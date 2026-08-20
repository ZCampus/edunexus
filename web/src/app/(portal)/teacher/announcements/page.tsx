"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { TeacherHeader } from "@/components/teacher/ui";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useTeacherCopy } from "@/lib/teacher-copy";
import { teacherClasses } from "@/lib/teacher-mvp";

export default function TeacherAnnouncementsPage() {
  const c = useTeacherCopy();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [className, setClassName] = useState(teacherClasses[0].className);

  function onPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast.success(c.announcePosted);
    setTitle("");
    setBody("");
  }

  return (
    <div className="flex flex-col gap-4">
      <TeacherHeader title={c.announceTitle} hint={c.announceHint} />

      <Card>
        <CardHeader>
          <CardTitle>{c.postAnnouncement}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onPost}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="an-class">{c.hwClass}</FieldLabel>
                <select
                  id="an-class"
                  value={className}
                  onChange={(event) => setClassName(event.target.value)}
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                >
                  {teacherClasses.map((item) => (
                    <option key={item.id} value={item.className}>
                      {item.className}
                    </option>
                  ))}
                </select>
              </Field>
              <Field>
                <FieldLabel htmlFor="an-title">{c.hwTitle}</FieldLabel>
                <Input
                  id="an-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="an-body">{c.announceBody}</FieldLabel>
                <textarea
                  id="an-body"
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  rows={4}
                  required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </Field>
              <Button type="submit" className="w-fit">
                {c.announcePost}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
