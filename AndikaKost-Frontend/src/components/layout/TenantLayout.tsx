import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function TenantLayout() {
  const items = [
    { to: "/tenant/dashboard", label: "Dashboard", icon: "dashboard" as const, end: true },
    { to: "/tenant/room", label: "My Room", icon: "rooms" as const, end: true },
    { to: "/tenant/bills", label: "My Bills", icon: "payments" as const },
    { to: "/tenant/complaints", label: "Complaints", icon: "complaints" as const, end: true },
    { to: "/tenant/complaints/new", label: "New complaint", icon: "plus" as const, end: true }
  ];

  return (
    <div className="app-page tenant-surface min-h-screen">
      <Navbar title="Tenant" />
      <div className="mx-auto flex w-full max-w-[92rem] flex-col lg:flex-row">
        <Sidebar items={items} />
        <main className="min-w-0 flex-1 p-3.5 sm:p-5 lg:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
