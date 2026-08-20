"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n";
import { useTeacherCopy } from "@/lib/teacher-copy";
import {
  pastAttendance,
  teacherRoster,
  todayLessons,
  type TeacherAttendanceMark,
} from "@/lib/teacher-mvp";
import { cn } from "@/lib/utils";

const marks: TeacherAttendanceMark[] = ["present", "absent", "late", "excused"];

type Row = {
  id: string;
  name: string;
  initials: string;
  status: TeacherAttendanceMark;
  remark: string;
};

export default function TeacherAttendancePage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">…</p>}>
      <AttendanceContent />
    </Suspense>
  );
}

function AttendanceContent() {
  const { t } = useI18n();
  const c = useTeacherCopy();
  const searchParams = useSearchParams();
  const periodFromQuery = searchParams.get("period");
  const [periodId, setPeriodId] = useState(
    periodFromQuery && todayLessons.some((item) => item.id === periodFromQuery)
      ? periodFromQuery
      : todayLessons[0]?.id,
  );
  const [rows, setRows] = useState<Row[]>(
    teacherRoster.map((student) => ({
      id: student.id,
      name: student.name,
      initials: student.initials,
      status: student.status,
      remark: "",
    })),
  );

  const lesson = todayLessons.find((item) => item.id === periodId) ?? todayLessons[0];

  const counts = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        acc[row.status] += 1;
        return acc;
      },
      { present: 0, absent: 0, late: 0, excused: 0 } as Record<
        TeacherAttendanceMark,
        number
      >,
    );
  }, [rows]);

  const labels: Record<TeacherAttendanceMark, string> = {
    present: t("presentShort"),
    absent: t("absentShort"),
    late: t("lateShort"),
    excused: c.attExcused,
  };

  function setStatus(id: string, status: TeacherAttendanceMark) {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, status } : row)),
    );
  }

  function setRemark(id: string, remark: string) {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, remark } : row)),
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <TeacherHeader title={c.attendanceTitle} hint={c.attendanceHint} />

      <Tabs defaultValue="today">
        <TabsList>
          <TabsTrigger value="today">{c.todaySheet}</TabsTrigger>
          <TabsTrigger value="past">{c.pastSheet}</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {todayLessons.map((item) => (
              <Button
                key={item.id}
                type="button"
                size="sm"
                variant={item.id === periodId ? "default" : "outline"}
                onClick={() => setPeriodId(item.id)}
              >
                {item.className} · {c.period} {item.period}
              </Button>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            {lesson.className} · {c.period} {lesson.period} · {lesson.time} ·{" "}
            {c.room} {lesson.room}
          </p>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {t("presentShort")}: {counts.present}
            </Badge>
            <Badge variant="secondary">
              {t("lateShort")}: {counts.late}
            </Badge>
            <Badge variant="secondary">
              {t("absentShort")}: {counts.absent}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                setRows((prev) =>
                  prev.map((row) => ({ ...row, status: "present" })),
                )
              }
            >
              {c.markAllPresent}
            </Button>
            <Button
              type="button"
              onClick={() => toast.success(c.attendanceSaved)}
            >
              {c.submitAttendance}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">{c.offlineHint}</p>

          <div className="flex flex-col gap-2">
            {rows.map((student) => (
              <Card key={student.id} size="sm">
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {student.initials}
                  </div>
                  <CardTitle className="text-base">{student.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <div className="flex flex-wrap gap-1">
                    {marks.map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setStatus(student.id, status)}
                        className={cn(
                          "min-h-9 flex-1 rounded-lg border px-2 text-xs font-medium sm:flex-none sm:px-3",
                          student.status === status
                            ? status === "present"
                              ? "border-primary bg-primary text-primary-foreground"
                              : status === "late"
                                ? "border-accent bg-accent text-accent-foreground"
                                : status === "excused"
                                  ? "border-border bg-muted text-foreground"
                                  : "border-destructive bg-destructive/90 text-white"
                            : "border-border bg-background text-muted-foreground",
                        )}
                        aria-pressed={student.status === status}
                      >
                        {labels[status]}
                      </button>
                    ))}
                  </div>
                  {(student.status === "absent" ||
                    student.status === "late" ||
                    student.status === "excused") && (
                    <Input
                      value={student.remark}
                      onChange={(event) =>
                        setRemark(student.id, event.target.value)
                      }
                      placeholder={c.remarksPlaceholder}
                      aria-label={`${student.name} ${c.remarks}`}
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="past" className="flex flex-col gap-2">
          {pastAttendance.map((item) => (
            <Card key={item.id} size="sm">
              <CardHeader>
                <CardTitle>
                  {item.className} · {c.period} {item.period}
                </CardTitle>
                <CardDescription>{item.date}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-1.5 text-xs">
                <Badge variant="secondary">
                  {t("presentShort")} {item.present}
                </Badge>
                <Badge variant="secondary">
                  {t("lateShort")} {item.late}
                </Badge>
                <Badge variant="secondary">
                  {t("absentShort")} {item.absent}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
