"use client";

import { useParams } from "next/navigation";

import { AdminHeader, AdminSkeleton, ForbiddenState } from "@/components/admin/ui";
import { StudentForm } from "@/components/admin/student-form";
import { can } from "@/lib/admin/permissions";
import { canViewStudent } from "@/lib/admin/scope";
import { useAdminStore } from "@/lib/admin/store";
import { useAdminCopy } from "@/lib/admin-copy";
import { useAuth } from "@/lib/auth";

export default function EditStudentPage() {
  const c = useAdminCopy();
  const { user } = useAuth();
  const params = useParams<{ id: string }>();
  const { state, ready } = useAdminStore();
  const student = state.students.find((item) => item.id === params.id);

  if (!user || !can(user.role, "students", "edit")) {
    return <ForbiddenState message={c.forbidden} />;
  }
  if (!ready) return <AdminSkeleton />;
  if (!student || !canViewStudent(state, user, student.id)) {
    return <ForbiddenState message={c.notFound} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <AdminHeader title={c.editStudent} hint={c.studentsHint} />
      <StudentForm student={student} />
    </div>
  );
}
