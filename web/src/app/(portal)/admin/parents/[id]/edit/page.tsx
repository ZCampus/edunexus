"use client";

import { useParams } from "next/navigation";

import { AdminHeader, AdminSkeleton, ForbiddenState } from "@/components/admin/ui";
import { ParentForm } from "@/components/admin/parent-form";
import { can } from "@/lib/admin/permissions";
import { useAdminStore } from "@/lib/admin/store";
import { useAdminCopy } from "@/lib/admin-copy";
import { useAuth } from "@/lib/auth";

export default function EditParentPage() {
  const c = useAdminCopy();
  const { user } = useAuth();
  const params = useParams<{ id: string }>();
  const { state, ready } = useAdminStore();
  const parent = state.parents.find((item) => item.id === params.id);

  if (!user || !can(user.role, "parents", "edit")) {
    return <ForbiddenState message={c.forbidden} />;
  }
  if (!ready) return <AdminSkeleton />;
  if (!parent) return <ForbiddenState message={c.notFound} />;

  return (
    <div className="flex flex-col gap-4">
      <AdminHeader title={c.editParent} hint={c.parentsHint} />
      <ParentForm parent={parent} />
    </div>
  );
}
