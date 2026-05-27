import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { usePayment } from "../../hooks/usePayments";
import { usePaymentMutations } from "../../hooks/usePayments";
import Badge from "../../components/ui/Badge";
import { API_BASE_URL } from "../../utils/constants";

export default function UploadPaymentProofPage() {
  const params = useParams();
  const navigate = useNavigate();
  const id = useMemo(() => Number(params.id), [params.id]);
  const payment = usePayment(id);
  const mut = usePaymentMutations();
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="grid gap-4">
      <Card title="Upload Payment Proof">
        <div className="flex items-center justify-between">
          <Link className="text-blue-700 hover:underline" to="/tenant/bills">
            Back to bills
          </Link>
        </div>
      </Card>

      {payment.isLoading ? (
        <div>Loading…</div>
      ) : payment.error || !payment.data ? (
        <div className="text-rose-700">Bill not found.</div>
      ) : (
        <Card title={`Bill #${payment.data.id}`}>
          <div className="grid gap-2">
            <div>
              <span className="text-slate-600">Status: </span>
              <Badge>{payment.data.status}</Badge>
            </div>
            {payment.data.proof_file_url ? (
              <a className="font-semibold text-blue-700 hover:underline" href={`${API_BASE_URL}${payment.data.proof_file_url}`} target="_blank" rel="noreferrer">
                View current proof
              </a>
            ) : null}
          </div>
          <div className="mt-4 grid gap-3">
            <Input
              label="Select file (PNG/JPG/PDF)"
              type="file"
              accept="image/png,image/jpeg,application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <Button
              onClick={() => {
                if (!file) return;
                mut.uploadProof.mutate(
                  { paymentId: id, file },
                  {
                    onSuccess: () => navigate("/tenant/bills", { replace: true })
                  }
                );
              }}
              disabled={!file || mut.uploadProof.isPending}
            >
              Upload
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

