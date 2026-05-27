from datetime import datetime

from pydantic import BaseModel


class RoomCreate(BaseModel):
    room_number: str
    room_type: str | None = None
    floor: str | None = None
    price_idr: int
    facilities: str | None = None
    status: str = "available"
    description: str | None = None


class RoomUpdate(BaseModel):
    room_number: str | None = None
    room_type: str | None = None
    floor: str | None = None
    price_idr: int | None = None
    facilities: str | None = None
    status: str | None = None
    description: str | None = None


class RoomOut(BaseModel):
    id: int
    room_number: str
    room_type: str | None
    floor: str | None
    price_idr: int
    facilities: str | None
    status: str
    description: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
