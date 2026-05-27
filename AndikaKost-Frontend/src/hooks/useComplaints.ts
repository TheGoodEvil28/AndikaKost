import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addAdminResponse,
  getComplaint,
  listComplaintsAdmin,
  listMyComplaints,
  submitComplaint,
  updateComplaintStatus
} from "../api/complaints.api";

export function useComplaintsAdmin() {
  return useQuery({ queryKey: ["complaints", "admin"], queryFn: listComplaintsAdmin });
}

export function useMyComplaints() {
  return useQuery({ queryKey: ["complaints", "me"], queryFn: listMyComplaints });
}

export function useComplaint(id: number) {
  return useQuery({ queryKey: ["complaints", id], queryFn: () => getComplaint(id), enabled: Number.isFinite(id) });
}

export function useComplaintMutations() {
  const qc = useQueryClient();
  return {
    updateStatus: useMutation({
      mutationFn: ({ id, status }: { id: number; status: string }) => updateComplaintStatus(id, status),
      onSuccess: async (_data, vars) => {
        await qc.invalidateQueries({ queryKey: ["complaints", "admin"] });
        await qc.invalidateQueries({ queryKey: ["complaints", vars.id] });
      }
    }),
    respond: useMutation({
      mutationFn: ({ id, response }: { id: number; response: string }) => addAdminResponse(id, response),
      onSuccess: async (_data, vars) => {
        await qc.invalidateQueries({ queryKey: ["complaints", "admin"] });
        await qc.invalidateQueries({ queryKey: ["complaints", vars.id] });
      }
    }),
    submit: useMutation({
      mutationFn: submitComplaint,
      onSuccess: async () => {
        await qc.invalidateQueries({ queryKey: ["complaints", "me"] });
      }
    })
  };
}

