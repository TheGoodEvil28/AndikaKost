import { api } from "./client";
import type { ApiSuccess, Tenant } from "../types";

export async function listTenants() {
  const res = await api.get<ApiSuccess<Tenant[]>>("/tenants");
  return res.data.data;
}

export async function getTenant(id: number) {
  const res = await api.get<ApiSuccess<Tenant>>(`/tenants/${id}`);
  return res.data.data;
}

export async function createTenant(payload: any) {
  const res = await api.post<ApiSuccess<Tenant>>("/tenants", payload);
  return res.data.data;
}

export async function updateTenant(id: number, payload: any) {
  const res = await api.put<ApiSuccess<Tenant>>(`/tenants/${id}`, payload);
  return res.data.data;
}

export async function assignRoom(tenantId: number, roomId: number | null) {
  const res = await api.post<ApiSuccess<Tenant>>(`/tenants/${tenantId}/assign-room`, { room_id: roomId });
  return res.data.data;
}

