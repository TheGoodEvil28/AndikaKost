import { useQuery } from "@tanstack/react-query";
import Card from "../../components/ui/Card";
import { api } from "../../api/client";
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
  const { data, isLoading, error } = useQuery({
    queryKey: ["tenant", "room"],
    queryFn: async () => (await api.get<{ data: Room | null; message: string }>("/tenant/room")).data.data
  });

  if (isLoading) return <div className="text-ui-base">Loading…</div>;
  if (error) return <div className="text-ui-base text-rose-700">Failed to load room.</div>;

  if (!data) {
    return (
      <Card title="My Room">
        <div className="text-slate-700">You don’t have a room assigned yet. Please contact the admin.</div>
      </Card>
    );
  }

  return (
    <Card title="My Room">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <div className="text-sm text-slate-600">Room number</div>
          <div className="text-2xl font-bold">{data.room_number}</div>
        </div>
        <div>
          <div className="text-sm text-slate-600">Price</div>
          <div className="text-2xl font-bold">{formatIdr(data.price_idr)}</div>
        </div>
        <div>
          <div className="text-sm text-slate-600">Type</div>
          <div className="font-semibold">{data.room_type ?? "-"}</div>
        </div>
        <div>
          <div className="text-sm text-slate-600">Floor</div>
          <div className="font-semibold">{data.floor ?? "-"}</div>
        </div>
        <div className="md:col-span-2">
          <div className="text-sm text-slate-600">Facilities</div>
          <div className="font-semibold">{data.facilities ?? "-"}</div>
        </div>
        <div className="md:col-span-2">
          <div className="text-sm text-slate-600">Description</div>
          <div className="font-semibold">{data.description ?? "-"}</div>
        </div>
      </div>
    </Card>
  );
}

