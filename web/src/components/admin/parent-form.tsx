"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AppSelect, AreaField, MultiCheck, TextField } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { saveParent, saveStudent } from "@/lib/admin/api";
import { personName, type ParentRecord } from "@/lib/admin/types";
import { useAdminStore } from "@/lib/admin/store";
import { useAdminCopy } from "@/lib/admin-copy";
import { useAuth } from "@/lib/auth";

export function ParentForm({ parent }: { parent?: ParentRecord }) {
  const c = useAdminCopy();
  const { user } = useAuth();
  const router = useRouter();
  const { state } = useAdminStore();
  const [pending, setPending] = useState(false);
  const linked = state.students
    .filter((item) => parent && item.parentIds.includes(parent.id))
    .map((item) => item.id);
  const [form, setForm] = useState({
    firstName: parent?.firstName ?? "",
    lastName: parent?.lastName ?? "",
    relation: parent?.relation ?? "Parent",
    gender: parent?.gender ?? "female",
    phone: parent?.phone ?? "",
    email: parent?.email ?? "",
    address: parent?.address ?? "",
    occupation: parent?.occupation ?? "",
    status: parent?.status ?? "active",
    childIds: linked,
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit() {
    if (!user) return;
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error(c.required);
      return;
    }
    setPending(true);
    try {
      const saved = await saveParent(
        {
          id: parent?.id,
          firstName: form.firstName,
          lastName: form.lastName,
          relation: form.relation,
          gender: form.gender as ParentRecord["gender"],
          phone: form.phone,
          email: form.email,
          address: form.address,
          occupation: form.occupation,
          status: form.status as ParentRecord["status"],
        },
        user.name,
      );
      const previous = new Set(linked);
      const next = new Set(form.childIds);
      for (const student of state.students) {
        const shouldHave = next.has(student.id);
        const had = previous.has(student.id);
        if (shouldHave === had) continue;
        const parentIds = shouldHave
          ? [...student.parentIds.filter((id) => id !== saved.id), saved.id]
          : student.parentIds.filter((id) => id !== saved.id);
        await saveStudent({ ...student, parentIds }, user.name);
      }
      toast.success(c.saved);
      router.replace(`/admin/parents/${saved.id}`);
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
              <TextField id="relation" label={c.relation} value={form.relation} onChange={(v) => set("relation", v)} />
              <AppSelect
                id="gender"
                label={c.gender}
                value={form.gender}
                onChange={(v) => set("gender", v as ParentRecord["gender"])}
                options={[
                  { value: "female", label: c.female },
                  { value: "male", label: c.male },
                  { value: "other", label: c.other },
                ]}
              />
              <TextField id="phone" label={c.phone} value={form.phone} onChange={(v) => set("phone", v)} />
              <TextField id="email" label={c.email} type="email" value={form.email} onChange={(v) => set("email", v)} />
              <TextField id="occupation" label={c.occupation} value={form.occupation} onChange={(v) => set("occupation", v)} />
              <AppSelect
                id="status"
                label={c.status}
                value={form.status}
                onChange={(v) => set("status", v as ParentRecord["status"])}
                options={[
                  { value: "active", label: c.active },
                  { value: "inactive", label: c.inactive },
                  { value: "archived", label: c.archived },
                ]}
              />
            </div>
            <AreaField id="address" label={c.address} value={form.address} onChange={(v) => set("address", v)} />
            <MultiCheck
              label={c.children}
              value={form.childIds}
              onChange={(ids) => set("childIds", ids)}
              options={state.students.map((item) => ({
                id: item.id,
                label: personName(item),
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
