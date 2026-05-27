from datetime import date, datetime

from pydantic import BaseModel, EmailStr


class TenantCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str | None = None
    password: str
    identity_number: str | None = None
    address: str | None = None
    emergency_contact_name: str | None = None
    emergency_contact_phone: str | None = None
    move_in_date: date
    notes: str | None = None


class TenantUpdate(BaseModel):
    full_name: str | None = None
    phone: str | None = None
    identity_number: str | None = None
    address: str | None = None
    emergency_contact_name: str | None = None
    emergency_contact_phone: str | None = None
    move_in_date: date | None = None
    move_out_date: date | None = None
    status: str | None = None
    notes: str | None = None


class TenantOut(BaseModel):
    id: int
    user_id: int
    room_id: int | None
    email: EmailStr
    full_name: str
    phone: str | None
    identity_number: str | None
    address: str | None
    emergency_contact_name: str | None
    emergency_contact_phone: str | None
    move_in_date: date
    move_out_date: date | None
    status: str
    notes: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class AssignRoomRequest(BaseModel):
    room_id: int | None
