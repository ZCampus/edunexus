"use client";

import { ExamBadge, StudentHeader } from "@/components/student/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useStudentCopy } from "@/lib/student-copy";
import { exams } from "@/lib/student-mvp";

export default function StudentExamsPage() {
  const c = useStudentCopy();

  return (
    <div className="flex flex-col gap-4">
      <StudentHeader title={c.examsTitle} hint={c.examsHint} />

      {exams.map((exam) => (
        <Card key={exam.id}>
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle>{exam.name}</CardTitle>
              <CardDescription>{exam.subject}</CardDescription>
            </div>
            <ExamBadge status={exam.status} copy={c} />
          </CardHeader>
          <CardContent className="flex flex-col gap-1 text-sm">
            <p>
              {exam.date} · {exam.time}
            </p>
            <p className="text-muted-foreground">
              {c.venue}: {exam.venue}
            </p>
            {exam.instructions ? (
              <p className="mt-2 rounded-lg bg-muted/60 px-3 py-2">
                {exam.instructions}
              </p>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
