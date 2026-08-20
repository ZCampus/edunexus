"use client";

import { AdminHeader, ForbiddenState } from "@/components/admin/ui";
import { ClassForm } from "@/components/admin/class-form";
import { can } from "@/lib/admin/permissions";
import { useAdminCopy } from "@/lib/admin-copy";
import { useAuth } from "@/lib/auth";

export default function NewClassPage() {
  const c = useAdminCopy();
  const { user } = useAuth();
  if (!user || !can(user.role, "classes", "create")) {
    return <ForbiddenState message={c.forbidden} />;
  }
  return (
    <div className="flex flex-col gap-4">
      <AdminHeader title={c.newClass} hint={c.classesHint} />
      <ClassForm />
    </div>
  );
}
