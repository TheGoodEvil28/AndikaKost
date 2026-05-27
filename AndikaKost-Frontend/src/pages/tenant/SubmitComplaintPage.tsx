import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import ComplaintForm from "../../components/forms/ComplaintForm";
import { useComplaintMutations } from "../../hooks/useComplaints";

export default function SubmitComplaintPage() {
  const navigate = useNavigate();
  const mut = useComplaintMutations();
  return (
    <Card title="Submit Complaint">
      <ComplaintForm
        submitting={mut.submit.isPending}
        onSubmit={(values) => {
          mut.submit.mutate(
            {
              category: values.category,
              description: values.description,
              priority: values.priority,
              photo: values.photo?.[0]
            },
            { onSuccess: () => navigate("/tenant/complaints", { replace: true }) }
          );
        }}
      />
    </Card>
  );
}

