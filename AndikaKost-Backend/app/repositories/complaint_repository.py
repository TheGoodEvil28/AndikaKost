from sqlalchemy.orm import Session

from app.models.complaint import Complaint


class ComplaintRepository:
    def __init__(self, db: Session):
        self.db = db

    def list_all(self) -> list[Complaint]:
        return self.db.query(Complaint).order_by(Complaint.id.desc()).all()

    def list_by_tenant(self, tenant_id: int) -> list[Complaint]:
        return self.db.query(Complaint).filter(Complaint.tenant_id == tenant_id).order_by(Complaint.id.desc()).all()

    def get(self, complaint_id: int) -> Complaint | None:
        return self.db.query(Complaint).filter(Complaint.id == complaint_id).first()

    def create(self, complaint: Complaint) -> Complaint:
        self.db.add(complaint)
        self.db.commit()
        self.db.refresh(complaint)
        return complaint

    def save(self, complaint: Complaint) -> Complaint:
        self.db.add(complaint)
        self.db.commit()
        self.db.refresh(complaint)
        return complaint
