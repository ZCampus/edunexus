"use client";

import { AdminHeader, ForbiddenState } from "@/components/admin/ui";
import { SubjectForm } from "@/components/admin/subject-form";
import { can } from "@/lib/admin/permissions";
import { useAdminCopy } from "@/lib/admin-copy";
import { useAuth } from "@/lib/auth";

export default function NewSubjectPage() {
  const c = useAdminCopy();
  const { user } = useAuth();
  if (!user || !can(user.role, "subjects", "create")) {
    return <ForbiddenState message={c.forbidden} />;
  }
  return (
    <div className="flex flex-col gap-4">
      <AdminHeader title={c.newSubject} hint={c.subjectsHint} />
      <SubjectForm />
    </div>
  );
}
