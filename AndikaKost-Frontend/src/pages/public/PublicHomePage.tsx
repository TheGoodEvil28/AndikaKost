import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { api } from "../../api/client";
import HeroImg from "../../assets/Asset-homepage-untuk-kost.png";
import PublicHeader from "../../components/layout/PublicHeader";

type Overview = { total_rooms: number; available_rooms: number };

export default function PublicHomePage() {
  const { data } = useQuery({
    queryKey: ["public", "overview"],
    queryFn: async () => (await api.get<{ data: Overview; message: string }>("/public/overview")).data.data
  });

  return (
    <div className="app-page min-h-screen">
      <PublicHeader />

      <main className="mx-auto grid max-w-7xl gap-6 p-4 md:grid-cols-12 md:gap-8 md:p-8">
        <Card className="md:col-span-7">
          <div className="inline-flex rounded-full brand-chip px-3 py-1 text-sm font-semibold">AndikaKost Living</div>
          <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
            Modern living management with a fast booking-to-tenant journey
          </h1>
          <p className="mt-3 text-ui-base text-muted">
            Explore available rooms, submit your request in minutes, and move smoothly into an organized tenant system.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/rooms">
              <Button>See available rooms</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary">Admin/Tenant login</Button>
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 md:max-w-md">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
              <div className="text-sm text-muted">Total rooms</div>
              <div className="mt-1 text-3xl font-extrabold text-slate-900">{data?.total_rooms ?? "-"}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
              <div className="text-sm text-muted">Available now</div>
              <div className="mt-1 text-3xl font-extrabold text-slate-900">{data?.available_rooms ?? "-"}</div>
            </div>
          </div>
        </Card>

        <Card title="Property Overview" className="md:col-span-5">
          <img src={HeroImg} alt="Kost overview" className="w-full rounded-2xl border border-slate-200 object-cover" />
          <p className="mt-4 text-sm text-muted">
            Every booking request is reviewed by admin to avoid double-booking and keep room occupancy status accurate in real time.
          </p>
        </Card>
      </main>
    </div>
  );
}
