from datetime import datetime
import uuid
from typing import TYPE_CHECKING
from sqlalchemy import (
    String,
    Integer,
    Boolean,
    DateTime,
    Text,
    ForeignKey,
    JSON,
    Uuid,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

if TYPE_CHECKING:
    from app.db.models.trip import Trip


class ItineraryOptionModel(Base):
    __tablename__ = "itinerary_options"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True,
    )
    trip_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("trips.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    option_key: Mapped[str] = mapped_column(String(50), nullable=False)  # e.g. "balanced", "budget", "slow"
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    price_display: Mapped[str] = mapped_column(String(100), nullable=False)
    estimated_cost: Mapped[dict] = mapped_column(
        JSONB().with_variant(JSON(), "sqlite"),
        nullable=False,
    )
    stop_count: Mapped[int] = mapped_column(Integer, nullable=False)
    stop_description: Mapped[str] = mapped_column(String(100), nullable=False)
    pace: Mapped[str] = mapped_column(String(50), nullable=False)
    image: Mapped[str] = mapped_column(String(255), nullable=False)
    image_alt: Mapped[str] = mapped_column(String(255), nullable=False)
    recommended: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    highlights: Mapped[list] = mapped_column(
        JSONB().with_variant(JSON(), "sqlite"),
        nullable=False,
        default=list,
    )
    day_outline: Mapped[list] = mapped_column(
        JSONB().with_variant(JSON(), "sqlite"),
        nullable=False,
        default=list,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    trip: Mapped["Trip"] = relationship("Trip", back_populates="options")
