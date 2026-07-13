import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Icon from "../../components/ui/Icon";
import Input from "../../components/ui/Input";
import PageHeader from "../../components/ui/PageHeader";
import StatePanel from "../../components/ui/StatePanel";
import { buttonClassName } from "../../components/ui/buttonStyles";
import { usePayment, usePaymentMutations } from "../../hooks/usePayments";
import { API_BASE_URL } from "../../utils/constants";
import { formatDate, formatIdr } from "../../utils/format";

export default function PaymentDetailPage() {
  const params = useParams();
  const id = useMemo(() => Number(params.id), [params.id]);
  const payment = usePayment(id);
  const mut = usePaymentMutations();
  const [note, setNote] = useState("");

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Finance"
        title={Number.isFinite(id) ? `Bill #${id}` : "Payment detail"}
        description="Review billing information and verify any payment proof submitted by the tenant."
        backTo="/admin/payments"
        backLabel="Back to payments"
      />

      {payment.isLoading ? (
        <StatePanel icon="payments" title="Loading payment..." />
      ) : payment.error || !payment.data ? (
        <StatePanel
          icon="payments"
          tone="danger"
          title="Payment not found"
          description="The bill may have been removed or the link may be incorrect."
        />
      ) : (
        <>
          <Card title="Billing details" action={<Badge>{payment.data.status}</Badge>}>
            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-label">Tenant</div>
                <div className="detail-value">#{payment.data.tenant_id}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Room</div>
                <div className="detail-value">#{payment.data.room_id}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Billing month</div>
                <div className="detail-value">{payment.data.billing_month}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Amount</div>
                <div className="detail-value">{formatIdr(payment.data.amount_idr)}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Due date</div>
                <div className="detail-value">{formatDate(payment.data.due_date)}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Status</div>
                <div className="detail-value">
                  <Badge>{payment.data.status}</Badge>
                </div>
              </div>
              <div className="detail-item sm:col-span-2">
                <div className="detail-label">Payment proof</div>
                <div className="detail-value">
                  {payment.data.proof_file_url ? (
                    <a
                      className={buttonClassName({ variant: "secondary", className: "mt-1" })}
                      href={`${API_BASE_URL}${payment.data.proof_file_url}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Icon name="upload" className="h-4 w-4" />
                      Open uploaded proof
                    </a>
                  ) : (
                    <span className="text-muted">No proof uploaded.</span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card
            title="Payment review"
            description="Approve valid proof or add a clear note before rejecting the submission."
          >
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <Input
                label="Admin note (optional, for rejection)"
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                <Button loading={mut.approve.isPending} onClick={() => mut.approve.mutate(id)}>
                  <Icon name="check" className="h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant="danger"
                  loading={mut.reject.isPending}
                  onClick={() => mut.reject.mutate({ id, note })}
                >
                  <Icon name="x" className="h-4 w-4" />
                  Reject
                </Button>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
