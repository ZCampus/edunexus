"use client";

import { AdminHeader, ForbiddenState } from "@/components/admin/ui";
import { SchoolForm } from "@/components/saas/school-form";
import { useAuth } from "@/lib/auth";
import { canSaas } from "@/lib/saas/permissions";
import { useSaasCopy } from "@/lib/saas-copy";

export default function NewSchoolPage() {
  const c = useSaasCopy();
  const { user } = useAuth();
  if (!user || !canSaas(user.role, "schools", "create")) {
    return <ForbiddenState message={c.forbidden} />;
  }
  return (
    <div className="flex flex-col gap-4">
      <AdminHeader title={c.addSchool} hint={c.schoolsHint} />
      <SchoolForm />
    </div>
  );
}
