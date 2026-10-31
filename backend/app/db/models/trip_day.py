from datetime import date, datetime
import uuid
from typing import List, TYPE_CHECKING
from sqlalchemy import (
    String,
    Date,
    Integer,
    DateTime,
    ForeignKey,
    Uuid,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

if TYPE_CHECKING:
    from app.db.models.trip import Trip
    from app.db.models.trip_stop import TripStopModel


class TripDayModel(Base):
    __tablename__ = "trip_days"

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
    day_number: Mapped[int] = mapped_column(Integer, nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    trip: Mapped["Trip"] = relationship("Trip", back_populates="days")
    stops: Mapped[List["TripStopModel"]] = relationship(
        "TripStopModel",
        back_populates="day",
        cascade="all, delete-orphan",
        order_by="TripStopModel.order_index",
    )

