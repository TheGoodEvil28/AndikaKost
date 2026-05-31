import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import PublicHomePage from "./pages/public/PublicHomePage";
import PublicRoomsPage from "./pages/public/PublicRoomsPage";
import AdminLayout from "./components/layout/AdminLayout";
import TenantLayout from "./components/layout/TenantLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import AdminDashboardPage from "./pages/admin/DashboardPage";
import BookingsPage from "./pages/admin/BookingsPage";
import BookingDetailPage from "./pages/admin/BookingDetailPage";
import RoomsPage from "./pages/admin/RoomsPage";
import RoomDetailPage from "./pages/admin/RoomDetailPage";
import TenantsPage from "./pages/admin/TenantsPage";
import TenantDetailPage from "./pages/admin/TenantDetailPage";
import PaymentsPage from "./pages/admin/PaymentsPage";
import PaymentDetailPage from "./pages/admin/PaymentDetailPage";
import ComplaintsPage from "./pages/admin/ComplaintsPage";
import ComplaintDetailPage from "./pages/admin/ComplaintDetailPage";
import TenantDashboardPage from "./pages/tenant/TenantDashboardPage";
import MyRoomPage from "./pages/tenant/MyRoomPage";
import MyBillsPage from "./pages/tenant/MyBillsPage";
import UploadPaymentProofPage from "./pages/tenant/UploadPaymentProofPage";
import MyComplaintsPage from "./pages/tenant/MyComplaintsPage";
import SubmitComplaintPage from "./pages/tenant/SubmitComplaintPage";

type Theme = "light" | "dark";

const THEME_KEY = "andika_theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem(THEME_KEY);
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  }

  return (
    <>
      <div className="theme-surface fixed right-4 top-4 z-50 rounded-full border px-3 py-2 text-xs font-semibold shadow-lg">
        <button type="button" onClick={toggleTheme} className="flex items-center gap-2">
          <span>{theme === "light" ? "Light" : "Dark"} mode</span>
          <span className="rounded-full border px-2 py-1 text-[10px] leading-none">Toggle</span>
        </button>
      </div>

      <Routes>
        <Route path="/" element={<PublicHomePage />} />
        <Route path="/rooms" element={<PublicRoomsPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="bookings/:id" element={<BookingDetailPage />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="rooms/:id" element={<RoomDetailPage />} />
          <Route path="tenants" element={<TenantsPage />} />
          <Route path="tenants/:id" element={<TenantDetailPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="payments/:id" element={<PaymentDetailPage />} />
          <Route path="complaints" element={<ComplaintsPage />} />
          <Route path="complaints/:id" element={<ComplaintDetailPage />} />
        </Route>

        <Route
          path="/tenant"
          element={
            <ProtectedRoute role="tenant">
              <TenantLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<TenantDashboardPage />} />
          <Route path="room" element={<MyRoomPage />} />
          <Route path="bills" element={<MyBillsPage />} />
          <Route path="bills/:id/upload" element={<UploadPaymentProofPage />} />
          <Route path="complaints" element={<MyComplaintsPage />} />
          <Route path="complaints/new" element={<SubmitComplaintPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
