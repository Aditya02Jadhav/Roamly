from typing import Annotated, List
import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.trip import (
    TripCreateRequest,
    TripResponse,
    TripListItemResponse,
)
from app.schemas.trip_summary import TripSummaryResponse
from app.services.trip_service import TripService
from app.db.models.user import UserModel
from app.api.deps import get_current_user, get_current_user_optional

router = APIRouter(prefix="/trips", tags=["Trips"])


@router.get(
    "",
    response_model=List[TripListItemResponse],
    status_code=status.HTTP_200_OK,
    summary="List all persisted trips",
    description="Retrieve a list of saved trips with high-level summaries for the My Trips dashboard.",
)
def list_trips(
    current_user: Annotated[UserModel, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
    limit: Annotated[int, Query(ge=1, le=100)] = 50,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> List[TripListItemResponse]:
    return TripService.list_trips(
        db=db,
        user_id=current_user.id,
        limit=limit,
        offset=offset,
    )


@router.post(
    "",
    response_model=TripResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a draft trip with preferences",
    description=(
        "Validate trip preferences, persist an anonymous draft trip in PostgreSQL, "
        "and generate starter itinerary options. Note: Draft trips are currently unauthenticated "
        "and public; they must not be treated as private or user-owned records until access control is implemented."
    ),
)
def create_trip(
    trip_in: TripCreateRequest,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[UserModel | None, Depends(get_current_user_optional)],
) -> TripResponse:
    try:
        return TripService.create_draft_trip(
            db=db,
            trip_in=trip_in,
            user_id=current_user.id if current_user else None,
        )
    except Exception as e:
        # Prevent stack trace leakage in API responses
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create and persist draft trip.",
        ) from None


@router.get(
    "/{trip_id}",
    response_model=TripResponse,
    status_code=status.HTTP_200_OK,
    summary="Retrieve a persisted trip by ID",
    description="Fetch a saved draft trip and its generated starter options using its unguessable UUID.",
)
def get_trip(
    trip_id: uuid.UUID,
    db: Annotated[Session, Depends(get_db)],
) -> TripResponse:
    trip = TripService.get_trip_by_id(db=db, trip_id=trip_id)
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID '{trip_id}' not found.",
        )
    return trip


@router.delete(
    "/{trip_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a trip",
    description="Permanently remove a trip and all its associated days and stops.",
)
def delete_trip(
    trip_id: uuid.UUID,
    db: Annotated[Session, Depends(get_db)],
) -> None:
    success = TripService.delete_trip(db=db, trip_id=trip_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID '{trip_id}' not found.",
        )


@router.post(
    "/{trip_id}/clone",
    response_model=TripResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Clone/duplicate a trip",
    description="Duplicate an existing trip including its selected plan and itinerary stops into a fresh draft.",
)
def clone_trip(
    trip_id: uuid.UUID,
    db: Annotated[Session, Depends(get_db)],
) -> TripResponse:
    cloned = TripService.clone_trip(db=db, trip_id=trip_id)
    if not cloned:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID '{trip_id}' not found.",
        )
    return cloned


@router.get(
    "/{trip_id}/summary",
    response_model=TripSummaryResponse,
    status_code=status.HTTP_200_OK,
    summary="Retrieve complete trip overview summary",
    description="Fetch comprehensive summary including metadata, selected plan, days with stops, and stats.",
)
def get_trip_summary(
    trip_id: uuid.UUID,
    db: Annotated[Session, Depends(get_db)],
) -> TripSummaryResponse:
    summary = TripService.get_trip_summary(db=db, trip_id=trip_id)
    if not summary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID '{trip_id}' not found.",
        )
    return summary


@router.post(
    "/{trip_id}/claim",
    status_code=status.HTTP_200_OK,
    summary="Claim an anonymous draft trip to current user",
)
def claim_trip(
    trip_id: uuid.UUID,
    current_user: Annotated[UserModel, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    from app.repositories.user_repository import UserRepository
    claimed = UserRepository.claim_trip(db, trip_id=trip_id, user_id=current_user.id)
    if not claimed:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID '{trip_id}' not found.",
        )
    return {"status": "success", "message": f"Trip claimed by user '{current_user.email}'."}
