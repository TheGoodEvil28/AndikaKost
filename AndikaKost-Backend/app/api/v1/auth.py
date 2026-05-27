from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_current_user
from app.schemas.auth import LoginRequest, TokenResponse, MeResponse
from app.services.auth_service import AuthService


router = APIRouter()


@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    token = AuthService(db).login(email=payload.email, password=payload.password)
    return {"data": TokenResponse(access_token=token), "message": "Success"}


@router.get("/me")
def me(user=Depends(get_current_user)):
    return {
        "data": MeResponse(
            id=user.id,
            full_name=user.full_name,
            email=user.email,
            phone=user.phone,
            role=user.role,
        ),
        "message": "Success",
    }
