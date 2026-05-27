from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.core.exceptions import unauthorized, validation_error
from app.core.security import verify_password, create_access_token
from app.models.user import User


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def login(self, *, email: str, password: str) -> str:
        user = self.db.query(User).filter(User.email == email, User.is_deleted.is_(False)).first()
        if not user or not user.is_active:
            raise unauthorized("Invalid email or password")
        if not verify_password(password, user.password_hash):
            raise unauthorized("Invalid email or password")
        user.last_login_at = datetime.now(timezone.utc)
        self.db.add(user)
        self.db.commit()
        return create_access_token(subject=str(user.id), role=user.role)

    def ensure_role(self, user: User, role: str) -> None:
        if user.role != role:
            raise validation_error(f"User must have role {role}")
