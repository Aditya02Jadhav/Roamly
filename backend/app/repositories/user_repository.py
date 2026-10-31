from typing import Optional
import uuid
from sqlalchemy.orm import Session
from app.db.models.user import UserModel
from app.db.models.trip import Trip
from app.schemas.user import UserRegisterRequest
from app.core.security import get_password_hash, verify_password


class UserRepository:
    @staticmethod
    def get_by_id(db: Session, user_id: uuid.UUID) -> Optional[UserModel]:
        return db.query(UserModel).filter(UserModel.id == user_id).first()

    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[UserModel]:
        return db.query(UserModel).filter(UserModel.email == email.lower().strip()).first()

    @staticmethod
    def create(db: Session, user_in: UserRegisterRequest) -> UserModel:
        user = UserModel(
            email=user_in.email.lower().strip(),
            hashed_password=get_password_hash(user_in.password),
            full_name=user_in.full_name.strip(),
            ai_credits=10,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def claim_trip(db: Session, trip_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        trip = db.query(Trip).filter(Trip.id == trip_id).first()
        if not trip:
            return False
        trip.user_id = user_id
        db.commit()
        return True

