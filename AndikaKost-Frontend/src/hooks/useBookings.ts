import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBooking, listBookings, updateBookingStatus } from "../api/bookings.api";

export function useBookings() {
  return useQuery({ queryKey: ["bookings"], queryFn: listBookings });
}

export function useBooking(id: number) {
  return useQuery({ queryKey: ["bookings", id], queryFn: () => getBooking(id), enabled: Number.isFinite(id) });
}

export function useBookingMutations() {
  const qc = useQueryClient();
  return {
    updateStatus: useMutation({
      mutationFn: ({ id, status }: { id: number; status: string }) => updateBookingStatus(id, status),
      onSuccess: async (_data, vars) => {
        await qc.invalidateQueries({ queryKey: ["bookings"] });
        await qc.invalidateQueries({ queryKey: ["bookings", vars.id] });
        await qc.invalidateQueries({ queryKey: ["dashboard", "admin"] });
      }
    })
  };
}

