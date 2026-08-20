"use client";

import { AdminHeader, ForbiddenState } from "@/components/admin/ui";
import { PlanForm } from "@/components/saas/plan-form";
import { useAuth } from "@/lib/auth";
import { canSaas } from "@/lib/saas/permissions";
import { useSaasCopy } from "@/lib/saas-copy";

export default function NewPlanPage() {
  const c = useSaasCopy();
  const { user } = useAuth();
  if (!user || !canSaas(user.role, "plans", "create")) {
    return <ForbiddenState message={c.forbidden} />;
  }
  return (
    <div className="flex flex-col gap-4">
      <AdminHeader title={c.addPlan} hint={c.plansHint} />
      <PlanForm />
    </div>
  );
}
