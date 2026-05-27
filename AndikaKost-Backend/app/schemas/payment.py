from datetime import date, datetime

from pydantic import BaseModel


class PaymentCreate(BaseModel):
    tenant_id: int
    billing_month: str
    amount_idr: int
    due_date: date


class PaymentUpdate(BaseModel):
    billing_month: str | None = None
    amount_idr: int | None = None
    due_date: date | None = None
    status: str | None = None
    admin_note: str | None = None


class PaymentOut(BaseModel):
    id: int
    tenant_id: int
    room_id: int
    billing_month: str
    amount_idr: int
    due_date: date
    payment_date: date | None
    payment_method: str | None
    proof_file_url: str | None
    status: str
    admin_note: str | None
    verified_by: int | None
    verified_at: datetime | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
