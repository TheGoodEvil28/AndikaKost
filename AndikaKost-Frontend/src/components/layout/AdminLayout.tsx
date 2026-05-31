import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  const items = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/bookings", label: "Bookings" },
    { to: "/admin/rooms", label: "Rooms" },
    { to: "/admin/tenants", label: "Tenants" },
    { to: "/admin/payments", label: "Payments" },
    { to: "/admin/complaints", label: "Complaints" }
  ];

  return (
    <div className="app-page admin-surface min-h-screen">
      <Navbar title="Admin" />
      <div className="mx-auto flex w-full max-w-7xl flex-col md:flex-row">
        <Sidebar items={items} />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
