"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AppSelect, AreaField, MultiCheck, TextField } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { saveStudent } from "@/lib/admin/api";
import { classLabel, personName, type StudentRecord } from "@/lib/admin/types";
import { useAdminStore } from "@/lib/admin/store";
import { useAdminCopy } from "@/lib/admin-copy";
import { useAuth } from "@/lib/auth";

type Props = {
  student?: StudentRecord;
};

export function StudentForm({ student }: Props) {
  const c = useAdminCopy();
  const { user } = useAuth();
  const router = useRouter();
  const { state } = useAdminStore();
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState({
    firstName: student?.firstName ?? "",
    lastName: student?.lastName ?? "",
    gender: student?.gender ?? "female",
    dateOfBirth: student?.dateOfBirth ?? "",
    email: student?.email ?? "",
    phone: student?.phone ?? "",
    address: student?.address ?? "",
    admissionNo: student?.admissionNo ?? "",
    admissionDate: student?.admissionDate ?? "2026-08-13",
    classId: student?.classId ?? state.classes[0]?.id ?? "",
    parentIds: student?.parentIds ?? [],
    status: student?.status ?? "active",
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit() {
    if (!user) return;
    if (!form.firstName.trim() || !form.lastName.trim() || !form.admissionNo.trim()) {
      toast.error(c.required);
      return;
    }
    setPending(true);
    try {
      const saved = await saveStudent(
        {
          id: student?.id,
          ...form,
        },
        user.name,
      );
      toast.success(c.saved);
      router.replace(`/admin/students/${saved.id}`);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{c.personal}</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField id="firstName" label={c.firstName} value={form.firstName} required onChange={(v) => set("firstName", v)} />
              <TextField id="lastName" label={c.lastName} value={form.lastName} required onChange={(v) => set("lastName", v)} />
              <AppSelect
                id="gender"
                label={c.gender}
                value={form.gender}
                onChange={(v) => set("gender", v as StudentRecord["gender"])}
                options={[
                  { value: "female", label: c.female },
                  { value: "male", label: c.male },
                  { value: "other", label: c.other },
                ]}
              />
              <TextField id="dob" label={c.dob} type="date" value={form.dateOfBirth} onChange={(v) => set("dateOfBirth", v)} />
              <TextField id="email" label={c.email} type="email" value={form.email} onChange={(v) => set("email", v)} />
              <TextField id="phone" label={c.phone} value={form.phone} onChange={(v) => set("phone", v)} />
            </div>
            <AreaField id="address" label={c.address} value={form.address} onChange={(v) => set("address", v)} />
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{c.admission}</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField id="admissionNo" label={c.admissionNo} value={form.admissionNo} required onChange={(v) => set("admissionNo", v)} />
              <TextField id="admissionDate" label={c.admissionDate} type="date" value={form.admissionDate} onChange={(v) => set("admissionDate", v)} />
              <AppSelect
                id="classId"
                label={c.class}
                value={form.classId}
                onChange={(v) => set("classId", v)}
                options={state.classes.map((item) => ({
                  value: item.id,
                  label: classLabel(item),
                }))}
              />
              <AppSelect
                id="status"
                label={c.status}
                value={form.status}
                onChange={(v) => set("status", v as StudentRecord["status"])}
                options={[
                  { value: "active", label: c.active },
                  { value: "inactive", label: c.inactive },
                  { value: "archived", label: c.archived },
                ]}
              />
            </div>
            <MultiCheck
              label={c.parents}
              value={form.parentIds}
              onChange={(ids) => set("parentIds", ids)}
              options={state.parents.map((item) => ({
                id: item.id,
                label: `${personName(item)} · ${item.relation}`,
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
