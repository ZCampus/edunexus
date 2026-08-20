"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { MultiCheck, TextField } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { saveSubject } from "@/lib/admin/api";
import { personName, type SubjectRecord } from "@/lib/admin/types";
import { useAdminStore } from "@/lib/admin/store";
import { useAdminCopy } from "@/lib/admin-copy";
import { useAuth } from "@/lib/auth";

export function SubjectForm({ subject }: { subject?: SubjectRecord }) {
  const c = useAdminCopy();
  const { user } = useAuth();
  const router = useRouter();
  const { state } = useAdminStore();
  const [pending, setPending] = useState(false);
  const teachers = state.staff.filter((item) => item.role === "teacher");
  const [form, setForm] = useState({
    name: subject?.name ?? "",
    code: subject?.code ?? "",
    teacherIds: subject?.teacherIds ?? [],
  });

  async function onSubmit() {
    if (!user) return;
    if (!form.name.trim() || !form.code.trim()) {
      toast.error(c.required);
      return;
    }
    setPending(true);
    try {
      const saved = await saveSubject(
        {
          id: subject?.id,
          name: form.name,
          code: form.code.toUpperCase(),
          teacherIds: form.teacherIds,
        },
        user.name,
      );
      toast.success(c.saved);
      router.replace("/admin/subjects");
      return saved;
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
              <TextField id="name" label={c.subjectsTitle} value={form.name} required onChange={(v) => setForm((p) => ({ ...p, name: v }))} />
              <TextField id="code" label={c.code} value={form.code} required onChange={(v) => setForm((p) => ({ ...p, code: v }))} />
            </div>
            <MultiCheck
              label={c.teachers}
              value={form.teacherIds}
              onChange={(ids) => setForm((p) => ({ ...p, teacherIds: ids }))}
              options={teachers.map((item) => ({
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
