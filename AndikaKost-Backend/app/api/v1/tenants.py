from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_admin
from app.models.user import User
from app.schemas.tenant import TenantCreate, TenantUpdate, AssignRoomRequest, TenantOut
from app.services.tenant_service import TenantService


router = APIRouter()

def _tenant_out(db: Session, tenant) -> TenantOut:
    user = db.get(User, tenant.user_id)
    return TenantOut(
        id=tenant.id,
        user_id=tenant.user_id,
        room_id=tenant.room_id,
        email=user.email if user else "unknown@example.invalid",
        full_name=user.full_name if user else "Unknown",
        phone=user.phone if user else None,
        identity_number=tenant.identity_number,
        address=tenant.address,
        emergency_contact_name=tenant.emergency_contact_name,
        emergency_contact_phone=tenant.emergency_contact_phone,
        move_in_date=tenant.move_in_date,
        move_out_date=tenant.move_out_date,
        status=tenant.status,
        notes=tenant.notes,
        created_at=tenant.created_at,
        updated_at=tenant.updated_at,
    )


@router.get("")
def list_tenants(db: Session = Depends(get_db), _admin=Depends(require_admin)):
    tenants = TenantService(db).list_tenants()
    return {"data": [_tenant_out(db, t) for t in tenants], "message": "Success"}


@router.get("/{tenant_id}")
def tenant_detail(tenant_id: int, db: Session = Depends(get_db), _admin=Depends(require_admin)):
    tenant = TenantService(db).get_tenant(tenant_id)
    return {"data": _tenant_out(db, tenant), "message": "Success"}


@router.post("")
def create_tenant(payload: TenantCreate, db: Session = Depends(get_db), _admin=Depends(require_admin)):
    tenant = TenantService(db).create_tenant_with_user(**payload.model_dump())
    return {"data": _tenant_out(db, tenant), "message": "Success"}


@router.put("/{tenant_id}")
def update_tenant(tenant_id: int, payload: TenantUpdate, db: Session = Depends(get_db), _admin=Depends(require_admin)):
    tenant = TenantService(db).update_tenant(tenant_id, payload.model_dump(exclude_unset=True))
    return {"data": _tenant_out(db, tenant), "message": "Success"}


@router.post("/{tenant_id}/assign-room")
def assign_room(tenant_id: int, payload: AssignRoomRequest, db: Session = Depends(get_db), _admin=Depends(require_admin)):
    tenant = TenantService(db).assign_room(tenant_id, payload.room_id)
    return {"data": _tenant_out(db, tenant), "message": "Success"}
