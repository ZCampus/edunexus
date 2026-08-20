"use client";

import { useParams } from "next/navigation";

import { AdminHeader, AdminSkeleton, ForbiddenState } from "@/components/admin/ui";
import { SchoolForm } from "@/components/saas/school-form";
import { useAuth } from "@/lib/auth";
import { canSaas } from "@/lib/saas/permissions";
import { useSaasStore } from "@/lib/saas/store";
import { useSaasCopy } from "@/lib/saas-copy";

export default function EditSchoolPage() {
  const c = useSaasCopy();
  const { user } = useAuth();
  const params = useParams<{ id: string }>();
  const { state, ready } = useSaasStore();
  const school = state.schools.find((item) => item.id === params.id);

  if (!user || !canSaas(user.role, "schools", "edit")) {
    return <ForbiddenState message={c.forbidden} />;
  }
  if (!ready) return <AdminSkeleton />;
  if (!school) return <ForbiddenState message={c.notFound} />;

  return (
    <div className="flex flex-col gap-4">
      <AdminHeader title={school.name} hint={c.schoolsHint} />
      <SchoolForm school={school} />
    </div>
  );
}
