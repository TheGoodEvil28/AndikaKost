import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assignRoom, createTenant, getTenant, listTenants, updateTenant } from "../api/tenants.api";

export function useTenants() {
  return useQuery({ queryKey: ["tenants"], queryFn: listTenants });
}

export function useTenant(id: number) {
  return useQuery({ queryKey: ["tenants", id], queryFn: () => getTenant(id), enabled: Number.isFinite(id) });
}

export function useTenantMutations() {
  const qc = useQueryClient();
  return {
    create: useMutation({
      mutationFn: createTenant,
      onSuccess: async () => {
        await qc.invalidateQueries({ queryKey: ["tenants"] });
      }
    }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: number; payload: any }) => updateTenant(id, payload),
      onSuccess: async (_data, vars) => {
        await qc.invalidateQueries({ queryKey: ["tenants"] });
        await qc.invalidateQueries({ queryKey: ["tenants", vars.id] });
      }
    }),
    assignRoom: useMutation({
      mutationFn: ({ tenantId, roomId }: { tenantId: number; roomId: number | null }) => assignRoom(tenantId, roomId),
      onSuccess: async (_data, vars) => {
        await qc.invalidateQueries({ queryKey: ["tenants"] });
        await qc.invalidateQueries({ queryKey: ["tenants", vars.tenantId] });
        await qc.invalidateQueries({ queryKey: ["rooms"] });
      }
    })
  };
}

