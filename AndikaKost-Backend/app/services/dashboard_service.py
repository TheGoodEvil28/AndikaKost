from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.complaint import Complaint
from app.models.payment import Payment
from app.models.room import Room
from app.models.tenant import Tenant
from app.models.booking import BookingRequest
from app.repositories.tenant_repository import TenantRepository


class DashboardService:
    def __init__(self, db: Session):
        self.db = db
        self.tenants = TenantRepository(db)

    def admin_summary(self) -> dict:
        total_rooms = self.db.query(func.count(Room.id)).filter(Room.is_deleted.is_(False)).scalar() or 0
        occupied_rooms = (
            self.db.query(func.count(Room.id))
            .filter(Room.is_deleted.is_(False), Room.status == "occupied")
            .scalar()
            or 0
        )
        available_rooms = (
            self.db.query(func.count(Room.id))
            .filter(Room.is_deleted.is_(False), Room.status == "available")
            .scalar()
            or 0
        )
        total_tenants = self.db.query(func.count(Tenant.id)).scalar() or 0
        pending_payments = self.db.query(func.count(Payment.id)).filter(Payment.status == "pending_verification").scalar() or 0
        unpaid_payments = self.db.query(func.count(Payment.id)).filter(Payment.status == "unpaid").scalar() or 0
        open_complaints = self.db.query(func.count(Complaint.id)).filter(Complaint.status.in_(["submitted", "reviewed", "in_progress"])).scalar() or 0
        pending_bookings = self.db.query(func.count(BookingRequest.id)).filter(BookingRequest.status == "submitted").scalar() or 0
        return {
            "total_rooms": total_rooms,
            "occupied_rooms": occupied_rooms,
            "available_rooms": available_rooms,
            "total_tenants": total_tenants,
            "pending_payments": pending_payments,
            "unpaid_payments": unpaid_payments,
            "open_complaints": open_complaints,
            "pending_bookings": pending_bookings,
        }

    def tenant_summary(self, *, user_id: int) -> dict:
        tenant = self.tenants.get_by_user_id(user_id)
        if not tenant:
            return {"assigned_room_id": None, "current_bill_id": None, "current_bill_status": None, "latest_complaint_id": None, "latest_complaint_status": None}
        latest_payment = (
            self.db.query(Payment)
            .filter(Payment.tenant_id == tenant.id)
            .order_by(Payment.id.desc())
            .first()
        )
        latest_complaint = (
            self.db.query(Complaint)
            .filter(Complaint.tenant_id == tenant.id)
            .order_by(Complaint.id.desc())
            .first()
        )
        return {
            "assigned_room_id": tenant.room_id,
            "current_bill_id": latest_payment.id if latest_payment else None,
            "current_bill_status": latest_payment.status if latest_payment else None,
            "latest_complaint_id": latest_complaint.id if latest_complaint else None,
            "latest_complaint_status": latest_complaint.status if latest_complaint else None,
        }
