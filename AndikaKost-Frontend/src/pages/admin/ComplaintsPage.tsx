import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import { Table, Td, Th } from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import { useComplaintsAdmin } from "../../hooks/useComplaints";

export default function ComplaintsPage() {
  const complaints = useComplaintsAdmin();

  return (
    <div className="grid gap-4">
      <Card title="Complaints">
        <div className="text-slate-600">Track and resolve tenant complaints.</div>
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
                <Th>Tenant</Th>
                <Th>Category</Th>
                <Th>Status</Th>
                <Th>Priority</Th>
              </tr>
            </thead>
            <tbody>
              {complaints.data?.map((c) => (
                <tr key={c.id}>
                  <Td>
                    <Link className="font-semibold text-blue-700 hover:underline" to={`/admin/complaints/${c.id}`}>
                      {c.id}
                    </Link>
                  </Td>
                  <Td>{c.tenant_id}</Td>
                  <Td>{c.category}</Td>
                  <Td>
                    <Badge>{c.status}</Badge>
                  </Td>
                  <Td>{c.priority}</Td>
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

