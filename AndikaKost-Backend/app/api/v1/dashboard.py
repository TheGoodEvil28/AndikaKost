from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_admin, require_tenant
from app.services.dashboard_service import DashboardService


router = APIRouter()


@router.get("/admin")
def admin_dashboard(db: Session = Depends(get_db), _admin=Depends(require_admin)):
    data = DashboardService(db).admin_summary()
    return {"data": data, "message": "Success"}


@router.get("/tenant")
def tenant_dashboard(db: Session = Depends(get_db), tenant_user=Depends(require_tenant)):
    data = DashboardService(db).tenant_summary(user_id=tenant_user.id)
    return {"data": data, "message": "Success"}
