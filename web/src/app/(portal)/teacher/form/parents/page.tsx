"use client";

import { FormEvent, useState } from "react";
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { classStudents, parentLog } from "@/lib/class-teacher";
import { useClassTeacherCopy } from "@/lib/class-teacher-copy";

export default function ClassParentsPage() {
  const c = useClassTeacherCopy();
  const [message, setMessage] = useState("");

  function onSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast.success(c.bulkSent);
    setMessage("");
  }

  return (
    <div className="flex flex-col gap-4">
      <TeacherHeader title={c.parentsTitle} hint={c.parentsHint} />

      <Card>
        <CardHeader>
          <CardTitle>{c.bulkMessage}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSend}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="bulk">{c.bulkMessage}</FieldLabel>
                <textarea
                  id="bulk"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder={c.bulkPlaceholder}
                  rows={3}
                  required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </Field>
              <Button type="submit" className="w-fit">
                {c.sendBulk}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{c.students}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {classStudents.map((student) => (
            <div
              key={student.id}
              className="rounded-lg border border-border/70 px-3 py-2 text-sm"
            >
              <p className="font-medium">{student.name}</p>
              <p className="text-muted-foreground">
                {student.parentName} · {student.parentPhone}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{c.commLog}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {parentLog.map((item) => {
            const student = classStudents.find((row) => row.id === item.studentId);
            return (
              <div key={item.id} className="text-sm">
                <p className="font-medium">
                  {item.date} · {student?.name}
                </p>
                <p className="text-muted-foreground">
                  {item.with}: {item.note}
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
