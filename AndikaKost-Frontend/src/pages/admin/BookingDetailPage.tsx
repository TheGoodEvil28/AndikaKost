import { useMemo } from "react";
import { useParams } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";
import Select from "../../components/ui/Select";
import StatePanel from "../../components/ui/StatePanel";
import { useBooking, useBookingMutations } from "../../hooks/useBookings";

export default function BookingDetailPage() {
  const params = useParams();
  const id = useMemo(() => Number(params.id), [params.id]);
  const booking = useBooking(id);
  const mut = useBookingMutations();

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Leasing"
        title={Number.isFinite(id) ? `Booking request #${id}` : "Booking request"}
        description="Review the applicant and move this request through the approval workflow."
        backTo="/admin/bookings"
        backLabel="Back to booking requests"
      />

      {booking.isLoading ? (
        <StatePanel icon="bookings" title="Loading booking request..." />
      ) : booking.error || !booking.data ? (
        <StatePanel
          icon="bookings"
          tone="danger"
          title="Booking request not found"
          description="The request may have been removed or the link may be incorrect."
        />
      ) : (
        <>
          <Card title="Request details" action={<Badge>{booking.data.status}</Badge>}>
            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-label">Room</div>
                <div className="detail-value">#{booking.data.room_id}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Applicant</div>
                <div className="detail-value">{booking.data.full_name}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Email</div>
                <div className="detail-value">{booking.data.email}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Phone</div>
                <div className="detail-value">{booking.data.phone ?? "-"}</div>
              </div>
              {booking.data.message ? (
                <div className="detail-item sm:col-span-2">
                  <div className="detail-label">Message</div>
                  <div className="detail-value whitespace-pre-wrap font-medium">{booking.data.message}</div>
                </div>
              ) : null}
            </div>
          </Card>

          <Card
            title="Request workflow"
            description="Changing the status saves immediately and updates the booking queue."
          >
            <div className="grid gap-4 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:items-end">
              <Select
                label="Update status"
                value={booking.data.status}
                disabled={mut.updateStatus.isPending}
                onChange={(event) => mut.updateStatus.mutate({ id, status: event.target.value })}
              >
                <option value="submitted">submitted</option>
                <option value="contacted">contacted</option>
                <option value="approved">approved</option>
                <option value="rejected">rejected</option>
                <option value="converted">converted</option>
              </Select>
              <div className="theme-subtle rounded-xl border p-4 text-sm text-muted">
                Suggested flow: <strong className="text-muted-strong">submitted &rarr; contacted &rarr; approved</strong>.
                Approving automatically activates the tenant profile and marks the room as occupied. Use converted only
                when that explicit final label is needed.
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
