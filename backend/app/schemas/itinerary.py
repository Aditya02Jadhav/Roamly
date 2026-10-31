from datetime import date
from typing import List, Optional
import uuid
from pydantic import BaseModel, ConfigDict, Field, computed_field


class SelectPlanRequest(BaseModel):
    plan: str = Field(..., description="Option key chosen by traveller (e.g. balanced, budget, slow)")


class TripStopCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    time: str = Field(default="Flexible", max_length=50)
    duration: str = Field(default="At your own pace", max_length=50)
    category: str = Field(default="Your addition", max_length=50)
    description: str = Field(default="")


class TripStopUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    time: Optional[str] = Field(default=None, max_length=50)
    duration: Optional[str] = Field(default=None, max_length=50)
    category: Optional[str] = Field(default=None, max_length=50)
    description: Optional[str] = None


class TripStopResponse(BaseModel):
    id: str = Field(..., description="Stop identifier string matching frontend expectations")
    stop_id: uuid.UUID = Field(..., description="Database UUID of stop")
    day_id: uuid.UUID = Field(..., description="Database UUID of parent day")
    title: str
    time: str
    duration: str
    category: str
    description: str
    order_index: int

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class TripDayResponse(BaseModel):
    id: str = Field(..., description="Day identifier string")
    day_id: uuid.UUID = Field(..., description="Database UUID of day")
    trip_id: uuid.UUID
    day_number: int
    date: date
    title: str
    stops: List[TripStopResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class ItineraryResponse(BaseModel):
    trip_id: uuid.UUID
    selected_plan: Optional[str] = None
    days: List[TripDayResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class ReorderStopsRequest(BaseModel):
    stop_ids: List[str] = Field(..., min_length=1, description="List of stop UUIDs or IDs in new sequence")


class ItineraryAdjustRequest(BaseModel):
    prompt: str = Field(..., min_length=2, max_length=500, description="Natural language prompt for day adjustments")
