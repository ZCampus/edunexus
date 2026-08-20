"use client";

import { useState } from "react";
import { toast } from "sonner";

import { AdminEmpty, AdminHeader, AdminSkeleton } from "@/components/admin/ui";
import { AppSelect, TextField } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { roleLabelKey } from "@/lib/role-label";
import { savePlatformStaff } from "@/lib/saas/api";
import { canSaas } from "@/lib/saas/permissions";
import { useSaasStore } from "@/lib/saas/store";
import type { PlatformRole } from "@/lib/saas/types";
import { useSaasCopy } from "@/lib/saas-copy";

export default function TeamPage() {
  const c = useSaasCopy();
  const { t } = useI18n();
  const { user } = useAuth();
  const { state, ready } = useSaasStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<PlatformRole>("support");

  if (!user || !canSaas(user.role, "team", "view")) {
    return <AdminEmpty title={c.forbidden} hint="" />;
  }
  if (!ready) return <AdminSkeleton />;

  async function onAdd() {
    if (!user || !name.trim() || !email.trim()) {
      toast.error(c.required);
      return;
    }
    await savePlatformStaff(
      { name, email, phone, role, status: "active" },
      user.name,
    );
    setName("");
    setEmail("");
    setPhone("");
    toast.success(c.saved);
  }

  return (
    <div className="flex flex-col gap-4">
      <AdminHeader title={c.teamTitle} hint={c.teamHint} />
      {canSaas(user.role, "team", "create") ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{c.addStaff}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FieldGroup>
              <div className="grid gap-4 md:grid-cols-2">
                <TextField id="name" label={c.name} value={name} onChange={setName} />
                <TextField id="email" label={c.email} type="email" value={email} onChange={setEmail} />
                <TextField id="phone" label={c.phone} value={phone} onChange={setPhone} />
                <AppSelect
                  id="role"
                  label={c.role}
                  value={role}
                  onChange={(value) => setRole(value as PlatformRole)}
                  options={[
                    { value: "super_admin", label: t("roleSuperAdmin") },
                    { value: "sales", label: t("roleSales") },
                    { value: "support", label: t("roleSupport") },
                    { value: "finance", label: t("roleFinance") },
                  ]}
                />
              </div>
            </FieldGroup>
            <Button type="button" onClick={onAdd}>{c.addStaff}</Button>
          </CardContent>
        </Card>
      ) : null}
      <div className="rounded-xl border border-border/80 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{c.name}</TableHead>
              <TableHead>{c.role}</TableHead>
              <TableHead>{c.email}</TableHead>
              <TableHead>{c.phone}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.staff.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{t(roleLabelKey(item.role))}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
