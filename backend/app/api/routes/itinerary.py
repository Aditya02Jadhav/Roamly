from typing import Annotated
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.itinerary import (
    SelectPlanRequest,
    TripStopCreate,
    TripStopUpdate,
    TripStopResponse,
    TripDayResponse,
    ItineraryResponse,
    ReorderStopsRequest,
    ItineraryAdjustRequest,
)
from app.services.itinerary_service import ItineraryService

router = APIRouter(prefix="/trips/{trip_id}", tags=["Itinerary"])


@router.post(
    "/select-plan",
    response_model=ItineraryResponse,
    status_code=status.HTTP_200_OK,
    summary="Select a plan and materialize itinerary days and stops",
)
def select_plan(
    trip_id: uuid.UUID,
    payload: SelectPlanRequest,
    db: Annotated[Session, Depends(get_db)],
) -> ItineraryResponse:
    itinerary = ItineraryService.select_plan(db=db, trip_id=trip_id, plan_key=payload.plan)
    if not itinerary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID '{trip_id}' or plan '{payload.plan}' not found.",
        )
    return itinerary


@router.get(
    "/itinerary",
    response_model=ItineraryResponse,
    status_code=status.HTTP_200_OK,
    summary="Get full materialized itinerary for trip",
)
def get_itinerary(
    trip_id: uuid.UUID,
    db: Annotated[Session, Depends(get_db)],
) -> ItineraryResponse:
    itinerary = ItineraryService.get_itinerary(db=db, trip_id=trip_id)
    if not itinerary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID '{trip_id}' not found.",
        )
    return itinerary


@router.post(
    "/days/{day_number}/stops",
    response_model=TripStopResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a new stop to a specific day",
)
def add_stop(
    trip_id: uuid.UUID,
    day_number: int,
    stop_in: TripStopCreate,
    db: Annotated[Session, Depends(get_db)],
) -> TripStopResponse:
    stop = ItineraryService.add_stop(
        db=db,
        trip_id=trip_id,
        day_number=day_number,
        stop_in=stop_in,
    )
    if not stop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Day {day_number} in trip '{trip_id}' not found.",
        )
    return stop


@router.post(
    "/days/{day_number}/adjust",
    response_model=TripDayResponse,
    status_code=status.HTTP_200_OK,
    summary="Adjust a day's stops using natural language AI prompt",
)
def adjust_day(
    trip_id: uuid.UUID,
    day_number: int,
    payload: ItineraryAdjustRequest,
    db: Annotated[Session, Depends(get_db)],
) -> TripDayResponse:
    adjusted_day = ItineraryService.adjust_day(
        db=db,
        trip_id=trip_id,
        day_number=day_number,
        prompt=payload.prompt,
    )
    if not adjusted_day:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Day {day_number} in trip '{trip_id}' not found.",
        )
    return adjusted_day


@router.patch(
    "/stops/{stop_id}",
    response_model=TripStopResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a stop's details",
)
def update_stop(
    trip_id: uuid.UUID,
    stop_id: uuid.UUID,
    stop_in: TripStopUpdate,
    db: Annotated[Session, Depends(get_db)],
) -> TripStopResponse:
    stop = ItineraryService.update_stop(db=db, stop_id=stop_id, stop_in=stop_in)
    if not stop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Stop with ID '{stop_id}' not found.",
        )
    return stop


@router.delete(
    "/stops/{stop_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a stop",
)
def delete_stop(
    trip_id: uuid.UUID,
    stop_id: uuid.UUID,
    db: Annotated[Session, Depends(get_db)],
):
    deleted = ItineraryService.delete_stop(db=db, stop_id=stop_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Stop with ID '{stop_id}' not found.",
        )
    return None


@router.put(
    "/days/{day_number}/reorder",
    status_code=status.HTTP_200_OK,
    summary="Reorder stops in a day",
)
def reorder_stops(
    trip_id: uuid.UUID,
    day_number: int,
    payload: ReorderStopsRequest,
    db: Annotated[Session, Depends(get_db)],
):
    reordered = ItineraryService.reorder_stops(
        db=db,
        trip_id=trip_id,
        day_number=day_number,
        stop_ids=payload.stop_ids,
    )
    if not reordered:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Day {day_number} in trip '{trip_id}' not found.",
        )
    return {"status": "success", "message": "Stops reordered successfully."}
