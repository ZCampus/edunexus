"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { TeacherHeader } from "@/components/teacher/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  classStudents,
  excuses as seedExcuses,
  studentAttendance,
} from "@/lib/class-teacher";
import { useClassTeacherCopy } from "@/lib/class-teacher-copy";

export default function ClassAttendanceOversightPage() {
  const c = useClassTeacherCopy();
  const [excuses, setExcuses] = useState(seedExcuses);
  const chronic = classStudents
    .map((student) => ({
      student,
      attendance: studentAttendance[student.id],
    }))
    .filter((row) => row.attendance && row.attendance.pct < 85);

  function setStatus(id: string, status: "approved" | "rejected") {
    setExcuses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item)),
    );
    toast.success(c.excuseUpdated);
  }

  const statusLabel = {
    pending: c.pending,
    approved: c.approved,
    rejected: c.rejected,
  };

  return (
    <div className="flex flex-col gap-4">
      <TeacherHeader title={c.attendanceTitle} hint={c.attendanceHint} />

      <Card>
        <CardHeader>
          <CardTitle>{c.chronic}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {chronic.map(({ student, attendance }) => (
            <Link
              key={student.id}
              href={`/teacher/form/students/${student.id}`}
              className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm hover:bg-destructive/10"
            >
              <span className="font-medium">{student.name}</span>
              <span className="tabular-nums">{attendance?.pct}%</span>
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{c.excuses}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {excuses.map((item) => {
            const student = classStudents.find((row) => row.id === item.studentId);
            return (
              <div
                key={item.id}
                className="rounded-lg border border-border/70 px-3 py-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{student?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.date} · {item.from}
                    </p>
                    <p className="mt-1 text-sm">{item.reason}</p>
                  </div>
                  <Badge variant="outline">{statusLabel[item.status]}</Badge>
                </div>
                {item.status === "pending" ? (
                  <div className="mt-2 flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setStatus(item.id, "approved")}
                    >
                      {c.approve}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setStatus(item.id, "rejected")}
                    >
                      {c.reject}
                    </Button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
