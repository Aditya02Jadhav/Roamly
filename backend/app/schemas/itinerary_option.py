from typing import List, Optional
import uuid
from pydantic import BaseModel, ConfigDict, Field, computed_field


class EstimatedCost(BaseModel):
    currency: str = "INR"
    min_amount: int
    max_amount: int
    basis: str = "per_person_per_day"  # e.g., "per_person_per_day" or "total_trip"
    display: str


class ItineraryOptionBase(BaseModel):
    option_key: str = Field(..., description="Option identifier e.g. balanced, budget, slow")
    title: str
    description: str
    price_display: str
    estimated_cost: EstimatedCost
    stop_count: int
    stop_description: str
    pace: str
    image: str
    image_alt: str
    recommended: bool = False
    highlights: List[str]
    day_outline: List[str]


class ItineraryOptionResponse(BaseModel):
    id: str = Field(..., description="Matches frontend option identifier (e.g. balanced)")
    option_id: uuid.UUID = Field(..., description="Database UUID for the option")
    title: str
    description: str
    price: str = Field(..., description="Display price string for frontend compatibility")
    estimated_cost: EstimatedCost
    stop_count: int
    stop_description: str
    pace: str
    image: str
    image_alt: str
    recommended: bool = False
    highlights: List[str]
    day_outline: List[str]

    # Computed fields for 100% frontend TypeScript contract compatibility
    @computed_field
    def stopCount(self) -> int:
        return self.stop_count

    @computed_field
    def stopDescription(self) -> str:
        return self.stop_description

    @computed_field
    def imageAlt(self) -> str:
        return self.image_alt

    @computed_field
    def dayOutline(self) -> List[str]:
        return self.day_outline

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
