"use client";

import Link from "next/link";

import { AdminEmpty, AdminHeader, AdminSkeleton } from "@/components/admin/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { formatTzs } from "@/lib/mock-data";
import { canSaas } from "@/lib/saas/permissions";
import { useSaasStore } from "@/lib/saas/store";
import { useSaasCopy } from "@/lib/saas-copy";

export default function PlansPage() {
  const c = useSaasCopy();
  const { user } = useAuth();
  const { state, ready } = useSaasStore();

  if (!user || !canSaas(user.role, "plans", "view")) {
    return <AdminEmpty title={c.forbidden} hint="" />;
  }
  if (!ready) return <AdminSkeleton />;

  return (
    <div className="flex flex-col gap-4">
      <AdminHeader
        title={c.plansTitle}
        hint={c.plansHint}
        actions={
          canSaas(user.role, "plans", "create") ? (
            <Button asChild>
              <Link href="/super-admin/plans/new">{c.addPlan}</Link>
            </Button>
          ) : null
        }
      />
      <div className="grid gap-3 md:grid-cols-2">
        {state.plans.map((plan) => {
          const count = state.schools.filter((school) => school.planId === plan.id).length;
          return (
            <Card key={plan.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                  {plan.name}
                  <Badge variant={plan.enabled ? "secondary" : "outline"}>
                    {plan.enabled ? c.enabled : c.cancelled}
                  </Badge>
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-sm">
                <p>{c.monthly}: {plan.monthlyTzs ? formatTzs(plan.monthlyTzs) : c.none}</p>
                <p>{c.yearly}: {plan.yearlyTzs ? formatTzs(plan.yearlyTzs) : c.none}</p>
                <p>{c.maxStudents}: {plan.maxStudents ?? c.unlimited}</p>
                <p>{c.sms}: {plan.smsCredits}</p>
                <p>{c.storage}: {plan.storageGb}</p>
                <p>{c.support}: {plan.supportLevel}</p>
                <p>{c.modules}: {plan.modules.join(", ")}</p>
                <p>{c.schoolsTitle}: {count}</p>
                {canSaas(user.role, "plans", "edit") ? (
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/super-admin/plans/${plan.id}/edit`}>{c.editPlan}</Link>
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
