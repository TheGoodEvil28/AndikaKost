import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";
import Card from "../../components/ui/Card";
import AdminDashImg from "../../assets/Asset-dashboard-Admin.png";

type Summary = {
  total_rooms: number;
  occupied_rooms: number;
  available_rooms: number;
  total_tenants: number;
  pending_payments: number;
  unpaid_payments: number;
  open_complaints: number;
  pending_bookings?: number;
};

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard", "admin"],
    queryFn: async () => (await api.get<{ data: Summary; message: string }>("/dashboard/admin")).data.data
  });

  if (isLoading) return <div className="text-ui-base">Loading…</div>;
  if (error || !data) return <div className="text-ui-base text-rose-700">Failed to load dashboard.</div>;

  const items: { label: string; value: number }[] = [
    { label: "Total rooms", value: data.total_rooms },
    { label: "Occupied rooms", value: data.occupied_rooms },
    { label: "Available rooms", value: data.available_rooms },
    { label: "Total tenants", value: data.total_tenants },
    { label: "Pending payments", value: data.pending_payments },
    { label: "Unpaid payments", value: data.unpaid_payments },
    { label: "Open complaints", value: data.open_complaints }
  ];

  if (typeof data.pending_bookings === "number") {
    items.splice(4, 0, { label: "New booking requests", value: data.pending_bookings });
  }

  return (
    <div className="grid gap-4">
      <Card title="Operational Summary">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <div key={i.label} className="rounded-xl border border-slate-200 p-4">
              <div className="text-sm text-slate-600">{i.label}</div>
              <div className="mt-1 text-3xl font-bold">{i.value}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Overview">
        <img
          src={AdminDashImg}
          alt="Admin dashboard illustration"
          className="w-full rounded-xl border border-slate-200"
        />
      </Card>
      <Card title="Admin Tips">
        <ul className="list-disc pl-5 text-slate-700">
          <li>Use large room numbers and consistent naming (e.g. A-101).</li>
          <li>Create tenant accounts before assigning rooms and bills.</li>
          <li>Ask tenants to upload clear payment proof screenshots.</li>
        </ul>
      </Card>
    </div>
  );
}
