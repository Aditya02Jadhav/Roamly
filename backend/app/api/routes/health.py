from fastapi import APIRouter, Response, status
from app.db.session import check_db_connection

router = APIRouter(tags=["Health"])


@router.get("/health")
def get_health(response: Response):
    """
    Check application health.
    Liveness is reported via app status; database readiness is reported separately.
    Returns HTTP 200 if healthy, or HTTP 503 if database readiness check fails.
    """
    is_db_connected = check_db_connection()
    if not is_db_connected:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    return {
        "status": "healthy" if is_db_connected else "degraded",
        "app": "healthy",
        "database": "connected" if is_db_connected else "disconnected",
    }
