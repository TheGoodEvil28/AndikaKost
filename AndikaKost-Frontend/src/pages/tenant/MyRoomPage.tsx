import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Icon from "../../components/ui/Icon";
import PageHeader from "../../components/ui/PageHeader";
import StatePanel from "../../components/ui/StatePanel";
import { formatIdr } from "../../utils/format";

type Room = {
  id: number;
  room_number: string;
  room_type: string | null;
  floor: string | null;
  price_idr: number;
  facilities: string | null;
  status: string;
  description: string | null;
};

export default function MyRoomPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["tenant", "room"],
    queryFn: async () => (await api.get<{ data: Room | null; message: string }>("/tenant/room")).data.data
  });

  const header = (
    <PageHeader
      eyebrow="Your accommodation"
      title="My room"
      description="Review your assigned room, monthly rate, and included facilities."
    />
  );

  if (isLoading) {
    return (
      <div className="page-stack" aria-live="polite">
        {header}
        <StatePanel
          icon="rooms"
          title="Loading your room"
          description="We are retrieving your latest room assignment."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-stack">
        {header}
        <StatePanel
          icon="rooms"
          tone="danger"
          title="We couldn't load your room"
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

  if (!data) {
    return (
      <div className="page-stack">
        {header}
        <StatePanel
          icon="rooms"
          title="No room assigned yet"
          description="Your room details will appear here after an admin completes your assignment. Contact the admin if you need help."
        />
      </div>
    );
  }

  return (
    <div className="page-stack">
      {header}

      <Card
        title={`Room ${data.room_number}`}
        description="Your current room assignment"
        action={<Badge>{data.status}</Badge>}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="metric-card">
            <div className="flex items-start justify-between gap-3">
              <div className="metric-label">Room number</div>
              <span className="brand-chip grid h-9 w-9 shrink-0 place-items-center rounded-xl">
                <Icon name="rooms" className="h-5 w-5" />
              </span>
            </div>
            <div className="metric-value">{data.room_number}</div>
          </div>

          <div className="metric-card">
            <div className="flex items-start justify-between gap-3">
              <div className="metric-label">Monthly rent</div>
              <span className="brand-chip grid h-9 w-9 shrink-0 place-items-center rounded-xl">
                <Icon name="wallet" className="h-5 w-5" />
              </span>
            </div>
            <div className="metric-value">{formatIdr(data.price_idr)}</div>
          </div>
        </div>

        <div className="detail-grid mt-4">
          <div className="detail-item">
            <div className="detail-label">Room type</div>
            <div className="detail-value">{data.room_type ?? "Not specified"}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Floor</div>
            <div className="detail-value">{data.floor ?? "Not specified"}</div>
          </div>
          <div className="detail-item sm:col-span-2">
            <div className="detail-label">Facilities</div>
            <div className="detail-value">{data.facilities ?? "No facilities listed"}</div>
          </div>
          <div className="detail-item sm:col-span-2">
            <div className="detail-label">Description</div>
            <div className="detail-value">{data.description ?? "No additional description"}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
