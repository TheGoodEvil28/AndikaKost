import { Link } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import Icon from "../../components/ui/Icon";
import PageHeader from "../../components/ui/PageHeader";
import StatePanel from "../../components/ui/StatePanel";
import { Table, Td, Th } from "../../components/ui/Table";
import { buttonClassName } from "../../components/ui/buttonStyles";
import { useComplaintsAdmin } from "../../hooks/useComplaints";

export default function ComplaintsPage() {
  const complaints = useComplaintsAdmin();

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Resident care"
        title="Complaints"
        description="Track tenant concerns, prioritize follow-up, and keep resolution work visible."
      />

      <Card title="Complaint queue" description="Open a complaint to review its details, update progress, or respond.">
        {complaints.isLoading ? (
          <StatePanel compact icon="complaints" title="Loading complaints..." />
        ) : complaints.error ? (
          <StatePanel
            compact
            icon="complaints"
            tone="danger"
            title="Complaints could not be loaded"
            description="Please try again in a moment."
          />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Complaint</Th>
                <Th>Tenant</Th>
                <Th>Category</Th>
                <Th>Status</Th>
                <Th>Priority</Th>
              </tr>
            </thead>
            <tbody>
              {complaints.data?.map((complaint) => (
                <tr key={complaint.id}>
                  <Td label="Complaint">
                    <Link
                      className={buttonClassName({ variant: "ghost", className: "text-link -my-2 justify-start" })}
                      to={`/admin/complaints/${complaint.id}`}
                      aria-label={`Open complaint ${complaint.id}`}
                    >
                      #{complaint.id}
                      <Icon name="arrow-right" className="h-4 w-4" />
                    </Link>
                  </Td>
                  <Td label="Tenant">#{complaint.tenant_id}</Td>
                  <Td label="Category" className="font-semibold">
                    {complaint.category}
                  </Td>
                  <Td label="Status">
                    <Badge>{complaint.status}</Badge>
                  </Td>
                  <Td label="Priority">
                    <Badge>{complaint.priority}</Badge>
                  </Td>
                </tr>
              ))}
              {complaints.data?.length === 0 ? (
                <tr>
                  <Td colSpan={5} className="p-3">
                    <StatePanel
                      compact
                      icon="complaints"
                      title="No complaints in the queue"
                      description="Tenant complaints will appear here when they are submitted."
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
