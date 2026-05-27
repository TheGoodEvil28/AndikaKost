from datetime import datetime, timezone

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.core.exceptions import not_found, forbidden, validation_error
from app.models.complaint import Complaint
from app.models.user import User
from app.repositories.complaint_repository import ComplaintRepository
from app.repositories.tenant_repository import TenantRepository
from app.utils.file_upload import save_upload


class ComplaintService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = ComplaintRepository(db)
        self.tenants = TenantRepository(db)

    def list_all(self) -> list[Complaint]:
        return self.repo.list_all()

    def list_for_tenant_user(self, user: User) -> list[Complaint]:
        tenant = self.tenants.get_by_user_id(user.id)
        if not tenant:
            return []
        return self.repo.list_by_tenant(tenant.id)

    def get_for_user(self, complaint_id: int, user: User) -> Complaint:
        complaint = self.repo.get(complaint_id)
        if not complaint:
            raise not_found("Complaint")
        if user.role == "admin":
            return complaint
        tenant = self.tenants.get_by_user_id(user.id)
        if not tenant or complaint.tenant_id != tenant.id:
            raise forbidden("Cannot access this complaint")
        return complaint

    def create(self, *, user: User, category: str, description: str, priority: str, photo: UploadFile | None) -> Complaint:
        tenant = self.tenants.get_by_user_id(user.id)
        if not tenant:
            raise validation_error("Tenant profile not found")
        if not tenant.room_id:
            raise validation_error("Tenant must have an assigned room")
        photo_url = save_upload(photo, prefix="complaint") if photo else None
        complaint = Complaint(
            tenant_id=tenant.id,
            room_id=tenant.room_id,
            category=category,
            description=description,
            priority=priority,
            status="submitted",
            photo_file_url=photo_url,
        )
        return self.repo.create(complaint)

    def update_status(self, complaint_id: int, status: str) -> Complaint:
        complaint = self.repo.get(complaint_id)
        if not complaint:
            raise not_found("Complaint")
        complaint.status = status
        if status == "resolved":
            complaint.resolved_at = datetime.now(timezone.utc)
        return self.repo.save(complaint)

    def add_response(self, complaint_id: int, admin_response: str) -> Complaint:
        complaint = self.repo.get(complaint_id)
        if not complaint:
            raise not_found("Complaint")
        complaint.admin_response = admin_response
        return self.repo.save(complaint)
