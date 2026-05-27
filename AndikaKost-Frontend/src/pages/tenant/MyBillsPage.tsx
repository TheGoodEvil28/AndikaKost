import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { Table, Td, Th } from "../../components/ui/Table";
import { useMyPayments } from "../../hooks/usePayments";
import { formatDate, formatIdr } from "../../utils/format";

export default function MyBillsPage() {
  const payments = useMyPayments();

  return (
    <div className="grid gap-4">
      <Card title="My Bills">
        <div className="text-slate-600">Upload payment proof for bills that are unpaid or rejected.</div>
      </Card>
      <Card title="Bill List">
        {payments.isLoading ? (
          <div>Loading…</div>
        ) : payments.error ? (
          <div className="text-rose-700">Failed to load bills.</div>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Month</Th>
                <Th>Amount</Th>
                <Th>Due</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {payments.data?.map((p) => (
                <tr key={p.id}>
                  <Td>{p.id}</Td>
                  <Td>{p.billing_month}</Td>
                  <Td>{formatIdr(p.amount_idr)}</Td>
                  <Td>{formatDate(p.due_date)}</Td>
                  <Td>
                    <Badge>{p.status}</Badge>
                  </Td>
                  <Td>
                    <Link className="font-semibold text-blue-700 hover:underline" to={`/tenant/bills/${p.id}/upload`}>
                      Upload proof
                    </Link>
                  </Td>
                </tr>
              ))}
              {payments.data?.length === 0 ? (
                <tr>
                  <Td>
                    <span className="text-slate-600">No bills yet.</span>
                  </Td>
                  <Td />
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

