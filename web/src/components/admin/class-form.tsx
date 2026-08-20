"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AppSelect, MultiCheck, TextField } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { saveClass } from "@/lib/admin/api";
import { personName, type ClassRecord } from "@/lib/admin/types";
import { useAdminStore } from "@/lib/admin/store";
import { useAdminCopy } from "@/lib/admin-copy";
import { useAuth } from "@/lib/auth";

export function ClassForm({ klass }: { klass?: ClassRecord }) {
  const c = useAdminCopy();
  const { user } = useAuth();
  const router = useRouter();
  const { state } = useAdminStore();
  const [pending, setPending] = useState(false);
  const teachers = state.staff.filter((item) => item.role === "teacher" && item.status === "active");
  const [form, setForm] = useState({
    name: klass?.name ?? "",
    section: klass?.section ?? "A",
    classTeacherId: klass?.classTeacherId ?? "none",
    capacity: String(klass?.capacity ?? 40),
    subjectIds: klass?.subjectIds ?? [],
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit() {
    if (!user) return;
    if (!form.name.trim() || !form.section.trim()) {
      toast.error(c.required);
      return;
    }
    setPending(true);
    try {
      const saved = await saveClass(
        {
          id: klass?.id,
          name: form.name,
          section: form.section,
          classTeacherId: form.classTeacherId === "none" ? null : form.classTeacherId,
          capacity: Number(form.capacity) || 0,
          subjectIds: form.subjectIds,
        },
        user.name,
      );
      toast.success(c.saved);
      router.replace(`/admin/classes/${saved.id}`);
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
              <TextField id="name" label={c.class} value={form.name} required onChange={(v) => set("name", v)} />
              <TextField id="section" label={c.section} value={form.section} required onChange={(v) => set("section", v)} />
              <TextField id="capacity" label={c.capacity} type="number" value={form.capacity} onChange={(v) => set("capacity", v)} />
              <AppSelect
                id="teacher"
                label={c.classTeacher}
                value={form.classTeacherId}
                onChange={(v) => set("classTeacherId", v)}
                options={[
                  { value: "none", label: c.unassigned },
                  ...teachers.map((item) => ({
                    value: item.id,
                    label: personName(item),
                  })),
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
