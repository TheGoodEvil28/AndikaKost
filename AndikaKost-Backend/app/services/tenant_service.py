from datetime import date

from sqlalchemy.orm import Session

from app.core.exceptions import not_found, validation_error
from app.core.security import hash_password
from app.models.room import Room
from app.models.tenant import Tenant
from app.models.user import User
from app.repositories.room_repository import RoomRepository
from app.repositories.tenant_repository import TenantRepository


class TenantService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = TenantRepository(db)
        self.rooms = RoomRepository(db)

    def list_tenants(self) -> list[Tenant]:
        return self.repo.list()

    def get_tenant(self, tenant_id: int) -> Tenant:
        tenant = self.repo.get(tenant_id)
        if not tenant:
            raise not_found("Tenant")
        return tenant

    def create_tenant_with_user(
        self,
        *,
        full_name: str,
        email: str,
        phone: str | None,
        password: str,
        identity_number: str | None,
        address: str | None,
        emergency_contact_name: str | None,
        emergency_contact_phone: str | None,
        move_in_date: date,
        notes: str | None,
    ) -> Tenant:
        existing = self.db.query(User).filter(User.email == email, User.is_deleted.is_(False)).first()
        if existing:
            raise validation_error("Tenant email must be unique")
        user = User(
            full_name=full_name,
            email=email,
            phone=phone,
            password_hash=hash_password(password),
            role="tenant",
            is_active=True,
            is_deleted=False,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        tenant = Tenant(
            user_id=user.id,
            room_id=None,
            identity_number=identity_number,
            address=address,
            emergency_contact_name=emergency_contact_name,
            emergency_contact_phone=emergency_contact_phone,
            move_in_date=move_in_date,
            move_out_date=None,
            status="active",
            notes=notes,
        )
        return self.repo.create(tenant)

    def update_tenant(self, tenant_id: int, patch: dict) -> Tenant:
        tenant = self.get_tenant(tenant_id)
        user = self.db.get(User, tenant.user_id)
        if not user or user.is_deleted:
            raise not_found("Tenant user")
        user_fields = {k: patch.pop(k) for k in list(patch.keys()) if k in {"full_name", "phone"}}
        for k, v in user_fields.items():
            if v is not None:
                setattr(user, k, v)
        self.db.add(user)

        for k, v in patch.items():
            if v is not None:
                setattr(tenant, k, v)
        self.db.add(tenant)
        self.db.commit()
        self.db.refresh(tenant)
        return tenant

    def assign_room(self, tenant_id: int, room_id: int | None) -> Tenant:
        tenant = self.get_tenant(tenant_id)
        if room_id is None:
            if tenant.room_id:
                old_room = self.rooms.get(tenant.room_id)
                if old_room and old_room.status == "occupied":
                    old_room.status = "available"
                    self.db.add(old_room)
            tenant.room_id = None
            self.db.add(tenant)
            self.db.commit()
            self.db.refresh(tenant)
            return tenant

        room = self.rooms.get(room_id)
        if not room:
            raise not_found("Room")
        if room.status == "occupied":
            raise validation_error("Room is already occupied")
        tenant.room_id = room.id
        room.status = "occupied"
        self.db.add(room)
        self.db.add(tenant)
        self.db.commit()
        self.db.refresh(tenant)
        return tenant
