from datetime import date, datetime
import uuid
from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import (
    String,
    Date,
    Integer,
    Boolean,
    DateTime,
    JSON,
    Uuid,
    ForeignKey,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

if TYPE_CHECKING:
    from app.db.models.itinerary_option import ItineraryOptionModel
    from app.db.models.trip_day import TripDayModel
    from app.db.models.user import UserModel


class Trip(Base):
    __tablename__ = "trips"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True,
    )
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    destination: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    flexible_dates: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    adults: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    children: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    budget: Mapped[str] = mapped_column(String(50), nullable=False)
    total_budget: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    pace: Mapped[str] = mapped_column(String(50), nullable=False)
    transport: Mapped[str] = mapped_column(String(50), nullable=False)
    interests: Mapped[list] = mapped_column(
        JSONB().with_variant(JSON(), "sqlite"),
        nullable=False,
        default=list,
    )
    status: Mapped[str] = mapped_column(
        String(50),
        default="draft",
        nullable=False,
        index=True,
    )
    selected_option_key: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    user: Mapped[Optional["UserModel"]] = relationship("UserModel", back_populates="trips")

    options: Mapped[List["ItineraryOptionModel"]] = relationship(
        "ItineraryOptionModel",
        back_populates="trip",
        cascade="all, delete-orphan",
        order_by="ItineraryOptionModel.created_at",
    )
    days: Mapped[List["TripDayModel"]] = relationship(
        "TripDayModel",
        back_populates="trip",
        cascade="all, delete-orphan",
        order_by="TripDayModel.day_number",
    )
