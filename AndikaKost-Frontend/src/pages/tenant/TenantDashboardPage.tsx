import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import { api } from "../../api/client";
import Badge from "../../components/ui/Badge";

type Summary = {
  assigned_room_id: number | null;
  current_bill_id: number | null;
  current_bill_status: string | null;
  latest_complaint_id: number | null;
  latest_complaint_status: string | null;
};

export default function TenantDashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard", "tenant"],
    queryFn: async () => (await api.get<{ data: Summary; message: string }>("/dashboard/tenant")).data.data
  });

  if (isLoading) return <div className="text-ui-base">Loading…</div>;
  if (error || !data) return <div className="text-ui-base text-rose-700">Failed to load dashboard.</div>;

  return (
    <div className="grid gap-4">
      <Card title="My Summary">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-600">Assigned room</div>
            <div className="mt-1 text-2xl font-bold">{data.assigned_room_id ?? "-"}</div>
            <Link className="mt-2 inline-block text-blue-700 hover:underline" to="/tenant/room">
              View room
            </Link>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-600">Current bill</div>
            <div className="mt-1 text-2xl font-bold">{data.current_bill_id ?? "-"}</div>
            {data.current_bill_status ? (
              <div className="mt-2">
                <Badge>{data.current_bill_status}</Badge>
              </div>
            ) : null}
            <Link className="mt-2 inline-block text-blue-700 hover:underline" to="/tenant/bills">
              View bills
            </Link>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-600">Latest complaint</div>
            <div className="mt-1 text-2xl font-bold">{data.latest_complaint_id ?? "-"}</div>
            {data.latest_complaint_status ? (
              <div className="mt-2">
                <Badge>{data.latest_complaint_status}</Badge>
              </div>
            ) : null}
            <Link className="mt-2 inline-block text-blue-700 hover:underline" to="/tenant/complaints">
              View complaints
            </Link>
          </div>
        </div>
      </Card>
      <Card title="Quick Actions">
        <div className="flex flex-wrap gap-2">
          <Link className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium hover:bg-slate-50" to="/tenant/bills">
            Upload payment proof
          </Link>
          <Link className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium hover:bg-slate-50" to="/tenant/complaints/new">
            Submit complaint
          </Link>
        </div>
      </Card>
    </div>
  );
}

