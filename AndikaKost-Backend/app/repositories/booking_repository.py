from sqlalchemy.orm import Session

from app.models.booking import BookingRequest


class BookingRepository:
    def __init__(self, db: Session):
        self.db = db

    def list_all(self) -> list[BookingRequest]:
        return self.db.query(BookingRequest).order_by(BookingRequest.id.desc()).all()

    def get(self, booking_id: int) -> BookingRequest | None:
        return self.db.query(BookingRequest).filter(BookingRequest.id == booking_id).first()

    def create(self, booking: BookingRequest) -> BookingRequest:
        self.db.add(booking)
        self.db.commit()
        self.db.refresh(booking)
        return booking

    def save(self, booking: BookingRequest) -> BookingRequest:
        self.db.add(booking)
        self.db.commit()
        self.db.refresh(booking)
        return booking

