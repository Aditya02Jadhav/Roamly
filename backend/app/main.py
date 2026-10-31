from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import health, trips, itinerary, auth

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for Roamly Travel Planner - Phase 1 Persistent Draft Trips",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration for frontend development (e.g. Next.js on localhost:3000)
cors_origins = [str(origin).rstrip("/") for origin in settings.BACKEND_CORS_ORIGINS]
for default_origin in ["http://localhost:3000", "http://127.0.0.1:3000"]:
    if default_origin not in cors_origins:
        cors_origins.append(default_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=r"https://.*\.devtunnels\.ms",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes
app.include_router(health.router, prefix=settings.API_V1_PREFIX)
app.include_router(trips.router, prefix=settings.API_V1_PREFIX)
app.include_router(itinerary.router, prefix=settings.API_V1_PREFIX)
app.include_router(auth.router, prefix=settings.API_V1_PREFIX)


@app.get("/", tags=["Root"])
def root():
    return {
        "service": settings.PROJECT_NAME,
        "version": "1.0.0",
        "documentation": "/docs",
        "health": f"{settings.API_V1_PREFIX}/health",
    }
