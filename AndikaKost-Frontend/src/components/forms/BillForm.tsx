import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import Input from "../ui/Input";

type Values = {
  tenant_id: number;
  billing_month: string;
  amount_idr: number;
  due_date: string;
};

export default function BillForm({
  onSubmit,
  submitting
}: {
  onSubmit: (values: Values) => void;
  submitting?: boolean;
}) {
  const { register, handleSubmit } = useForm<Values>({
    defaultValues: {
      tenant_id: 0,
      billing_month: new Date().toISOString().slice(0, 7),
      amount_idr: 0,
      due_date: new Date().toISOString().slice(0, 10)
    }
  });
  return (
    <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="grid min-w-0 gap-4">
        <legend className="text-ui-base font-extrabold text-[var(--surface-fg)]">Billing details</legend>
        <p className="mt-1 text-sm text-muted">Set the billing period, amount, and payment deadline for this tenant.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Tenant ID"
            type="number"
            {...register("tenant_id", { valueAsNumber: true, min: 1 })}
            hint="Use the ID shown in the tenant list."
          />
          <Input label="Billing month (YYYY-MM)" {...register("billing_month", { required: true })} />
          <Input label="Amount (IDR)" type="number" {...register("amount_idr", { valueAsNumber: true, min: 1 })} />
          <Input label="Due date" type="date" {...register("due_date", { required: true })} />
        </div>
      </fieldset>
      <div className="flex border-t border-[var(--surface-divider)] pt-4">
        <Button type="submit" loading={submitting} className="w-full sm:w-auto sm:min-w-36">
          {submitting ? "Creating bill..." : "Create bill"}
        </Button>
      </div>
    </form>
  );
}
