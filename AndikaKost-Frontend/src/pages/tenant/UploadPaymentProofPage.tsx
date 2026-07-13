import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const MAX_FILE_BYTES = 1024 * 1024;
const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg", "application/pdf"];
const UPLOADABLE_STATUSES = ["unpaid", "rejected", "pending_verification"];

function formatFileSize(size: number) {
  return size < 1024 ? `${size} bytes` : `${Math.ceil(size / 1024)} KB`;
}

export default function UploadPaymentProofPage() {
  const params = useParams();
  const navigate = useNavigate();
  const id = useMemo(() => Number(params.id), [params.id]);
  const payment = usePayment(id);
  const mut = usePaymentMutations();
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>();

  const header = (
    <PageHeader
      eyebrow="Billing"
      title="Upload payment proof"
      description="Attach a clear receipt or transfer confirmation for admin review."
      backTo="/tenant/bills"
      backLabel="Back to bills"
    />
  );

  if (!Number.isInteger(id) || id <= 0) {
    return (
      <div className="page-stack">
        {header}
        <StatePanel
          icon="payments"
          tone="danger"
          title="Invalid bill"
          description="This bill link is not valid. Return to your bills and choose a payment record."
        />
      </div>
    );
  }

  if (payment.isLoading) {
    return (
      <div className="page-stack" aria-live="polite">
        {header}
        <StatePanel
          icon="payments"
          title="Loading bill details"
          description="We are checking the bill before you upload a document."
        />
      </div>
    );
  }

  if (payment.error || !payment.data) {
    return (
      <div className="page-stack">
        {header}
        <StatePanel
          icon="payments"
          tone="danger"
          title="Bill not found"
          description="The bill may no longer be available. Refresh the record or return to your bills."
          action={
            <Button variant="secondary" onClick={() => void payment.refetch()}>
              Try again
            </Button>
          }
        />
      </div>
    );
  }

  const bill = payment.data;
  const normalizedStatus = bill.status.trim().toLowerCase().replaceAll("-", "_").replaceAll(" ", "_");
  const canUpload = UPLOADABLE_STATUSES.includes(normalizedStatus);

  return (
    <div className="page-stack">
      {header}

      <Card
        title={`Bill #${bill.id}`}
        description="Confirm the bill details before selecting a file."
        action={
          bill.proof_file_url ? (
            <a
              className={buttonClassName({ variant: "secondary" })}
              href={`${API_BASE_URL}${bill.proof_file_url}`}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="arrow-right" className="h-4 w-4" />
              View current proof
            </a>
          ) : undefined
        }
      >
        <div className="detail-grid">
          <div className="detail-item">
            <div className="detail-label">Billing month</div>
            <div className="detail-value">{bill.billing_month}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Amount</div>
            <div className="detail-value">{formatIdr(bill.amount_idr)}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Due date</div>
            <div className="detail-value">{formatDate(bill.due_date)}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Status</div>
            <div className="detail-value">
              <Badge>{bill.status}</Badge>
            </div>
          </div>
          {bill.admin_note ? (
            <div className="detail-item sm:col-span-2">
              <div className="detail-label">Admin note</div>
              <div className="detail-value">{bill.admin_note}</div>
            </div>
          ) : null}
        </div>

        <div className="panel-divider mt-6 border-t pt-6">
          <h3 className="text-ui-lg font-bold brand-heading">Payment document</h3>
          <p className="mt-1 text-sm text-muted">Choose a PNG, JPG, or PDF file no larger than 1 MB.</p>

          {canUpload ? (
            <div className="mt-4 grid max-w-2xl gap-4">
              <Input
                id="payment-proof"
                label="Select payment proof"
                hint="Accepted formats: PNG, JPG, or PDF. Maximum file size: 1 MB."
                error={fileError}
                type="file"
                accept="image/png,image/jpeg,application/pdf"
                onChange={(event) => {
                  const selectedFile = event.target.files?.[0] ?? null;

                  if (!selectedFile) {
                    setFile(null);
                    setFileError(undefined);
                    return;
                  }

                  if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
                    setFile(null);
                    setFileError("Choose a PNG, JPG, or PDF file.");
                    event.currentTarget.value = "";
                    return;
                  }

                  if (selectedFile.size > MAX_FILE_BYTES) {
                    setFile(null);
                    setFileError("The selected file is larger than 1 MB.");
                    event.currentTarget.value = "";
                    return;
                  }

                  setFile(selectedFile);
                  setFileError(undefined);
                }}
              />

              {file ? (
                <div className="theme-subtle flex items-start gap-3 rounded-xl border p-4" aria-live="polite">
                  <span className="brand-chip grid h-9 w-9 shrink-0 place-items-center rounded-xl">
                    <Icon name="check" className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="break-words font-bold">{file.name}</div>
                    <div className="mt-0.5 text-sm text-muted">{formatFileSize(file.size)} selected and ready to upload</div>
                  </div>
                </div>
              ) : null}

              {mut.uploadProof.isError ? (
                <div role="alert">
                  <StatePanel
                    compact
                    icon="upload"
                    tone="danger"
                    title="We couldn't upload this file"
                    description="Check the format and file size, then try again."
                  />
                </div>
              ) : null}

              <div>
                <Button
                  className="w-full sm:w-auto"
                  loading={mut.uploadProof.isPending}
                  disabled={!file}
                  onClick={() => {
                    if (!file) return;
                    mut.uploadProof.mutate(
                      { paymentId: id, file },
                      {
                        onSuccess: () => navigate("/tenant/bills", { replace: true })
                      }
                    );
                  }}
                >
                  <Icon name="upload" className="h-4 w-4" />
                  Upload proof
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <StatePanel
                compact
                icon="check"
                title="No upload needed"
                description="This bill's current status does not accept a new payment proof."
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
