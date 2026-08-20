"use client";

import { useParams } from "next/navigation";

import { AdminHeader, AdminSkeleton, ForbiddenState } from "@/components/admin/ui";
import { PlanForm } from "@/components/saas/plan-form";
import { useAuth } from "@/lib/auth";
import { canSaas } from "@/lib/saas/permissions";
import { useSaasStore } from "@/lib/saas/store";
import { useSaasCopy } from "@/lib/saas-copy";

export default function EditPlanPage() {
  const c = useSaasCopy();
  const { user } = useAuth();
  const params = useParams<{ id: string }>();
  const { state, ready } = useSaasStore();
  const plan = state.plans.find((item) => item.id === params.id);

  if (!user || !canSaas(user.role, "plans", "edit")) {
    return <ForbiddenState message={c.forbidden} />;
  }
  if (!ready) return <AdminSkeleton />;
  if (!plan) return <ForbiddenState message={c.notFound} />;

  return (
    <div className="flex flex-col gap-4">
      <AdminHeader title={c.editPlan} hint={c.plansHint} />
      <PlanForm plan={plan} />
    </div>
  );
}
