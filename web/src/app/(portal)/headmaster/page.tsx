"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Users, UserCheck, Percent, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/lib/i18n";
import {
  formatTzs,
  headmasterProfile,
  school,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function HeadmasterDashboardPage() {
  const { t } = useI18n();
  const { kpis } = headmasterProfile;
  const [approvals, setApprovals] = useState(
    headmasterProfile.pendingApprovals,
  );

  const collectionPct = Math.round(
    (kpis.feesCollectedTzs / kpis.feesTargetTzs) * 100,
  );

  function decide(id: string, action: "approve" | "reject") {
    const item = approvals.find((a) => a.id === id);
    setApprovals((prev) => prev.filter((a) => a.id !== id));
    toast.success(
      action === "approve"
        ? `${t("hmApprove")}: ${item?.title ?? ""}`
        : `${t("hmReject")}: ${item?.title ?? ""}`,
    );
  }

  const kpiCards = [
    {
      label: t("hmStudents"),
      value: kpis.students.toLocaleString(),
      icon: Users,
    },
    {
      label: t("hmTeachers"),
      value: String(kpis.teachers),
      icon: UserCheck,
    },
    {
      label: t("hmAttendanceToday"),
      value: `${kpis.attendanceTodayPct}%`,
      icon: Percent,
    },
    {
      label: t("hmFeesCollected"),
      value: formatTzs(kpis.feesCollectedTzs),
      icon: Wallet,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="animate-rise flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">
          {headmasterProfile.name} · {school.name}
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          {t("hmGreeting")}
        </h1>
        <p className="text-sm text-muted-foreground">{school.term}</p>
      </div>

      <div className="animate-rise-delay grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="border-border/80">
            <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
              <CardDescription>{label}</CardDescription>
              <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <Icon aria-hidden className="size-4" />
              </span>
            </CardHeader>
            <CardContent>
              <p className="font-[family-name:var(--font-display)] text-2xl tracking-tight tabular-nums">
                {value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="animate-fade border-border/80">
        <CardHeader>
          <CardTitle className="text-base">{t("hmCollection")}</CardTitle>
          <CardDescription>
            {t("hmFeesTarget")}: {formatTzs(kpis.feesTargetTzs)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-end justify-between gap-3">
            <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight tabular-nums">
              {collectionPct}%
            </p>
            <p className="text-sm text-muted-foreground tabular-nums">
              {formatTzs(kpis.feesCollectedTzs)}
            </p>
          </div>
          <Progress value={collectionPct} aria-label={t("hmCollection")} />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="animate-fade border-border/80">
          <CardHeader>
            <CardTitle className="text-base">{t("hmPendingApprovals")}</CardTitle>
            <CardDescription>
              {approvals.length === 0
                ? "—"
                : `${approvals.length} waiting`}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {approvals.length === 0 ? (
              <p className="text-sm text-muted-foreground">All clear for now.</p>
            ) : (
              approvals.map((item, index) => (
                <div key={item.id} className="flex flex-col gap-3">
                  {index > 0 && <Separator />}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-snug">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.requester}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => decide(item.id, "reject")}
                      >
                        {t("hmReject")}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => decide(item.id, "approve")}
                      >
                        {t("hmApprove")}
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="animate-fade border-border/80">
          <CardHeader>
            <CardTitle className="text-base">{t("hmAlerts")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {headmasterProfile.alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 rounded-lg border border-border/70 bg-muted/25 px-3 py-3"
              >
                <span
                  className={cn(
                    "mt-1 size-2 shrink-0 rounded-full",
                    alert.severity === "high" && "bg-rose-600",
                    alert.severity === "medium" && "bg-amber-500",
                    alert.severity === "low" && "bg-teal-600",
                  )}
                  aria-hidden
                />
                <p className="text-sm leading-snug">{alert.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="animate-fade border-border/80">
        <CardHeader>
          <CardTitle className="text-base">{t("hmClassSnapshot")}</CardTitle>
          <CardDescription>Today · live roll-up</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {headmasterProfile.classAttendance.map((row) => {
            const pct = Math.round((row.present / row.total) * 100);
            return (
              <div key={row.className} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium">{row.className}</span>
                  <span className="flex items-center gap-2 tabular-nums text-muted-foreground">
                    {row.present}/{row.total}
                    <Badge
                      variant="secondary"
                      className={cn(
                        pct < 90 &&
                          "bg-amber-100 text-amber-950 dark:bg-amber-950/50 dark:text-amber-100",
                        pct < 85 &&
                          "bg-rose-100 text-rose-950 dark:bg-rose-950/50 dark:text-rose-100",
                      )}
                    >
                      {pct}%
                    </Badge>
                  </span>
                </div>
                <Progress value={pct} aria-label={row.className} />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
