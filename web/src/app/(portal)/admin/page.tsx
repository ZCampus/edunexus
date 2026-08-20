"use client";

import Link from "next/link";
import {
  GraduationCap,
  Users,
  UserPlus,
  BookOpen,
} from "lucide-react";

import {
  AdminHeader,
  Can,
  ComingSoonButton,
} from "@/components/admin/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAdminStore } from "@/lib/admin/store";
import { classLabel, personName } from "@/lib/admin/types";
import { formatIsoDate, isNewAdmission } from "@/lib/admin/scope";
import { useAdminCopy } from "@/lib/admin-copy";

export default function AdminDashboardPage() {
  const c = useAdminCopy();
  const { state, ready } = useAdminStore();

  const activeStudents = state.students.filter((item) => item.status === "active");
  const activeStaff = state.staff.filter((item) => item.status === "active");
  const newAdmissions = activeStudents.filter((item) => isNewAdmission(item.admissionDate));
  const withoutParent = activeStudents.filter((item) => item.parentIds.length === 0);
  const fullClasses = state.classes.filter((item) => {
    const count = state.students.filter(
      (student) => student.classId === item.id && student.status === "active",
    ).length;
    return item.capacity > 0 && count / item.capacity >= 0.9;
  });

  const kpis = [
    { label: c.totalStudents, value: String(activeStudents.length), icon: GraduationCap },
    { label: c.totalStaff, value: String(activeStaff.length), icon: Users },
    { label: c.newAdmissions, value: String(newAdmissions.length), icon: UserPlus },
    { label: c.activeClasses, value: String(state.classes.length), icon: BookOpen },
  ];

  return (
    <div className="flex flex-col gap-6">
      <AdminHeader title={c.dashTitle} hint={c.dashHint} />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="border-border/80">
            <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
              <CardDescription>{label}</CardDescription>
              <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <Icon aria-hidden className="size-4" />
              </span>
            </CardHeader>
            <CardContent>
              <p className="font-[family-name:var(--font-display)] text-2xl tracking-tight tabular-nums">
                {ready ? value : "—"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/80">
        <CardHeader>
          <CardTitle className="text-base">{c.quickActions}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Can module="students" action="create">
            <Button asChild>
              <Link href="/admin/students/new">{c.addStudent}</Link>
            </Button>
          </Can>
          <ComingSoonButton label={c.recordPayment} hint={c.comingSoon} />
          <ComingSoonButton label={c.markAttendance} hint={c.comingSoon} />
          <ComingSoonButton label={c.createInvoice} hint={c.comingSoon} />
          <ComingSoonButton label={c.generateReport} hint={c.comingSoon} />
          <ComingSoonButton label={c.sendAnnouncement} hint={c.comingSoon} />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="text-base">{c.recentActivity}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {!ready ? (
              <p className="text-sm text-muted-foreground">…</p>
            ) : state.activity.length === 0 ? (
              <p className="text-sm text-muted-foreground">{c.noActivity}</p>
            ) : (
              state.activity.slice(0, 8).map((item, index) => (
                <div key={item.id} className="flex flex-col gap-3">
                  {index > 0 ? <Separator /> : null}
                  <div className="flex flex-col gap-1">
                    <p className="text-sm leading-snug">{item.summary}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.actor} · {formatIsoDate(item.at)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="text-base">{c.alerts}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-start gap-3 rounded-lg border border-border/70 bg-muted/25 px-3 py-3">
              <Badge variant="secondary">{newAdmissions.length}</Badge>
              <p className="text-sm leading-snug">{c.alertNew}</p>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border/70 bg-muted/25 px-3 py-3">
              <Badge variant="secondary">{withoutParent.length}</Badge>
              <p className="text-sm leading-snug">{c.alertUnassigned}</p>
            </div>
            {fullClasses.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-lg border border-border/70 bg-muted/25 px-3 py-3"
              >
                <Badge variant="outline">{classLabel(item)}</Badge>
                <p className="text-sm leading-snug">{c.alertCapacity}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/80">
        <CardHeader>
          <CardTitle className="text-base">{c.classesTitle}</CardTitle>
          <CardDescription>{state.school.term}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {state.classes.map((item) => {
            const count = state.students.filter(
              (student) => student.classId === item.id && student.status !== "archived",
            ).length;
            const teacher = state.staff.find((staff) => staff.id === item.classTeacherId);
            return (
              <div
                key={item.id}
                className="flex flex-col gap-1 rounded-lg border border-border/60 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <Link href={`/admin/classes/${item.id}`} className="font-medium hover:underline">
                  {classLabel(item)}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {count}/{item.capacity} {c.enrolled}
                  {teacher ? ` · ${personName(teacher)}` : ""}
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
