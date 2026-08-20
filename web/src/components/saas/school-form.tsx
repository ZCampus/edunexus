"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AppSelect, AreaField, TextField } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { saveSchool } from "@/lib/saas/api";
import { slugify } from "@/lib/saas/labels";
import { useSaasStore } from "@/lib/saas/store";
import type { BillingCycle, SchoolStatus, SchoolType, TenantSchool } from "@/lib/saas/types";
import { useSaasCopy } from "@/lib/saas-copy";
import { useAuth } from "@/lib/auth";

export function SchoolForm({ school }: { school?: TenantSchool }) {
  const c = useSaasCopy();
  const { user } = useAuth();
  const router = useRouter();
  const { state } = useSaasStore();
  const [pending, setPending] = useState(false);
  const defaultPlan = state.plans.find((item) => item.code === "starter") ?? state.plans[0];
  const [form, setForm] = useState({
    name: school?.name ?? "",
    code: school?.code ?? "",
    type: school?.type ?? "secondary",
    country: school?.country ?? "Tanzania",
    region: school?.region ?? "",
    city: school?.city ?? "",
    ownerName: school?.ownerName ?? "",
    ownerEmail: school?.ownerEmail ?? "",
    ownerPhone: school?.ownerPhone ?? "",
    planId: school?.planId ?? defaultPlan?.id ?? "",
    status: school?.status ?? "trial",
    billingCycle: school?.billingCycle ?? "monthly",
    studentsCount: String(school?.studentsCount ?? 100),
    notes: school?.notes ?? "",
  });

  async function onSubmit() {
    if (!user) return;
    if (!form.name.trim() || !form.ownerName.trim() || !form.ownerEmail.trim()) {
      toast.error(c.required);
      return;
    }
    const plan = state.plans.find((item) => item.id === form.planId);
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 14);
    const trial = trialEnd.toISOString().slice(0, 10);
    setPending(true);
    try {
      const saved = await saveSchool(
        {
          id: school?.id,
          name: form.name,
          code: form.code || form.name.slice(0, 3).toUpperCase(),
          type: form.type as SchoolType,
          country: form.country,
          region: form.region,
          city: form.city,
          ownerName: form.ownerName,
          ownerEmail: form.ownerEmail,
          ownerPhone: form.ownerPhone,
          planId: form.planId,
          status: form.status as SchoolStatus,
          billingCycle: form.billingCycle as BillingCycle,
          trialEndsAt: school?.trialEndsAt ?? trial,
          subscriptionEndsAt: school?.subscriptionEndsAt ?? trial,
          studentsCount: Number(form.studentsCount) || 0,
          staffCount: school?.staffCount ?? 1,
          parentsCount: school?.parentsCount ?? 0,
          monthlyFeeTzs: plan?.monthlyTzs ?? school?.monthlyFeeTzs ?? 0,
          lastPaymentAt: school?.lastPaymentAt ?? "",
          outstandingTzs: school?.outstandingTzs ?? 0,
          subdomain: school?.subdomain ?? slugify(form.name),
          createdAt: school?.createdAt ?? new Date().toISOString().slice(0, 10),
          notes: form.notes,
        },
        user.name,
      );
      toast.success(c.saved);
      router.replace(`/super-admin/schools/${saved.id}`);
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
              <TextField id="name" label={c.schoolName} value={form.name} required onChange={(v) => setForm((p) => ({ ...p, name: v }))} />
              <TextField id="code" label={c.code} value={form.code} onChange={(v) => setForm((p) => ({ ...p, code: v }))} />
              <AppSelect
                id="type"
                label={c.schoolType}
                value={form.type}
                onChange={(v) => setForm((p) => ({ ...p, type: v as SchoolType }))}
                options={[
                  { value: "primary", label: c.primary },
                  { value: "secondary", label: c.secondary },
                  { value: "international", label: c.international },
                  { value: "mixed", label: c.mixed },
                ]}
              />
              <AppSelect
                id="plan"
                label={c.plan}
                value={form.planId}
                onChange={(v) => setForm((p) => ({ ...p, planId: v }))}
                options={state.plans.map((item) => ({ value: item.id, label: item.name }))}
              />
              <TextField id="country" label={c.country} value={form.country} onChange={(v) => setForm((p) => ({ ...p, country: v }))} />
              <TextField id="region" label={c.region} value={form.region} onChange={(v) => setForm((p) => ({ ...p, region: v }))} />
              <TextField id="city" label={c.city} value={form.city} onChange={(v) => setForm((p) => ({ ...p, city: v }))} />
              <TextField id="students" label={c.estimate} type="number" value={form.studentsCount} onChange={(v) => setForm((p) => ({ ...p, studentsCount: v }))} />
              <TextField id="owner" label={c.adminName} value={form.ownerName} required onChange={(v) => setForm((p) => ({ ...p, ownerName: v }))} />
              <TextField id="email" label={c.email} type="email" value={form.ownerEmail} required onChange={(v) => setForm((p) => ({ ...p, ownerEmail: v }))} />
              <TextField id="phone" label={c.phone} value={form.ownerPhone} onChange={(v) => setForm((p) => ({ ...p, ownerPhone: v }))} />
              <AppSelect
                id="status"
                label={c.status}
                value={form.status}
                onChange={(v) => setForm((p) => ({ ...p, status: v as SchoolStatus }))}
                options={[
                  { value: "trial", label: c.trial },
                  { value: "active", label: c.active },
                  { value: "suspended", label: c.suspended },
                  { value: "cancelled", label: c.cancelled },
                ]}
              />
            </div>
            <AreaField id="notes" label={c.notes} value={form.notes} onChange={(v) => setForm((p) => ({ ...p, notes: v }))} />
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
