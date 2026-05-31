import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function TenantLayout() {
  const items = [
    { to: "/tenant/dashboard", label: "Dashboard" },
    { to: "/tenant/room", label: "My Room" },
    { to: "/tenant/bills", label: "My Bills" },
    { to: "/tenant/complaints", label: "My Complaints" },
    { to: "/tenant/complaints/new", label: "New Complaint" }
  ];

  return (
    <div className="app-page tenant-surface min-h-screen">
      <Navbar title="Tenant" />
      <div className="mx-auto flex w-full max-w-7xl flex-col md:flex-row">
        <Sidebar items={items} />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
