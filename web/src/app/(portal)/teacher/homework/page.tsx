"use client";

import { FormEvent, useState } from "react";
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useTeacherCopy } from "@/lib/teacher-copy";
import {
  homeworkSubmissions,
  teacherClasses,
  teacherHomework,
} from "@/lib/teacher-mvp";

export default function TeacherHomeworkPage() {
  const c = useTeacherCopy();
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [due, setDue] = useState("2026-08-15");
  const [className, setClassName] = useState(teacherClasses[0].className);
  const [activeId, setActiveId] = useState(teacherHomework[0]?.id);
  const [scores, setScores] = useState<Record<string, string>>({});

  const active = teacherHomework.find((item) => item.id === activeId);

  function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast.success(c.hwCreated);
    setTitle("");
    setDetail("");
  }

  const statusLabel = {
    pending: c.hwPending,
    submitted: c.hwSubmitted,
    late: c.hwLate,
  };

  return (
    <div className="flex flex-col gap-4">
      <TeacherHeader title={c.homeworkTitle} hint={c.homeworkHint} />

      <Card>
        <CardHeader>
          <CardTitle>{c.newHomework}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onCreate}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="hw-title">{c.hwTitle}</FieldLabel>
                <Input
                  id="hw-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="hw-detail">{c.hwDetail}</FieldLabel>
                <textarea
                  id="hw-detail"
                  value={detail}
                  onChange={(event) => setDetail(event.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="hw-class">{c.hwClass}</FieldLabel>
                  <select
                    id="hw-class"
                    value={className}
                    onChange={(event) => setClassName(event.target.value)}
                    className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                  >
                    {teacherClasses.map((item) => (
                      <option key={item.id} value={item.className}>
                        {item.className} · {item.subject}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="hw-due">{c.hwDue}</FieldLabel>
                  <Input
                    id="hw-due"
                    type="date"
                    value={due}
                    onChange={(event) => setDue(event.target.value)}
                    required
                  />
                </Field>
              </div>
              <Button type="submit" className="w-fit">
                {c.hwCreate}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      {teacherHomework.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => setActiveId(item.id)}
          className="rounded-xl border border-border/80 bg-card px-4 py-3 text-left shadow-sm hover:bg-muted/40"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium">{item.title}</p>
            <Badge variant="secondary">
              {item.submitted}/{item.total}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {item.className} · {item.due}
          </p>
        </button>
      ))}

      {active ? (
        <Card>
          <CardHeader>
            <CardTitle>{active.title}</CardTitle>
            <CardDescription>
              {c.submissions} · {active.className}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {homeworkSubmissions.map((row) => (
              <div
                key={row.id}
                className="flex flex-col gap-2 rounded-lg border border-border/70 px-3 py-2 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{row.name}</p>
                  <Badge variant="outline">{statusLabel[row.status]}</Badge>
                </div>
                <Input
                  className="w-24"
                  inputMode="numeric"
                  placeholder={c.gradeHw}
                  value={scores[row.id] ?? ""}
                  onChange={(event) =>
                    setScores((prev) => ({
                      ...prev,
                      [row.id]: event.target.value,
                    }))
                  }
                  aria-label={`${row.name} ${c.gradeHw}`}
                />
              </div>
            ))}
            <Button
              type="button"
              className="w-fit"
              onClick={() => toast.success(c.returned)}
            >
              {c.returnHw}
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
