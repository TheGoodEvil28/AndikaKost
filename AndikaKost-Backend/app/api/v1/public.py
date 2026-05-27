from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.models.room import Room
from app.schemas.booking import BookingCreate, BookingOut
from app.schemas.room import RoomOut
from app.services.booking_service import BookingService


router = APIRouter()


@router.get("/overview")
def overview(db: Session = Depends(get_db)):
    total_rooms = db.query(func.count(Room.id)).filter(Room.is_deleted.is_(False)).scalar() or 0
    available_rooms = (
        db.query(func.count(Room.id))
        .filter(Room.is_deleted.is_(False), Room.status == "available")
        .scalar()
        or 0
    )
    return {
        "data": {
            "total_rooms": total_rooms,
            "available_rooms": available_rooms,
        },
        "message": "Success",
    }


@router.get("/rooms")
def available_rooms(db: Session = Depends(get_db)):
    rooms = (
        db.query(Room)
        .filter(Room.is_deleted.is_(False), Room.status == "available")
        .order_by(Room.id.desc())
        .all()
    )
    return {"data": [RoomOut.model_validate(r) for r in rooms], "message": "Success"}


@router.post("/bookings")
def create_booking(payload: BookingCreate, db: Session = Depends(get_db)):
    booking = BookingService(db).create(**payload.model_dump())
    return {"data": BookingOut.model_validate(booking), "message": "Success"}

