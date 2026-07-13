import { useNavigate } from "react-router-dom";
import ComplaintForm from "../../components/forms/ComplaintForm";
import Card from "../../components/ui/Card";
import Icon from "../../components/ui/Icon";
import PageHeader from "../../components/ui/PageHeader";
import StatePanel from "../../components/ui/StatePanel";
import { useComplaintMutations } from "../../hooks/useComplaints";

export default function SubmitComplaintPage() {
  const navigate = useNavigate();
  const mut = useComplaintMutations();

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Maintenance and support"
        title="Submit a complaint"
        description="Tell the admin what needs attention so your request can be reviewed and tracked."
        backTo="/tenant/complaints"
        backLabel="Back to complaints"
      />

      <Card
        title="Complaint details"
        description="Provide enough detail to help the admin understand and prioritize the issue."
        className="max-w-3xl"
      >
        <div className="theme-subtle mb-5 flex items-start gap-3 rounded-xl border p-4">
          <span className="brand-chip grid h-10 w-10 shrink-0 place-items-center rounded-xl">
            <Icon name="upload" className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <div className="font-bold">Before you submit</div>
            <p className="mt-1 text-sm text-muted">
              Include the exact location and what happened. An optional photo must be JPG or PNG and no larger than 1 MB.
            </p>
          </div>
        </div>

        {mut.submit.isError ? (
          <div className="mb-5" role="alert">
            <StatePanel
              compact
              icon="complaints"
              tone="danger"
              title="We couldn't submit your complaint"
              description="Review the details and attachment, then try again."
            />
          </div>
        ) : null}

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
    </div>
  );
}
