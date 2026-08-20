"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { AdminHeader } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAdminCopy } from "@/lib/admin-copy";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { roleLabelKey } from "@/lib/role-label";

export default function AdminProfilePage() {
  const c = useAdminCopy();
  const { t } = useI18n();
  const { user } = useAuth();
  const [pending, setPending] = useState(false);

  if (!user) return null;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next = String(form.get("newPassword") ?? "");
    const confirm = String(form.get("confirmPassword") ?? "");
    if (next !== confirm) {
      toast.error(c.passwordMismatch);
      return;
    }
    setPending(true);
    await new Promise((resolve) => window.setTimeout(resolve, 400));
    toast.success(c.passwordSaved);
    setPending(false);
    event.currentTarget.reset();
  }

  return (
    <div className="flex flex-col gap-4">
      <AdminHeader title={c.profileTitle} hint={c.profileHint} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{user.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <Info label={c.email} value={user.email} />
          <Info label={c.role} value={t(roleLabelKey(user.role))} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{c.savePassword}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex max-w-md flex-col gap-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="current">{c.currentPassword}</FieldLabel>
                <Input id="current" name="currentPassword" type="password" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="new">{c.newPassword}</FieldLabel>
                <Input id="new" name="newPassword" type="password" required minLength={8} />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm">{c.confirmPassword}</FieldLabel>
                <Input id="confirm" name="confirmPassword" type="password" required minLength={8} />
              </Field>
            </FieldGroup>
            <Button type="submit" disabled={pending}>
              {pending ? c.saving : c.savePassword}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
