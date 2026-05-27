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
    <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
      <Input label="Tenant ID" type="number" {...register("tenant_id", { valueAsNumber: true, min: 1 })} hint="Use the tenant ID from Tenants list." />
      <Input label="Billing month (YYYY-MM)" {...register("billing_month", { required: true })} />
      <Input label="Amount (IDR)" type="number" {...register("amount_idr", { valueAsNumber: true, min: 1 })} />
      <Input label="Due date" type="date" {...register("due_date", { required: true })} />
      <Button type="submit" disabled={submitting}>
        Create bill
      </Button>
    </form>
  );
}

