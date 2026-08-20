"use client";

import { useParams } from "next/navigation";

import { AdminHeader, AdminSkeleton, ForbiddenState } from "@/components/admin/ui";
import { SubjectForm } from "@/components/admin/subject-form";
import { can } from "@/lib/admin/permissions";
import { useAdminStore } from "@/lib/admin/store";
import { useAdminCopy } from "@/lib/admin-copy";
import { useAuth } from "@/lib/auth";

export default function EditSubjectPage() {
  const c = useAdminCopy();
  const { user } = useAuth();
  const params = useParams<{ id: string }>();
  const { state, ready } = useAdminStore();
  const subject = state.subjects.find((item) => item.id === params.id);

  if (!user || !can(user.role, "subjects", "edit")) {
    return <ForbiddenState message={c.forbidden} />;
  }
  if (!ready) return <AdminSkeleton />;
  if (!subject) return <ForbiddenState message={c.notFound} />;

  return (
    <div className="flex flex-col gap-4">
      <AdminHeader title={c.editSubject} hint={c.subjectsHint} />
      <SubjectForm subject={subject} />
    </div>
  );
}
