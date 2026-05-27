from datetime import datetime

from pydantic import BaseModel


class ComplaintCreate(BaseModel):
    category: str
    description: str
    priority: str = "normal"


class ComplaintStatusUpdate(BaseModel):
    status: str


class ComplaintResponseCreate(BaseModel):
    admin_response: str


class ComplaintOut(BaseModel):
    id: int
    tenant_id: int
    room_id: int
    category: str
    description: str
    photo_file_url: str | None
    status: str
    priority: str
    admin_response: str | None
    resolved_at: datetime | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
