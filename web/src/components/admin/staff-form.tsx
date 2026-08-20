"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AppSelect, MultiCheck, TextField } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { saveStaff } from "@/lib/admin/api";
import { classLabel, type StaffRecord, type StaffRole } from "@/lib/admin/types";
import { useAdminStore } from "@/lib/admin/store";
import { useAdminCopy } from "@/lib/admin-copy";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { roleLabelKey } from "@/lib/role-label";

const staffRoles: StaffRole[] = ["school_admin", "principal", "teacher", "accountant"];

export function StaffForm({ staff }: { staff?: StaffRecord }) {
  const c = useAdminCopy();
  const { t } = useI18n();
  const { user } = useAuth();
  const router = useRouter();
  const { state } = useAdminStore();
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState({
    firstName: staff?.firstName ?? "",
    lastName: staff?.lastName ?? "",
    role: staff?.role ?? "teacher",
    gender: staff?.gender ?? "female",
    phone: staff?.phone ?? "",
    email: staff?.email ?? "",
    subjectIds: staff?.subjectIds ?? [],
    classIds: staff?.classIds ?? [],
    classTeacherOfId: staff?.classTeacherOfId ?? "none",
    hasLogin: staff?.hasLogin ? "yes" : "no",
    status: staff?.status ?? "active",
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit() {
    if (!user) return;
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      toast.error(c.required);
      return;
    }
    setPending(true);
    try {
      const saved = await saveStaff(
        {
          id: staff?.id,
          firstName: form.firstName,
          lastName: form.lastName,
          role: form.role as StaffRole,
          gender: form.gender as StaffRecord["gender"],
          phone: form.phone,
          email: form.email,
          subjectIds: form.subjectIds,
          classIds: form.classIds,
          classTeacherOfId: form.classTeacherOfId === "none" ? null : form.classTeacherOfId,
          hasLogin: form.hasLogin === "yes",
          status: form.status as StaffRecord["status"],
        },
        user.name,
      );
      toast.success(c.saved);
      router.replace(`/admin/staff/${saved.id}`);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="pt-6">
          <FieldGroup>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField id="firstName" label={c.firstName} value={form.firstName} required onChange={(v) => set("firstName", v)} />
              <TextField id="lastName" label={c.lastName} value={form.lastName} required onChange={(v) => set("lastName", v)} />
              <AppSelect
                id="role"
                label={c.role}
                value={form.role}
                onChange={(v) => set("role", v as StaffRole)}
                options={staffRoles.map((role) => ({
                  value: role,
                  label: t(roleLabelKey(role)),
                }))}
              />
              <AppSelect
                id="gender"
                label={c.gender}
                value={form.gender}
                onChange={(v) => set("gender", v as StaffRecord["gender"])}
                options={[
                  { value: "female", label: c.female },
                  { value: "male", label: c.male },
                  { value: "other", label: c.other },
                ]}
              />
              <TextField id="phone" label={c.phone} value={form.phone} onChange={(v) => set("phone", v)} />
              <TextField id="email" label={c.email} type="email" value={form.email} required onChange={(v) => set("email", v)} />
              <AppSelect
                id="classTeacher"
                label={c.classTeacher}
                value={form.classTeacherOfId}
                onChange={(v) => set("classTeacherOfId", v)}
                options={[
                  { value: "none", label: c.unassigned },
                  ...state.classes.map((item) => ({
                    value: item.id,
                    label: classLabel(item),
                  })),
                ]}
              />
              <AppSelect
                id="login"
                label={c.loginAccess}
                value={form.hasLogin}
                onChange={(v) => set("hasLogin", v)}
                options={[
                  { value: "yes", label: c.hasLogin },
                  { value: "no", label: c.noLogin },
                ]}
              />
              <AppSelect
                id="status"
                label={c.status}
                value={form.status}
                onChange={(v) => set("status", v as StaffRecord["status"])}
                options={[
                  { value: "active", label: c.active },
                  { value: "inactive", label: c.inactive },
                  { value: "archived", label: c.archived },
                ]}
              />
            </div>
            <MultiCheck
              label={c.subjects}
              value={form.subjectIds}
              onChange={(ids) => set("subjectIds", ids)}
              options={state.subjects.map((item) => ({
                id: item.id,
                label: `${item.name} (${item.code})`,
              }))}
            />
            <MultiCheck
              label={c.classes}
              value={form.classIds}
              onChange={(ids) => set("classIds", ids)}
              options={state.classes.map((item) => ({
                id: item.id,
                label: classLabel(item),
              }))}
            />
          </FieldGroup>
        </CardContent>
      </Card>
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={onSubmit} disabled={pending}>
          {pending ? c.saving : c.save}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          {c.cancel}
        </Button>
      </div>
    </div>
  );
}
