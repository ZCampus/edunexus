"use client";

import { StudentHeader } from "@/components/student/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n";
import { useStudentCopy } from "@/lib/student-copy";
import { exams, todayTimetable, weekTimetable } from "@/lib/student-mvp";
import { cn } from "@/lib/utils";

export default function StudentTimetablePage() {
  const { locale } = useI18n();
  const c = useStudentCopy();

  return (
    <div className="flex flex-col gap-4">
      <StudentHeader title={c.timetableTitle} hint={c.timetableHint} />

      <Tabs defaultValue="today">
        <TabsList>
          <TabsTrigger value="today">{c.today}</TabsTrigger>
          <TabsTrigger value="week">{c.week}</TabsTrigger>
          <TabsTrigger value="exams">{c.examView}</TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          <PeriodList rows={todayTimetable} copy={c} />
        </TabsContent>

        <TabsContent value="week" className="flex flex-col gap-3">
          {weekTimetable.map((day) => (
            <Card key={day.day} size="sm">
              <CardHeader>
                <CardTitle>{locale === "sw" ? day.daySw : day.day}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-1.5">
                {day.periods
                  .filter((row) => row.kind === "lesson")
                  .map((row) => (
                    <p
                      key={`${day.day}-${row.period}`}
                      className="flex justify-between gap-2 text-sm"
                    >
                      <span className="text-muted-foreground">{row.time}</span>
                      <span className="flex-1 font-medium">{row.subject}</span>
                      <span className="text-muted-foreground">{row.room}</span>
                    </p>
                  ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="exams" className="flex flex-col gap-2">
          {exams
            .filter((exam) => exam.status === "upcoming")
            .map((exam) => (
              <Card key={exam.id} size="sm">
                <CardHeader>
                  <CardTitle>{exam.name}</CardTitle>
                  <CardDescription>
                    {exam.date} · {exam.time} · {exam.venue}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PeriodList({
  rows,
  copy,
}: {
  rows: typeof todayTimetable;
  copy: ReturnType<typeof useStudentCopy>;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-2 pt-4">
        {rows.map((row) => (
          <div
            key={`${row.period}-${row.time}`}
            className={cn(
              "grid grid-cols-[4.5rem_1fr_auto] items-center gap-3 rounded-lg border px-3 py-2 text-sm sm:grid-cols-[5.5rem_1fr_8rem_4rem]",
              row.kind === "break"
                ? "border-dashed border-border/70 bg-muted/40 text-muted-foreground"
                : "border-border/70",
            )}
          >
            <span className="tabular-nums">{row.time}</span>
            <div>
              <p className="font-medium">{row.subject}</p>
              <p className="text-xs text-muted-foreground sm:hidden">
                {row.teacher} · {row.room}
              </p>
            </div>
            <span className="hidden truncate text-muted-foreground sm:inline">
              {row.teacher}
            </span>
            <span className="text-right text-muted-foreground">{row.room}</span>
          </div>
        ))}
        <p className="text-xs text-muted-foreground">
          {copy.teacher} · {copy.room}
        </p>
      </CardContent>
    </Card>
  );
}
