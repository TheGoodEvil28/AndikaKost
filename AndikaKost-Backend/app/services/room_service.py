from sqlalchemy.orm import Session

from app.core.exceptions import validation_error, not_found
from app.models.room import Room
from app.repositories.room_repository import RoomRepository


class RoomService:
    def __init__(self, db: Session):
        self.repo = RoomRepository(db)

    def list_rooms(self) -> list[Room]:
        return self.repo.list()

    def get_room(self, room_id: int) -> Room:
        room = self.repo.get(room_id)
        if not room:
            raise not_found("Room")
        return room

    def create_room(self, *, room_number: str, room_type: str | None, floor: str | None, price_idr: int,
                    facilities: str | None, status: str, description: str | None) -> Room:
        if price_idr <= 0:
            raise validation_error("Room price must be greater than 0")
        if self.repo.get_by_room_number(room_number):
            raise validation_error("Room number must be unique")
        room = Room(
            room_number=room_number,
            room_type=room_type,
            floor=floor,
            price_idr=price_idr,
            facilities=facilities,
            status=status,
            description=description,
            is_deleted=False,
        )
        return self.repo.create(room)

    def update_room(self, room_id: int, patch: dict) -> Room:
        room = self.get_room(room_id)
        if "room_number" in patch and patch["room_number"] and patch["room_number"] != room.room_number:
            if self.repo.get_by_room_number(patch["room_number"]):
                raise validation_error("Room number must be unique")
        if "price_idr" in patch and patch["price_idr"] is not None and patch["price_idr"] <= 0:
            raise validation_error("Room price must be greater than 0")
        for k, v in patch.items():
            if v is not None:
                setattr(room, k, v)
        return self.repo.save(room)

    def set_status(self, room_id: int, status: str) -> Room:
        room = self.get_room(room_id)
        room.status = status
        return self.repo.save(room)

    def soft_delete(self, room_id: int) -> None:
        room = self.get_room(room_id)
        room.is_deleted = True
        self.repo.save(room)
