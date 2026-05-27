from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_admin
from app.schemas.room import RoomCreate, RoomUpdate, RoomOut
from app.services.room_service import RoomService


router = APIRouter()


@router.get("")
def list_rooms(db: Session = Depends(get_db), _admin=Depends(require_admin)):
    rooms = RoomService(db).list_rooms()
    return {"data": [RoomOut.model_validate(r) for r in rooms], "message": "Success"}


@router.get("/{room_id}")
def room_detail(room_id: int, db: Session = Depends(get_db), _admin=Depends(require_admin)):
    room = RoomService(db).get_room(room_id)
    return {"data": RoomOut.model_validate(room), "message": "Success"}


@router.post("")
def create_room(payload: RoomCreate, db: Session = Depends(get_db), _admin=Depends(require_admin)):
    room = RoomService(db).create_room(**payload.model_dump())
    return {"data": RoomOut.model_validate(room), "message": "Success"}


@router.put("/{room_id}")
def update_room(room_id: int, payload: RoomUpdate, db: Session = Depends(get_db), _admin=Depends(require_admin)):
    room = RoomService(db).update_room(room_id, payload.model_dump(exclude_unset=True))
    return {"data": RoomOut.model_validate(room), "message": "Success"}


@router.patch("/{room_id}/status")
def set_room_status(room_id: int, payload: dict, db: Session = Depends(get_db), _admin=Depends(require_admin)):
    status = payload.get("status")
    room = RoomService(db).set_status(room_id, status=status)
    return {"data": RoomOut.model_validate(room), "message": "Success"}


@router.delete("/{room_id}")
def delete_room(room_id: int, db: Session = Depends(get_db), _admin=Depends(require_admin)):
    RoomService(db).soft_delete(room_id)
    return {"data": {"id": room_id}, "message": "Success"}
