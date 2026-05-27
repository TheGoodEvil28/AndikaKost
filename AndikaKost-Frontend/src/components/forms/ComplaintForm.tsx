import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

type Values = {
  category: string;
  description: string;
  priority: string;
  photo?: FileList;
};

export default function ComplaintForm({ onSubmit, submitting }: { onSubmit: (values: Values) => void; submitting?: boolean }) {
  const { register, handleSubmit } = useForm<Values>({
    defaultValues: { category: "Room", description: "", priority: "normal" }
  });
  return (
    <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
      <Input label="Category" {...register("category", { required: true })} placeholder="e.g. AC, Water, Internet" />
      <label className="block">
        <div className="mb-1 text-ui-base font-medium">Description</div>
        <textarea className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-ui-base" rows={5} {...register("description", { required: true })} />
      </label>
      <Select label="Priority" {...register("priority")}>
        <option value="low">Low</option>
        <option value="normal">Normal</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
      </Select>
      <Input label="Photo (optional)" type="file" accept="image/*" {...register("photo")} />
      <Button type="submit" disabled={submitting}>
        Submit
      </Button>
    </form>
  );
}

