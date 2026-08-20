"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AreaField, TextField } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup } from "@/components/ui/field";
import { savePlan } from "@/lib/saas/api";
import type { SubscriptionPlan } from "@/lib/saas/types";
import { useSaasCopy } from "@/lib/saas-copy";
import { useAuth } from "@/lib/auth";

export function PlanForm({ plan }: { plan?: SubscriptionPlan }) {
  const c = useSaasCopy();
  const { user } = useAuth();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState({
    name: plan?.name ?? "",
    code: plan?.code ?? "",
    monthlyTzs: String(plan?.monthlyTzs ?? 100000),
    yearlyTzs: String(plan?.yearlyTzs ?? 1000000),
    maxStudents: plan?.maxStudents === null ? "" : String(plan?.maxStudents ?? 200),
    smsCredits: String(plan?.smsCredits ?? 500),
    storageGb: String(plan?.storageGb ?? 5),
    supportLevel: plan?.supportLevel ?? "Email",
    modules: plan?.modules.join(", ") ?? "Students, Attendance, Fees",
    description: plan?.description ?? "",
    enabled: plan?.enabled ?? true,
  });

  async function onSubmit() {
    if (!user || !form.name.trim() || !form.code.trim()) {
      toast.error(c.required);
      return;
    }
    setPending(true);
    try {
      await savePlan(
        {
          id: plan?.id,
          name: form.name,
          code: form.code.toLowerCase(),
          monthlyTzs: Number(form.monthlyTzs) || 0,
          yearlyTzs: Number(form.yearlyTzs) || 0,
          maxStudents: form.maxStudents === "" ? null : Number(form.maxStudents),
          smsCredits: Number(form.smsCredits) || 0,
          storageGb: Number(form.storageGb) || 0,
          modules: form.modules.split(",").map((item) => item.trim()).filter(Boolean),
          supportLevel: form.supportLevel,
          enabled: form.enabled,
          description: form.description,
        },
        user.name,
      );
      toast.success(c.saved);
      router.replace("/super-admin/plans");
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
              <TextField id="name" label={c.name} value={form.name} required onChange={(v) => setForm((p) => ({ ...p, name: v }))} />
              <TextField id="code" label={c.code} value={form.code} required onChange={(v) => setForm((p) => ({ ...p, code: v }))} />
              <TextField id="monthly" label={c.monthly} type="number" value={form.monthlyTzs} onChange={(v) => setForm((p) => ({ ...p, monthlyTzs: v }))} />
              <TextField id="yearly" label={c.yearly} type="number" value={form.yearlyTzs} onChange={(v) => setForm((p) => ({ ...p, yearlyTzs: v }))} />
              <TextField id="max" label={c.maxStudents} value={form.maxStudents} onChange={(v) => setForm((p) => ({ ...p, maxStudents: v }))} />
              <TextField id="sms" label={c.sms} type="number" value={form.smsCredits} onChange={(v) => setForm((p) => ({ ...p, smsCredits: v }))} />
              <TextField id="storage" label={c.storage} type="number" value={form.storageGb} onChange={(v) => setForm((p) => ({ ...p, storageGb: v }))} />
              <TextField id="support" label={c.support} value={form.supportLevel} onChange={(v) => setForm((p) => ({ ...p, supportLevel: v }))} />
            </div>
            <TextField id="modules" label={c.modules} value={form.modules} onChange={(v) => setForm((p) => ({ ...p, modules: v }))} />
            <AreaField id="desc" label={c.description} value={form.description} onChange={(v) => setForm((p) => ({ ...p, description: v }))} />
            <Field>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={form.enabled} onCheckedChange={(next) => setForm((p) => ({ ...p, enabled: next === true }))} />
                {c.enabled}
              </label>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
      <div className="flex gap-2">
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
