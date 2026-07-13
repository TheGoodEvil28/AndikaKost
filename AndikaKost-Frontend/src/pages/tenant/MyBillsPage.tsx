import { Link } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Icon from "../../components/ui/Icon";
import PageHeader from "../../components/ui/PageHeader";
import StatePanel from "../../components/ui/StatePanel";
import { Table, Td, Th } from "../../components/ui/Table";
import { buttonClassName } from "../../components/ui/buttonStyles";
import { useMyPayments } from "../../hooks/usePayments";
import { formatDate, formatIdr } from "../../utils/format";

export default function MyBillsPage() {
  const payments = useMyPayments();

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Billing"
        title="My bills"
        description="Review charges and upload payment proof for bills that are unpaid or need a new document."
      />

      <Card title="Billing history" description="Each upload is reviewed by the admin before a bill is marked as paid.">
        {payments.isLoading ? (
          <div aria-live="polite">
            <StatePanel
              compact
              icon="payments"
              title="Loading your bills"
              description="We are retrieving your latest billing records."
            />
          </div>
        ) : payments.error ? (
          <StatePanel
            compact
            icon="payments"
            tone="danger"
            title="We couldn't load your bills"
            description="Check your connection and try again."
            action={
              <Button variant="secondary" onClick={() => void payments.refetch()}>
                Try again
              </Button>
            }
          />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Bill</Th>
                <Th>Month</Th>
                <Th>Amount</Th>
                <Th>Due date</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {payments.data?.map((payment) => (
                <tr key={payment.id}>
                  <Td label="Bill">
                    <span className="font-bold">#{payment.id}</span>
                  </Td>
                  <Td label="Month" className="font-semibold">
                    {payment.billing_month}
                  </Td>
                  <Td label="Amount" className="whitespace-nowrap font-semibold">
                    {formatIdr(payment.amount_idr)}
                  </Td>
                  <Td label="Due date" className="whitespace-nowrap">
                    {formatDate(payment.due_date)}
                  </Td>
                  <Td label="Status">
                    <Badge>{payment.status}</Badge>
                  </Td>
                  <Td label="Action">
                    <Link
                      className={buttonClassName({ variant: "secondary", className: "w-full md:w-auto" })}
                      to={`/tenant/bills/${payment.id}/upload`}
                      aria-label={`Upload proof for bill ${payment.id}`}
                    >
                      <Icon name="upload" className="h-4 w-4" />
                      Upload proof
                    </Link>
                  </Td>
                </tr>
              ))}
              {payments.data?.length === 0 ? (
                <tr>
                  <Td colSpan={6} className="!border-b-0 !p-0">
                    <StatePanel
                      compact
                      icon="wallet"
                      title="No bills yet"
                      description="New billing records will appear here when they are issued."
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
