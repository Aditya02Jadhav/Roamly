from typing import Optional, List, Dict, Any
import uuid
from sqlalchemy.orm import Session, joinedload
from app.db.models.trip import Trip
from app.db.models.itinerary_option import ItineraryOptionModel
from app.db.models.trip_day import TripDayModel
from app.db.models.trip_stop import TripStopModel
from app.schemas.trip import TripCreateRequest


class TripRepository:
    @staticmethod
    def create(
        db: Session,
        trip_in: TripCreateRequest,
        starter_options_data: List[Dict[str, Any]],
        user_id: Optional[uuid.UUID] = None,
    ) -> Trip:
        trip = Trip(
            user_id=user_id,
            destination=trip_in.destination,
            start_date=trip_in.start_date,
            end_date=trip_in.end_date,
            flexible_dates=trip_in.flexible_dates,
            adults=trip_in.adults,
            children=trip_in.children,
            budget=trip_in.budget,
            total_budget=trip_in.total_budget,
            interests=trip_in.interests,
            pace=trip_in.pace,
            transport=trip_in.transport,
            status="draft",
        )

        for opt_data in starter_options_data:
            option_model = ItineraryOptionModel(
                option_key=opt_data["option_key"],
                title=opt_data["title"],
                description=opt_data["description"],
                price_display=opt_data["price_display"],
                estimated_cost=opt_data["estimated_cost"],
                stop_count=opt_data["stop_count"],
                stop_description=opt_data["stop_description"],
                pace=opt_data["pace"],
                image=opt_data["image"],
                image_alt=opt_data["image_alt"],
                recommended=opt_data.get("recommended", False),
                highlights=opt_data["highlights"],
                day_outline=opt_data["day_outline"],
            )
            trip.options.append(option_model)

        db.add(trip)
        db.commit()
        db.refresh(trip)
        return trip

    @staticmethod
    def get_by_id(db: Session, trip_id: uuid.UUID) -> Optional[Trip]:
        return (
            db.query(Trip)
            .options(
                joinedload(Trip.options),
                joinedload(Trip.days).joinedload(TripDayModel.stops),
            )
            .filter(Trip.id == trip_id)
            .first()
        )

    @staticmethod
    def list_all(
        db: Session,
        user_id: uuid.UUID,
        limit: int = 50,
        offset: int = 0,
    ) -> List[Trip]:
        return (
            db.query(Trip)
            .options(
                joinedload(Trip.options),
                joinedload(Trip.days).joinedload(TripDayModel.stops),
            )
            .filter(Trip.user_id == user_id)
            .order_by(Trip.created_at.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )

    @staticmethod
    def delete(db: Session, trip_id: uuid.UUID) -> bool:
        trip = db.query(Trip).filter(Trip.id == trip_id).first()
        if not trip:
            return False
        db.delete(trip)
        db.commit()
        return True

    @staticmethod
    def clone(db: Session, trip_id: uuid.UUID) -> Optional[Trip]:
        original = TripRepository.get_by_id(db, trip_id)
        if not original:
            return None

        cloned_trip = Trip(
            user_id=original.user_id,
            destination=f"{original.destination} (Copy)",
            start_date=original.start_date,
            end_date=original.end_date,
            flexible_dates=original.flexible_dates,
            adults=original.adults,
            children=original.children,
            budget=original.budget,
            total_budget=original.total_budget,
            interests=list(original.interests or []),
            pace=original.pace,
            transport=original.transport,
            status="draft",
            selected_option_key=original.selected_option_key,
        )

        # Clone starter options
        for opt in original.options:
            cloned_opt = ItineraryOptionModel(
                option_key=opt.option_key,
                title=opt.title,
                description=opt.description,
                price_display=opt.price_display,
                estimated_cost=dict(opt.estimated_cost),
                stop_count=opt.stop_count,
                stop_description=opt.stop_description,
                pace=opt.pace,
                image=opt.image,
                image_alt=opt.image_alt,
                recommended=opt.recommended,
                highlights=list(opt.highlights or []),
                day_outline=list(opt.day_outline or []),
            )
            cloned_trip.options.append(cloned_opt)

        # Clone materialized days and stops if present
        for day in original.days:
            cloned_day = TripDayModel(
                day_number=day.day_number,
                date=day.date,
                title=day.title,
            )
            for stop in day.stops:
                cloned_stop = TripStopModel(
                    title=stop.title,
                    time=stop.time,
                    duration=stop.duration,
                    category=stop.category,
                    description=stop.description,
                    order_index=stop.order_index,
                )
                cloned_day.stops.append(cloned_stop)
            cloned_trip.days.append(cloned_day)

        db.add(cloned_trip)
        db.commit()
        db.refresh(cloned_trip)
        return cloned_trip
