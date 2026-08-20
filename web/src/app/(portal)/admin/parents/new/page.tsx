"use client";

import { AdminHeader, ForbiddenState } from "@/components/admin/ui";
import { ParentForm } from "@/components/admin/parent-form";
import { can } from "@/lib/admin/permissions";
import { useAdminCopy } from "@/lib/admin-copy";
import { useAuth } from "@/lib/auth";

export default function NewParentPage() {
  const c = useAdminCopy();
  const { user } = useAuth();
  if (!user || !can(user.role, "parents", "create")) {
    return <ForbiddenState message={c.forbidden} />;
  }
  return (
    <div className="flex flex-col gap-4">
      <AdminHeader title={c.newParent} hint={c.parentsHint} />
      <ParentForm />
    </div>
  );
}
