from datetime import date, datetime
from typing import List, Optional, Dict
import uuid
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.trip import TripPreferencesData
from app.schemas.itinerary import TripDayResponse
from app.schemas.itinerary_option import ItineraryOptionResponse, EstimatedCost


class TripStats(BaseModel):
    total_days: int
    total_stops: int
    categories_breakdown: Dict[str, int] = Field(default_factory=dict)


class TripSummaryResponse(BaseModel):
    trip_id: uuid.UUID = Field(..., serialization_alias="tripId")
    status: str
    destination: str
    preferences: TripPreferencesData
    selected_plan: Optional[str] = Field(default=None, serialization_alias="selectedPlan")
    selected_option: Optional[ItineraryOptionResponse] = Field(default=None, serialization_alias="selectedOption")
    days: List[TripDayResponse] = Field(default_factory=list)
    stats: TripStats
    created_at: datetime = Field(..., serialization_alias="createdAt")
    updated_at: datetime = Field(..., serialization_alias="updatedAt")

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

