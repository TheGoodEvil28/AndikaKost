import { useState } from "react";
import { Link } from "react-router-dom";
import TenantForm from "../../components/forms/TenantForm";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Icon from "../../components/ui/Icon";
import Modal from "../../components/ui/Modal";
import PageHeader from "../../components/ui/PageHeader";
import StatePanel from "../../components/ui/StatePanel";
import { Table, Td, Th } from "../../components/ui/Table";
import { buttonClassName } from "../../components/ui/buttonStyles";
import { useTenantMutations, useTenants } from "../../hooks/useTenants";

export default function TenantsPage() {
  const tenants = useTenants();
  const mut = useTenantMutations();
  const [open, setOpen] = useState(false);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Residents"
        title="Tenants"
        description="Create tenant accounts, review resident details, and manage room assignments."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Icon name="plus" className="h-4 w-4" />
            Add tenant
          </Button>
        }
      />

      <Card title="Tenant directory" description="Open a tenant profile to update contact details or room assignment.">
        {tenants.isLoading ? (
          <StatePanel compact icon="tenants" title="Loading tenants..." />
        ) : tenants.error ? (
          <StatePanel
            compact
            icon="tenants"
            tone="danger"
            title="Tenants could not be loaded"
            description="Please try again in a moment."
          />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Room</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {tenants.data?.map((tenant) => (
                <tr key={tenant.id}>
                  <Td label="ID">#{tenant.id}</Td>
                  <Td label="Name">
                    <Link
                      className={buttonClassName({ variant: "ghost", className: "text-link -my-2 justify-start" })}
                      to={`/admin/tenants/${tenant.id}`}
                      aria-label={`Open tenant ${tenant.full_name}`}
                    >
                      {tenant.full_name}
                      <Icon name="arrow-right" className="h-4 w-4" />
                    </Link>
                  </Td>
                  <Td label="Email" className="break-all">
                    {tenant.email}
                  </Td>
                  <Td label="Room">{tenant.room_id ? `#${tenant.room_id}` : "Unassigned"}</Td>
                  <Td label="Status">
                    <Badge>{tenant.status}</Badge>
                  </Td>
                </tr>
              ))}
              {tenants.data?.length === 0 ? (
                <tr>
                  <Td colSpan={5} className="p-3">
                    <StatePanel
                      compact
                      icon="tenants"
                      title="No tenants yet"
                      description="Add the first tenant to begin managing resident accounts."
                      action={
                        <Button onClick={() => setOpen(true)}>
                          <Icon name="plus" className="h-4 w-4" />
                          Add tenant
                        </Button>
                      }
                    />
                  </Td>
                </tr>
              ) : null}
            </tbody>
          </Table>
        )}
      </Card>

      <Modal title="Add tenant" open={open} onClose={() => setOpen(false)}>
        <TenantForm
          mode="create"
          submitting={mut.create.isPending}
          onSubmit={(values) => {
            mut.create.mutate(
              {
                ...values,
                email: values.email,
                password: values.password
              },
              { onSuccess: () => setOpen(false) }
            );
          }}
        />
      </Modal>
    </div>
  );
}
