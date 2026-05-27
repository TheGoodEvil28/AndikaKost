import { api } from "./client";
import type { ApiSuccess, Room } from "../types";

export async function listRooms() {
  const res = await api.get<ApiSuccess<Room[]>>("/rooms");
  return res.data.data;
}

export async function getRoom(id: number) {
  const res = await api.get<ApiSuccess<Room>>(`/rooms/${id}`);
  return res.data.data;
}

export async function createRoom(payload: Partial<Room>) {
  const res = await api.post<ApiSuccess<Room>>("/rooms", payload);
  return res.data.data;
}

export async function updateRoom(id: number, payload: Partial<Room>) {
  const res = await api.put<ApiSuccess<Room>>(`/rooms/${id}`, payload);
  return res.data.data;
}

export async function deleteRoom(id: number) {
  const res = await api.delete<ApiSuccess<{ id: number }>>(`/rooms/${id}`);
  return res.data.data;
}

