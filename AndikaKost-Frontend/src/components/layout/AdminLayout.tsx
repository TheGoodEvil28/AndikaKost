import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  const items = [
    { to: "/admin/dashboard", label: "Dashboard", icon: "dashboard" as const, end: true },
    { to: "/admin/bookings", label: "Bookings", icon: "bookings" as const },
    { to: "/admin/rooms", label: "Rooms", icon: "rooms" as const },
    { to: "/admin/tenants", label: "Tenants", icon: "tenants" as const },
    { to: "/admin/payments", label: "Payments", icon: "payments" as const },
    { to: "/admin/complaints", label: "Complaints", icon: "complaints" as const }
  ];

  return (
    <div className="app-page admin-surface min-h-screen">
      <Navbar title="Admin" />
      <div className="mx-auto flex w-full max-w-[92rem] flex-col lg:flex-row">
        <Sidebar items={items} />
        <main className="min-w-0 flex-1 p-3.5 sm:p-5 lg:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
