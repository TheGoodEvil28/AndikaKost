from fastapi import APIRouter, Depends, UploadFile, File, Request
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_admin, get_current_user, require_tenant
from app.core.rate_limit import enforce_upload_rate_limit
from app.schemas.payment import PaymentCreate, PaymentUpdate, PaymentOut
from app.services.payment_service import PaymentService


router = APIRouter()


@router.get("")
def list_payments(db: Session = Depends(get_db), _admin=Depends(require_admin)):
    data = PaymentService(db).list_all()
    return {"data": [PaymentOut.model_validate(p) for p in data], "message": "Success"}


@router.get("/{payment_id}")
def payment_detail(payment_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    payment = PaymentService(db).get_payment_for_user(payment_id, user)
    return {"data": PaymentOut.model_validate(payment), "message": "Success"}


@router.post("")
def create_bill(payload: PaymentCreate, db: Session = Depends(get_db), _admin=Depends(require_admin)):
    payment = PaymentService(db).create_bill(**payload.model_dump())
    return {"data": PaymentOut.model_validate(payment), "message": "Success"}


@router.put("/{payment_id}")
def update_bill(payment_id: int, payload: PaymentUpdate, db: Session = Depends(get_db), _admin=Depends(require_admin)):
    service = PaymentService(db)
    payment = service.get_payment(payment_id)
    patch = payload.model_dump(exclude_unset=True)
    for k, v in patch.items():
        setattr(payment, k, v)
    payment = service.repo.save(payment)
    return {"data": PaymentOut.model_validate(payment), "message": "Success"}


@router.post("/{payment_id}/upload-proof")
def upload_proof(
    payment_id: int,
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    tenant_user=Depends(require_tenant),
):
    enforce_upload_rate_limit(request)
    payment = PaymentService(db).upload_proof(payment_id=payment_id, user=tenant_user, file=file)
    return {"data": PaymentOut.model_validate(payment), "message": "Success"}


@router.patch("/{payment_id}/approve")
def approve(payment_id: int, db: Session = Depends(get_db), admin_user=Depends(require_admin)):
    payment = PaymentService(db).approve(payment_id=payment_id, admin_user=admin_user)
    return {"data": PaymentOut.model_validate(payment), "message": "Success"}


@router.patch("/{payment_id}/reject")
def reject(payment_id: int, payload: dict, db: Session = Depends(get_db), admin_user=Depends(require_admin)):
    note = payload.get("admin_note")
    payment = PaymentService(db).reject(payment_id=payment_id, admin_user=admin_user, admin_note=note)
    return {"data": PaymentOut.model_validate(payment), "message": "Success"}


"""
Tenant list routes live under /api/v1/tenant in tenant.py (per dev plan).
"""
