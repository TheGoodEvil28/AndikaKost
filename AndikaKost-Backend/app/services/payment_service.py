from datetime import datetime, timezone

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.core.exceptions import not_found, forbidden, validation_error
from app.models.payment import Payment
from app.models.tenant import Tenant
from app.models.user import User
from app.repositories.payment_repository import PaymentRepository
from app.repositories.room_repository import RoomRepository
from app.repositories.tenant_repository import TenantRepository
from app.utils.file_upload import save_upload


class PaymentService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = PaymentRepository(db)
        self.tenants = TenantRepository(db)
        self.rooms = RoomRepository(db)

    def list_all(self) -> list[Payment]:
        return self.repo.list_all()

    def list_for_tenant_user(self, user: User) -> list[Payment]:
        tenant = self.tenants.get_by_user_id(user.id)
        if not tenant:
            return []
        return self.repo.list_by_tenant(tenant.id)

    def get_payment(self, payment_id: int) -> Payment:
        payment = self.repo.get(payment_id)
        if not payment:
            raise not_found("Payment")
        return payment

    def get_payment_for_user(self, payment_id: int, user: User) -> Payment:
        payment = self.get_payment(payment_id)
        if user.role == "admin":
            return payment
        tenant = self.tenants.get_by_user_id(user.id)
        if not tenant or payment.tenant_id != tenant.id:
            raise forbidden("Cannot access this payment")
        return payment

    def create_bill(self, *, tenant_id: int, billing_month: str, amount_idr: int, due_date) -> Payment:
        if amount_idr <= 0:
            raise validation_error("Bill amount must be greater than 0")
        tenant = self.tenants.get(tenant_id)
        if not tenant:
            raise not_found("Tenant")
        if tenant.status != "active":
            raise validation_error("Bill can only be created for active tenant")
        if not tenant.room_id:
            raise validation_error("Tenant must have a room before a bill can be created")
        payment = Payment(
            tenant_id=tenant.id,
            room_id=tenant.room_id,
            billing_month=billing_month,
            amount_idr=amount_idr,
            due_date=due_date,
            status="unpaid",
        )
        return self.repo.create(payment)

    def upload_proof(self, *, payment_id: int, user: User, file: UploadFile) -> Payment:
        payment = self.get_payment_for_user(payment_id, user)
        if user.role != "tenant":
            raise forbidden("Tenant access required")
        if payment.status not in {"unpaid", "rejected", "pending_verification"}:
            raise validation_error("Cannot upload proof for this bill status")
        url = save_upload(file, prefix=f"payment_{payment.id}")
        payment.proof_file_url = url
        payment.status = "pending_verification"
        return self.repo.save(payment)

    def approve(self, *, payment_id: int, admin_user: User) -> Payment:
        payment = self.get_payment(payment_id)
        payment.status = "paid"
        payment.verified_by = admin_user.id
        payment.verified_at = datetime.now(timezone.utc)
        return self.repo.save(payment)

    def reject(self, *, payment_id: int, admin_user: User, admin_note: str | None = None) -> Payment:
        payment = self.get_payment(payment_id)
        payment.status = "rejected"
        payment.verified_by = admin_user.id
        payment.verified_at = datetime.now(timezone.utc)
        if admin_note:
            payment.admin_note = admin_note
        return self.repo.save(payment)
