"use client";

import { AdminEmpty, AdminHeader, AdminSkeleton } from "@/components/admin/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth";
import { formatTzs } from "@/lib/mock-data";
import { schoolStatusLabel } from "@/lib/saas/labels";
import { canSaas } from "@/lib/saas/permissions";
import { useSaasStore } from "@/lib/saas/store";
import { useSaasCopy } from "@/lib/saas-copy";

export default function AnalyticsPage() {
  const c = useSaasCopy();
  const { user } = useAuth();
  const { state, ready } = useSaasStore();

  if (!user || !canSaas(user.role, "analytics", "view")) {
    return <AdminEmpty title={c.forbidden} hint="" />;
  }
  if (!ready) return <AdminSkeleton />;

  const totalStudents = state.schools.reduce((sum, item) => sum + item.studentsCount, 0);
  const mrr = state.schools
    .filter((item) => item.status === "active")
    .reduce((sum, item) => sum + item.monthlyFeeTzs, 0);
  const maxPlan = Math.max(
    ...state.plans.map(
      (plan) => state.schools.filter((school) => school.planId === plan.id).length,
    ),
    1,
  );

  return (
    <div className="flex flex-col gap-4">
      <AdminHeader title={c.analyticsTitle} hint={c.analyticsHint} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>{c.totalSchools}</CardDescription>
            <CardTitle className="tabular-nums">{state.schools.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>{c.mrr}</CardDescription>
            <CardTitle className="tabular-nums">{formatTzs(mrr)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>{c.students}</CardDescription>
            <CardTitle className="tabular-nums">{totalStudents.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{c.plan}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {state.plans.map((plan) => {
            const count = state.schools.filter((school) => school.planId === plan.id).length;
            return (
              <div key={plan.id} className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span>{plan.name}</span>
                  <span className="tabular-nums">{count}</span>
                </div>
                <Progress value={(count / maxPlan) * 100} aria-label={plan.name} />
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{c.status}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          {(["active", "trial", "suspended", "cancelled"] as const).map((status) => (
            <p key={status}>
              {schoolStatusLabel(status, c)}:{" "}
              {state.schools.filter((item) => item.status === status).length}
            </p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
