import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";
import { api } from "../../api/client";
import type { Room } from "../../types";
import { formatIdr } from "../../utils/format";
import PublicHeader from "../../components/layout/PublicHeader";

type BookingPayload = { room_id: number; full_name: string; email: string; phone?: string; message?: string };

export default function PublicRoomsPage() {
  const rooms = useQuery({
    queryKey: ["public", "rooms"],
    queryFn: async () => (await api.get<{ data: Room[]; message: string }>("/public/rooms")).data.data
  });

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", message: "" });

  const book = useMutation({
    mutationFn: async (payload: BookingPayload) => (await api.post("/public/bookings", payload)).data,
    onSuccess: () => {
      setOpen(false);
      setForm({ full_name: "", email: "", phone: "", message: "" });
      alert("Booking request sent. Admin will contact you to confirm and guide payment.");
    }
  });

  const list = useMemo(() => rooms.data ?? [], [rooms.data]);

  return (
    <div className="app-page min-h-screen">
      <PublicHeader />

      <main className="mx-auto grid max-w-7xl gap-6 p-4 md:p-8">
        <Card>
          
          <h1 className="text-3xl font-bold text-slate-900">Available Rooms</h1>
          <p className="mt-2 text-muted">Choose a room and submit your booking request. We will confirm details and payment with you.</p>
        </Card>

        {rooms.isLoading ? (
          <Card title="Loading">Loading…</Card>
        ) : rooms.error ? (
          <Card title="Error">Failed to load rooms.</Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {list.map((r) => (
              <Card key={r.id} title={r.room_number}>
                <div className="grid gap-2 text-ui-base">
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Price</span>
                    <b>{formatIdr(r.price_idr)}</b>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Type</span>
                    <b>{r.room_type ?? "-"}</b>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Floor</span>
                    <b>{r.floor ?? "-"}</b>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Status</span>
                    <Badge tone="ok">available</Badge>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={() => {
                        setSelectedRoom(r);
                        setOpen(true);
                      }}
                    >
                      Request booking
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            {list.length === 0 ? (
              <Card title="No rooms available">
                <div className="text-muted">No rooms are available right now. Please check again later.</div>
              </Card>
            ) : null}
          </div>
        )}
      </main>

      <Modal
        title={selectedRoom ? `Request booking: ${selectedRoom.room_number}` : "Request booking"}
        open={open}
        onClose={() => setOpen(false)}
      >
        <div className="grid gap-3">
          <Input label="Full name" value={form.full_name} onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          <Input label="Phone (optional)" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
          <label className="block">
            <div className="mb-1.5 text-ui-base font-semibold text-[var(--surface-fg)]">Message (optional)</div>
            <textarea
              className="min-h-11 w-full rounded-xl border border-slate-300/80 bg-white/85 px-3.5 py-2.5 text-ui-base text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
              rows={4}
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              placeholder="Preferred move-in date, questions, etc."
            />
          </label>
          <Button
            onClick={() => {
              if (!selectedRoom) return;
              book.mutate({
                room_id: selectedRoom.id,
                full_name: form.full_name,
                email: form.email,
                phone: form.phone || undefined,
                message: form.message || undefined
              });
            }}
            disabled={!selectedRoom || !form.full_name.trim() || !form.email.trim() || book.isPending}
          >
            Send request
          </Button>
        </div>
      </Modal>
    </div>
  );
}
