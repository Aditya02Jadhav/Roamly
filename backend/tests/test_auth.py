import uuid
from fastapi.testclient import TestClient


def test_auth_register_login_and_claim_flow(client: TestClient):
    email = f"traveller_{uuid.uuid4().hex[:6]}@example.com"
    password = "secretpassword123"

    # 1. Register new user
    reg_res = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": password, "full_name": "Test Traveller"},
    )
    assert reg_res.status_code == 201
    reg_data = reg_res.json()
    assert "access_token" in reg_data
    assert reg_data["user"]["email"] == email
    assert reg_data["user"]["ai_credits"] == 10
    token = reg_data["access_token"]

    # 2. Cannot register with same email
    dup_res = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "anotherpassword"},
    )
    assert dup_res.status_code == 400

    # 3. Login
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password},
    )
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()

    # 4. Wrong password login fails
    bad_login = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": "wrongpassword"},
    )
    assert bad_login.status_code == 401

    # 5. Access protected /me
    me_res = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_res.status_code == 200
    assert me_res.json()["email"] == email

    # 6. Create anonymous draft trip & claim it
    trip_payload = {
        "destination": "Zurich, Switzerland",
        "startDate": "2026-11-10",
        "endDate": "2026-11-14",
        "adults": 1,
        "children": 0,
        "budget": "comfort",
        "interests": ["Nature", "Photography"],
        "pace": "relaxed",
        "transport": "public-transit",
    }
    trip_res = client.post("/api/v1/trips", json=trip_payload)
    assert trip_res.status_code == 201
    trip_id = trip_res.json()["id"]

    claim_res = client.post(
        f"/api/v1/trips/{trip_id}/claim",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert claim_res.status_code == 200
    assert "claimed" in claim_res.json()["message"].lower()

    # 7. Unauthenticated request to protected endpoint fails
    unauth_res = client.get("/api/v1/auth/me")
    assert unauth_res.status_code == 401

