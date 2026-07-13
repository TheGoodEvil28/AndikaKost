import { Link } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import Icon from "../../components/ui/Icon";
import PageHeader from "../../components/ui/PageHeader";
import StatePanel from "../../components/ui/StatePanel";
import { Table, Td, Th } from "../../components/ui/Table";
import { buttonClassName } from "../../components/ui/buttonStyles";
import { useBookings } from "../../hooks/useBookings";

export default function BookingsPage() {
  const bookings = useBookings();

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Leasing"
        title="Booking requests"
        description="Review requests submitted from the public room listings and keep each applicant moving."
      />

      <Card title="All requests" description="Open a request to review contact details and update its status.">
        {bookings.isLoading ? (
          <StatePanel compact icon="bookings" title="Loading booking requests..." />
        ) : bookings.error ? (
          <StatePanel
            compact
            icon="bookings"
            tone="danger"
            title="Booking requests could not be loaded"
            description="Please try again in a moment."
          />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Request</Th>
                <Th>Room</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {bookings.data?.map((booking) => (
                <tr key={booking.id}>
                  <Td label="Request">
                    <Link
                      className={buttonClassName({ variant: "ghost", className: "text-link -my-2 justify-start" })}
                      to={`/admin/bookings/${booking.id}`}
                      aria-label={`Open booking request ${booking.id}`}
                    >
                      #{booking.id}
                      <Icon name="arrow-right" className="h-4 w-4" />
                    </Link>
                  </Td>
                  <Td label="Room">#{booking.room_id}</Td>
                  <Td label="Name" className="font-semibold">
                    {booking.full_name}
                  </Td>
                  <Td label="Email" className="break-all">
                    {booking.email}
                  </Td>
                  <Td label="Status">
                    <Badge>{booking.status}</Badge>
                  </Td>
                </tr>
              ))}
              {bookings.data?.length === 0 ? (
                <tr>
                  <Td colSpan={5} className="p-3">
                    <StatePanel
                      compact
                      icon="bookings"
                      title="No booking requests yet"
                      description="New requests from the public room listings will appear here."
                    />
                  </Td>
                </tr>
              ) : null}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
