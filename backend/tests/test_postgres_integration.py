import uuid
from datetime import date
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.db.models.trip import Trip
from app.db.models.itinerary_option import ItineraryOptionModel
from app.db.models.trip_day import TripDayModel
from app.db.models.trip_stop import TripStopModel
from app.repositories.trip_repository import TripRepository
from app.repositories.itinerary_repository import ItineraryRepository
from app.schemas.trip import TripCreateRequest
from app.schemas.itinerary import TripStopCreate
from app.services.option_service import generate_starter_options


def test_real_postgresql_persistence():
    """
    Empirically verify persistence, foreign key relationships, and retrieval
    against the live PostgreSQL database.
    """
    engine = create_engine(settings.DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        trip_request = TripCreateRequest(
            destination="Kyoto, Japan",
            startDate=date(2026, 11, 1),
            endDate=date(2026, 11, 6),
            flexibleDates=True,
            adults=2,
            children=0,
            budget="moderate",
            interests=["Culture", "History"],
            pace="balanced",
            transport="public-transit",
        )

        starter_options = generate_starter_options(
            destination=trip_request.destination,
            start_date=trip_request.start_date,
            end_date=trip_request.end_date,
            budget=trip_request.budget,
            adults=trip_request.adults,
            children=trip_request.children,
        )

        # Persist to PostgreSQL
        created_trip = TripRepository.create(
            db=session,
            trip_in=trip_request,
            starter_options_data=starter_options,
        )

        trip_id = created_trip.id
        assert isinstance(trip_id, uuid.UUID)

        # Clear session cache to ensure retrieval reads from PostgreSQL disk/tables
        session.expunge_all()

        # Read back from PostgreSQL
        retrieved_trip = TripRepository.get_by_id(session, trip_id)
        assert retrieved_trip is not None
        assert retrieved_trip.id == trip_id
        assert retrieved_trip.destination == "Kyoto, Japan"
        assert retrieved_trip.status == "draft"
        assert len(retrieved_trip.options) == 3

        # Clean up created record to leave database clean
        session.delete(retrieved_trip)
        session.commit()

        # Verify deletion cascaded
        assert TripRepository.get_by_id(session, trip_id) is None
        remaining_options = session.query(ItineraryOptionModel).filter_by(trip_id=trip_id).all()
        assert len(remaining_options) == 0

    finally:
        session.close()
        engine.dispose()


def test_real_postgresql_itinerary_persistence():
    """
    Empirically verify trip_days and trip_stops persistence and cascading delete in live PostgreSQL.
    """
    engine = create_engine(settings.DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        trip_request = TripCreateRequest(
            destination="Goa, India",
            startDate=date(2026, 12, 1),
            endDate=date(2026, 12, 3),
            flexibleDates=True,
            adults=2,
            children=0,
            budget="moderate",
            interests=["Beaches"],
            pace="balanced",
            transport="car-or-taxi",
        )
        starter_options = generate_starter_options(
            destination=trip_request.destination,
            start_date=trip_request.start_date,
            end_date=trip_request.end_date,
            budget=trip_request.budget,
            adults=trip_request.adults,
            children=trip_request.children,
        )
        trip = TripRepository.create(session, trip_request, starter_options)
        trip_id = trip.id

        # Materialize plan
        balanced_opt = trip.options[0]
        materialized = ItineraryRepository.materialize_plan(session, trip, balanced_opt)
        assert len(materialized.days) == 3

        # Add a custom stop
        stop = ItineraryRepository.add_stop(
            session,
            trip_id,
            day_number=1,
            stop_in=TripStopCreate(title="Live Postgres Stop", time="11:00 AM"),
        )
        assert stop is not None
        stop_id = stop.id

        # Clear session cache and read from DB disk
        session.expunge_all()

        loaded_trip = ItineraryRepository.get_trip_with_itinerary(session, trip_id)
        assert loaded_trip is not None
        assert len(loaded_trip.days) == 3
        day1_stop_titles = [s.title for s in loaded_trip.days[0].stops]
        assert "Live Postgres Stop" in day1_stop_titles

        # Delete trip and check cascade delete on trip_days and trip_stops
        session.delete(loaded_trip)
        session.commit()

        assert session.query(TripDayModel).filter_by(trip_id=trip_id).count() == 0
        assert session.query(TripStopModel).filter_by(id=stop_id).count() == 0

    finally:
        session.close()
        engine.dispose()

