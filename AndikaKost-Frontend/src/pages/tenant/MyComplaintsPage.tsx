import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { Table, Td, Th } from "../../components/ui/Table";
import { useMyComplaints } from "../../hooks/useComplaints";

export default function MyComplaintsPage() {
  const complaints = useMyComplaints();
  return (
    <div className="grid gap-4">
      <Card title="My Complaints">
        <div className="text-slate-600">Track complaint progress and admin responses.</div>
      </Card>
      <Card title="Complaint List">
        {complaints.isLoading ? (
          <div>Loading…</div>
        ) : complaints.error ? (
          <div className="text-rose-700">Failed to load complaints.</div>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Category</Th>
                <Th>Status</Th>
                <Th>Priority</Th>
                <Th>Admin response</Th>
              </tr>
            </thead>
            <tbody>
              {complaints.data?.map((c) => (
                <tr key={c.id}>
                  <Td>{c.id}</Td>
                  <Td>{c.category}</Td>
                  <Td>
                    <Badge>{c.status}</Badge>
                  </Td>
                  <Td>{c.priority}</Td>
                  <Td>{c.admin_response ?? "-"}</Td>
                </tr>
              ))}
              {complaints.data?.length === 0 ? (
                <tr>
                  <Td>
                    <span className="text-slate-600">No complaints yet.</span>
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

