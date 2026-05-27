import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
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
    <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
      <Input label="Room number" {...register("room_number", { required: true })} error={formState.errors.room_number?.message} />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Input label="Room type" {...register("room_type")} />
        <Input label="Floor" {...register("floor")} />
      </div>
      <Input label="Price (IDR)" type="number" {...register("price_idr", { valueAsNumber: true, min: 1 })} />
      <Input label="Facilities" {...register("facilities")} placeholder="e.g. AC, WiFi, Bathroom" />
      <Select label="Status" {...register("status")}>
        <option value="available">Available</option>
        <option value="occupied">Occupied</option>
        <option value="maintenance">Maintenance</option>
        <option value="inactive">Inactive</option>
      </Select>
      <Input label="Description" {...register("description")} />
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          Save
        </Button>
      </div>
    </form>
  );
}

