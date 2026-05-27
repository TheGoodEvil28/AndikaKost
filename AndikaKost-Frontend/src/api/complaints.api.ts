import { api } from "./client";
import type { ApiSuccess, Complaint } from "../types";

export async function listComplaintsAdmin() {
  const res = await api.get<ApiSuccess<Complaint[]>>("/complaints");
  return res.data.data;
}

export async function getComplaint(id: number) {
  const res = await api.get<ApiSuccess<Complaint>>(`/complaints/${id}`);
  return res.data.data;
}

export async function updateComplaintStatus(id: number, status: string) {
  const res = await api.patch<ApiSuccess<Complaint>>(`/complaints/${id}/status`, { status });
  return res.data.data;
}

export async function addAdminResponse(id: number, admin_response: string) {
  const res = await api.post<ApiSuccess<Complaint>>(`/complaints/${id}/response`, { admin_response });
  return res.data.data;
}

export async function listMyComplaints() {
  const res = await api.get<ApiSuccess<Complaint[]>>("/tenant/complaints");
  return res.data.data;
}

export async function submitComplaint(payload: { category: string; description: string; priority: string; photo?: File }) {
  const form = new FormData();
  form.append("category", payload.category);
  form.append("description", payload.description);
  form.append("priority", payload.priority);
  if (payload.photo) form.append("photo", payload.photo);
  const res = await api.post<ApiSuccess<Complaint>>("/complaints", form, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data.data;
}

