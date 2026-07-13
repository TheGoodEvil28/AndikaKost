import { Link } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Icon from "../../components/ui/Icon";
import PageHeader from "../../components/ui/PageHeader";
import StatePanel from "../../components/ui/StatePanel";
import { Table, Td, Th } from "../../components/ui/Table";
import { buttonClassName } from "../../components/ui/buttonStyles";
import { useMyComplaints } from "../../hooks/useComplaints";

export default function MyComplaintsPage() {
  const complaints = useMyComplaints();

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Maintenance and support"
        title="My complaints"
        description="Track each request from submission through the admin's response and resolution."
        actions={
          <Link className={buttonClassName({ className: "w-full sm:w-auto" })} to="/tenant/complaints/new">
            <Icon name="plus" className="h-4 w-4" />
            New complaint
          </Link>
        }
      />

      <Card title="Complaint history" description="Status and priority labels update as your request is reviewed.">
        {complaints.isLoading ? (
          <div aria-live="polite">
            <StatePanel
              compact
              icon="complaints"
              title="Loading your complaints"
              description="We are retrieving your latest support requests."
            />
          </div>
        ) : complaints.error ? (
          <StatePanel
            compact
            icon="complaints"
            tone="danger"
            title="We couldn't load your complaints"
            description="Check your connection and try again."
            action={
              <Button variant="secondary" onClick={() => void complaints.refetch()}>
                Try again
              </Button>
            }
          />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Complaint</Th>
                <Th>Category</Th>
                <Th>Status</Th>
                <Th>Priority</Th>
                <Th>Admin response</Th>
              </tr>
            </thead>
            <tbody>
              {complaints.data?.map((complaint) => (
                <tr key={complaint.id}>
                  <Td label="Complaint">
                    <span className="font-bold">#{complaint.id}</span>
                  </Td>
                  <Td label="Category" className="font-semibold">
                    {complaint.category}
                  </Td>
                  <Td label="Status">
                    <Badge>{complaint.status}</Badge>
                  </Td>
                  <Td label="Priority">
                    <Badge>{complaint.priority}</Badge>
                  </Td>
                  <Td label="Admin response" className="max-w-xl">
                    {complaint.admin_response ?? <span className="text-muted">Awaiting admin response</span>}
                  </Td>
                </tr>
              ))}
              {complaints.data?.length === 0 ? (
                <tr>
                  <Td colSpan={5} className="!border-b-0 !p-0">
                    <StatePanel
                      compact
                      icon="complaints"
                      title="No complaints yet"
                      description="When something needs attention, submit a request and track it here."
                      action={
                        <Link className={buttonClassName()} to="/tenant/complaints/new">
                          <Icon name="plus" className="h-4 w-4" />
                          Submit a complaint
                        </Link>
                      }
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
