from sqlalchemy.orm import Session

from app.models.tenant import Tenant


class TenantRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self) -> list[Tenant]:
        return self.db.query(Tenant).order_by(Tenant.id.desc()).all()

    def get(self, tenant_id: int) -> Tenant | None:
        return self.db.query(Tenant).filter(Tenant.id == tenant_id).first()

    def get_by_user_id(self, user_id: int) -> Tenant | None:
        return self.db.query(Tenant).filter(Tenant.user_id == user_id).first()

    def create(self, tenant: Tenant) -> Tenant:
        self.db.add(tenant)
        self.db.commit()
        self.db.refresh(tenant)
        return tenant

    def save(self, tenant: Tenant) -> Tenant:
        self.db.add(tenant)
        self.db.commit()
        self.db.refresh(tenant)
        return tenant
