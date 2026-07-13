import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Card from "../../components/ui/Card";
import Icon from "../../components/ui/Icon";
import { buttonClassName } from "../../components/ui/buttonStyles";
import { api } from "../../api/client";
import HeroImg from "../../assets/Asset-homepage-untuk-kost.png";
import PublicHeader from "../../components/layout/PublicHeader";

type Overview = { total_rooms: number; available_rooms: number };

const features = [
  {
    icon: "rooms" as const,
    title: "Clear room availability",
    description: "See the rooms that are ready now, with simple pricing and facility details."
  },
  {
    icon: "bookings" as const,
    title: "A guided booking flow",
    description: "Send one request and let the admin confirm availability before your move-in."
  },
  {
    icon: "shield" as const,
    title: "Organized after move-in",
    description: "Bills, payment proof, room details, and complaints stay in one tenant workspace."
  }
];

export default function PublicHomePage() {
  const overview = useQuery({
    queryKey: ["public", "overview"],
    queryFn: async () => (await api.get<{ data: Overview; message: string }>("/public/overview")).data.data
  });

  return (
    <div className="app-page min-h-screen">
      <PublicHeader />

      <main>
        <section className="mx-auto w-full max-w-7xl px-4 pb-7 pt-5 sm:px-6 sm:pt-8 lg:pb-10 lg:pt-10">
          <div className="theme-surface relative overflow-hidden rounded-[1.75rem] border p-5 sm:p-8 lg:p-10">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--brand-soft)] blur-3xl" aria-hidden="true" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
              <div>
                <div className="brand-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.09em]">
                  <Icon name="sparkles" className="h-4 w-4" />
                  Simple living, better managed
                </div>
                <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.08] text-[var(--surface-fg)] sm:text-5xl lg:text-[3.45rem]">
                  Find your room, then manage every step with <span className="brand-heading">confidence.</span>
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                  AndikaKost brings room discovery, booking, payments, and tenant support into one clear journey—without the usual back-and-forth.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link to="/rooms" className={buttonClassName({ className: "min-w-40" })}>
                    Explore rooms
                    <Icon name="arrow-right" className="h-4 w-4" />
                  </Link>
                  <Link to="/login" className={buttonClassName({ variant: "secondary" })}>
                    Resident sign in
                  </Link>
                </div>
                <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-muted-strong">
                  {['Verified availability', 'Admin-reviewed requests', 'Tenant self-service'].map((item) => (
                    <span key={item} className="inline-flex items-center gap-1.5">
                      <Icon name="check" className="h-4 w-4 text-[var(--success-fg)]" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-lg">
                <div className="theme-subtle relative aspect-square overflow-hidden rounded-[1.75rem] border p-7 sm:p-10">
                  <img
                    src={HeroImg}
                    alt="Illustration of an AndikaKost property"
                    className="h-full w-full object-contain drop-shadow-[0_28px_25px_rgba(4,40,86,0.16)]"
                  />
                </div>
                <div className="theme-surface absolute -bottom-3 left-3 right-3 grid grid-cols-2 gap-2 rounded-2xl border p-3 shadow-lg sm:left-6 sm:right-6 sm:p-4">
                  <div>
                    <div className="metric-label">Total rooms</div>
                    <div className="metric-value" aria-live="polite">{overview.isLoading ? "–" : overview.data?.total_rooms ?? "–"}</div>
                  </div>
                  <div className="border-l border-[var(--surface-divider)] pl-3 sm:pl-4">
                    <div className="metric-label">Available now</div>
                    <div className="metric-value text-[var(--success-fg)]" aria-live="polite">
                      {overview.isLoading ? "–" : overview.data?.available_rooms ?? "–"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-12" aria-labelledby="why-andikakost">
          <div className="max-w-2xl">
            <div className="page-kicker">One connected experience</div>
            <h2 id="why-andikakost" className="mt-2 text-3xl font-bold text-[var(--surface-fg)] sm:text-4xl">
              Less uncertainty from search to stay
            </h2>
            <p className="mt-3 text-muted">Every surface is designed around the real lifecycle of a kost resident.</p>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="h-full">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand-primary)]">
                  <Icon name={feature.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-[var(--surface-fg)]">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:pb-16">
          <div className="overflow-hidden rounded-[1.75rem] bg-[var(--action-primary-bg)] px-5 py-8 text-[var(--action-primary-fg)] shadow-[var(--shadow-lg)] sm:px-8 lg:flex lg:items-center lg:justify-between lg:gap-8 lg:px-10">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-[0.12em] opacity-70">Ready when you are</div>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Your next room may already be available.</h2>
              <p className="mt-2 max-w-2xl opacity-80">Browse live availability and send a no-obligation booking request in a few minutes.</p>
            </div>
            <Link
              to="/rooms"
              className={buttonClassName({ variant: "secondary", className: "mt-5 shrink-0 border-white/20 bg-[#ffffff] text-[#063b78] hover:bg-[#f2f6fb] lg:mt-0" })}
            >
              View available rooms
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--surface-border)] px-4 py-6 text-center text-sm text-muted sm:px-6">
        © {new Date().getFullYear()} AndikaKost · Kost Management System
      </footer>
    </div>
  );
}
