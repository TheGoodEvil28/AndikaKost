import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Textarea from "../../components/ui/Textarea";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";
import Icon from "../../components/ui/Icon";
import PageHeader from "../../components/ui/PageHeader";
import StatePanel from "../../components/ui/StatePanel";
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
  const [query, setQuery] = useState("");
  const [roomType, setRoomType] = useState("all");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", message: "" });

  const book = useMutation({
    mutationFn: async (payload: BookingPayload) => (await api.post("/public/bookings", payload)).data,
    onSuccess: () => {
      setOpen(false);
      setSelectedRoom(null);
      setForm({ full_name: "", email: "", phone: "", message: "" });
      setFeedback("Your booking request has been sent. The AndikaKost team will contact you to confirm the next step.");
    }
  });

  const roomTypes = useMemo(
    () => [...new Set((rooms.data ?? []).map((room) => room.room_type).filter((value): value is string => Boolean(value)))].sort(),
    [rooms.data]
  );

  const list = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return (rooms.data ?? []).filter((room) => {
      const matchesType = roomType === "all" || room.room_type === roomType;
      const searchable = [room.room_number, room.room_type, room.floor, room.facilities].filter(Boolean).join(" ").toLowerCase();
      return matchesType && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [query, roomType, rooms.data]);

  const closeModal = () => {
    setOpen(false);
    setSelectedRoom(null);
    book.reset();
  };

  return (
    <div className="app-page min-h-screen">
      <PublicHeader />

      <main className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-5 sm:px-6 sm:py-8 lg:gap-6">
        <PageHeader
          eyebrow="Live availability"
          title="Find a room that fits your routine"
          description="Compare the rooms that are ready now, then send one simple request. Availability is confirmed by the admin before move-in."
        />

        {feedback ? (
          <div className="flex items-start gap-3 rounded-2xl border border-[var(--success-border)] bg-[var(--success-bg)] p-4 text-[var(--success-fg)]" role="status">
            <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="flex-1 text-sm font-semibold">{feedback}</div>
            <button type="button" onClick={() => setFeedback(null)} className="rounded-lg p-1" aria-label="Dismiss message">
              <Icon name="x" className="h-4 w-4" />
            </button>
          </div>
        ) : null}

        <Card padding="sm">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_15rem]">
            <div className="relative">
              <Icon name="search" className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-muted" />
              <Input
                aria-label="Search rooms"
                placeholder="Search room, floor, or facility"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="pl-10"
              />
            </div>
            <Select aria-label="Filter by room type" value={roomType} onChange={(event) => setRoomType(event.target.value)}>
              <option value="all">All room types</option>
              {roomTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
          </div>
        </Card>

        {rooms.isLoading ? (
          <StatePanel title="Finding available rooms" description="We are checking the latest room availability." icon="search" />
        ) : rooms.error ? (
          <StatePanel
            title="Rooms could not be loaded"
            description="Please check your connection and try again."
            tone="danger"
            icon="rooms"
            action={<Button variant="secondary" onClick={() => rooms.refetch()}>Try again</Button>}
          />
        ) : list.length === 0 ? (
          <StatePanel
            title={rooms.data?.length ? "No rooms match these filters" : "No rooms are available right now"}
            description={rooms.data?.length ? "Try a different search or room type." : "Availability changes regularly, so please check again soon."}
            icon="rooms"
            action={rooms.data?.length ? <Button variant="secondary" onClick={() => { setQuery(""); setRoomType("all"); }}>Clear filters</Button> : undefined}
          />
        ) : (
          <section aria-label={`${list.length} available rooms`}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-[var(--surface-fg)]">{list.length} room{list.length === 1 ? "" : "s"} available</h2>
              <span className="text-sm font-semibold text-muted">Admin-confirmed booking</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {list.map((room) => (
                <Card key={room.id} className="flex h-full flex-col" padding="md">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-extrabold uppercase tracking-[0.1em] text-muted">Room</div>
                      <h3 className="mt-1 text-2xl font-bold brand-heading">{room.room_number}</h3>
                    </div>
                    <Badge>{room.status || "available"}</Badge>
                  </div>
                  <div className="mt-5 text-2xl font-bold text-[var(--surface-fg)]">{formatIdr(room.price_idr)}</div>
                  <div className="text-sm text-muted">per month</div>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <div className="detail-item">
                      <div className="detail-label">Type</div>
                      <div className="detail-value">{room.room_type ?? "Standard"}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Floor</div>
                      <div className="detail-value">{room.floor ?? "–"}</div>
                    </div>
                  </div>
                  {room.facilities ? <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted">{room.facilities}</p> : null}
                  <Button
                    className="mt-5 w-full"
                    onClick={() => {
                      setSelectedRoom(room);
                      setOpen(true);
                      book.reset();
                    }}
                  >
                    Request this room
                    <Icon name="arrow-right" className="h-4 w-4" />
                  </Button>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>

      <Modal title={selectedRoom ? `Request room ${selectedRoom.room_number}` : "Request a room"} open={open} onClose={closeModal}>
        {selectedRoom ? (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-subtle)] p-3">
            <div>
              <div className="text-sm font-bold text-[var(--surface-fg)]">{selectedRoom.room_number}</div>
              <div className="text-sm text-muted">{formatIdr(selectedRoom.price_idr)} / month</div>
            </div>
            <Badge>{selectedRoom.status || "available"}</Badge>
          </div>
        ) : null}
        <div className="grid gap-3">
          <Input label="Full name" autoComplete="name" value={form.full_name} onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Email" type="email" autoComplete="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
            <Input label="Phone (optional)" type="tel" autoComplete="tel" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
          </div>
          <Textarea
            label="Message (optional)"
            rows={4}
            value={form.message}
            onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
            placeholder="Preferred move-in date or questions for the admin"
          />
          {book.error ? (
            <div className="rounded-xl border border-[var(--danger-border)] bg-[var(--danger-bg)] p-3 text-sm font-semibold text-[var(--danger-fg)]" role="alert">
              The request could not be sent. Please review your details and try again.
            </div>
          ) : null}
          <Button
            loading={book.isPending}
            onClick={() => {
              if (!selectedRoom) return;
              book.mutate({
                room_id: selectedRoom.id,
                full_name: form.full_name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim() || undefined,
                message: form.message.trim() || undefined
              });
            }}
            disabled={!selectedRoom || !form.full_name.trim() || !form.email.trim()}
          >
            Send booking request
          </Button>
          <p className="text-center text-xs leading-5 text-muted">Submitting a request does not reserve the room until an admin confirms it.</p>
        </div>
      </Modal>
    </div>
  );
}
