import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import { useComplaint, useComplaintMutations } from "../../hooks/useComplaints";
import { API_BASE_URL } from "../../utils/constants";

export default function ComplaintDetailPage() {
  const params = useParams();
  const id = useMemo(() => Number(params.id), [params.id]);
  const complaint = useComplaint(id);
  const mut = useComplaintMutations();
  const [response, setResponse] = useState("");

  return (
    <div className="grid gap-4">
      <Card title="Complaint Detail">
        <div className="flex items-center justify-between">
          <Link className="text-blue-700 hover:underline" to="/admin/complaints">
            Back to complaints
          </Link>
        </div>
      </Card>

      {complaint.isLoading ? (
        <div>Loading…</div>
      ) : complaint.error || !complaint.data ? (
        <div className="text-rose-700">Complaint not found.</div>
      ) : (
        <Card title={`Complaint #${complaint.data.id}`}>
          <div className="grid gap-2 text-ui-base">
            <div>
              <span className="text-slate-600">Category: </span>
              <b>{complaint.data.category}</b>
            </div>
            <div>
              <span className="text-slate-600">Priority: </span>
              <b>{complaint.data.priority}</b>
            </div>
            <div>
              <span className="text-slate-600">Status: </span>
              <b>{complaint.data.status}</b>
            </div>
            <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="text-sm text-slate-600">Description</div>
              <div className="whitespace-pre-wrap">{complaint.data.description}</div>
            </div>
            {complaint.data.photo_file_url ? (
              <a className="font-semibold text-blue-700 hover:underline" href={`${API_BASE_URL}${complaint.data.photo_file_url}`} target="_blank" rel="noreferrer">
                Open attached photo
              </a>
            ) : null}
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <Select
              label="Update status"
              value={complaint.data.status}
              onChange={(e) => mut.updateStatus.mutate({ id, status: e.target.value })}
            >
              <option value="submitted">submitted</option>
              <option value="reviewed">reviewed</option>
              <option value="in_progress">in_progress</option>
              <option value="resolved">resolved</option>
              <option value="rejected">rejected</option>
            </Select>
            <label className="block">
              <div className="mb-1.5 text-ui-base font-semibold text-[var(--surface-fg)]">Admin response</div>
              <textarea
                className="w-full rounded-xl border border-slate-300/80 bg-white/85 px-3.5 py-2.5 text-ui-base text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
                rows={3}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Write a clear, friendly response…"
              />
            </label>
            <div className="md:col-span-2">
              <Button onClick={() => mut.respond.mutate({ id, response })} disabled={!response.trim() || mut.respond.isPending}>
                Save response
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

