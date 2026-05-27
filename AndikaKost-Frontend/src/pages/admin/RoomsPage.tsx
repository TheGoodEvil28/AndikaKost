import { Link } from "react-router-dom";
import { useState } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import RoomForm from "../../components/forms/RoomForm";
import { Table, Td, Th } from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import { useRooms, useRoomMutations } from "../../hooks/useRooms";
import { formatIdr } from "../../utils/format";

function toneForStatus(status: string) {
  if (status === "available") return "ok";
  if (status === "occupied") return "warn";
  if (status === "maintenance") return "bad";
  return "neutral";
}

export default function RoomsPage() {
  const rooms = useRooms();
  const mut = useRoomMutations();
  const [open, setOpen] = useState(false);

  return (
    <div className="grid gap-4">
      <Card title="Rooms">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-slate-600">Manage room list, status, and pricing.</div>
          <Button onClick={() => setOpen(true)}>Add room</Button>
        </div>
      </Card>

      <Card title="Room List">
        {rooms.isLoading ? (
          <div>Loading…</div>
        ) : rooms.error ? (
          <div className="text-rose-700">Failed to load rooms.</div>
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
              {rooms.data?.map((r) => (
                <tr key={r.id}>
                  <Td>
                    <Link className="font-semibold text-blue-700 hover:underline" to={`/admin/rooms/${r.id}`}>
                      {r.room_number}
                    </Link>
                  </Td>
                  <Td>{r.room_type ?? "-"}</Td>
                  <Td>{r.floor ?? "-"}</Td>
                  <Td>{formatIdr(r.price_idr)}</Td>
                  <Td>
                    <Badge tone={toneForStatus(r.status) as any}>{r.status}</Badge>
                  </Td>
                  <Td>
                    <Button
                      variant="danger"
                      onClick={() => {
                        if (!confirm(`Delete room ${r.room_number}?`)) return;
                        mut.remove.mutate(r.id);
                      }}
                    >
                      Delete
                    </Button>
                  </Td>
                </tr>
              ))}
              {rooms.data?.length === 0 ? (
                <tr>
                  <Td>
                    <span className="text-slate-600">No rooms yet.</span>
                  </Td>
                  <Td />
                  <Td />
                  <Td />
                  <Td />
                  <Td />
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

