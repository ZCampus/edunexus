"use client";

import Link from "next/link";
import {
  CalendarCheck,
  FileText,
  MessageCircle,
  NotebookPen,
  Wallet,
} from "lucide-react";

import { ParentHeader } from "@/components/parent/ui";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth";
import { useParentChild } from "@/lib/parent-child";
import { useParentCopy } from "@/lib/parent-copy";
import {
  childAlerts,
  childAttendance,
  childHomework,
  childTodayLessons,
  formatTzs,
  parentAccount,
  pendingHomework,
} from "@/lib/parent-mvp";
import { cn } from "@/lib/utils";

export default function ParentDashboardPage() {
  const { user } = useAuth();
  const { child } = useParentChild();
  const c = useParentCopy();
  const name = user?.name ?? parentAccount.name;
  const attendance = childAttendance(child.id);
  const pending = pendingHomework(child.id);
  const alerts = childAlerts[child.id] ?? [];
  const today = childTodayLessons(child.id);
  const homework = childHomework[child.id] ?? [];

  return (
    <div className="flex flex-col gap-4">
      <ParentHeader
        title={`${c.welcome}, ${name.split(" ")[0]}`}
        hint={`${child.name} · ${child.className} · ${c.hubHint}`}
      />

      <Card>
        <CardHeader className="pb-3">
          <CardDescription>{c.classTeacher}</CardDescription>
          <CardTitle className="text-lg">{child.classTeacher}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {child.classTeacherTitle}
          </p>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/parent/fees">
              <Wallet data-icon="inline-start" />
              {c.payFees}
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/parent/results">
              <FileText data-icon="inline-start" />
              {c.viewResults}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/parent/messages">
              <MessageCircle data-icon="inline-start" />
              {c.messageTeacher}
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label={c.overallAttendance}
          value={`${attendance.overall.pct}%`}
          hint={`${attendance.overall.attended}/${attendance.overall.total} ${c.periods}`}
        >
          <Progress value={attendance.overall.pct} className="mt-2" />
        </StatCard>
        <StatCard
          label={c.pendingHw}
          value={String(pending.length)}
          hint={c.homeworkDue}
        />
        <StatCard
          label={c.fees}
          value={formatTzs(child.feeBalanceTzs)}
          hint={child.name.split(" ")[0]}
        />
      </div>

      {alerts.length ? (
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <CardTitle>{c.alerts}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {alerts.map((alert) => (
              <Link
                key={alert.id}
                href={alert.href}
                className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm hover:bg-destructive/10"
              >
                {alert.text}
              </Link>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle>{c.todayPeriods}</CardTitle>
            <CardDescription>{child.className}</CardDescription>
          </div>
          <Link
            href="/parent/attendance"
            className="text-sm font-medium text-primary hover:underline"
          >
            {c.viewAll}
          </Link>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {today.map((row) => (
            <div
              key={`${row.period}-${row.subject}`}
              className="flex items-center justify-between gap-2 rounded-lg border border-border/70 px-3 py-2 text-sm"
            >
              <div>
                <p className="font-medium">
                  {c.period} {row.period} · {row.subject}
                </p>
                <p className="text-xs text-muted-foreground">
                  {row.time} · {row.teacher}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <CardTitle>{c.homeworkDue}</CardTitle>
          <Link
            href="/parent/homework"
            className="text-sm font-medium text-primary hover:underline"
          >
            {c.viewAll}
          </Link>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {homework.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm",
                item.status === "overdue" || item.status === "not_submitted"
                  ? "border-border/70"
                  : "border-border/50 text-muted-foreground",
              )}
            >
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {item.subject} · {c.due} {item.due}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-2 sm:grid-cols-2">
        <Quick href="/parent/attendance" icon={CalendarCheck}>
          {c.attendance}
        </Quick>
        <Quick href="/parent/homework" icon={NotebookPen}>
          {c.homework}
        </Quick>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  children,
}: {
  label: string;
  value: string;
  hint: string;
  children?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="font-[family-name:var(--font-display)] text-2xl tabular-nums">
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{hint}</p>
        {children}
      </CardContent>
    </Card>
  );
}

function Quick({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: typeof CalendarCheck;
  children: React.ReactNode;
}) {
  return (
    <Button asChild variant="outline" className="h-auto justify-start gap-3 py-3">
      <Link href={href}>
        <Icon className="size-4" />
        {children}
      </Link>
    </Button>
  );
}
