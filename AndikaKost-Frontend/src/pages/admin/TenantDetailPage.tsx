import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import TenantForm from "../../components/forms/TenantForm";
import Select from "../../components/ui/Select";
import { useTenant, useTenantMutations } from "../../hooks/useTenants";
import { useRooms } from "../../hooks/useRooms";

export default function TenantDetailPage() {
  const params = useParams();
  const id = useMemo(() => Number(params.id), [params.id]);
  const tenant = useTenant(id);
  const rooms = useRooms();
  const mut = useTenantMutations();
  const [open, setOpen] = useState(false);

  return (
    <div className="grid gap-4">
      <Card title="Tenant Detail">
        <div className="flex items-center justify-between">
          <Link className="text-blue-700 hover:underline" to="/admin/tenants">
            Back to tenants
          </Link>
          <Button variant="secondary" onClick={() => setOpen(true)} disabled={!tenant.data}>
            Edit
          </Button>
        </div>
      </Card>

      {tenant.isLoading ? (
        <div>Loading…</div>
      ) : tenant.error || !tenant.data ? (
        <div className="text-rose-700">Tenant not found.</div>
      ) : (
        <>
          <Card title={tenant.data.full_name}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <div className="text-sm text-slate-600">Email</div>
                <div className="font-semibold">{tenant.data.email}</div>
              </div>
              <div>
                <div className="text-sm text-slate-600">Phone</div>
                <div className="font-semibold">{tenant.data.phone ?? "-"}</div>
              </div>
              <div>
                <div className="text-sm text-slate-600">Room ID</div>
                <div className="font-semibold">{tenant.data.room_id ?? "-"}</div>
              </div>
              <div>
                <div className="text-sm text-slate-600">Move-in date</div>
                <div className="font-semibold">{tenant.data.move_in_date}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-sm text-slate-600">Notes</div>
                <div className="font-semibold">{tenant.data.notes ?? "-"}</div>
              </div>
            </div>
          </Card>

          <Card title="Assign / Unassign Room">
            <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
              <Select
                label="Room"
                value={tenant.data.room_id ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  const roomId = value === "" ? null : Number(value);
                  mut.assignRoom.mutate({ tenantId: tenant.data!.id, roomId });
                }}
              >
                <option value="">Unassigned</option>
                {rooms.data?.map((r) => (
                  <option key={r.id} value={r.id} disabled={r.status === "occupied" && r.id !== tenant.data?.room_id}>
                    {r.room_number} ({r.status})
                  </option>
                ))}
              </Select>
              <div className="text-sm text-slate-600">
                Tip: assigning a room will set room status to <b>occupied</b>.
              </div>
            </div>
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

