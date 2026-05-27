from sqlalchemy.orm import Session

from app.models.room import Room


class RoomRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self) -> list[Room]:
        return (
            self.db.query(Room)
            .filter(Room.is_deleted.is_(False))
            .order_by(Room.id.desc())
            .all()
        )

    def get(self, room_id: int) -> Room | None:
        return self.db.query(Room).filter(Room.id == room_id, Room.is_deleted.is_(False)).first()

    def get_by_room_number(self, room_number: str) -> Room | None:
        return self.db.query(Room).filter(Room.room_number == room_number, Room.is_deleted.is_(False)).first()

    def create(self, room: Room) -> Room:
        self.db.add(room)
        self.db.commit()
        self.db.refresh(room)
        return room

    def save(self, room: Room) -> Room:
        self.db.add(room)
        self.db.commit()
        self.db.refresh(room)
        return room
