import uuid
from fastapi.testclient import TestClient


def _create_sample_trip(client: TestClient) -> dict:
    payload = {
        "destination": "Goa, India",
        "startDate": "2026-11-14",
        "endDate": "2026-11-16",
        "adults": 2,
        "children": 0,
        "budget": "moderate",
        "interests": ["Beaches", "Food and cafés"],
        "pace": "balanced",
        "transport": "car-or-taxi",
    }
    response = client.post("/api/v1/trips", json=payload)
    assert response.status_code == 201
    return response.json()


def test_select_plan_and_materialize_days(client: TestClient):
    trip = _create_sample_trip(client)
    trip_id = trip["id"]

    # Select "balanced" plan
    res = client.post(f"/api/v1/trips/{trip_id}/select-plan", json={"plan": "balanced"})
    assert res.status_code == 200
    data = res.json()

    assert data["trip_id"] == trip_id
    assert data["selected_plan"] == "balanced"
    # 3-day trip (Nov 14 to Nov 16)
    assert len(data["days"]) == 3
    day1 = data["days"][0]
    assert day1["day_number"] == 1
    assert len(day1["stops"]) > 0


def test_get_itinerary_auto_materializes_if_empty(client: TestClient):
    trip = _create_sample_trip(client)
    trip_id = trip["id"]

    # Call GET without explicit select-plan
    res = client.get(f"/api/v1/trips/{trip_id}/itinerary")
    assert res.status_code == 200
    data = res.json()
    assert len(data["days"]) == 3
    assert len(data["days"][0]["stops"]) > 0


def test_add_update_reorder_delete_stop_flow(client: TestClient):
    trip = _create_sample_trip(client)
    trip_id = trip["id"]

    # Materialize first
    client.post(f"/api/v1/trips/{trip_id}/select-plan", json={"plan": "balanced"})

    # 1. Add Stop to Day 1
    stop_data = {
        "title": "Calangute Beach sunset stroll",
        "time": "5:30 PM",
        "duration": "1.5 hours",
        "category": "Sightseeing",
        "description": "Watch the sunset by the waves",
    }
    add_res = client.post(f"/api/v1/trips/{trip_id}/days/1/stops", json=stop_data)
    assert add_res.status_code == 201
    new_stop = add_res.json()
    assert new_stop["title"] == "Calangute Beach sunset stroll"
    stop_id = new_stop["id"]

    # 2. Update Stop
    update_res = client.patch(
        f"/api/v1/trips/{trip_id}/stops/{stop_id}",
        json={"title": "Anjuna Beach sunset stroll"},
    )
    assert update_res.status_code == 200
    assert update_res.json()["title"] == "Anjuna Beach sunset stroll"

    # 3. Check Itinerary has the new stop
    itin_res = client.get(f"/api/v1/trips/{trip_id}/itinerary")
    day1_stops = itin_res.json()["days"][0]["stops"]
    assert any(s["id"] == stop_id for s in day1_stops)

    # 4. Reorder Stops
    reversed_ids = [s["id"] for s in reversed(day1_stops)]
    reorder_res = client.put(
        f"/api/v1/trips/{trip_id}/days/1/reorder",
        json={"stop_ids": reversed_ids},
    )
    assert reorder_res.status_code == 200

    # Verify new sequence
    itin_reordered = client.get(f"/api/v1/trips/{trip_id}/itinerary").json()
    day1_stops_after = itin_reordered["days"][0]["stops"]
    assert [s["id"] for s in day1_stops_after] == reversed_ids

    # 5. Delete Stop
    del_res = client.delete(f"/api/v1/trips/{trip_id}/stops/{stop_id}")
    assert del_res.status_code == 204

    # Verify deleted
    itin_final = client.get(f"/api/v1/trips/{trip_id}/itinerary").json()
    day1_stops_final = itin_final["days"][0]["stops"]
    assert not any(s["id"] == stop_id for s in day1_stops_final)


def test_get_trip_summary_endpoint(client: TestClient):
    trip = _create_sample_trip(client)
    trip_id = trip["id"]

    res = client.get(f"/api/v1/trips/{trip_id}/summary")
    assert res.status_code == 200
    data = res.json()

    assert data["tripId"] == trip_id
    assert data["destination"] == "Goa, India"
    assert data["preferences"]["budget"] == "moderate"
    assert "stats" in data
    assert data["stats"]["total_days"] == 3
    assert data["stats"]["total_stops"] > 0
    assert "selectedOption" in data
    assert len(data["days"]) == 3


def test_adjust_day_endpoint(client: TestClient):
    trip = _create_sample_trip(client)
    trip_id = trip["id"]

    # Materialize first
    client.post(f"/api/v1/trips/{trip_id}/select-plan", json={"plan": "balanced"})

    # Adjust day 1 to be relaxed
    res = client.post(
        f"/api/v1/trips/{trip_id}/days/1/adjust",
        json={"prompt": "Make the day more relaxed"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["day_number"] == 1
    assert len(data["stops"]) == 2
    assert "relaxed" in data["stops"][0]["title"].lower() or "leisure" in data["stops"][0]["title"].lower()

    # Verify persisted in full itinerary
    itin_res = client.get(f"/api/v1/trips/{trip_id}/itinerary")
    day1_stops = itin_res.json()["days"][0]["stops"]
    assert len(day1_stops) == 2


def test_itinerary_404_handling(client: TestClient):
    fake_id = str(uuid.uuid4())
    fake_stop_id = str(uuid.uuid4())

    assert client.get(f"/api/v1/trips/{fake_id}/itinerary").status_code == 404
    assert client.get(f"/api/v1/trips/{fake_id}/summary").status_code == 404
    assert (
        client.post(f"/api/v1/trips/{fake_id}/select-plan", json={"plan": "balanced"}).status_code
        == 404
    )
    assert (
        client.post(
            f"/api/v1/trips/{fake_id}/days/1/stops",
            json={"title": "Test"},
        ).status_code
        == 404
    )
    assert (
        client.patch(
            f"/api/v1/trips/{fake_id}/stops/{fake_stop_id}",
            json={"title": "Updated"},
        ).status_code
        == 404
    )
    assert (
        client.delete(f"/api/v1/trips/{fake_id}/stops/{fake_stop_id}").status_code
        == 404
    )
