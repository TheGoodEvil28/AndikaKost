from sqlalchemy.orm import Session

from app.models.payment import Payment


class PaymentRepository:
    def __init__(self, db: Session):
        self.db = db

    def list_all(self) -> list[Payment]:
        return self.db.query(Payment).order_by(Payment.id.desc()).all()

    def list_by_tenant(self, tenant_id: int) -> list[Payment]:
        return self.db.query(Payment).filter(Payment.tenant_id == tenant_id).order_by(Payment.id.desc()).all()

    def get(self, payment_id: int) -> Payment | None:
        return self.db.query(Payment).filter(Payment.id == payment_id).first()

    def create(self, payment: Payment) -> Payment:
        self.db.add(payment)
        self.db.commit()
        self.db.refresh(payment)
        return payment

    def save(self, payment: Payment) -> Payment:
        self.db.add(payment)
        self.db.commit()
        self.db.refresh(payment)
        return payment
