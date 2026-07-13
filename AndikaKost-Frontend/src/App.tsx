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

export default function App() {
  return (
    <>
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
          <Route index element={<Navigate to="dashboard" replace />} />
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
          <Route index element={<Navigate to="dashboard" replace />} />
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
