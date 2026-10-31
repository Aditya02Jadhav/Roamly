from datetime import datetime
import uuid
from typing import TYPE_CHECKING
from sqlalchemy import (
    String,
    Integer,
    DateTime,
    Text,
    ForeignKey,
    Uuid,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

if TYPE_CHECKING:
    from app.db.models.trip_day import TripDayModel


class TripStopModel(Base):
    __tablename__ = "trip_stops"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True,
    )
    day_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("trip_days.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    time: Mapped[str] = mapped_column(String(50), nullable=False, default="Flexible")
    duration: Mapped[str] = mapped_column(String(50), nullable=False, default="At your own pace")
    category: Mapped[str] = mapped_column(String(50), nullable=False, default="Trip stop")
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    order_index: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    day: Mapped["TripDayModel"] = relationship("TripDayModel", back_populates="stops")

