from datetime import datetime

from pydantic import BaseModel


class BookingCreate(BaseModel):
    room_id: int
    full_name: str
    email: str
    phone: str | None = None
    message: str | None = None


class BookingStatusUpdate(BaseModel):
    status: str


class BookingOut(BaseModel):
    id: int
    room_id: int
    full_name: str
    email: str
    phone: str | None
    message: str | None
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

