import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import Input from "../ui/Input";
import type { Tenant } from "../../types";

type Values = {
  full_name: string;
  email?: string;
  phone?: string;
  password?: string;
  identity_number?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  move_in_date: string;
  notes?: string;
};

export default function TenantForm({
  mode,
  initial,
  onSubmit,
  submitting
}: {
  mode: "create" | "update";
  initial?: Partial<Tenant>;
  onSubmit: (values: Values) => void;
  submitting?: boolean;
}) {
  const { register, handleSubmit } = useForm<Values>({
    defaultValues:
      mode === "create"
        ? { full_name: "", email: "", phone: "", password: "", move_in_date: new Date().toISOString().slice(0, 10), notes: "" }
        : {
            full_name: initial?.full_name ?? "",
            phone: initial?.phone ?? "",
            identity_number: initial?.identity_number ?? "",
            address: initial?.address ?? "",
            emergency_contact_name: initial?.emergency_contact_name ?? "",
            emergency_contact_phone: initial?.emergency_contact_phone ?? "",
            move_in_date: (initial?.move_in_date ?? new Date().toISOString().slice(0, 10)) as string,
            notes: initial?.notes ?? ""
          }
  });

  return (
    <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
      <Input label="Full name" {...register("full_name", { required: true })} />
      {mode === "create" ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Input label="Email" type="email" {...register("email", { required: true })} />
          <Input label="Password" type="password" {...register("password", { required: true })} />
        </div>
      ) : null}
      <Input label="Phone" {...register("phone")} />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Input label="Move-in date" type="date" {...register("move_in_date", { required: true })} />
        <Input label="Identity number" {...register("identity_number")} />
      </div>
      <Input label="Address" {...register("address")} />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Input label="Emergency contact name" {...register("emergency_contact_name")} />
        <Input label="Emergency contact phone" {...register("emergency_contact_phone")} />
      </div>
      <Input label="Notes" {...register("notes")} />
      <Button type="submit" disabled={submitting}>
        Save
      </Button>
    </form>
  );
}

