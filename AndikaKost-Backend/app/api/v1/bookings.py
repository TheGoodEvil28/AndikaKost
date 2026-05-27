from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_admin
from app.schemas.booking import BookingOut, BookingStatusUpdate
from app.services.booking_service import BookingService


router = APIRouter()


@router.get("")
def list_bookings(db: Session = Depends(get_db), _admin=Depends(require_admin)):
    data = BookingService(db).list_all()
    return {"data": [BookingOut.model_validate(b) for b in data], "message": "Success"}


@router.get("/{booking_id}")
def booking_detail(booking_id: int, db: Session = Depends(get_db), _admin=Depends(require_admin)):
    booking = BookingService(db).get(booking_id)
    return {"data": BookingOut.model_validate(booking), "message": "Success"}


@router.patch("/{booking_id}/status")
def update_status(booking_id: int, payload: BookingStatusUpdate, db: Session = Depends(get_db), _admin=Depends(require_admin)):
    booking = BookingService(db).update_status(booking_id, payload.status)
    return {"data": BookingOut.model_validate(booking), "message": "Success"}

