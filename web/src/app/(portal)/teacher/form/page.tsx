"use client";

import Link from "next/link";

import { TeacherHeader } from "@/components/teacher/ui";
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
import {
  averageOf,
  classAlerts,
  classEvents,
  classOverview,
  classStudents,
  classTeacherAssignment,
  studentAttendance,
  subjectAverages,
} from "@/lib/class-teacher";
import { useClassTeacherCopy } from "@/lib/class-teacher-copy";
import { cn } from "@/lib/utils";

export default function ClassTeacherHubPage() {
  const { user } = useAuth();
  const c = useClassTeacherCopy();
  const assignment = classTeacherAssignment(user?.staffId);
  const weakest = [...subjectAverages].sort((a, b) => a.classPct - b.classPct)[0];

  return (
    <div className="flex flex-col gap-4">
      <TeacherHeader
        title={`${c.hubTitle} · ${assignment?.label ?? "Form 2A"}`}
        hint={c.hubHint}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label={c.presentToday}
          value={`${classOverview.presentToday}/${classOverview.total}`}
        />
        <Stat label={c.disciplineOpen} value={String(classOverview.disciplineOpen)} />
        <Stat label={c.classAverage} value={`${classOverview.classAverage}%`} />
        <Stat label={c.feeAlerts} value={String(classOverview.feeAlerts)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{c.alerts}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {classAlerts.map((alert) => (
              <Link
                key={alert.id}
                href={`/teacher/form/students/${alert.studentId}`}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm hover:bg-muted/50",
                  alert.severity === "high"
                    ? "border-destructive/30 bg-destructive/5"
                    : "border-border/70",
                )}
              >
                {alert.text}
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{c.events}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {classEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-lg border border-border/70 px-3 py-2 text-sm"
              >
                <p className="font-medium">{event.title}</p>
                <p className="text-xs text-muted-foreground">
                  {event.when} · {event.venue}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{c.subjectCompare}</CardTitle>
          <CardDescription>
            {c.weakSubject}: {weakest.subject} ({weakest.teacher})
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {subjectAverages.map((row) => (
            <div key={row.subject}>
              <div className="mb-1 flex justify-between gap-2 text-sm">
                <span className="font-medium">{row.subject}</span>
                <span className="tabular-nums text-muted-foreground">
                  {c.ourClass} {row.classPct}% · {c.peerClass} {row.peerPct}%
                </span>
              </div>
              <Progress value={row.classPct} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{c.students}</CardTitle>
          <CardDescription>{c.drill}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {classStudents.map((student) => {
            const attendance = studentAttendance[student.id];
            return (
              <div
                key={student.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/70 px-3 py-2"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {student.initials}
                  </div>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {student.admissionNo}
                      {attendance
                        ? ` · ${attendance.pct}% ${c.navAttendance.toLowerCase()}`
                        : ""}
                      {` · ${averageOf(student.id)}%`}
                    </p>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/teacher/form/students/${student.id}`}>
                    {c.drill}
                  </Link>
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
