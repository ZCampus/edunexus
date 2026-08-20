"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { AreaField, TextField } from "@/components/admin/fields";
import { AdminHeader, AdminSkeleton, ForbiddenState } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { saveSchool } from "@/lib/admin/api";
import { fileToLogoDataUrl } from "@/lib/admin/logo";
import { can } from "@/lib/admin/permissions";
import { useAdminStore } from "@/lib/admin/store";
import type { SchoolSettings } from "@/lib/admin/types";
import { useAdminCopy } from "@/lib/admin-copy";
import { adminDemoUsers, useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { roleLabelKey } from "@/lib/role-label";

export default function SettingsPage() {
  const c = useAdminCopy();
  const { t } = useI18n();
  const { user } = useAuth();
  const { state, ready } = useAdminStore();
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState<SchoolSettings>(state.school);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ready) setForm(state.school);
  }, [ready, state.school]);

  if (!user || !can(user.role, "settings", "view")) {
    return <ForbiddenState message={c.forbidden} />;
  }
  if (!ready) return <AdminSkeleton />;

  const canEdit = can(user.role, "settings", "edit");

  async function onSave() {
    if (!user) return;
    setPending(true);
    try {
      const saved = await saveSchool(form, user.name);
      setForm(saved);
      toast.success(c.saved);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <AdminHeader title={c.settingsTitle} hint={c.settingsHint} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{c.schoolName}</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="logo">{c.schoolLogo}</FieldLabel>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {form.logoUrl ? (
                  <img
                    src={form.logoUrl}
                    alt={c.schoolLogo}
                    className="size-16 rounded-lg border border-border object-cover"
                  />
                ) : (
                  <span className="flex size-16 items-center justify-center rounded-lg bg-primary text-lg font-semibold text-primary-foreground">
                    {form.logoInitials}
                  </span>
                )}
                {canEdit ? (
                  <div className="flex flex-wrap gap-2">
                    <Input
                      ref={fileRef}
                      id="logo"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        event.target.value = "";
                        if (!file) return;
                        try {
                          const logoUrl = await fileToLogoDataUrl(file);
                          setForm((prev) => ({ ...prev, logoUrl }));
                        } catch {
                          toast.error(c.schoolLogoInvalid);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileRef.current?.click()}
                    >
                      {form.logoUrl ? c.schoolLogoChange : c.schoolLogoUpload}
                    </Button>
                    {form.logoUrl ? (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setForm((prev) => ({ ...prev, logoUrl: "" }))}
                      >
                        {c.schoolLogoRemove}
                      </Button>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <FieldDescription>{c.schoolLogoHint}</FieldDescription>
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField id="name" label={c.schoolName} value={form.name} onChange={(v) => setForm((p) => ({ ...p, name: v }))} />
              <TextField id="code" label={c.schoolCode} value={form.code} onChange={(v) => setForm((p) => ({ ...p, code: v }))} />
              <TextField id="phone" label={c.schoolPhone} value={form.phone} onChange={(v) => setForm((p) => ({ ...p, phone: v }))} />
              <TextField id="email" label={c.schoolEmail} value={form.email} onChange={(v) => setForm((p) => ({ ...p, email: v }))} />
              <TextField id="currency" label={c.currency} value={form.currency} onChange={(v) => setForm((p) => ({ ...p, currency: v }))} />
              <TextField id="year" label={c.academicYear} value={form.academicYear} onChange={(v) => setForm((p) => ({ ...p, academicYear: v }))} />
              <TextField id="term" label={c.term} value={form.term} onChange={(v) => setForm((p) => ({ ...p, term: v }))} />
            </div>
            <AreaField id="address" label={c.address} value={form.address} onChange={(v) => setForm((p) => ({ ...p, address: v }))} />
            {canEdit ? (
              <Button type="button" onClick={onSave} disabled={pending}>
                {pending ? c.saving : c.save}
              </Button>
            ) : null}
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{c.users}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{c.firstName}</TableHead>
                <TableHead>{c.role}</TableHead>
                <TableHead>{c.email}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminDemoUsers.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>{t(roleLabelKey(account.role))}</TableCell>
                  <TableCell>{account.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
