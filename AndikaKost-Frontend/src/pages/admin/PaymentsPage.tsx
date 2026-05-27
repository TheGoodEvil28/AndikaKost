import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import BillForm from "../../components/forms/BillForm";
import { Table, Td, Th } from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import { usePaymentMutations, usePaymentsAdmin } from "../../hooks/usePayments";
import { formatIdr, formatDate } from "../../utils/format";

export default function PaymentsPage() {
  const payments = usePaymentsAdmin();
  const mut = usePaymentMutations();
  const [open, setOpen] = useState(false);

  return (
    <div className="grid gap-4">
      <Card title="Payments">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-slate-600">Create bills and verify payment proofs.</div>
          <Button onClick={() => setOpen(true)}>Create bill</Button>
        </div>
      </Card>

      <Card title="Payment List">
        {payments.isLoading ? (
          <div>Loading…</div>
        ) : payments.error ? (
          <div className="text-rose-700">Failed to load payments.</div>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Tenant ID</Th>
                <Th>Month</Th>
                <Th>Amount</Th>
                <Th>Due</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {payments.data?.map((p) => (
                <tr key={p.id}>
                  <Td>
                    <Link className="font-semibold text-blue-700 hover:underline" to={`/admin/payments/${p.id}`}>
                      {p.id}
                    </Link>
                  </Td>
                  <Td>{p.tenant_id}</Td>
                  <Td>{p.billing_month}</Td>
                  <Td>{formatIdr(p.amount_idr)}</Td>
                  <Td>{formatDate(p.due_date)}</Td>
                  <Td>
                    <Badge>{p.status}</Badge>
                  </Td>
                </tr>
              ))}
              {payments.data?.length === 0 ? (
                <tr>
                  <Td>
                    <span className="text-slate-600">No payments yet.</span>
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

      <Modal title="Create bill" open={open} onClose={() => setOpen(false)}>
        <BillForm
          submitting={mut.createBill.isPending}
          onSubmit={(values) => mut.createBill.mutate(values, { onSuccess: () => setOpen(false) })}
        />
      </Modal>
    </div>
  );
}

