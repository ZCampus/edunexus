"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useI18n } from "@/lib/i18n";
import {
  teacherClass,
  type AttendanceStatus,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statuses: AttendanceStatus[] = ["present", "absent", "late"];

export default function TeacherAttendancePage() {
  const { t } = useI18n();
  const [rows, setRows] = useState(teacherClass.students);

  const counts = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        acc[row.status] += 1;
        return acc;
      },
      { present: 0, absent: 0, late: 0 } as Record<AttendanceStatus, number>,
    );
  }, [rows]);

  function setStatus(id: string, status: AttendanceStatus) {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, status } : row)),
    );
  }

  function save() {
    toast.success(
      `${t("teacherSave")} · ${counts.present} ${t("presentShort")}, ${counts.absent} ${t("absentShort")}`,
    );
  }

  const labels: Record<AttendanceStatus, string> = {
    present: t("presentShort"),
    absent: t("absentShort"),
    late: t("lateShort"),
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="animate-rise flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
            {t("teacherAttendance")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {teacherClass.name} · {teacherClass.dateLabel}
          </p>
        </div>
        <Button size="lg" onClick={save}>
          {t("teacherSave")}
        </Button>
      </div>

      <div className="animate-rise-delay flex flex-wrap gap-2">
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

      <Card className="animate-fade border-border/80">
        <CardHeader>
          <CardTitle className="text-base">{teacherClass.name}</CardTitle>
          <CardDescription>
            Tap a status — works offline, syncs later
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      {statuses.map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setStatus(student.id, status)}
                          className={cn(
                            "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                            student.status === status
                              ? status === "present"
                                ? "border-teal-700 bg-teal-700 text-white"
                                : status === "late"
                                  ? "border-amber-600 bg-amber-500 text-white"
                                  : "border-rose-700 bg-rose-600 text-white"
                              : "border-border bg-background text-muted-foreground hover:bg-muted",
                          )}
                          aria-pressed={student.status === status}
                        >
                          {labels[status]}
                        </button>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
