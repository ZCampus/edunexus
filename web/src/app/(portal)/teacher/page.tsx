"use client";

import Link from "next/link";
import {
  CalendarCheck,
  Megaphone,
  NotebookPen,
  PenLine,
} from "lucide-react";

import { TeacherHeader } from "@/components/teacher/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import {
  classTeacherAssignment,
  isClassTeacher,
} from "@/lib/class-teacher";
import { useClassTeacherCopy } from "@/lib/class-teacher-copy";
import { useTeacherCopy } from "@/lib/teacher-copy";
import {
  teacherHomework,
  teacherProfile,
  teacherStats,
  todayLessons,
} from "@/lib/teacher-mvp";

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  const c = useTeacherCopy();
  const formCopy = useClassTeacherCopy();
  const formClass = classTeacherAssignment(user?.staffId);
  const first = (user?.name ?? teacherProfile.name).split(" ")[1] ?? "Amani";

  return (
    <div className="flex flex-col gap-4">
      <TeacherHeader
        title={`${c.welcome}, ${first}`}
        hint={`${teacherProfile.subject} · ${c.todayLabel}`}
      />

      {isClassTeacher(user) && formClass ? (
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardDescription>{formCopy.youAreForm}</CardDescription>
              <CardTitle>{formClass.label}</CardTitle>
            </div>
            <Button asChild>
              <Link href="/teacher/form">{formCopy.openHub}</Link>
            </Button>
          </CardHeader>
        </Card>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label={c.pendingGrading} value={String(teacherStats.pendingGrading)} />
        <Stat label={c.homeworkOpen} value={String(teacherStats.homeworkOpen)} />
        <Stat label={c.absentToday} value={String(teacherStats.absentToday)} />
        <Stat label={c.upcomingExams} value={String(teacherStats.upcomingExams)} />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild size="lg">
          <Link href="/teacher/attendance">
            <CalendarCheck data-icon="inline-start" />
            {c.takeAttendance}
          </Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link href="/teacher/homework">
            <NotebookPen data-icon="inline-start" />
            {c.assignHomework}
          </Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link href="/teacher/marks">
            <PenLine data-icon="inline-start" />
            {c.enterMarks}
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/teacher/announcements">
            <Megaphone data-icon="inline-start" />
            {c.postAnnouncement}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle>{c.todayClasses}</CardTitle>
            <CardDescription>{c.dashHint}</CardDescription>
          </div>
          <Button asChild variant="link" size="sm" className="h-auto px-0">
            <Link href="/teacher/classes">{c.viewAll}</Link>
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {todayLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/70 px-3 py-2"
            >
              <div>
                <p className="font-medium">
                  {c.period} {lesson.period} · {lesson.className}
                </p>
                <p className="text-xs text-muted-foreground">
                  {lesson.time} · {lesson.room}
                </p>
              </div>
              <Button asChild size="sm">
                <Link href={`/teacher/attendance?period=${lesson.id}`}>
                  {c.takeNow}
                </Link>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <CardTitle>{c.homeworkTitle}</CardTitle>
          <Button asChild variant="link" size="sm" className="h-auto px-0">
            <Link href="/teacher/homework">{c.viewAll}</Link>
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {teacherHomework
            .filter((item) => item.status !== "returned")
            .map((item) => (
              <Link
                key={item.id}
                href="/teacher/homework"
                className="flex items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-2 text-sm hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.className} · {item.due}
                  </p>
                </div>
                <Badge variant="secondary">
                  {item.submitted}/{item.total}
                </Badge>
              </Link>
            ))}
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
