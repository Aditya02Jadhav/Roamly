from unittest.mock import patch
from fastapi.testclient import TestClient


def test_health_endpoint_healthy(client: TestClient):
    with patch("app.api.routes.health.check_db_connection", return_value=True):
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["app"] == "healthy"
        assert data["database"] == "connected"


def test_health_endpoint_degraded(client: TestClient):
    with patch("app.api.routes.health.check_db_connection", return_value=False):
        response = client.get("/api/v1/health")
        assert response.status_code == 503
        data = response.json()
        assert data["status"] == "degraded"
        assert data["app"] == "healthy"
        assert data["database"] == "disconnected"
