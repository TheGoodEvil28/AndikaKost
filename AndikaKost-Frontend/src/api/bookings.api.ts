import { api } from "./client";
import type { ApiSuccess } from "../types";

export type Booking = {
  id: number;
  room_id: number;
  full_name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export async function listBookings() {
  const res = await api.get<ApiSuccess<Booking[]>>("/bookings");
  return res.data.data;
}

export async function getBooking(id: number) {
  const res = await api.get<ApiSuccess<Booking>>(`/bookings/${id}`);
  return res.data.data;
}

export async function updateBookingStatus(id: number, status: string) {
  const res = await api.patch<ApiSuccess<Booking>>(`/bookings/${id}/status`, { status });
  return res.data.data;
}

