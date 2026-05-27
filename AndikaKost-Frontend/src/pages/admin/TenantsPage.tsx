import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import TenantForm from "../../components/forms/TenantForm";
import { Table, Td, Th } from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import { useTenantMutations, useTenants } from "../../hooks/useTenants";

export default function TenantsPage() {
  const tenants = useTenants();
  const mut = useTenantMutations();
  const [open, setOpen] = useState(false);

  return (
    <div className="grid gap-4">
      <Card title="Tenants">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-slate-600">Create tenant accounts and manage assignments.</div>
          <Button onClick={() => setOpen(true)}>Add tenant</Button>
        </div>
      </Card>

      <Card title="Tenant List">
        {tenants.isLoading ? (
          <div>Loading…</div>
        ) : tenants.error ? (
          <div className="text-rose-700">Failed to load tenants.</div>
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
              {tenants.data?.map((t) => (
                <tr key={t.id}>
                  <Td>{t.id}</Td>
                  <Td>
                    <Link className="font-semibold text-blue-700 hover:underline" to={`/admin/tenants/${t.id}`}>
                      {t.full_name}
                    </Link>
                  </Td>
                  <Td>{t.email}</Td>
                  <Td>{t.room_id ?? "-"}</Td>
                  <Td>
                    <Badge>{t.status}</Badge>
                  </Td>
                </tr>
              ))}
              {tenants.data?.length === 0 ? (
                <tr>
                  <Td>
                    <span className="text-slate-600">No tenants yet.</span>
                  </Td>
                  <Td />
                  <Td />
                  <Td />
                  <Td />
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

