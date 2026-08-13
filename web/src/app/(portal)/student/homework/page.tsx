"use client";

import { useState } from "react";
import { toast } from "sonner";

import { HomeworkBadge, StudentHeader } from "@/components/student/ui";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useStudentCopy } from "@/lib/student-copy";
import {
  homeworkItems,
  type HomeworkStatus,
} from "@/lib/student-mvp";

export default function StudentHomeworkPage() {
  const c = useStudentCopy();
  const [items, setItems] = useState(homeworkItems);

  function submit(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: (item.status === "overdue" ? "late" : "submitted") as HomeworkStatus,
            }
          : item,
      ),
    );
    toast.success(c.submittedToast);
  }

  return (
    <div className="flex flex-col gap-4">
      <StudentHeader title={c.homeworkTitle} hint={c.homeworkHint} />

      {items.map((item) => {
        const canSubmit =
          item.status === "not_submitted" || item.status === "overdue";
        return (
          <Card key={item.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>
                  {item.subject} · {item.teacher}
                </CardDescription>
              </div>
              <HomeworkBadge status={item.status} copy={c} />
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm">
                <span className="text-muted-foreground">{c.due}: </span>
                {item.due} ({item.dueLabel})
              </p>
              <p className="text-sm text-muted-foreground">{item.instructions}</p>
              {item.feedback ? (
                <p className="rounded-lg bg-muted/60 px-3 py-2 text-sm">
                  <span className="font-medium">{c.feedback}: </span>
                  {item.feedback}
                </p>
              ) : null}
              {item.marks != null ? (
                <p className="text-sm font-medium tabular-nums">
                  {c.marks}: {item.marks}/{item.max}
                </p>
              ) : null}
              {canSubmit ? (
                <Button
                  type="button"
                  onClick={() => submit(item.id)}
                  className="w-fit"
                >
                  {c.submit}
                </Button>
              ) : null}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
