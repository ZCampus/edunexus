"use client";

import { AdminHeader, ForbiddenState } from "@/components/admin/ui";
import { StudentForm } from "@/components/admin/student-form";
import { can } from "@/lib/admin/permissions";
import { useAdminCopy } from "@/lib/admin-copy";
import { useAuth } from "@/lib/auth";

export default function NewStudentPage() {
  const c = useAdminCopy();
  const { user } = useAuth();
  if (!user || !can(user.role, "students", "create")) {
    return <ForbiddenState message={c.forbidden} />;
  }
  return (
    <div className="flex flex-col gap-4">
      <AdminHeader title={c.newStudent} hint={c.studentsHint} />
      <StudentForm />
    </div>
  );
}
