"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { StudentHeader } from "@/components/student/ui";
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
import { useStudentCopy } from "@/lib/student-copy";

export default function StudentSettingsPage() {
  const c = useStudentCopy();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  function onSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (next !== confirm) {
      toast.error(c.passwordMismatch);
      return;
    }
    setCurrent("");
    setNext("");
    setConfirm("");
    toast.success(c.passwordSaved);
  }

  return (
    <div className="flex flex-col gap-4">
      <StudentHeader title={c.settingsTitle} hint={c.settingsHint} />

      <Card>
        <CardHeader>
          <CardTitle>{c.changePassword}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSave}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="current">{c.currentPassword}</FieldLabel>
                <Input
                  id="current"
                  type="password"
                  autoComplete="current-password"
                  value={current}
                  onChange={(event) => setCurrent(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="next">{c.newPassword}</FieldLabel>
                <Input
                  id="next"
                  type="password"
                  autoComplete="new-password"
                  value={next}
                  onChange={(event) => setNext(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm">{c.confirmPassword}</FieldLabel>
                <Input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                  required
                />
              </Field>
              <Button type="submit" className="w-fit">
                {c.savePassword}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle>{c.language}</CardTitle>
          <CardDescription>{c.languageHint}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
