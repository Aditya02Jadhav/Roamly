# Roamly Backend — Phase 1: Persistent Draft Trips

FastAPI backend milestone for Roamly travel planner, providing PostgreSQL persistence for draft trips, validation matching frontend types, and destination-aware starter itinerary generation without external API dependencies.

---

## 1. Architecture & Stack

- **Framework**: FastAPI (Python 3.11 - 3.14 compatible)
- **Database**: PostgreSQL 16+ via SQLAlchemy 2.x and Psycopg 3
- **Migrations**: Alembic
- **Validation**: Pydantic V2 with strict type constraints
- **Testing**: Pytest with isolated in-memory testing and live PostgreSQL integration tests

### Project Structure

```text
backend/
├── app/
│   ├── main.py                  # FastAPI entry point & CORS configuration
│   ├── api/
│   │   └── routes/
│   │       ├── health.py        # /api/v1/health (liveness & readiness)
│   │       └── trips.py         # /api/v1/trips and /api/v1/trips/{trip_id}
│   ├── core/
│   │   └── config.py            # Environment-driven settings (Pydantic BaseSettings)
│   ├── db/
│   │   ├── base.py              # SQLAlchemy 2.0 DeclarativeBase
│   │   ├── session.py           # Engine, SessionLocal factory, get_db dependency
│   │   └── models/
│   │       ├── trip.py          # Trip database model
│   │       └── itinerary_option.py # ItineraryOptionModel database model
│   ├── schemas/
│   │   ├── trip.py              # Trip request/response schemas & validation
│   │   └── itinerary_option.py  # ItineraryOption schemas with frontend compatibility
│   ├── repositories/
│   │   └── trip_repository.py   # Database query and transaction layer
│   └── services/
│       ├── trip_service.py      # Business logic orchestration
│       └── option_service.py    # Isolated destination-aware starter option generation
├── alembic/                     # Database migrations
│   ├── env.py
│   └── versions/                # Generated revision files
├── tests/
│   ├── conftest.py              # Pytest fixtures and isolated database setup
│   ├── test_health.py           # Health endpoint tests
│   ├── test_trips.py            # Trips validation & lifecycle unit tests
│   └── test_postgres_integration.py # Real PostgreSQL persistence & cascade verification
├── .env.example                 # Template environment variables
├── alembic.ini                  # Alembic migration configuration
├── pytest.ini                   # Pytest configuration
├── requirements.txt             # Locked Python dependencies
└── README.md                    # Backend documentation
```

---

## 2. Database Design & Decisions

### Tables

1. **`trips`**:
   - `id`: `UUID` (Primary Key, unguessable UUIDv4)
   - `destination`: `VARCHAR(255)`, indexed, non-empty, max 120 chars
   - `start_date`: `DATE`
   - `end_date`: `DATE` (validated: `>= start_date`, maximum duration <= 60 days)
   - `flexible_dates`: `BOOLEAN` (default: `True`)
   - `adults`: `INTEGER` (1 - 20)
   - `children`: `INTEGER` (0 - 20)
   - `budget`: `VARCHAR(50)` (allowed: `budget-friendly`, `moderate`, `comfort`, `premium`)
   - `pace`: `VARCHAR(50)` (allowed: `relaxed`, `balanced`, `packed`)
   - `transport`: `VARCHAR(50)` (allowed: `public-transit`, `walking`, `car-or-taxi`, `mixed-transit`)
   - `interests`: `JSONB` / `JSON` list of validated strings.
     - *Design choice rationale*: Stored as validated JSON arrays rather than a join table because interests represent a static list of preference tags that are always read and updated together with the draft trip. Pydantic strictly validates each tag against allowed frontend enums.
   - `status`: `VARCHAR(50)` (default: `draft`)
   - `created_at` / `updated_at`: `TIMESTAMPTZ`

2. **`itinerary_options`**:
   - `id`: `UUID` (Primary Key)
   - `trip_id`: `UUID` (Foreign Key referencing `trips.id` with `ON DELETE CASCADE`)
   - `option_key`: `VARCHAR(50)` (`balanced`, `budget`, `slow`)
   - `title`: `VARCHAR(255)`
   - `description`: `TEXT`
   - `price_display`: `VARCHAR(100)`
   - `estimated_cost`: `JSONB` structural cost breakdown:
     ```json
     {
       "currency": "INR",
       "min_amount": 18000,
       "max_amount": 42000,
       "basis": "estimated_total_per_trip",
       "display": "₹18,000 – ₹42,000"
     }
     ```
   - `stop_count`: `INTEGER`
   - `stop_description`: `VARCHAR(100)`
   - `pace`: `VARCHAR(50)`
   - `image`: `VARCHAR(255)`
   - `image_alt`: `VARCHAR(255)`
   - `recommended`: `BOOLEAN`
   - `highlights`: `JSONB` array of strings
   - `day_outline`: `JSONB` array of daily itineraries
   - `created_at`: `TIMESTAMPTZ`

---

## 3. Setup & Running Locally

### Prerequisites

- Python 3.11+
- PostgreSQL running locally or in Docker

### 1. Start PostgreSQL (Docker)

```powershell
docker run -d --name roamly-postgres -e POSTGRES_USER=roamly -e POSTGRES_PASSWORD=roamly -e POSTGRES_DB=roamly_db -p 5432:5432 postgres:16-alpine
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```powershell
copy .env.example .env
```

### 3. Install Python Dependencies

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 4. Run Database Migrations

```powershell
alembic upgrade head
```

### 5. Start FastAPI Server

```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The interactive OpenAPI documentation is available at `http://127.0.0.1:8000/docs`.

---

## 4. API Endpoints & Contract

### 1. `GET /api/v1/health`

Returns app liveness and database connection readiness.

**Response (HTTP 200)**:
```json
{
  "status": "healthy",
  "app": "healthy",
  "database": "connected"
}
```

---

### 2. `POST /api/v1/trips`

Creates and persists a new draft trip with generated starter options.

**Request**:
```json
{
  "destination": "Goa, India",
  "startDate": "2026-11-14",
  "endDate": "2026-11-20",
  "adults": 2,
  "children": 0,
  "budget": "moderate",
  "interests": ["Beaches", "Food and cafés", "Culture", "Hidden gems"],
  "pace": "balanced",
  "transport": "car-or-taxi",
  "flexibleDates": true
}
```

**Response (HTTP 201 Created)**:
```json
{
  "id": "e98e2170-4f95-46aa-bd68-154ce17a94ee",
  "status": "draft",
  "preferences": {
    "destination": "Goa, India",
    "startDate": "2026-11-14",
    "endDate": "2026-11-20",
    "flexibleDates": true,
    "adults": 2,
    "children": 0,
    "budget": "moderate",
    "interests": ["Beaches", "Food and cafés", "Culture", "Hidden gems"],
    "pace": "balanced",
    "transport": "car-or-taxi"
  },
  "createdAt": "2026-10-27T17:05:00.000Z",
  "updatedAt": "2026-10-27T17:05:00.000Z",
  "options": [
    {
      "id": "balanced",
      "option_id": "b18751dc-cf7c-47fc-8f78-36a5fae5ff12",
      "title": "Balanced Explorer",
      "description": "Coastal highlights, historic Latin Quarter alleys, vibrant beach shacks, and sunset forts.",
      "price": "₹42,000 – ₹98,000",
      "estimated_cost": {
        "currency": "INR",
        "min_amount": 42000,
        "max_amount": 98000,
        "basis": "estimated_total_per_trip",
        "display": "₹42,000 – ₹98,000"
      },
      "stop_count": 21,
      "stopCount": 21,
      "stop_description": "curated stops",
      "stopDescription": "curated stops",
      "pace": "Balanced",
      "image": "/images/goa-balanced.jpg",
      "image_alt": "Golden sunset over Goa shoreline with palm trees and ocean waves.",
      "imageAlt": "Golden sunset over Goa shoreline with palm trees and ocean waves.",
      "recommended": true,
      "highlights": [
        "Fontainhas heritage architecture walk",
        "Scenic coastal cliff and fort viewpoints",
        "Authentic Goan seafood thali tasting",
        "Sunset catamaran or seaside lounge"
      ],
      "day_outline": [
        "Arrival & Panjim Latin Quarter (Fontainhas)",
        "North Goa Coastal Forts & Sunset Shacks",
        "Old Goa UNESCO Churches & Spice Plantation",
        "South Goa Serene Beaches & Backwaters",
        "Coastal Souvenirs & Departure"
      ],
      "dayOutline": [
        "Arrival & Panjim Latin Quarter (Fontainhas)",
        "North Goa Coastal Forts & Sunset Shacks",
        "Old Goa UNESCO Churches & Spice Plantation",
        "South Goa Serene Beaches & Backwaters",
        "Coastal Souvenirs & Departure"
      ]
    }
  ]
}
```

---

### 3. `GET /api/v1/trips/{trip_id}`

Retrieves the saved trip and starter options.

- Returns **HTTP 200** with the trip schema.
- Returns **HTTP 404** if not found:
  ```json
  {
    "detail": "Trip with ID '00000000-0000-0000-0000-000000000000' not found."
  }
  ```

---

## 5. Security & Isolation Notes

- **Anonymous Draft Scope**: Draft trips in Phase 1 are unauthenticated and public. They are identifiable only via unguessable UUIDs and must not be treated as user-owned private records until Phase 2 authentication and user management are implemented.
- **Credential Protection**: Database passwords and credentials are never checked into git. `.env.example` contains only template placeholders.
- **Error Obfuscation**: Internal database error details and tracebacks are intercepted and logged internally rather than exposed across the API boundary.

---

## 6. Automated Testing

Run the test suite:

```powershell
pytest -v
```

Tests verify:
- Health endpoint status and degraded state
- Trip creation, validation, and read-after-retrieval
- Empty destinations, invalid date ranges, and duration caps (> 60 days)
- Enum constraints (budget, pace, transport, interests)
- Nonexistent trips (404)
- Destination-specific starter options (Kyoto, Goa) vs. generic non-fabricated options
- Real PostgreSQL persistence and cascading delete
