import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import type { Room } from "../../types";

type FormValues = {
  room_number: string;
  room_type?: string;
  floor?: string;
  price_idr: number;
  facilities?: string;
  status: string;
  description?: string;
};

export default function RoomForm({
  initial,
  onSubmit,
  submitting
}: {
  initial?: Partial<Room>;
  onSubmit: (values: FormValues) => void;
  submitting?: boolean;
}) {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      room_number: initial?.room_number ?? "",
      room_type: initial?.room_type ?? "",
      floor: initial?.floor ?? "",
      price_idr: initial?.price_idr ?? 0,
      facilities: initial?.facilities ?? "",
      status: initial?.status ?? "available",
      description: initial?.description ?? ""
    }
  });

  return (
    <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="grid min-w-0 gap-4">
        <legend className="text-ui-base font-extrabold text-[var(--surface-fg)]">Room details</legend>
        <p className="mt-1 text-sm text-muted">Keep the room identity and availability accurate for listings and assignments.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Room number" {...register("room_number", { required: true })} error={formState.errors.room_number?.message} />
          <Input label="Room type" {...register("room_type")} />
          <Input label="Floor" {...register("floor")} />
          <Select label="Status" {...register("status")}>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </Select>
        </div>
      </fieldset>

      <fieldset className="grid min-w-0 gap-4 border-t border-[var(--surface-divider)] pt-5">
        <legend className="text-ui-base font-extrabold text-[var(--surface-fg)]">Pricing and amenities</legend>
        <p className="mt-1 text-sm text-muted">Add the monthly rate and the details tenants need when comparing rooms.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Price (IDR)" type="number" {...register("price_idr", { valueAsNumber: true, min: 1 })} />
          <Input label="Facilities" {...register("facilities")} placeholder="e.g. AC, WiFi, Bathroom" />
        </div>
        <Textarea label="Description" rows={4} {...register("description")} />
      </fieldset>

      <div className="flex border-t border-[var(--surface-divider)] pt-4">
        <Button type="submit" loading={submitting} className="w-full sm:w-auto sm:min-w-36">
          {submitting ? "Saving room..." : initial ? "Save changes" : "Add room"}
        </Button>
      </div>
    </form>
  );
}
