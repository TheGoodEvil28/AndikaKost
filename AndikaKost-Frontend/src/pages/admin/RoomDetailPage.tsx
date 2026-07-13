import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import RoomForm from "../../components/forms/RoomForm";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import PageHeader from "../../components/ui/PageHeader";
import StatePanel from "../../components/ui/StatePanel";
import { useRoom, useRoomMutations } from "../../hooks/useRooms";
import { formatIdr } from "../../utils/format";

export default function RoomDetailPage() {
  const params = useParams();
  const id = useMemo(() => Number(params.id), [params.id]);
  const room = useRoom(id);
  const mut = useRoomMutations();
  const [open, setOpen] = useState(false);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Inventory"
        title={room.data?.room_number ?? "Room detail"}
        description="Review availability, pricing, facilities, and public listing information."
        backTo="/admin/rooms"
        backLabel="Back to rooms"
        actions={
          <Button variant="secondary" onClick={() => setOpen(true)} disabled={!room.data}>
            Edit room
          </Button>
        }
      />

      {room.isLoading ? (
        <StatePanel icon="rooms" title="Loading room..." />
      ) : room.error || !room.data ? (
        <StatePanel
          icon="rooms"
          tone="danger"
          title="Room not found"
          description="The room may have been removed or the link may be incorrect."
        />
      ) : (
        <Card title="Room profile" action={<Badge>{room.data.status}</Badge>}>
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-label">Room number</div>
              <div className="detail-value">{room.data.room_number}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Type</div>
              <div className="detail-value">{room.data.room_type ?? "-"}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Floor</div>
              <div className="detail-value">{room.data.floor ?? "-"}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Monthly price</div>
              <div className="detail-value">{formatIdr(room.data.price_idr)}</div>
            </div>
            <div className="detail-item sm:col-span-2">
              <div className="detail-label">Facilities</div>
              <div className="detail-value font-medium">{room.data.facilities ?? "-"}</div>
            </div>
            <div className="detail-item sm:col-span-2">
              <div className="detail-label">Description</div>
              <div className="detail-value whitespace-pre-wrap font-medium">{room.data.description ?? "-"}</div>
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
