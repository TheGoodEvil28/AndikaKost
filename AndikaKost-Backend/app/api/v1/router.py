from fastapi import APIRouter

from app.api.v1 import auth, dashboard, rooms, tenants, payments, complaints, health, tenant, public, bookings


api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(public.router, prefix="/public", tags=["public"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(rooms.router, prefix="/rooms", tags=["rooms"])
api_router.include_router(tenants.router, prefix="/tenants", tags=["tenants"])
api_router.include_router(payments.router, prefix="/payments", tags=["payments"])
api_router.include_router(complaints.router, prefix="/complaints", tags=["complaints"])
api_router.include_router(tenant.router, prefix="/tenant", tags=["tenant"])
api_router.include_router(bookings.router, prefix="/bookings", tags=["bookings"])
