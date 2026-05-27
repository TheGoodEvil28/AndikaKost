import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import RoomForm from "../../components/forms/RoomForm";
import { useRoom, useRoomMutations } from "../../hooks/useRooms";
import { formatIdr } from "../../utils/format";

export default function RoomDetailPage() {
  const params = useParams();
  const id = useMemo(() => Number(params.id), [params.id]);
  const room = useRoom(id);
  const mut = useRoomMutations();
  const [open, setOpen] = useState(false);

  return (
    <div className="grid gap-4">
      <Card title="Room Detail">
        <div className="flex items-center justify-between">
          <Link className="text-blue-700 hover:underline" to="/admin/rooms">
            Back to rooms
          </Link>
          <Button variant="secondary" onClick={() => setOpen(true)} disabled={!room.data}>
            Edit
          </Button>
        </div>
      </Card>

      {room.isLoading ? (
        <div>Loading…</div>
      ) : room.error || !room.data ? (
        <div className="text-rose-700">Room not found.</div>
      ) : (
        <Card title={room.data.room_number}>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <div className="text-sm text-slate-600">Type</div>
              <div className="font-semibold">{room.data.room_type ?? "-"}</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">Floor</div>
              <div className="font-semibold">{room.data.floor ?? "-"}</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">Price</div>
              <div className="font-semibold">{formatIdr(room.data.price_idr)}</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">Status</div>
              <div className="font-semibold">{room.data.status}</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-sm text-slate-600">Facilities</div>
              <div className="font-semibold">{room.data.facilities ?? "-"}</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-sm text-slate-600">Description</div>
              <div className="font-semibold">{room.data.description ?? "-"}</div>
            </div>
          </div>
        </Card>
      )}

      <Modal title="Edit room" open={open} onClose={() => setOpen(false)}>
        <RoomForm
          initial={room.data ?? undefined}
          submitting={mut.update.isPending}
          onSubmit={(values) => {
            mut.update.mutate({ id, payload: values }, { onSuccess: () => setOpen(false) });
          }}
        />
      </Modal>
    </div>
  );
}

