"use client";

import Link from "next/link";
import {
  Building2,
  CircleDollarSign,
  UserPlus,
  AlertTriangle,
} from "lucide-react";

import { AdminHeader } from "@/components/admin/ui";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatTzs } from "@/lib/mock-data";
import { schoolStatusLabel } from "@/lib/saas/labels";
import { canSaas } from "@/lib/saas/permissions";
import { useSaasStore } from "@/lib/saas/store";
import { useSaasCopy } from "@/lib/saas-copy";
import { useAuth } from "@/lib/auth";

export default function SuperAdminDashboardPage() {
  const c = useSaasCopy();
  const { user } = useAuth();
  const { state, ready } = useSaasStore();

  const active = state.schools.filter((item) => item.status === "active");
  const trial = state.schools.filter((item) => item.status === "trial");
  const mrr = active.reduce((sum, item) => sum + item.monthlyFeeTzs, 0);
  const newThisMonth = state.schools.filter((item) => item.createdAt.startsWith("2026-08"));
  const overdue = state.invoices.filter((item) => item.status === "overdue");
  const pending = state.invoices.filter((item) => item.status === "sent");
  const openTickets = state.tickets.filter((item) => item.status === "open" || item.status === "pending");
  const endingTrial = trial.filter((item) => item.trialEndsAt <= "2026-08-27");
  const arpu = active.length ? Math.round(mrr / active.length) : 0;
  const paidThisMonth = state.payments
    .filter((item) => item.paidAt.startsWith("2026-08"))
    .reduce((sum, item) => sum + item.amountTzs, 0);

  const kpis = [
    { label: c.totalSchools, value: String(state.schools.length), icon: Building2 },
    { label: c.mrr, value: formatTzs(mrr), icon: CircleDollarSign },
    { label: c.newThisMonth, value: String(newThisMonth.length), icon: UserPlus },
    { label: c.overduePay, value: String(overdue.length), icon: AlertTriangle },
  ];

  if (!user || !canSaas(user.role, "dashboard", "view")) return null;

  return (
    <div className="flex flex-col gap-6">
      <AdminHeader title={c.dashTitle} hint={c.dashHint} />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <CardDescription>{label}</CardDescription>
              <Icon className="size-4 text-muted-foreground" aria-hidden />
            </CardHeader>
            <CardContent>
              <p className="font-[family-name:var(--font-display)] text-2xl tabular-nums">
                {ready ? value : "—"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>{c.activeSchools}</CardDescription>
            <CardTitle className="tabular-nums">{active.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>{c.trialSchools}</CardDescription>
            <CardTitle className="tabular-nums">{trial.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>{c.arpu}</CardDescription>
            <CardTitle className="tabular-nums">{formatTzs(arpu)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{c.alerts}</CardTitle>
            <CardDescription>{c.revenueMonth}: {formatTzs(paidThisMonth)}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Link href="/super-admin/schools" className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2 text-sm">
              <span>{c.alertTrial}</span>
              <Badge variant="secondary">{endingTrial.length}</Badge>
            </Link>
            <Link href="/super-admin/billing" className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2 text-sm">
              <span>{c.alertOverdue}</span>
              <Badge variant="secondary">{overdue.length + pending.length}</Badge>
            </Link>
            <Link href="/super-admin/tickets" className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2 text-sm">
              <span>{c.alertTickets}</span>
              <Badge variant="secondary">{openTickets.length}</Badge>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{c.recentActivity}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {state.activity.slice(0, 8).map((item, index) => (
              <div key={item.id} className="flex flex-col gap-2">
                {index > 0 ? <Separator /> : null}
                <p className="text-sm">{item.summary}</p>
                <p className="text-xs text-muted-foreground">{item.actor}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{c.schoolsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {state.schools.slice(0, 6).map((school) => {
            const plan = state.plans.find((item) => item.id === school.planId);
            return (
              <Link
                key={school.id}
                href={`/super-admin/schools/${school.id}`}
                className="flex flex-col gap-1 rounded-lg border border-border/60 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-medium">{school.name}</span>
                <span className="text-sm text-muted-foreground">
                  {plan?.name} · {schoolStatusLabel(school.status, c)} · {formatTzs(school.monthlyFeeTzs)}
                </span>
              </Link>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
