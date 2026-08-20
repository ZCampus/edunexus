"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { ParentHeader } from "@/components/parent/ui";
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
import { useParentChild } from "@/lib/parent-child";
import { useParentCopy } from "@/lib/parent-copy";
import { parentAccount, parentChildren } from "@/lib/parent-mvp";

export default function ParentSettingsPage() {
  const { user } = useAuth();
  const { child } = useParentChild();
  const c = useParentCopy();
  const [emergencyName, setEmergencyName] = useState(parentAccount.emergencyName);
  const [emergencyPhone, setEmergencyPhone] = useState(
    parentAccount.emergencyPhone,
  );

  function onSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast.success(c.saved);
  }

  return (
    <div className="flex flex-col gap-4">
      <ParentHeader title={c.settingsTitle} hint={c.settingsHint} />

      <Card>
        <CardHeader>
          <CardTitle>{user?.name ?? parentAccount.name}</CardTitle>
          <CardDescription>
            {parentAccount.email} · {parentAccount.phone}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 text-sm">
          {parentChildren.map((item) => (
            <p key={item.id} className="text-muted-foreground">
              {item.name} · {item.className} · {item.admissionNo}
            </p>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {c.classTeacher} · {child.name.split(" ")[0]}
          </CardTitle>
          <CardDescription>{child.classTeacherTitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{child.classTeacher}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{c.emergency}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSave}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="em-name">{c.name}</FieldLabel>
                <Input
                  id="em-name"
                  value={emergencyName}
                  onChange={(event) => setEmergencyName(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="em-phone">{c.phone}</FieldLabel>
                <Input
                  id="em-phone"
                  inputMode="tel"
                  value={emergencyPhone}
                  onChange={(event) => setEmergencyPhone(event.target.value)}
                  required
                />
              </Field>
              <Button type="submit" className="w-fit">
                {c.save}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
