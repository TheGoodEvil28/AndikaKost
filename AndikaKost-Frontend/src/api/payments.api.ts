import { api } from "./client";
import type { ApiSuccess, Payment } from "../types";

export async function listPaymentsAdmin() {
  const res = await api.get<ApiSuccess<Payment[]>>("/payments");
  return res.data.data;
}

export async function getPayment(id: number) {
  const res = await api.get<ApiSuccess<Payment>>(`/payments/${id}`);
  return res.data.data;
}

export async function createBill(payload: any) {
  const res = await api.post<ApiSuccess<Payment>>("/payments", payload);
  return res.data.data;
}

export async function approvePayment(id: number) {
  const res = await api.patch<ApiSuccess<Payment>>(`/payments/${id}/approve`);
  return res.data.data;
}

export async function rejectPayment(id: number, adminNote?: string) {
  const res = await api.patch<ApiSuccess<Payment>>(`/payments/${id}/reject`, { admin_note: adminNote ?? null });
  return res.data.data;
}

export async function listMyPayments() {
  const res = await api.get<ApiSuccess<Payment[]>>("/tenant/payments");
  return res.data.data;
}

export async function uploadPaymentProof(paymentId: number, file: File) {
  const form = new FormData();
  form.append("file", file);
  const res = await api.post<ApiSuccess<Payment>>(`/payments/${paymentId}/upload-proof`, form, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data.data;
}

