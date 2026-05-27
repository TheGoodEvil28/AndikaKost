import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { Table, Td, Th } from "../../components/ui/Table";
import { useBookings } from "../../hooks/useBookings";

export default function BookingsPage() {
  const bookings = useBookings();

  return (
    <div className="grid gap-4">
      <Card title="Booking Requests">
        <div className="text-slate-600">Requests submitted from the public rooms page.</div>
      </Card>

      <Card title="List">
        {bookings.isLoading ? (
          <div>Loading…</div>
        ) : bookings.error ? (
          <div className="text-rose-700">Failed to load booking requests.</div>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Room</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {bookings.data?.map((b) => (
                <tr key={b.id}>
                  <Td>
                    <Link className="font-semibold text-blue-700 hover:underline" to={`/admin/bookings/${b.id}`}>
                      {b.id}
                    </Link>
                  </Td>
                  <Td>{b.room_id}</Td>
                  <Td>{b.full_name}</Td>
                  <Td>{b.email}</Td>
                  <Td>
                    <Badge>{b.status}</Badge>
                  </Td>
                </tr>
              ))}
              {bookings.data?.length === 0 ? (
                <tr>
                  <Td>
                    <span className="text-slate-600">No booking requests yet.</span>
                  </Td>
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
    </div>
  );
}

