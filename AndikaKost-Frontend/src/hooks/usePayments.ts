import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approvePayment,
  createBill,
  getPayment,
  listMyPayments,
  listPaymentsAdmin,
  rejectPayment,
  uploadPaymentProof
} from "../api/payments.api";

export function usePaymentsAdmin() {
  return useQuery({ queryKey: ["payments", "admin"], queryFn: listPaymentsAdmin });
}

export function useMyPayments() {
  return useQuery({ queryKey: ["payments", "me"], queryFn: listMyPayments });
}

export function usePayment(id: number) {
  return useQuery({ queryKey: ["payments", id], queryFn: () => getPayment(id), enabled: Number.isFinite(id) });
}

export function usePaymentMutations() {
  const qc = useQueryClient();
  return {
    createBill: useMutation({
      mutationFn: createBill,
      onSuccess: async () => {
        await qc.invalidateQueries({ queryKey: ["payments", "admin"] });
      }
    }),
    approve: useMutation({
      mutationFn: approvePayment,
      onSuccess: async (_data, id) => {
        await qc.invalidateQueries({ queryKey: ["payments", "admin"] });
        await qc.invalidateQueries({ queryKey: ["payments", id] });
      }
    }),
    reject: useMutation({
      mutationFn: ({ id, note }: { id: number; note?: string }) => rejectPayment(id, note),
      onSuccess: async (_data, vars) => {
        await qc.invalidateQueries({ queryKey: ["payments", "admin"] });
        await qc.invalidateQueries({ queryKey: ["payments", vars.id] });
      }
    }),
    uploadProof: useMutation({
      mutationFn: ({ paymentId, file }: { paymentId: number; file: File }) => uploadPaymentProof(paymentId, file),
      onSuccess: async (_data, vars) => {
        await qc.invalidateQueries({ queryKey: ["payments", "me"] });
        await qc.invalidateQueries({ queryKey: ["payments", vars.paymentId] });
      }
    })
  };
}

