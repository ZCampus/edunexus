"use client";

import { useEffect, useMemo, useState } from "react";

import { AttendanceBadge, ParentHeader } from "@/components/parent/ui";
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
import { useParentChild } from "@/lib/parent-child";
import { useParentCopy } from "@/lib/parent-copy";
import {
  childAttendance,
  type PeriodAttendance,
} from "@/lib/parent-mvp";
import { cn } from "@/lib/utils";

export default function ParentAttendancePage() {
  const { locale } = useI18n();
  const { child } = useParentChild();
  const c = useParentCopy();
  const data = childAttendance(child.id);
  const [subjectName, setSubjectName] = useState(data.subjects[0]?.subject);

  useEffect(() => {
    setSubjectName(childAttendance(child.id).subjects[0]?.subject);
  }, [child.id]);

  const selected = useMemo(
    () => data.subjects.find((item) => item.subject === subjectName) ?? data.subjects[0],
    [data.subjects, subjectName],
  );

  return (
    <div className="flex flex-col gap-4">
      <ParentHeader
        title={c.attendanceTitle}
        hint={`${child.name} · ${c.attendanceHint}`}
      />

      <Card>
        <CardHeader>
          <CardDescription>{c.overallAttendance}</CardDescription>
          <CardTitle className="text-3xl tabular-nums">
            {data.overall.pct}%
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Progress value={data.overall.pct} />
          <p className="text-sm text-muted-foreground">
            {data.overall.attended}/{data.overall.total} {c.periods}
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline">
              {c.attPresent} {data.overall.present}
            </Badge>
            <Badge variant="outline">
              {c.attLate} {data.overall.late}
            </Badge>
            <Badge variant="outline">
              {c.attAbsent} {data.overall.absent}
            </Badge>
            <Badge variant="outline">
              {c.attExcused} {data.overall.excused}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="subjects">
        <TabsList>
          <TabsTrigger value="subjects">{c.bySubject}</TabsTrigger>
          <TabsTrigger value="days">{c.byDay}</TabsTrigger>
        </TabsList>

        <TabsContent value="subjects" className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {data.subjects.map((item) => (
              <Button
                key={item.subject}
                type="button"
                size="sm"
                variant={item.subject === selected?.subject ? "default" : "outline"}
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
                  {selected.teacher} · {selected.attended}/{selected.total} {c.periods}
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
          {data.days.map((day) => {
            const partial = day.attended < day.total;
            return (
              <Card key={day.date}>
                <CardHeader className="flex flex-row items-start justify-between gap-3">
                  <div>
                    <CardTitle>
                      {day.day} · {day.date}
                    </CardTitle>
                    <CardDescription>
                      {day.attended}/{day.total} {c.periods}
                    </CardDescription>
                  </div>
                  <Badge variant={partial ? "destructive" : "secondary"}>
                    {day.attended}/{day.total}
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
  copy: ReturnType<typeof useParentCopy>;
  locale: "sw" | "en";
  mode: "subject" | "day";
}) {
  const weekday = dayLabel[row.day];
  const dayName = weekday ? weekday[locale] : row.day;
  const title =
    mode === "subject"
      ? `${dayName} ${row.date} · ${copy.period} ${row.period}`
      : `${copy.period} ${row.period} · ${row.subject}`;

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
          {row.time} · {copy.periodTeacher} {row.teacher}
          {row.note ? ` · ${row.note}` : ""}
        </p>
      </div>
      <AttendanceBadge status={row.status} copy={copy} />
    </div>
  );
}
