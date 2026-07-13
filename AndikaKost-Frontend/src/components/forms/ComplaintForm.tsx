import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";

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
    <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="grid min-w-0 gap-4">
        <legend className="text-ui-base font-extrabold text-[var(--surface-fg)]">Issue details</legend>
        <p className="mt-1 text-sm text-muted">Describe what happened so the team can review and prioritize your request.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Category" {...register("category", { required: true })} placeholder="e.g. AC, Water, Internet" />
          <Select label="Priority" {...register("priority")}>
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </Select>
        </div>
        <Textarea
          label="Description"
          rows={5}
          {...register("description", { required: true })}
          hint="Include the location and any details that may help the team investigate."
        />
        <Input
          label="Photo (optional)"
          type="file"
          accept="image/*"
          {...register("photo")}
          hint="Attach an image if it helps explain the issue."
        />
      </fieldset>
      <div className="flex border-t border-[var(--surface-divider)] pt-4">
        <Button type="submit" loading={submitting} className="w-full sm:w-auto sm:min-w-40">
          {submitting ? "Submitting complaint..." : "Submit complaint"}
        </Button>
      </div>
    </form>
  );
}

