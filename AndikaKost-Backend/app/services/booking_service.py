from sqlalchemy.orm import Session

from app.core.exceptions import not_found, validation_error
from app.models.booking import BookingRequest
from app.repositories.booking_repository import BookingRepository
from app.repositories.room_repository import RoomRepository


class BookingService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = BookingRepository(db)
        self.rooms = RoomRepository(db)

    def list_all(self) -> list[BookingRequest]:
        return self.repo.list_all()

    def get(self, booking_id: int) -> BookingRequest:
        booking = self.repo.get(booking_id)
        if not booking:
            raise not_found("Booking request")
        return booking

    def create(self, *, room_id: int, full_name: str, email: str, phone: str | None, message: str | None) -> BookingRequest:
        room = self.rooms.get(room_id)
        if not room or room.is_deleted:
            raise not_found("Room")
        if room.status != "available":
            raise validation_error("Room is not available")
        booking = BookingRequest(
            room_id=room_id,
            full_name=full_name.strip(),
            email=email.strip().lower(),
            phone=phone.strip() if phone else None,
            message=message.strip() if message else None,
            status="submitted",
        )
        return self.repo.create(booking)

    def update_status(self, booking_id: int, status: str) -> BookingRequest:
        booking = self.get(booking_id)
        booking.status = status
        return self.repo.save(booking)

