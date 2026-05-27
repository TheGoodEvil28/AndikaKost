from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_tenant
from app.schemas.complaint import ComplaintOut
from app.schemas.payment import PaymentOut
from app.schemas.room import RoomOut
from app.services.complaint_service import ComplaintService
from app.services.payment_service import PaymentService
from app.repositories.tenant_repository import TenantRepository
from app.repositories.room_repository import RoomRepository


router = APIRouter()


@router.get("/payments")
def tenant_payments(db: Session = Depends(get_db), tenant_user=Depends(require_tenant)):
    data = PaymentService(db).list_for_tenant_user(tenant_user)
    return {"data": [PaymentOut.model_validate(p) for p in data], "message": "Success"}


@router.get("/complaints")
def tenant_complaints(db: Session = Depends(get_db), tenant_user=Depends(require_tenant)):
    data = ComplaintService(db).list_for_tenant_user(tenant_user)
    return {"data": [ComplaintOut.model_validate(c) for c in data], "message": "Success"}


@router.get("/room")
def tenant_room(db: Session = Depends(get_db), tenant_user=Depends(require_tenant)):
    tenant = TenantRepository(db).get_by_user_id(tenant_user.id)
    if not tenant or not tenant.room_id:
        return {"data": None, "message": "Success"}
    room = RoomRepository(db).get(tenant.room_id)
    if not room:
        return {"data": None, "message": "Success"}
    return {"data": RoomOut.model_validate(room), "message": "Success"}
