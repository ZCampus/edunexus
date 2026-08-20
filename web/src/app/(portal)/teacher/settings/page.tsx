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
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useTeacherCopy } from "@/lib/teacher-copy";
import { teacherProfile } from "@/lib/teacher-mvp";

export default function TeacherSettingsPage() {
  const { user } = useAuth();
  const c = useTeacherCopy();
  const [password, setPassword] = useState("");

  function onSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPassword("");
    toast.success(c.passwordSaved);
  }

  return (
    <div className="flex flex-col gap-4">
      <TeacherHeader title={c.settingsTitle} hint={c.settingsHint} />

      <Card>
        <CardHeader>
          <CardTitle>{user?.name ?? teacherProfile.name}</CardTitle>
          <CardDescription>
            {teacherProfile.employeeNo} · {teacherProfile.qualification}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 text-sm">
          <p>{teacherProfile.email}</p>
          <p className="text-muted-foreground">{teacherProfile.phone}</p>
          <p className="text-muted-foreground">{teacherProfile.subject}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{c.savePassword}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSave}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="new-pass">{c.savePassword}</FieldLabel>
                <Input
                  id="new-pass"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
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
    </div>
  );
}
