"use client";

import { useState } from "react";
import { toast } from "sonner";

import { TeacherHeader } from "@/components/teacher/ui";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  averageOf,
  classStudents,
  defaultMarks,
  studentMarks,
} from "@/lib/class-teacher";
import { useClassTeacherCopy } from "@/lib/class-teacher-copy";

export default function ClassReportsPage() {
  const c = useClassTeacherCopy();
  const [remarks, setRemarks] = useState<Record<string, string>>({
    "s-neema":
      "Neema is attentive and cooperative. Encourage more practice in Biology practicals.",
    "s-daniel": "Attendance must improve before the mid-term. Contact guardian weekly.",
  });

  return (
    <div className="flex flex-col gap-4">
      <TeacherHeader title={c.reportsTitle} hint={c.reportsHint} />

      <Button
        type="button"
        className="w-fit"
        onClick={() => toast.success(c.reportsSent)}
      >
        {c.submitReports}
      </Button>

      {classStudents.map((student) => {
        const marks = studentMarks[student.id] ?? defaultMarks;
        return (
          <Card key={student.id}>
            <CardHeader>
              <CardTitle>{student.name}</CardTitle>
              <CardDescription>
                {c.classAverage} {averageOf(student.id)}%
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-1.5 text-xs">
                {marks.map((row) => (
                  <span
                    key={row.subject}
                    className="rounded-md border border-border/70 px-2 py-1"
                  >
                    {row.subject} {row.score}
                  </span>
                ))}
              </div>
              <label className="text-sm font-medium" htmlFor={`remark-${student.id}`}>
                {c.remark}
              </label>
              <textarea
                id={`remark-${student.id}`}
                value={remarks[student.id] ?? ""}
                onChange={(event) =>
                  setRemarks((prev) => ({
                    ...prev,
                    [student.id]: event.target.value,
                  }))
                }
                placeholder={c.remarkPlaceholder}
                rows={3}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
