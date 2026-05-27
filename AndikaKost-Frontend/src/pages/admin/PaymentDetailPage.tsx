import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import { usePayment, usePaymentMutations } from "../../hooks/usePayments";
import { API_BASE_URL } from "../../utils/constants";
import { formatIdr, formatDate } from "../../utils/format";

export default function PaymentDetailPage() {
  const params = useParams();
  const id = useMemo(() => Number(params.id), [params.id]);
  const payment = usePayment(id);
  const mut = usePaymentMutations();
  const [note, setNote] = useState("");

  return (
    <div className="grid gap-4">
      <Card title="Payment Detail">
        <div className="flex items-center justify-between">
          <Link className="text-blue-700 hover:underline" to="/admin/payments">
            Back to payments
          </Link>
        </div>
      </Card>

      {payment.isLoading ? (
        <div>Loading…</div>
      ) : payment.error || !payment.data ? (
        <div className="text-rose-700">Payment not found.</div>
      ) : (
        <Card title={`Bill #${payment.data.id}`}>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <div className="text-sm text-slate-600">Tenant ID</div>
              <div className="font-semibold">{payment.data.tenant_id}</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">Room ID</div>
              <div className="font-semibold">{payment.data.room_id}</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">Billing month</div>
              <div className="font-semibold">{payment.data.billing_month}</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">Amount</div>
              <div className="font-semibold">{formatIdr(payment.data.amount_idr)}</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">Due date</div>
              <div className="font-semibold">{formatDate(payment.data.due_date)}</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">Status</div>
              <div className="font-semibold">
                <Badge>{payment.data.status}</Badge>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="text-sm text-slate-600">Proof</div>
              {payment.data.proof_file_url ? (
                <a className="font-semibold text-blue-700 hover:underline" href={`${API_BASE_URL}${payment.data.proof_file_url}`} target="_blank" rel="noreferrer">
                  Open uploaded proof
                </a>
              ) : (
                <div className="font-semibold">No proof uploaded.</div>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <Input label="Admin note (optional, for rejection)" value={note} onChange={(e) => setNote(e.target.value)} />
            <div className="flex flex-wrap gap-2 md:items-end">
              <Button onClick={() => mut.approve.mutate(id)} disabled={mut.approve.isPending}>
                Approve
              </Button>
              <Button variant="danger" onClick={() => mut.reject.mutate({ id, note })} disabled={mut.reject.isPending}>
                Reject
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

