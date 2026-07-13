import { useState } from "react";
import { Link } from "react-router-dom";
import BillForm from "../../components/forms/BillForm";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Icon from "../../components/ui/Icon";
import Modal from "../../components/ui/Modal";
import PageHeader from "../../components/ui/PageHeader";
import StatePanel from "../../components/ui/StatePanel";
import { Table, Td, Th } from "../../components/ui/Table";
import { buttonClassName } from "../../components/ui/buttonStyles";
import { usePaymentMutations, usePaymentsAdmin } from "../../hooks/usePayments";
import { formatDate, formatIdr } from "../../utils/format";

export default function PaymentsPage() {
  const payments = usePaymentsAdmin();
  const mut = usePaymentMutations();
  const [open, setOpen] = useState(false);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Finance"
        title="Payments"
        description="Create monthly bills and review payment proof from tenants."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Icon name="plus" className="h-4 w-4" />
            Create bill
          </Button>
        }
      />

      <Card title="Payment ledger" description="Open a bill to review payment details and verification status.">
        {payments.isLoading ? (
          <StatePanel compact icon="payments" title="Loading payments..." />
        ) : payments.error ? (
          <StatePanel
            compact
            icon="payments"
            tone="danger"
            title="Payments could not be loaded"
            description="Please try again in a moment."
          />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Bill</Th>
                <Th>Tenant</Th>
                <Th>Month</Th>
                <Th>Amount</Th>
                <Th>Due</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {payments.data?.map((payment) => (
                <tr key={payment.id}>
                  <Td label="Bill">
                    <Link
                      className={buttonClassName({ variant: "ghost", className: "text-link -my-2 justify-start" })}
                      to={`/admin/payments/${payment.id}`}
                      aria-label={`Open bill ${payment.id}`}
                    >
                      #{payment.id}
                      <Icon name="arrow-right" className="h-4 w-4" />
                    </Link>
                  </Td>
                  <Td label="Tenant">#{payment.tenant_id}</Td>
                  <Td label="Month" className="font-semibold">
                    {payment.billing_month}
                  </Td>
                  <Td label="Amount">{formatIdr(payment.amount_idr)}</Td>
                  <Td label="Due">{formatDate(payment.due_date)}</Td>
                  <Td label="Status">
                    <Badge>{payment.status}</Badge>
                  </Td>
                </tr>
              ))}
              {payments.data?.length === 0 ? (
                <tr>
                  <Td colSpan={6} className="p-3">
                    <StatePanel
                      compact
                      icon="payments"
                      title="No bills yet"
                      description="Create the first bill to begin tracking tenant payments."
                      action={
                        <Button onClick={() => setOpen(true)}>
                          <Icon name="plus" className="h-4 w-4" />
                          Create bill
                        </Button>
                      }
                    />
                  </Td>
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
