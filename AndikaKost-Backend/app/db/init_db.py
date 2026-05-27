from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password
from app.db.session import engine, SessionLocal
from app.models.user import User
from app.models.room import Room
from app.models.tenant import Tenant
from app.models.payment import Payment
from app.models.complaint import Complaint
from app.models.booking import BookingRequest


def seed_admin(db: Session) -> None:
    existing = db.query(User).filter(User.email == settings.seed_admin_email, User.is_deleted.is_(False)).first()
    if existing:
        return
    admin = User(
        full_name=settings.seed_admin_full_name,
        email=settings.seed_admin_email,
        phone=None,
        password_hash=hash_password(settings.seed_admin_password),
        role="admin",
        is_active=True,
        is_deleted=False,
    )
    db.add(admin)
    db.commit()


def init_db() -> None:
    # Import models above to ensure metadata is loaded for Alembic autogenerate if needed.
    with SessionLocal() as db:
        seed_admin(db)


if __name__ == "__main__":
    init_db()
