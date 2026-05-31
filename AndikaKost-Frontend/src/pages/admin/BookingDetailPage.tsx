import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Select from "../../components/ui/Select";
import { useBooking, useBookingMutations } from "../../hooks/useBookings";

export default function BookingDetailPage() {
  const params = useParams();
  const id = useMemo(() => Number(params.id), [params.id]);
  const booking = useBooking(id);
  const mut = useBookingMutations();

  return (
    <div className="grid gap-4">
      <Card title="Booking Request">
        <div className="flex items-center justify-between">
          <Link className="text-blue-700 hover:underline" to="/admin/bookings">
            Back to bookings
          </Link>
        </div>
      </Card>

      {booking.isLoading ? (
        <div>Loading…</div>
      ) : booking.error || !booking.data ? (
        <div className="text-rose-700">Booking request not found.</div>
      ) : (
        <Card title={`Request #${booking.data.id}`}>
          <div className="grid gap-2 text-ui-base">
            <div>
              <span className="text-slate-600">Room ID: </span>
              <b>{booking.data.room_id}</b>
            </div>
            <div>
              <span className="text-slate-600">Name: </span>
              <b>{booking.data.full_name}</b>
            </div>
            <div>
              <span className="text-slate-600">Email: </span>
              <b>{booking.data.email}</b>
            </div>
            <div>
              <span className="text-slate-600">Phone: </span>
              <b>{booking.data.phone ?? "-"}</b>
            </div>
            <div>
              <span className="text-slate-600">Status: </span>
              <Badge>{booking.data.status}</Badge>
            </div>
            {booking.data.message ? (
              <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-sm text-slate-600">Message</div>
                <div className="whitespace-pre-wrap">{booking.data.message}</div>
              </div>
            ) : null}
          </div>

          <div className="mt-6">
            <Select
              label="Update status"
              value={booking.data.status}
              onChange={(e) => mut.updateStatus.mutate({ id, status: e.target.value })}
            >
              <option value="submitted">submitted</option>
              <option value="contacted">contacted</option>
              <option value="approved">approved</option>
              <option value="rejected">rejected</option>
              <option value="converted">converted</option>
            </Select>
            <div className="mt-2 text-sm text-slate-600">
              Suggested flow: <b>submitted → contacted → approved</b>. Approving now auto-creates/activates the tenant profile and sets the room to <b>occupied</b>. Use <b>converted</b> only if you want that explicit final status label.
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

