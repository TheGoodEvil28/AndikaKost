import { useState } from "react";
import { Link } from "react-router-dom";
import RoomForm from "../../components/forms/RoomForm";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Icon from "../../components/ui/Icon";
import Modal from "../../components/ui/Modal";
import PageHeader from "../../components/ui/PageHeader";
import StatePanel from "../../components/ui/StatePanel";
import { Table, Td, Th } from "../../components/ui/Table";
import { buttonClassName } from "../../components/ui/buttonStyles";
import { useRoomMutations, useRooms } from "../../hooks/useRooms";
import { formatIdr } from "../../utils/format";

export default function RoomsPage() {
  const rooms = useRooms();
  const mut = useRoomMutations();
  const [open, setOpen] = useState(false);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Inventory"
        title="Rooms"
        description="Manage room availability, pricing, and the information tenants see."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Icon name="plus" className="h-4 w-4" />
            Add room
          </Button>
        }
      />

      <Card title="Room inventory" description="Open a room to review its profile or edit the listing.">
        {rooms.isLoading ? (
          <StatePanel compact icon="rooms" title="Loading rooms..." />
        ) : rooms.error ? (
          <StatePanel
            compact
            icon="rooms"
            tone="danger"
            title="Rooms could not be loaded"
            description="Please try again in a moment."
          />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Room</Th>
                <Th>Type</Th>
                <Th>Floor</Th>
                <Th>Price</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {rooms.data?.map((room) => (
                <tr key={room.id}>
                  <Td label="Room">
                    <Link
                      className={buttonClassName({ variant: "ghost", className: "text-link -my-2 justify-start" })}
                      to={`/admin/rooms/${room.id}`}
                      aria-label={`Open room ${room.room_number}`}
                    >
                      {room.room_number}
                      <Icon name="arrow-right" className="h-4 w-4" />
                    </Link>
                  </Td>
                  <Td label="Type">{room.room_type ?? "-"}</Td>
                  <Td label="Floor">{room.floor ?? "-"}</Td>
                  <Td label="Price" className="font-semibold">
                    {formatIdr(room.price_idr)}
                  </Td>
                  <Td label="Status">
                    <Badge>{room.status}</Badge>
                  </Td>
                  <Td label="Actions">
                    <Button
                      variant="danger"
                      onClick={() => {
                        if (!confirm(`Delete room ${room.room_number}?`)) return;
                        mut.remove.mutate(room.id);
                      }}
                    >
                      Delete
                    </Button>
                  </Td>
                </tr>
              ))}
              {rooms.data?.length === 0 ? (
                <tr>
                  <Td colSpan={6} className="p-3">
                    <StatePanel
                      compact
                      icon="rooms"
                      title="No rooms yet"
                      description="Add the first room to begin building the property inventory."
                      action={
                        <Button onClick={() => setOpen(true)}>
                          <Icon name="plus" className="h-4 w-4" />
                          Add room
                        </Button>
                      }
                    />
                  </Td>
                </tr>
              ) : null}
            </tbody>
          </Table>
        )}
      </Card>

      <Modal title="Add room" open={open} onClose={() => setOpen(false)}>
        <RoomForm
          submitting={mut.create.isPending}
          onSubmit={(values) => {
            mut.create.mutate(values, { onSuccess: () => setOpen(false) });
          }}
        />
      </Modal>
    </div>
  );
}
