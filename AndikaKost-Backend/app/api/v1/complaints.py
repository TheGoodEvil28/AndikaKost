from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_admin, require_tenant, get_current_user
from app.schemas.complaint import ComplaintStatusUpdate, ComplaintResponseCreate, ComplaintOut
from app.services.complaint_service import ComplaintService


router = APIRouter()


@router.get("")
def list_complaints(db: Session = Depends(get_db), _admin=Depends(require_admin)):
    data = ComplaintService(db).list_all()
    return {"data": [ComplaintOut.model_validate(c) for c in data], "message": "Success"}


@router.get("/{complaint_id}")
def complaint_detail(complaint_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    complaint = ComplaintService(db).get_for_user(complaint_id, user)
    return {"data": ComplaintOut.model_validate(complaint), "message": "Success"}


@router.post("")
def submit_complaint(
    category: str = Form(...),
    description: str = Form(...),
    priority: str = Form("normal"),
    photo: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    tenant_user=Depends(require_tenant),
):
    complaint = ComplaintService(db).create(user=tenant_user, category=category, description=description, priority=priority, photo=photo)
    return {"data": ComplaintOut.model_validate(complaint), "message": "Success"}


@router.patch("/{complaint_id}/status")
def update_status(
    complaint_id: int,
    payload: ComplaintStatusUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    complaint = ComplaintService(db).update_status(complaint_id, payload.status)
    return {"data": ComplaintOut.model_validate(complaint), "message": "Success"}


@router.post("/{complaint_id}/response")
def add_response(
    complaint_id: int,
    payload: ComplaintResponseCreate,
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    complaint = ComplaintService(db).add_response(complaint_id, payload.admin_response)
    return {"data": ComplaintOut.model_validate(complaint), "message": "Success"}


"""
Tenant list routes live under /api/v1/tenant in tenant.py (per dev plan).
"""
