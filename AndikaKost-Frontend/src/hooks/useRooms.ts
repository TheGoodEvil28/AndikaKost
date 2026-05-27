import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRoom, deleteRoom, getRoom, listRooms, updateRoom } from "../api/rooms.api";

export function useRooms() {
  return useQuery({ queryKey: ["rooms"], queryFn: listRooms });
}

export function useRoom(id: number) {
  return useQuery({ queryKey: ["rooms", id], queryFn: () => getRoom(id), enabled: Number.isFinite(id) });
}

export function useRoomMutations() {
  const qc = useQueryClient();
  return {
    create: useMutation({
      mutationFn: createRoom,
      onSuccess: async () => {
        await qc.invalidateQueries({ queryKey: ["rooms"] });
      }
    }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: number; payload: any }) => updateRoom(id, payload),
      onSuccess: async (_data, vars) => {
        await qc.invalidateQueries({ queryKey: ["rooms"] });
        await qc.invalidateQueries({ queryKey: ["rooms", vars.id] });
      }
    }),
    remove: useMutation({
      mutationFn: deleteRoom,
      onSuccess: async () => {
        await qc.invalidateQueries({ queryKey: ["rooms"] });
      }
    })
  };
}

