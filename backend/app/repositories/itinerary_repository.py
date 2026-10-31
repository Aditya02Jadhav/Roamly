from datetime import timedelta
from typing import Optional, List
import uuid
from sqlalchemy.orm import Session, joinedload
from app.db.models.trip import Trip
from app.db.models.itinerary_option import ItineraryOptionModel
from app.db.models.trip_day import TripDayModel
from app.db.models.trip_stop import TripStopModel
from app.schemas.itinerary import TripStopCreate, TripStopUpdate


class ItineraryRepository:
    @staticmethod
    def get_trip_with_itinerary(db: Session, trip_id: uuid.UUID) -> Optional[Trip]:
        return (
            db.query(Trip)
            .options(
                joinedload(Trip.days).joinedload(TripDayModel.stops),
                joinedload(Trip.options),
            )
            .filter(Trip.id == trip_id)
            .first()
        )

    @staticmethod
    def materialize_plan(
        db: Session,
        trip: Trip,
        option: ItineraryOptionModel,
    ) -> Trip:
        trip.selected_option_key = option.option_key
        # Clear previous materialized days if re-materializing
        trip.days.clear()
        db.flush()

        day_count = max(1, (trip.end_date - trip.start_date).days + 1)
        times = ["9:00 AM", "10:30 AM", "12:15 PM", "1:30 PM", "3:30 PM", "5:00 PM"]
        highlights = option.highlights or []
        day_outlines = option.day_outline or []

        for day_index in range(day_count):
            day_date = trip.start_date + timedelta(days=day_index)
            day_title = (
                day_outlines[day_index]
                if day_index < len(day_outlines)
                else f"Day {day_index + 1}: Open time to explore"
            )

            day_model = TripDayModel(
                trip_id=trip.id,
                day_number=day_index + 1,
                date=day_date,
                title=day_title,
            )

            if day_index == 0:
                # First day populates with plan highlights
                if highlights:
                    for stop_idx, highlight in enumerate(highlights):
                        time_str = times[stop_idx] if stop_idx < len(times) else "Flexible"
                        duration_str = "1 hour" if stop_idx == 0 else "1–1.5 hours"
                        category_str = "Trip highlight" if stop_idx == 0 else "Plan highlight"
                        stop = TripStopModel(
                            title=highlight,
                            time=time_str,
                            duration=duration_str,
                            category=category_str,
                            description=f"A featured experience from your {option.title.lower()} plan.",
                            order_index=stop_idx,
                        )
                        day_model.stops.append(stop)
                else:
                    stop = TripStopModel(
                        title=day_title,
                        time="Flexible",
                        duration="At your own pace",
                        category="Day outline",
                        description=option.description or "Featured starter itinerary experience.",
                        order_index=0,
                    )
                    day_model.stops.append(stop)
            else:
                outline_text = day_outlines[day_index] if day_index < len(day_outlines) else None
                stop = TripStopModel(
                    title=outline_text if outline_text else "Open time to explore",
                    time="Flexible",
                    duration="At your own pace",
                    category="Day outline" if outline_text else "Flexible time",
                    description=(
                        option.description
                        if outline_text
                        else "Keep this day open and decide what feels right while you travel."
                    ),
                    order_index=0,
                )
                day_model.stops.append(stop)

            trip.days.append(day_model)

        db.commit()
        db.refresh(trip)
        return trip

    @staticmethod
    def get_day_by_number(db: Session, trip_id: uuid.UUID, day_number: int) -> Optional[TripDayModel]:
        return (
            db.query(TripDayModel)
            .options(joinedload(TripDayModel.stops))
            .filter(TripDayModel.trip_id == trip_id, TripDayModel.day_number == day_number)
            .first()
        )

    @staticmethod
    def add_stop(
        db: Session,
        trip_id: uuid.UUID,
        day_number: int,
        stop_in: TripStopCreate,
    ) -> Optional[TripStopModel]:
        day = ItineraryRepository.get_day_by_number(db, trip_id, day_number)
        if not day:
            return None

        current_max_order = max([s.order_index for s in day.stops], default=-1)
        stop = TripStopModel(
            day_id=day.id,
            title=stop_in.title,
            time=stop_in.time,
            duration=stop_in.duration,
            category=stop_in.category,
            description=stop_in.description,
            order_index=current_max_order + 1,
        )
        db.add(stop)
        db.commit()
        db.refresh(stop)
        return stop

    @staticmethod
    def get_stop_by_id(db: Session, stop_id: uuid.UUID) -> Optional[TripStopModel]:
        return db.query(TripStopModel).filter(TripStopModel.id == stop_id).first()

    @staticmethod
    def update_stop(
        db: Session,
        stop_id: uuid.UUID,
        stop_in: TripStopUpdate,
    ) -> Optional[TripStopModel]:
        stop = ItineraryRepository.get_stop_by_id(db, stop_id)
        if not stop:
            return None

        if stop_in.title is not None:
            stop.title = stop_in.title
        if stop_in.time is not None:
            stop.time = stop_in.time
        if stop_in.duration is not None:
            stop.duration = stop_in.duration
        if stop_in.category is not None:
            stop.category = stop_in.category
        if stop_in.description is not None:
            stop.description = stop_in.description

        db.commit()
        db.refresh(stop)
        return stop

    @staticmethod
    def delete_stop(db: Session, stop_id: uuid.UUID) -> bool:
        stop = ItineraryRepository.get_stop_by_id(db, stop_id)
        if not stop:
            return False

        day_id = stop.day_id
        db.delete(stop)
        db.flush()

        # Re-index remaining stops in that day
        remaining_stops = (
            db.query(TripStopModel)
            .filter(TripStopModel.day_id == day_id)
            .order_by(TripStopModel.order_index)
            .all()
        )
        for idx, s in enumerate(remaining_stops):
            s.order_index = idx

        db.commit()
        return True

    @staticmethod
    def reorder_stops(
        db: Session,
        trip_id: uuid.UUID,
        day_number: int,
        stop_ids: List[str],
    ) -> bool:
        day = ItineraryRepository.get_day_by_number(db, trip_id, day_number)
        if not day:
            return False

        stops_by_id = {str(s.id): s for s in day.stops}
        for new_index, stop_id_str in enumerate(stop_ids):
            if stop_id_str in stops_by_id:
                stops_by_id[stop_id_str].order_index = new_index

        db.commit()
        return True

    @staticmethod
    def replace_day_stops(
        db: Session,
        trip_id: uuid.UUID,
        day_number: int,
        new_stops_in: List[TripStopCreate],
    ) -> Optional[TripDayModel]:
        day = ItineraryRepository.get_day_by_number(db, trip_id, day_number)
        if not day:
            return None

        # Delete existing stops for this day
        db.query(TripStopModel).filter(TripStopModel.day_id == day.id).delete()
        db.flush()

        # Insert new stops
        for idx, stop_in in enumerate(new_stops_in):
            stop_model = TripStopModel(
                day_id=day.id,
                title=stop_in.title,
                time=stop_in.time,
                duration=stop_in.duration,
                category=stop_in.category,
                description=stop_in.description,
                order_index=idx,
            )
            day.stops.append(stop_model)

        db.commit()
        db.refresh(day)
        return day
