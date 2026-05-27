import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { api } from "../../api/client";
import HeroImg from "../../assets/Asset-homepage-untuk-kost.png";

type Overview = { total_rooms: number; available_rooms: number };

export default function PublicHomePage() {
  const { data } = useQuery({
    queryKey: ["public", "overview"],
    queryFn: async () => (await api.get<{ data: Overview; message: string }>("/public/overview")).data.data
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="text-ui-lg font-semibold">AndikaKost</div>
          <div className="flex gap-2">
            <Link to="/rooms" className="rounded-lg px-3 py-2 font-medium hover:bg-slate-100">
              Rooms
            </Link>
            <Link to="/login">
              <Button variant="secondary">Login</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-4 p-4 md:grid-cols-2 md:items-start">
        <Card title="Welcome">
          <p className="text-slate-700">
            View available rooms, request a booking, and we’ll help you become a tenant after payment is verified.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/rooms">
              <Button>See available rooms</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary">Admin/Tenant login</Button>
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-sm text-slate-600">Total rooms</div>
              <div className="mt-1 text-3xl font-bold">{data?.total_rooms ?? "-"}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-sm text-slate-600">Available now</div>
              <div className="mt-1 text-3xl font-bold">{data?.available_rooms ?? "-"}</div>
            </div>
          </div>
        </Card>

        <Card title="Overview">
          <img src={HeroImg} alt="Kost overview" className="w-full rounded-xl border border-slate-200" />
          <p className="mt-3 text-sm text-slate-600">
            Booking requests are reviewed by admin to prevent double-booking and to verify payment details.
          </p>
        </Card>
      </main>
    </div>
  );
}

