from typing import Optional, List, Dict, Any
import uuid
from sqlalchemy.orm import Session
from app.db.models.trip import Trip
from app.db.models.trip_day import TripDayModel
from app.db.models.trip_stop import TripStopModel
from app.schemas.itinerary import (
    TripStopCreate,
    TripStopUpdate,
    TripStopResponse,
    TripDayResponse,
    ItineraryResponse,
)
from app.repositories.itinerary_repository import ItineraryRepository
from app.services.ai_service import AIService


class ItineraryService:
    @staticmethod
    def _map_stop_to_response(stop: TripStopModel) -> TripStopResponse:
        return TripStopResponse(
            id=str(stop.id),
            stop_id=stop.id,
            day_id=stop.day_id,
            title=stop.title,
            time=stop.time,
            duration=stop.duration,
            category=stop.category,
            description=stop.description,
            order_index=stop.order_index,
        )

    @classmethod
    def _map_day_to_response(cls, day: TripDayModel) -> TripDayResponse:
        sorted_stops = sorted(day.stops, key=lambda s: s.order_index)
        return TripDayResponse(
            id=f"day-{day.day_number}",
            day_id=day.id,
            trip_id=day.trip_id,
            day_number=day.day_number,
            date=day.date,
            title=day.title,
            stops=[cls._map_stop_to_response(s) for s in sorted_stops],
        )

    @classmethod
    def _map_itinerary_to_response(cls, trip: Trip) -> ItineraryResponse:
        sorted_days = sorted(trip.days, key=lambda d: d.day_number)
        return ItineraryResponse(
            trip_id=trip.id,
            selected_plan=trip.selected_option_key,
            days=[cls._map_day_to_response(d) for d in sorted_days],
        )

    @classmethod
    def select_plan(
        cls,
        db: Session,
        trip_id: uuid.UUID,
        plan_key: str,
    ) -> Optional[ItineraryResponse]:
        trip = ItineraryRepository.get_trip_with_itinerary(db, trip_id)
        if not trip:
            return None

        # Find requested option
        option = next((opt for opt in trip.options if opt.option_key == plan_key), None)
        if not option and trip.options:
            option = trip.options[0]

        if not option:
            return None

        materialized_trip = ItineraryRepository.materialize_plan(db, trip, option)
        return cls._map_itinerary_to_response(materialized_trip)

    @classmethod
    def get_itinerary(
        cls,
        db: Session,
        trip_id: uuid.UUID,
    ) -> Optional[ItineraryResponse]:
        trip = ItineraryRepository.get_trip_with_itinerary(db, trip_id)
        if not trip:
            return None

        # If not yet materialized, auto-materialize selected or first starter option
        if not trip.days and trip.options:
            plan_to_use = trip.selected_option_key or trip.options[0].option_key
            option = next((opt for opt in trip.options if opt.option_key == plan_to_use), trip.options[0])
            trip = ItineraryRepository.materialize_plan(db, trip, option)

        return cls._map_itinerary_to_response(trip)

    @classmethod
    def add_stop(
        cls,
        db: Session,
        trip_id: uuid.UUID,
        day_number: int,
        stop_in: TripStopCreate,
    ) -> Optional[TripStopResponse]:
        stop = ItineraryRepository.add_stop(db, trip_id, day_number, stop_in)
        if not stop:
            return None
        return cls._map_stop_to_response(stop)

    @classmethod
    def update_stop(
        cls,
        db: Session,
        stop_id: uuid.UUID,
        stop_in: TripStopUpdate,
    ) -> Optional[TripStopResponse]:
        stop = ItineraryRepository.update_stop(db, stop_id, stop_in)
        if not stop:
            return None
        return cls._map_stop_to_response(stop)

    @classmethod
    def delete_stop(cls, db: Session, stop_id: uuid.UUID) -> bool:
        return ItineraryRepository.delete_stop(db, stop_id)

    @classmethod
    def reorder_stops(
        cls,
        db: Session,
        trip_id: uuid.UUID,
        day_number: int,
        stop_ids: List[str],
    ) -> bool:
        return ItineraryRepository.reorder_stops(db, trip_id, day_number, stop_ids)

    @classmethod
    def adjust_day(
        cls,
        db: Session,
        trip_id: uuid.UUID,
        day_number: int,
        prompt: str,
    ) -> Optional[TripDayResponse]:
        trip = ItineraryRepository.get_trip_with_itinerary(db, trip_id)
        if not trip:
            return None

        # Auto-materialize if necessary
        if not trip.days and trip.options:
            plan_to_use = trip.selected_option_key or trip.options[0].option_key
            option = next((opt for opt in trip.options if opt.option_key == plan_to_use), trip.options[0])
            trip = ItineraryRepository.materialize_plan(db, trip, option)

        day = ItineraryRepository.get_day_by_number(db, trip_id, day_number)
        if not day:
            return None

        current_stops_dict = [
            {"title": s.title, "time": s.time, "duration": s.duration, "category": s.category}
            for s in day.stops
        ]

        # Call AI Service
        new_stops_in = AIService.generate_adjusted_stops(
            prompt=prompt,
            destination=trip.destination,
            current_stops=current_stops_dict,
        )

        updated_day = ItineraryRepository.replace_day_stops(db, trip_id, day_number, new_stops_in)
        if not updated_day:
            return None

        return cls._map_day_to_response(updated_day)
