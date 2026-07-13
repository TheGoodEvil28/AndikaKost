import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
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
    <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="grid min-w-0 gap-4">
        <legend className="text-ui-base font-extrabold text-[var(--surface-fg)]">Tenant details</legend>
        <p className="mt-1 text-sm text-muted">Record the tenant's contact and residency information.</p>
        <Input label="Full name" {...register("full_name", { required: true })} />
        {mode === "create" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Email" type="email" {...register("email", { required: true })} />
            <Input label="Password" type="password" {...register("password", { required: true })} />
          </div>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Phone" {...register("phone")} />
          <Input label="Identity number" {...register("identity_number")} />
        </div>
        <Input label="Move-in date" type="date" {...register("move_in_date", { required: true })} />
        <Textarea label="Address" rows={3} {...register("address")} />
      </fieldset>

      <fieldset className="grid min-w-0 gap-4 border-t border-[var(--surface-divider)] pt-5">
        <legend className="text-ui-base font-extrabold text-[var(--surface-fg)]">Emergency contact</legend>
        <p className="mt-1 text-sm text-muted">Add someone the property team can contact when urgent help is needed.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Contact name" {...register("emergency_contact_name")} />
          <Input label="Contact phone" {...register("emergency_contact_phone")} />
        </div>
        <Textarea label="Notes" rows={3} {...register("notes")} hint="Optional internal notes about this tenant." />
      </fieldset>

      <div className="flex border-t border-[var(--surface-divider)] pt-4">
        <Button type="submit" loading={submitting} className="w-full sm:w-auto sm:min-w-40">
          {submitting ? "Saving tenant..." : mode === "create" ? "Add tenant" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
