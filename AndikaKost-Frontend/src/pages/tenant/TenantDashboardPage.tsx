import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Icon from "../../components/ui/Icon";
import PageHeader from "../../components/ui/PageHeader";
import StatePanel from "../../components/ui/StatePanel";
import { buttonClassName } from "../../components/ui/buttonStyles";

type Summary = {
  assigned_room_id: number | null;
  current_bill_id: number | null;
  current_bill_status: string | null;
  latest_complaint_id: number | null;
  latest_complaint_status: string | null;
};

export default function TenantDashboardPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dashboard", "tenant"],
    queryFn: async () => (await api.get<{ data: Summary; message: string }>("/dashboard/tenant")).data.data
  });

  const header = (
    <PageHeader
      eyebrow="Tenant overview"
      title="Your home at a glance"
      description="Check your room, stay current on billing, and follow up on maintenance requests from one place."
    />
  );

  if (isLoading) {
    return (
      <div className="page-stack" aria-live="polite">
        {header}
        <StatePanel
          icon="dashboard"
          title="Loading your dashboard"
          description="We are collecting your latest room, bill, and complaint details."
        />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="page-stack">
        {header}
        <StatePanel
          icon="dashboard"
          tone="danger"
          title="We couldn't load your dashboard"
          description="Check your connection and try again."
          action={
            <Button variant="secondary" onClick={() => void refetch()}>
              Try again
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="page-stack">
      {header}

      <Card title="At a glance" description="Your latest account activity and assigned room.">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <article className="metric-card flex min-h-full flex-col">
            <div className="flex items-start justify-between gap-3">
              <div className="metric-label">Assigned room</div>
              <span className="brand-chip grid h-9 w-9 shrink-0 place-items-center rounded-xl">
                <Icon name="rooms" className="h-4.5 w-4.5" />
              </span>
            </div>
            <div className="metric-value">
              {data.assigned_room_id === null ? "Not assigned" : `Room #${data.assigned_room_id}`}
            </div>
            <Link
              className={buttonClassName({ variant: "ghost", className: "mt-4 w-full justify-between" })}
              to="/tenant/room"
            >
              View room
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </article>

          <article className="metric-card flex min-h-full flex-col">
            <div className="flex items-start justify-between gap-3">
              <div className="metric-label">Current bill</div>
              <span className="brand-chip grid h-9 w-9 shrink-0 place-items-center rounded-xl">
                <Icon name="payments" className="h-4.5 w-4.5" />
              </span>
            </div>
            <div className="metric-value">
              {data.current_bill_id === null ? "No current bill" : `Bill #${data.current_bill_id}`}
            </div>
            {data.current_bill_status ? (
              <div className="mt-3">
                <Badge>{data.current_bill_status}</Badge>
              </div>
            ) : null}
            <Link
              className={buttonClassName({ variant: "ghost", className: "mt-4 w-full justify-between" })}
              to="/tenant/bills"
            >
              View bills
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </article>

          <article className="metric-card flex min-h-full flex-col sm:col-span-2 xl:col-span-1">
            <div className="flex items-start justify-between gap-3">
              <div className="metric-label">Latest complaint</div>
              <span className="brand-chip grid h-9 w-9 shrink-0 place-items-center rounded-xl">
                <Icon name="complaints" className="h-4.5 w-4.5" />
              </span>
            </div>
            <div className="metric-value">
              {data.latest_complaint_id === null ? "No complaints" : `Complaint #${data.latest_complaint_id}`}
            </div>
            {data.latest_complaint_status ? (
              <div className="mt-3">
                <Badge>{data.latest_complaint_status}</Badge>
              </div>
            ) : null}
            <Link
              className={buttonClassName({ variant: "ghost", className: "mt-4 w-full justify-between" })}
              to="/tenant/complaints"
            >
              View complaints
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </article>
        </div>
      </Card>

      <Card title="Quick actions" description="Complete common tenant tasks without searching through the menu.">
        <div className="grid gap-2 sm:grid-cols-2 lg:max-w-2xl">
          <Link className={buttonClassName({ variant: "secondary", className: "w-full sm:justify-start" })} to="/tenant/bills">
            <Icon name="upload" className="h-4.5 w-4.5" />
            Upload payment proof
          </Link>
          <Link className={buttonClassName({ className: "w-full sm:justify-start" })} to="/tenant/complaints/new">
            <Icon name="plus" className="h-4.5 w-4.5" />
            Submit a complaint
          </Link>
        </div>
      </Card>
    </div>
  );
}
