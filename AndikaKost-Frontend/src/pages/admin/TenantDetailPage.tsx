import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import TenantForm from "../../components/forms/TenantForm";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import PageHeader from "../../components/ui/PageHeader";
import Select from "../../components/ui/Select";
import StatePanel from "../../components/ui/StatePanel";
import { useRooms } from "../../hooks/useRooms";
import { useTenant, useTenantMutations } from "../../hooks/useTenants";

export default function TenantDetailPage() {
  const params = useParams();
  const id = useMemo(() => Number(params.id), [params.id]);
  const tenant = useTenant(id);
  const rooms = useRooms();
  const mut = useTenantMutations();
  const [open, setOpen] = useState(false);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Residents"
        title={tenant.data?.full_name ?? "Tenant detail"}
        description="Review resident information and keep the tenant's room assignment current."
        backTo="/admin/tenants"
        backLabel="Back to tenants"
        actions={
          <Button variant="secondary" onClick={() => setOpen(true)} disabled={!tenant.data}>
            Edit tenant
          </Button>
        }
      />

      {tenant.isLoading ? (
        <StatePanel icon="tenants" title="Loading tenant..." />
      ) : tenant.error || !tenant.data ? (
        <StatePanel
          icon="tenants"
          tone="danger"
          title="Tenant not found"
          description="The tenant may have been removed or the link may be incorrect."
        />
      ) : (
        <>
          <Card title="Tenant profile" action={<Badge>{tenant.data.status}</Badge>}>
            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-label">Email</div>
                <div className="detail-value">{tenant.data.email}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Phone</div>
                <div className="detail-value">{tenant.data.phone ?? "-"}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Room</div>
                <div className="detail-value">{tenant.data.room_id ? `#${tenant.data.room_id}` : "Unassigned"}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Move-in date</div>
                <div className="detail-value">{tenant.data.move_in_date}</div>
              </div>
              <div className="detail-item sm:col-span-2">
                <div className="detail-label">Notes</div>
                <div className="detail-value whitespace-pre-wrap font-medium">{tenant.data.notes ?? "-"}</div>
              </div>
            </div>
          </Card>

          <Card
            title="Room assignment"
            description="Choose a room or select Unassigned. Changes are saved immediately."
          >
            {rooms.isLoading ? (
              <StatePanel compact icon="rooms" title="Loading available rooms..." />
            ) : rooms.error ? (
              <StatePanel
                compact
                icon="rooms"
                tone="danger"
                title="Available rooms could not be loaded"
                description="Please try again in a moment."
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] md:items-end">
                <Select
                  label="Room"
                  value={tenant.data.room_id ?? ""}
                  disabled={mut.assignRoom.isPending}
                  onChange={(event) => {
                    const value = event.target.value;
                    const roomId = value === "" ? null : Number(value);
                    mut.assignRoom.mutate({ tenantId: tenant.data!.id, roomId });
                  }}
                >
                  <option value="">Unassigned</option>
                  {rooms.data?.map((room) => (
                    <option
                      key={room.id}
                      value={room.id}
                      disabled={room.status === "occupied" && room.id !== tenant.data?.room_id}
                    >
                      {room.room_number} ({room.status})
                    </option>
                  ))}
                </Select>
                <div className="theme-subtle rounded-xl border p-4 text-sm text-muted">
                  Assigning a room automatically updates that room's status to occupied.
                </div>
              </div>
            )}
          </Card>
        </>
      )}

      <Modal title="Edit tenant" open={open} onClose={() => setOpen(false)}>
        <TenantForm
          mode="update"
          initial={tenant.data ?? undefined}
          submitting={mut.update.isPending}
          onSubmit={(values) => {
            mut.update.mutate({ id, payload: values }, { onSuccess: () => setOpen(false) });
          }}
        />
      </Modal>
    </div>
  );
}
