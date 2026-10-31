import uuid
from fastapi.testclient import TestClient


def test_create_trip_successful_and_read_back(client: TestClient):
    payload = {
        "destination": "Goa, India",
        "startDate": "2026-11-14",
        "endDate": "2026-11-20",
        "adults": 2,
        "children": 1,
        "budget": "moderate",
        "totalBudget": 105000,
        "interests": ["Beaches", "Food and cafés", "Culture"],
        "pace": "balanced",
        "transport": "car-or-taxi",
        "flexibleDates": True,
    }

    # 1. Create trip (POST /api/v1/trips)
    create_response = client.post("/api/v1/trips", json=payload)
    assert create_response.status_code == 201
    created_data = create_response.json()

    assert "id" in created_data
    trip_id = created_data["id"]
    assert created_data["status"] == "draft"
    assert created_data["preferences"]["destination"] == "Goa, India"
    assert created_data["preferences"]["adults"] == 2
    assert created_data["preferences"]["children"] == 1
    assert created_data["preferences"]["budget"] == "moderate"
    assert created_data["preferences"]["totalBudget"] == 105000
    assert created_data["preferences"]["interests"] == ["Beaches", "Food and cafés", "Culture"]
    assert len(created_data["options"]) == 3

    # Check option format and structural cost
    for opt in created_data["options"]:
        assert opt["id"] in ["balanced", "budget", "slow"]
        assert "option_id" in opt
        assert "price" in opt
        assert "estimated_cost" in opt
        cost = opt["estimated_cost"]
        assert cost["currency"] == "INR"
        assert cost["min_amount"] > 0
        assert cost["max_amount"] >= cost["min_amount"]
        assert cost["basis"] == "estimated_total_per_trip"
        # Check computed frontend compatibility aliases
        assert "stopCount" in opt
        assert "stopDescription" in opt
        assert "imageAlt" in opt
        assert "dayOutline" in opt
        assert isinstance(opt["highlights"], list)
        assert len(opt["highlights"]) > 0

    # 2. Read back trip (GET /api/v1/trips/{trip_id})
    get_response = client.get(f"/api/v1/trips/{trip_id}")
    assert get_response.status_code == 200
    retrieved_data = get_response.json()

    assert retrieved_data["id"] == trip_id
    assert retrieved_data["preferences"]["destination"] == "Goa, India"
    assert retrieved_data["preferences"]["totalBudget"] == 105000
    assert len(retrieved_data["options"]) == 3


def test_destination_specific_starter_options_kyoto(client: TestClient):
    payload = {
        "destination": "Kyoto, Japan",
        "startDate": "2026-10-01",
        "endDate": "2026-10-05",
        "adults": 1,
        "children": 0,
        "budget": "comfort",
        "interests": ["Culture", "History"],
        "pace": "balanced",
        "transport": "public-transit",
    }
    response = client.post("/api/v1/trips", json=payload)
    assert response.status_code == 201
    data = response.json()
    balanced_opt = next(opt for opt in data["options"] if opt["id"] == "balanced")
    assert any("Fushimi Inari" in h for h in balanced_opt["highlights"])


def test_generic_starter_options_for_unrelated_destination(client: TestClient):
    payload = {
        "destination": "Reykjavik, Iceland",
        "startDate": "2026-09-10",
        "endDate": "2026-09-15",
        "adults": 2,
        "children": 0,
        "budget": "premium",
        "interests": ["Nature", "Photography"],
        "pace": "relaxed",
        "transport": "car-or-taxi",
    }
    response = client.post("/api/v1/trips", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert len(data["options"]) == 3

    # Ensure Kyoto facts are NOT leaked into unrelated destinations
    for opt in data["options"]:
        opt_text = str(opt).lower()
        assert "kyoto" not in opt_text
        assert "fushimi inari" not in opt_text
        assert "machiya" not in opt_text
        assert "gion" not in opt_text
        # Labelled clearly as starter stops
        assert "starter stops" in opt["stop_description"]


def test_invalid_destination_empty(client: TestClient):
    payload = {
        "destination": "   ",
        "startDate": "2026-11-14",
        "endDate": "2026-11-20",
        "adults": 2,
    }
    response = client.post("/api/v1/trips", json=payload)
    assert response.status_code == 422


def test_invalid_date_range_end_before_start(client: TestClient):
    payload = {
        "destination": "Paris, France",
        "startDate": "2026-11-20",
        "endDate": "2026-11-14",
        "adults": 2,
    }
    response = client.post("/api/v1/trips", json=payload)
    assert response.status_code == 422


def test_invalid_date_range_exceeds_max_duration(client: TestClient):
    payload = {
        "destination": "Paris, France",
        "startDate": "2026-01-01",
        "endDate": "2026-04-01",  # 90 days > 60 days
        "adults": 2,
    }
    response = client.post("/api/v1/trips", json=payload)
    assert response.status_code == 422


def test_invalid_traveller_counts(client: TestClient):
    # Adults < 1
    response = client.post(
        "/api/v1/trips",
        json={"destination": "Goa", "startDate": "2026-11-14", "endDate": "2026-11-20", "adults": 0},
    )
    assert response.status_code == 422


def test_invalid_total_budget(client: TestClient):
    response = client.post(
        "/api/v1/trips",
        json={
            "destination": "Goa",
            "startDate": "2026-11-14",
            "endDate": "2026-11-20",
            "totalBudget": 0,
        },
    )
    assert response.status_code == 422

    # Adults > 20
    response = client.post(
        "/api/v1/trips",
        json={"destination": "Goa", "startDate": "2026-11-14", "endDate": "2026-11-20", "adults": 25},
    )
    assert response.status_code == 422

    # Children < 0
    response = client.post(
        "/api/v1/trips",
        json={"destination": "Goa", "startDate": "2026-11-14", "endDate": "2026-11-20", "adults": 2, "children": -1},
    )
    assert response.status_code == 422


def test_invalid_enum_values(client: TestClient):
    # Invalid budget
    response = client.post(
        "/api/v1/trips",
        json={"destination": "Goa", "startDate": "2026-11-14", "endDate": "2026-11-20", "budget": "luxury-billionaire"},
    )
    assert response.status_code == 422

    # Invalid pace
    response = client.post(
        "/api/v1/trips",
        json={"destination": "Goa", "startDate": "2026-11-14", "endDate": "2026-11-20", "pace": "supersonic"},
    )
    assert response.status_code == 422

    # Invalid interest
    response = client.post(
        "/api/v1/trips",
        json={"destination": "Goa", "startDate": "2026-11-14", "endDate": "2026-11-20", "interests": ["Crypto Mining"]},
    )
    assert response.status_code == 422


def test_get_nonexistent_trip_returns_404(client: TestClient):
    random_uuid = uuid.uuid4()
    response = client.get(f"/api/v1/trips/{random_uuid}")
    assert response.status_code == 404
    assert response.json()["detail"] == f"Trip with ID '{random_uuid}' not found."


def test_get_invalid_uuid_returns_422(client: TestClient):
    response = client.get("/api/v1/trips/not-a-valid-uuid")
    assert response.status_code == 422


def test_list_delete_and_clone_trip_flow(client: TestClient):
    registration = client.post(
        "/api/v1/auth/register",
        json={
            "email": f"trip_owner_{uuid.uuid4().hex[:8]}@example.com",
            "password": "testpassword123",
            "full_name": "Trip Owner",
        },
    )
    assert registration.status_code == 201
    auth_headers = {
        "Authorization": f"Bearer {registration.json()['access_token']}"
    }

    # 1. Create a trip
    payload = {
        "destination": "Paris, France",
        "startDate": "2026-12-01",
        "endDate": "2026-12-05",
        "adults": 2,
        "children": 0,
        "budget": "comfort",
        "totalBudget": 220000,
        "interests": ["Culture", "History"],
        "pace": "balanced",
        "transport": "public-transit",
    }
    create_res = client.post(
        "/api/v1/trips",
        json=payload,
        headers=auth_headers,
    )
    assert create_res.status_code == 201
    trip_id = create_res.json()["id"]

    # 2. List trips
    assert client.get("/api/v1/trips?limit=10").status_code == 401
    list_res = client.get("/api/v1/trips?limit=10", headers=auth_headers)
    assert list_res.status_code == 200
    trips = list_res.json()
    assert any(t["id"] == trip_id for t in trips)
    match = next(t for t in trips if t["id"] == trip_id)
    assert match["destination"] == "Paris, France"
    assert match["totalDays"] == 5

    other_registration = client.post(
        "/api/v1/auth/register",
        json={
            "email": f"other_owner_{uuid.uuid4().hex[:8]}@example.com",
            "password": "testpassword123",
            "full_name": "Other Owner",
        },
    )
    other_headers = {
        "Authorization": f"Bearer {other_registration.json()['access_token']}"
    }
    assert client.get("/api/v1/trips?limit=10", headers=other_headers).json() == []

    # 3. Clone trip
    clone_res = client.post(f"/api/v1/trips/{trip_id}/clone")
    assert clone_res.status_code == 201
    cloned_data = clone_res.json()
    cloned_id = cloned_data["id"]
    assert cloned_id != trip_id
    assert "Paris, France (Copy)" in cloned_data["preferences"]["destination"]
    assert cloned_data["preferences"]["totalBudget"] == 220000

    # 4. Delete cloned trip
    del_res = client.delete(f"/api/v1/trips/{cloned_id}")
    assert del_res.status_code == 204

    # Verify 404 after deletion
    assert client.get(f"/api/v1/trips/{cloned_id}").status_code == 404

    # Delete non-existent trip returns 404
    fake_id = str(uuid.uuid4())
    assert client.delete(f"/api/v1/trips/{fake_id}").status_code == 404
    assert client.post(f"/api/v1/trips/{fake_id}/clone").status_code == 404
