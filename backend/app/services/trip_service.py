from typing import Optional, List, Dict
import uuid
from collections import Counter
from sqlalchemy.orm import Session
from app.db.models.trip import Trip
from app.db.models.itinerary_option import ItineraryOptionModel
from app.schemas.trip import (
    TripCreateRequest,
    TripResponse,
    TripPreferencesData,
    TripListItemResponse,
)
from app.schemas.itinerary_option import (
    ItineraryOptionResponse,
    EstimatedCost,
)
from app.schemas.trip_summary import (
    TripSummaryResponse,
    TripStats,
)
from app.repositories.trip_repository import TripRepository
from app.services.option_service import generate_starter_options
from app.services.itinerary_service import ItineraryService


class TripService:
    @staticmethod
    def _map_option_to_response(option: ItineraryOptionModel) -> ItineraryOptionResponse:
        return ItineraryOptionResponse(
            id=option.option_key,  # For seamless frontend option matching ("balanced", "budget", "slow")
            option_id=option.id,
            title=option.title,
            description=option.description,
            price=option.price_display,
            estimated_cost=EstimatedCost(**option.estimated_cost),
            stop_count=option.stop_count,
            stop_description=option.stop_description,
            pace=option.pace,
            image=option.image,
            image_alt=option.image_alt,
            recommended=option.recommended,
            highlights=option.highlights or [],
            day_outline=option.day_outline or [],
        )

    @classmethod
    def _map_trip_to_response(cls, trip: Trip) -> TripResponse:
        preferences = TripPreferencesData(
            destination=trip.destination,
            start_date=trip.start_date,
            end_date=trip.end_date,
            flexible_dates=trip.flexible_dates,
            adults=trip.adults,
            children=trip.children,
            budget=trip.budget,
            interests=trip.interests or [],
            pace=trip.pace,
            transport=trip.transport,
            total_budget=trip.total_budget,
        )

        options = [cls._map_option_to_response(opt) for opt in trip.options]

        return TripResponse(
            id=trip.id,
            status=trip.status,
            preferences=preferences,
            created_at=trip.created_at,
            updated_at=trip.updated_at,
            options=options,
        )

    @classmethod
    def create_draft_trip(
        cls,
        db: Session,
        trip_in: TripCreateRequest,
        user_id: Optional[uuid.UUID] = None,
    ) -> TripResponse:
        starter_options = generate_starter_options(
            destination=trip_in.destination,
            start_date=trip_in.start_date,
            end_date=trip_in.end_date,
            budget=trip_in.budget,
            adults=trip_in.adults,
            children=trip_in.children,
        )

        trip = TripRepository.create(
            db=db,
            trip_in=trip_in,
            starter_options_data=starter_options,
            user_id=user_id,
        )
        return cls._map_trip_to_response(trip)

    @classmethod
    def get_trip_by_id(
        cls,
        db: Session,
        trip_id: uuid.UUID,
    ) -> Optional[TripResponse]:
        trip = TripRepository.get_by_id(db, trip_id)
        if not trip:
            return None
        return cls._map_trip_to_response(trip)

    @classmethod
    def list_trips(
        cls,
        db: Session,
        user_id: uuid.UUID,
        limit: int = 50,
        offset: int = 0,
    ) -> List[TripListItemResponse]:
        trips = TripRepository.list_all(
            db,
            user_id=user_id,
            limit=limit,
            offset=offset,
        )
        result = []
        for t in trips:
            total_days = max(1, (t.end_date - t.start_date).days + 1)
            total_stops = sum(len(d.stops) for d in t.days)
            result.append(
                TripListItemResponse(
                    id=t.id,
                    destination=t.destination,
                    status=t.status,
                    start_date=t.start_date,
                    end_date=t.end_date,
                    total_days=total_days,
                    adults=t.adults,
                    children=t.children,
                    budget=t.budget,
                    pace=t.pace,
                    selected_plan=t.selected_option_key,
                    total_stops=total_stops,
                    created_at=t.created_at,
                    updated_at=t.updated_at,
                )
            )
        return result

    @classmethod
    def delete_trip(cls, db: Session, trip_id: uuid.UUID) -> bool:
        return TripRepository.delete(db, trip_id)

    @classmethod
    def clone_trip(cls, db: Session, trip_id: uuid.UUID) -> Optional[TripResponse]:
        cloned = TripRepository.clone(db, trip_id)
        if not cloned:
            return None
        return cls._map_trip_to_response(cloned)

    @classmethod
    def get_trip_summary(
        cls,
        db: Session,
        trip_id: uuid.UUID,
    ) -> Optional[TripSummaryResponse]:
        # Ensure itinerary is loaded/auto-materialized
        itinerary = ItineraryService.get_itinerary(db, trip_id)
        if not itinerary:
            return None

        trip = TripRepository.get_by_id(db, trip_id)
        if not trip:
            return None

        # Determine selected option
        selected_key = trip.selected_option_key or (trip.options[0].option_key if trip.options else None)
        selected_opt = None
        for opt in trip.options:
            if opt.option_key == selected_key:
                selected_opt = cls._map_option_to_response(opt)
                break
        if not selected_opt and trip.options:
            selected_opt = cls._map_option_to_response(trip.options[0])

        # Calculate statistics
        total_days = len(itinerary.days)
        categories: Counter = Counter()
        total_stops = 0

        for day in itinerary.days:
            total_stops += len(day.stops)
            for stop in day.stops:
                categories[stop.category] += 1

        stats = TripStats(
            total_days=total_days,
            total_stops=total_stops,
            categories_breakdown=dict(categories),
        )

        preferences = TripPreferencesData(
            destination=trip.destination,
            start_date=trip.start_date,
            end_date=trip.end_date,
            flexible_dates=trip.flexible_dates,
            adults=trip.adults,
            children=trip.children,
            budget=trip.budget,
            interests=trip.interests or [],
            pace=trip.pace,
            transport=trip.transport,
            total_budget=trip.total_budget,
        )

        return TripSummaryResponse(
            trip_id=trip.id,
            status=trip.status,
            destination=trip.destination,
            preferences=preferences,
            selected_plan=trip.selected_option_key,
            selected_option=selected_opt,
            days=itinerary.days,
            stats=stats,
            created_at=trip.created_at,
            updated_at=trip.updated_at,
        )
