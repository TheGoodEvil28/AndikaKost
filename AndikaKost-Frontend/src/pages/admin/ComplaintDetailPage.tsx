import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Icon from "../../components/ui/Icon";
import PageHeader from "../../components/ui/PageHeader";
import Select from "../../components/ui/Select";
import StatePanel from "../../components/ui/StatePanel";
import Textarea from "../../components/ui/Textarea";
import { buttonClassName } from "../../components/ui/buttonStyles";
import { useComplaint, useComplaintMutations } from "../../hooks/useComplaints";
import { API_BASE_URL } from "../../utils/constants";

export default function ComplaintDetailPage() {
  const params = useParams();
  const id = useMemo(() => Number(params.id), [params.id]);
  const complaint = useComplaint(id);
  const mut = useComplaintMutations();
  const [response, setResponse] = useState("");

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Resident care"
        title={Number.isFinite(id) ? `Complaint #${id}` : "Complaint"}
        description="Review the issue, communicate clearly, and keep the resolution status current."
        backTo="/admin/complaints"
        backLabel="Back to complaints"
      />

      {complaint.isLoading ? (
        <StatePanel icon="complaints" title="Loading complaint..." />
      ) : complaint.error || !complaint.data ? (
        <StatePanel
          icon="complaints"
          tone="danger"
          title="Complaint not found"
          description="The complaint may have been removed or the link may be incorrect."
        />
      ) : (
        <>
          <Card title="Complaint details" action={<Badge>{complaint.data.status}</Badge>}>
            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-label">Tenant</div>
                <div className="detail-value">#{complaint.data.tenant_id}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Room</div>
                <div className="detail-value">#{complaint.data.room_id}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Category</div>
                <div className="detail-value">{complaint.data.category}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Priority</div>
                <div className="detail-value">
                  <Badge>{complaint.data.priority}</Badge>
                </div>
              </div>
              <div className="detail-item sm:col-span-2">
                <div className="detail-label">Description</div>
                <div className="detail-value whitespace-pre-wrap font-medium">{complaint.data.description}</div>
              </div>
              {complaint.data.admin_response ? (
                <div className="detail-item sm:col-span-2">
                  <div className="detail-label">Latest admin response</div>
                  <div className="detail-value whitespace-pre-wrap font-medium">{complaint.data.admin_response}</div>
                </div>
              ) : null}
            </div>

            {complaint.data.photo_file_url ? (
              <div className="mt-4">
                <a
                  className={buttonClassName({ variant: "secondary" })}
                  href={`${API_BASE_URL}${complaint.data.photo_file_url}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name="upload" className="h-4 w-4" />
                  Open attached photo
                </a>
              </div>
            ) : null}
          </Card>

          <Card title="Resolution" description="Status changes and responses are saved to the tenant complaint record.">
            <div className="grid gap-4 md:grid-cols-2">
              <Select
                label="Update status"
                value={complaint.data.status}
                disabled={mut.updateStatus.isPending}
                onChange={(event) => mut.updateStatus.mutate({ id, status: event.target.value })}
              >
                <option value="submitted">submitted</option>
                <option value="reviewed">reviewed</option>
                <option value="in_progress">in_progress</option>
                <option value="resolved">resolved</option>
                <option value="rejected">rejected</option>
              </Select>
              <Textarea
                label="Admin response"
                rows={4}
                value={response}
                onChange={(event) => setResponse(event.target.value)}
                placeholder="Write a clear, friendly response..."
              />
              <div className="md:col-span-2">
                <Button
                  loading={mut.respond.isPending}
                  onClick={() => mut.respond.mutate({ id, response })}
                  disabled={!response.trim()}
                >
                  Save response
                </Button>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
