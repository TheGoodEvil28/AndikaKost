from datetime import date

from sqlalchemy.orm import Session

from app.core.exceptions import not_found, validation_error
from app.core.security import hash_password
from app.models.booking import BookingRequest
from app.models.tenant import Tenant
from app.models.user import User
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

    def _build_default_password(self, email: str) -> str:
        local_part = email.split("@", 1)[0].strip().lower() or "tenant"
        return f"{local_part}12345"

    def _get_or_create_tenant_user(self, booking: BookingRequest) -> User:
        email = booking.email.strip().lower()
        user = self.db.query(User).filter(User.email == email, User.is_deleted.is_(False)).first()
        if user:
            if user.role != "tenant":
                raise validation_error("Booking email already belongs to non-tenant account")
            user.full_name = booking.full_name.strip() or user.full_name
            if booking.phone and not user.phone:
                user.phone = booking.phone.strip()
            user.is_active = True
            self.db.add(user)
            return user

        user = User(
            full_name=booking.full_name.strip(),
            email=email,
            phone=booking.phone.strip() if booking.phone else None,
            password_hash=hash_password(self._build_default_password(email)),
            role="tenant",
            is_active=True,
            is_deleted=False,
        )
        self.db.add(user)
        self.db.flush()
        return user

    def _get_or_create_tenant_profile(self, user: User, booking: BookingRequest) -> Tenant:
        tenant = self.db.query(Tenant).filter(Tenant.user_id == user.id).first()
        if tenant:
            tenant.status = "active"
            self.db.add(tenant)
            return tenant

        tenant = Tenant(
            user_id=user.id,
            room_id=None,
            identity_number=None,
            address=None,
            emergency_contact_name=None,
            emergency_contact_phone=None,
            move_in_date=date.today(),
            move_out_date=None,
            status="active",
            notes=f"Auto-created from booking request #{booking.id}",
        )
        self.db.add(tenant)
        self.db.flush()
        return tenant

    def _assign_room(self, tenant: Tenant, booking: BookingRequest) -> None:
        room = self.rooms.get(booking.room_id)
        if not room:
            raise not_found("Room")

        if room.status == "occupied" and tenant.room_id != room.id:
            raise validation_error("Room is already occupied")

        if tenant.room_id and tenant.room_id != room.id:
            old_room = self.rooms.get(tenant.room_id)
            if old_room and old_room.status == "occupied":
                old_room.status = "available"
                self.db.add(old_room)

        tenant.room_id = room.id
        room.status = "occupied"
        self.db.add(tenant)
        self.db.add(room)

    def _convert_to_tenant(self, booking: BookingRequest) -> None:
        user = self._get_or_create_tenant_user(booking)
        tenant = self._get_or_create_tenant_profile(user, booking)
        self._assign_room(tenant, booking)

    def update_status(self, booking_id: int, status: str) -> BookingRequest:
        booking = self.get(booking_id)

        if status in {"approved", "converted"}:
            self._convert_to_tenant(booking)

        booking.status = status
        return self.repo.save(booking)
