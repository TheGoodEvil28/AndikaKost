import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Icon, { type IconName } from "../../components/ui/Icon";
import PageHeader from "../../components/ui/PageHeader";
import StatePanel from "../../components/ui/StatePanel";
import { buttonClassName } from "../../components/ui/buttonStyles";

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

type DashboardMetric = {
  label: string;
  value: number;
  icon: IconName;
};

type QueueMetric = DashboardMetric & {
  to: string;
  action: string;
};

export default function AdminDashboardPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dashboard", "admin"],
    queryFn: async () => (await api.get<{ data: Summary; message: string }>("/dashboard/admin")).data.data
  });

  const propertyMetrics: DashboardMetric[] = data
    ? [
        { label: "Total rooms", value: data.total_rooms, icon: "rooms" },
        { label: "Occupied rooms", value: data.occupied_rooms, icon: "home" },
        { label: "Available rooms", value: data.available_rooms, icon: "building" },
        { label: "Active tenants", value: data.total_tenants, icon: "tenants" }
      ]
    : [];

  const queueMetrics: QueueMetric[] = data
    ? [
        ...(typeof data.pending_bookings === "number"
          ? [
              {
                label: "New booking requests",
                value: data.pending_bookings,
                icon: "bookings" as const,
                to: "/admin/bookings",
                action: "Review bookings"
              }
            ]
          : []),
        {
          label: "Pending payment reviews",
          value: data.pending_payments,
          icon: "payments",
          to: "/admin/payments",
          action: "Review payments"
        },
        {
          label: "Unpaid bills",
          value: data.unpaid_payments,
          icon: "wallet",
          to: "/admin/payments",
          action: "Open payment ledger"
        },
        {
          label: "Open complaints",
          value: data.open_complaints,
          icon: "complaints",
          to: "/admin/complaints",
          action: "Review complaints"
        }
      ]
    : [];

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Admin workspace"
        title="Dashboard"
        description="A focused view of occupancy, resident activity, and the work that needs attention today."
      />

      {isLoading ? (
        <StatePanel icon="dashboard" title="Loading dashboard..." description="Preparing the latest property summary." />
      ) : error || !data ? (
        <StatePanel
          icon="dashboard"
          tone="danger"
          title="Dashboard could not be loaded"
          description="Please check the connection and try again."
          action={
            <Button variant="secondary" onClick={() => void refetch()}>
              Try again
            </Button>
          }
        />
      ) : (
        <>
          <Card title="Property snapshot" description="Current room capacity and resident totals.">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {propertyMetrics.map((metric) => (
                <div key={metric.label} className="metric-card">
                  <div className="flex items-center justify-between gap-3">
                    <div className="metric-label">{metric.label}</div>
                    <span className="brand-chip grid h-9 w-9 shrink-0 place-items-center rounded-xl">
                      <Icon name={metric.icon} className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="metric-value">{metric.value}</div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.8fr)]">
            <Card title="Action queue" description="Start with the items that can affect tenants or room turnover.">
              <div className="grid gap-3 sm:grid-cols-2">
                {queueMetrics.map((metric) => (
                  <div key={metric.label} className="metric-card flex min-h-44 flex-col">
                    <div className="flex items-center justify-between gap-3">
                      <div className="metric-label">{metric.label}</div>
                      <span className="brand-chip grid h-9 w-9 shrink-0 place-items-center rounded-xl">
                        <Icon name={metric.icon} className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="metric-value">{metric.value}</div>
                    <Link
                      to={metric.to}
                      className={buttonClassName({
                        variant: "ghost",
                        className: "text-link mt-auto w-full justify-between px-3"
                      })}
                    >
                      {metric.action}
                      <Icon name="arrow-right" className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Today's focus" description="A simple rhythm for keeping operations current.">
              <ul className="grid gap-3 text-ui-base">
                <li className="theme-subtle flex gap-3 rounded-xl border p-3">
                  <span className="brand-chip grid h-8 w-8 shrink-0 place-items-center rounded-lg">
                    <Icon name="check" className="h-4 w-4" />
                  </span>
                  <span>Review new booking requests before room availability changes.</span>
                </li>
                <li className="theme-subtle flex gap-3 rounded-xl border p-3">
                  <span className="brand-chip grid h-8 w-8 shrink-0 place-items-center rounded-lg">
                    <Icon name="check" className="h-4 w-4" />
                  </span>
                  <span>Verify payment proof and leave clear notes on rejected submissions.</span>
                </li>
                <li className="theme-subtle flex gap-3 rounded-xl border p-3">
                  <span className="brand-chip grid h-8 w-8 shrink-0 place-items-center rounded-lg">
                    <Icon name="check" className="h-4 w-4" />
                  </span>
                  <span>Respond to open complaints and keep their progress status accurate.</span>
                </li>
              </ul>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
