"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { AttendanceBadge, StudentHeader } from "@/components/student/ui";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n";
import { useStudentCopy } from "@/lib/student-copy";
import {
  attendanceDays,
  attendanceOverall,
  attendanceSubjects,
  type PeriodAttendance,
} from "@/lib/student-mvp";
import { cn } from "@/lib/utils";

export default function StudentAttendancePage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">…</p>}>
      <AttendanceContent />
    </Suspense>
  );
}

function AttendanceContent() {
  const { locale } = useI18n();
  const c = useStudentCopy();
  const searchParams = useSearchParams();
  const subjectFromQuery = searchParams.get("subject");
  const [subjectName, setSubjectName] = useState(
    subjectFromQuery && attendanceSubjects.some((item) => item.subject === subjectFromQuery)
      ? subjectFromQuery
      : attendanceSubjects[0]?.subject,
  );
  const selected = useMemo(
    () => attendanceSubjects.find((item) => item.subject === subjectName),
    [subjectName],
  );

  return (
    <div className="flex flex-col gap-4">
      <StudentHeader title={c.attendanceTitle} hint={c.attendanceHint} />

      <Card>
        <CardHeader>
          <CardDescription>{c.overallAttendance}</CardDescription>
          <CardTitle className="text-3xl tabular-nums">
            {attendanceOverall.pct}%
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Progress value={attendanceOverall.pct} />
          <p className="text-sm text-muted-foreground">
            {attendanceOverall.attended}/{attendanceOverall.total} {c.periodsLabel} ·{" "}
            {c.lateCounts}
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline">
              {c.attPresent} {attendanceOverall.present}
            </Badge>
            <Badge variant="outline">
              {c.attLate} {attendanceOverall.late}
            </Badge>
            <Badge variant="outline">
              {c.attAbsent} {attendanceOverall.absent}
            </Badge>
            <Badge variant="outline">
              {c.attExcused} {attendanceOverall.excused}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="subjects">
        <TabsList>
          <TabsTrigger value="subjects">{c.subjectAttendance}</TabsTrigger>
          <TabsTrigger value="days">{c.dayAttendance}</TabsTrigger>
        </TabsList>

        <TabsContent value="subjects" className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {attendanceSubjects.map((item) => (
              <Button
                key={item.subject}
                type="button"
                size="sm"
                variant={item.subject === subjectName ? "default" : "outline"}
                onClick={() => setSubjectName(item.subject)}
              >
                {item.subject} · {item.pct}%
              </Button>
            ))}
          </div>

          {selected ? (
            <Card>
              <CardHeader>
                <CardTitle>{selected.subject}</CardTitle>
                <CardDescription>
                  {selected.teacher} · {selected.attended}/{selected.total}{" "}
                  {c.periodsLabel}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Progress value={selected.pct} />
                <div className="flex flex-col gap-2">
                  {selected.records.map((row) => (
                    <PeriodRow
                      key={`${row.date}-${row.period}`}
                      row={row}
                      copy={c}
                      locale={locale}
                      mode="subject"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>

        <TabsContent value="days" className="flex flex-col gap-3">
          {attendanceDays.map((day) => {
            const partial = day.attended < day.total;
            return (
              <Card key={day.date}>
                <CardHeader className="flex flex-row items-start justify-between gap-3">
                  <div>
                    <CardTitle>
                      {day.day} · {day.date}
                    </CardTitle>
                    <CardDescription>
                      {day.attended}/{day.total} {c.periodsLabel}
                    </CardDescription>
                  </div>
                  <Badge variant={partial ? "destructive" : "secondary"}>
                    {partial ? c.partialDay : c.allPresent}
                  </Badge>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {day.records.map((row) => (
                    <PeriodRow
                      key={`${row.date}-${row.period}`}
                      row={row}
                      copy={c}
                      locale={locale}
                      mode="day"
                    />
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}

const dayLabel: Record<string, { sw: string; en: string }> = {
  Mon: { sw: "Jumatatu", en: "Mon" },
  Tue: { sw: "Jumanne", en: "Tue" },
  Wed: { sw: "Jumatano", en: "Wed" },
  Thu: { sw: "Alhamisi", en: "Thu" },
  Fri: { sw: "Ijumaa", en: "Fri" },
};

function PeriodRow({
  row,
  copy,
  locale,
  mode,
}: {
  row: PeriodAttendance;
  copy: ReturnType<typeof useStudentCopy>;
  locale: "sw" | "en";
  mode: "subject" | "day";
}) {
  const weekday = dayLabel[row.day];
  const dayName = weekday ? weekday[locale] : row.day;
  const title =
    mode === "subject"
      ? `${dayName} ${row.date} · ${copy.period} ${row.period}`
      : `${copy.period} ${row.period} · ${row.subject}`;
  const detail = `${row.time} · ${copy.periodTeacher} ${row.teacher}`;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm",
        row.status === "absent"
          ? "border-destructive/20 bg-destructive/5"
          : "border-border/70",
      )}
    >
      <div className="min-w-0">
        <p className="font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">
          {detail}
          {row.note ? ` · ${row.note}` : ""}
        </p>
      </div>
      <AttendanceBadge status={row.status} copy={copy} />
    </div>
  );
}
