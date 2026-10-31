from datetime import date, datetime
from typing import List, Literal, Optional
import uuid
from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    field_validator,
    model_validator,
    computed_field,
)
from app.schemas.itinerary_option import ItineraryOptionResponse

AllowedBudget = Literal[
    "budget-friendly",
    "moderate",
    "comfort",
    "premium",
]

AllowedPace = Literal[
    "relaxed",
    "balanced",
    "packed",
]

AllowedTransport = Literal[
    "public-transit",
    "walking",
    "car-or-taxi",
    "mixed-transit",
]

AllowedInterest = Literal[
    "Beaches",
    "Food and cafés",
    "Culture",
    "Hidden gems",
    "Nature",
    "History",
    "Adventure",
    "Shopping",
    "Nightlife",
    "Photography",
]


class TripCreateRequest(BaseModel):
    destination: str = Field(
        ...,
        min_length=1,
        max_length=120,
        description="Target destination name or location",
    )
    start_date: date = Field(
        ...,
        validation_alias="startDate",
        description="Trip start date (YYYY-MM-DD)",
    )
    end_date: date = Field(
        ...,
        validation_alias="endDate",
        description="Trip end date (YYYY-MM-DD)",
    )
    flexible_dates: bool = Field(
        default=True,
        validation_alias="flexibleDates",
        description="Flexible date preference",
    )
    adults: int = Field(
        default=1,
        ge=1,
        le=20,
        description="Number of adult travellers (1 to 20)",
    )
    children: int = Field(
        default=0,
        ge=0,
        le=20,
        description="Number of child travellers (0 to 20)",
    )
    budget: AllowedBudget = Field(
        default="moderate",
        description="Budget preference",
    )
    total_budget: Optional[int] = Field(
        default=None,
        ge=1,
        le=60_000_000,
        validation_alias="totalBudget",
        serialization_alias="totalBudget",
        description="Total trip budget in INR",
    )
    interests: List[AllowedInterest] = Field(
        default_factory=list,
        description="List of selected interest tags",
    )
    pace: AllowedPace = Field(
        default="balanced",
        description="Travel pace preference",
    )
    transport: AllowedTransport = Field(
        default="car-or-taxi",
        description="Preferred transportation method",
    )

    @field_validator("destination")
    @classmethod
    def validate_destination_non_empty(cls, v: str) -> str:
        trimmed = v.strip()
        if not trimmed:
            raise ValueError("Destination cannot be empty or whitespace only.")
        return trimmed

    @field_validator("interests")
    @classmethod
    def validate_unique_interests(cls, v: List[str]) -> List[str]:
        # Deduplicate while preserving order
        seen = set()
        deduped = []
        for item in v:
            if item not in seen:
                seen.add(item)
                deduped.append(item)
        return deduped

    @model_validator(mode="after")
    def validate_dates(self) -> "TripCreateRequest":
        if self.end_date < self.start_date:
            raise ValueError("End date cannot be earlier than start date.")

        duration_days = (self.end_date - self.start_date).days
        max_allowed_days = 60
        if duration_days > max_allowed_days:
            raise ValueError(
                f"Trip duration ({duration_days} days) exceeds maximum allowed duration of {max_allowed_days} days."
            )
        return self

    model_config = ConfigDict(populate_by_name=True)


class TripPreferencesData(BaseModel):
    destination: str
    start_date: date = Field(..., serialization_alias="startDate")
    end_date: date = Field(..., serialization_alias="endDate")
    flexible_dates: bool = Field(..., serialization_alias="flexibleDates")
    adults: int
    children: int
    budget: str
    interests: List[str]
    pace: str
    transport: str
    total_budget: Optional[int] = Field(
        default=None,
        serialization_alias="totalBudget",
    )

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class TripListItemResponse(BaseModel):
    id: uuid.UUID
    destination: str
    status: str
    start_date: date = Field(..., serialization_alias="startDate")
    end_date: date = Field(..., serialization_alias="endDate")
    total_days: int = Field(..., serialization_alias="totalDays")
    adults: int
    children: int
    budget: str
    pace: str
    selected_plan: Optional[str] = Field(default=None, serialization_alias="selectedPlan")
    total_stops: int = Field(default=0, serialization_alias="totalStops")
    created_at: datetime = Field(..., serialization_alias="createdAt")
    updated_at: datetime = Field(..., serialization_alias="updatedAt")

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class TripResponse(BaseModel):
    id: uuid.UUID = Field(..., description="Unique trip identifier (UUID)")
    status: str = Field(default="draft", description="Trip status (e.g. draft)")
    preferences: TripPreferencesData = Field(..., description="Saved trip preferences")
    created_at: datetime = Field(..., serialization_alias="createdAt")
    updated_at: datetime = Field(..., serialization_alias="updatedAt")
    options: List[ItineraryOptionResponse] = Field(
        default_factory=list,
        description="Destination-tailored starter itinerary options",
    )

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)
