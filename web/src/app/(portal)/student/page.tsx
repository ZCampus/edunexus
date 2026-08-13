"use client";

import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  FileText,
  MessageCircle,
  Megaphone,
  NotebookPen,
} from "lucide-react";

import {
  AttendanceBadge,
  HomeworkBadge,
  SectionLink,
  StudentHeader,
} from "@/components/student/ui";
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
import { useStudentCopy } from "@/lib/student-copy";
import {
  announcements,
  attendanceOverall,
  attendanceSubjects,
  homeworkItems,
  recentResults,
  studentRecord,
  studentStats,
  todayAttendance,
  todayTimetable,
} from "@/lib/student-mvp";
import { cn } from "@/lib/utils";

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const c = useStudentCopy();
  const name = user?.name ?? studentRecord.fullName;
  const pending = homeworkItems.filter(
    (item) => item.status === "not_submitted" || item.status === "overdue",
  );

  return (
    <div className="flex flex-col gap-4">
      <StudentHeader
        title={`${c.welcome}, ${name.split(" ")[0]}`}
        hint={`${studentRecord.className} · ${studentRecord.term} · ${c.todayLabel}`}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label={c.overallAttendance}
          value={`${attendanceOverall.pct}%`}
          hint={`${attendanceOverall.attended}/${attendanceOverall.total} ${c.periodsLabel}`}
        >
          <Progress value={attendanceOverall.pct} className="mt-2" />
        </StatCard>
        <StatCard
          label={c.pendingHw}
          value={String(studentStats.pendingHomework)}
          hint={c.homeworkDue}
        />
        <StatCard
          label={c.upcomingExams}
          value={String(studentStats.upcomingExams)}
          hint={c.examsTitle}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle>{c.attendance}</CardTitle>
            <CardDescription>{c.attendanceHint}</CardDescription>
          </div>
          <SectionLink href="/student/attendance">{c.viewAll}</SectionLink>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              {c.todayPeriods} · {todayAttendance.attended}/{todayAttendance.total}{" "}
              {c.periodsLabel}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {todayAttendance.records.map((row) => (
                <div
                  key={`${row.date}-${row.period}`}
                  className="flex items-center gap-1.5 rounded-lg border border-border/70 px-2 py-1.5 text-xs"
                >
                  <span className="font-medium">{row.subject}</span>
                  <AttendanceBadge status={row.status} copy={c} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-muted-foreground">
              {c.subjectAttendance}
            </p>
            {attendanceSubjects.map((subject) => (
              <Link
                key={subject.subject}
                href={`/student/attendance?subject=${encodeURIComponent(subject.subject)}`}
                className="rounded-lg border border-border/70 px-3 py-2 hover:bg-muted/50"
              >
                <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                  <span className="font-medium">{subject.subject}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {subject.pct}% · {subject.attended}/{subject.total}
                  </span>
                </div>
                <Progress value={subject.pct} />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Quick href="/student/timetable" icon={CalendarDays}>
          {c.quickTimetable}
        </Quick>
        <Quick href="/student/homework" icon={NotebookPen}>
          {c.quickHomework}
        </Quick>
        <Quick href="/student/results" icon={FileText}>
          {c.quickResults}
        </Quick>
        <Quick href="/report-card" icon={FileText} variant="secondary">
          {c.quickReport}
        </Quick>
        <Quick href="/student/announcements" icon={Megaphone} variant="secondary">
          {c.quickAnnounce}
        </Quick>
        <Quick href="/student/messages" icon={MessageCircle} variant="secondary">
          {c.quickMessage}
        </Quick>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle>{c.todayTimetable}</CardTitle>
            <CardDescription>{c.todayLabel}</CardDescription>
          </div>
          <SectionLink href="/student/timetable">{c.viewAll}</SectionLink>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {todayTimetable.slice(0, 6).map((row) => (
            <div
              key={`${row.period}-${row.time}`}
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm",
                row.kind === "break"
                  ? "border-dashed border-border/70 bg-muted/40 text-muted-foreground"
                  : "border-border/70",
              )}
            >
              <span className="w-24 shrink-0 tabular-nums text-muted-foreground">
                {row.time}
              </span>
              <span className="flex-1 font-medium">{row.subject}</span>
              <span className="hidden text-muted-foreground sm:inline">
                {row.room}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle>{c.homeworkDue}</CardTitle>
            <CardDescription>
              {pending.length} · {c.pendingHw}
            </CardDescription>
          </div>
          <SectionLink href="/student/homework">{c.viewAll}</SectionLink>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {pending.map((item) => (
            <Link
              key={item.id}
              href="/student/homework"
              className="flex items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-2 text-sm hover:bg-muted/50"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {item.subject} · {c.due} {item.dueLabel}
                </p>
              </div>
              <HomeworkBadge status={item.status} copy={c} />
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle>{c.latestAnnounce}</CardTitle>
            <CardDescription>
              {studentStats.unreadAnnouncements} {c.unreadMail.toLowerCase()}
            </CardDescription>
          </div>
          <SectionLink href="/student/announcements">{c.viewAll}</SectionLink>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {announcements.slice(0, 3).map((item) => (
            <Link
              key={item.id}
              href="/student/announcements"
              className="rounded-lg border border-border/70 px-3 py-2 hover:bg-muted/50"
            >
              <p className="text-sm font-medium">{item.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{item.time}</p>
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <CardTitle>{c.recentResults}</CardTitle>
          <SectionLink href="/student/results">{c.viewAll}</SectionLink>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {recentResults.map((row) => (
            <div
              key={`${row.subject}-${row.exam}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-2 text-sm"
            >
              <div>
                <p className="font-medium">{row.subject}</p>
                <p className="text-xs text-muted-foreground">{row.exam}</p>
              </div>
              <p className="tabular-nums font-semibold">
                {row.score}/{row.max} · {row.grade}
              </p>
            </div>
          ))}
          <Button asChild variant="outline">
            <Link href="/student/materials">
              <BookOpen data-icon="inline-start" />
              {c.materialsTitle}
            </Link>
          </Button>
        </CardContent>
      </Card>
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
    <Card size="sm">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
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
  variant = "default",
}: {
  href: string;
  icon: typeof CalendarDays;
  children: React.ReactNode;
  variant?: "default" | "secondary";
}) {
  return (
    <Button asChild size="lg" variant={variant}>
      <Link href={href}>
        <Icon data-icon="inline-start" />
        {children}
      </Link>
    </Button>
  );
}
