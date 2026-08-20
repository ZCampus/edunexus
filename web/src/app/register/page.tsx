"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";

import { AppSelect, TextField } from "@/components/admin/fields";
import { LocaleToggle } from "@/components/locale-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { DEMO_PASSWORD, useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { saveSchool } from "@/lib/saas/api";
import { slugify } from "@/lib/saas/labels";
import { getSaasState, hydrateSaas } from "@/lib/saas/store";
import type { SchoolType } from "@/lib/saas/types";
import { useSaasCopy } from "@/lib/saas-copy";

export default function RegisterPage() {
  const c = useSaasCopy();
  const { t } = useI18n();
  const { login } = useAuth();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "secondary" as SchoolType,
    country: "Tanzania",
    region: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    studentsCount: "200",
  });

  async function onSubmit() {
    if (!form.name.trim() || !form.ownerName.trim() || !form.ownerEmail.trim()) {
      toast.error(c.required);
      return;
    }
    hydrateSaas();
    const starter = getSaasState().plans.find((item) => item.code === "starter") ?? getSaasState().plans[0];
    const trial = new Date();
    trial.setDate(trial.getDate() + 14);
    const trialEndsAt = trial.toISOString().slice(0, 10);
    setPending(true);
    try {
      await saveSchool(
        {
          name: form.name,
          code: form.name.slice(0, 3).toUpperCase(),
          type: form.type,
          country: form.country,
          region: form.region,
          city: form.region,
          ownerName: form.ownerName,
          ownerEmail: form.ownerEmail,
          ownerPhone: form.ownerPhone,
          planId: starter.id,
          status: "trial",
          billingCycle: "monthly",
          trialEndsAt,
          subscriptionEndsAt: trialEndsAt,
          studentsCount: Number(form.studentsCount) || 0,
          staffCount: 1,
          parentsCount: 0,
          monthlyFeeTzs: starter.monthlyTzs,
          lastPaymentAt: "",
          outstandingTzs: 0,
          subdomain: slugify(form.name),
          createdAt: new Date().toISOString().slice(0, 10),
          notes: "Self-service trial",
        },
        form.ownerName,
      );
      toast.success(c.welcomeMail);
      const user = await login(form.ownerEmail, DEMO_PASSWORD);
      router.replace(user.homePath);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-background px-4 py-10">
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
        <LocaleToggle />
        <ThemeToggle />
      </div>
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border/80 bg-card p-6 md:p-8">
        <Link href="/" className="mb-6 flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap aria-hidden />
          </span>
          <span className="font-[family-name:var(--font-display)] text-xl">{t("brand")}</span>
        </Link>
        <h1 className="text-xl font-semibold">{c.registerTitle}</h1>
        <p className="mt-1 mb-5 text-sm text-muted-foreground">{c.registerHint}</p>
        <FieldGroup>
          <div className="grid gap-4 md:grid-cols-2">
            <TextField id="name" label={c.schoolName} value={form.name} required onChange={(v) => setForm((p) => ({ ...p, name: v }))} />
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
            <TextField id="country" label={c.country} value={form.country} onChange={(v) => setForm((p) => ({ ...p, country: v }))} />
            <TextField id="region" label={c.region} value={form.region} onChange={(v) => setForm((p) => ({ ...p, region: v }))} />
            <TextField id="owner" label={c.adminName} value={form.ownerName} required onChange={(v) => setForm((p) => ({ ...p, ownerName: v }))} />
            <TextField id="email" label={c.email} type="email" value={form.ownerEmail} required onChange={(v) => setForm((p) => ({ ...p, ownerEmail: v }))} />
            <TextField id="phone" label={c.phone} value={form.ownerPhone} onChange={(v) => setForm((p) => ({ ...p, ownerPhone: v }))} />
            <TextField id="students" label={c.estimate} type="number" value={form.studentsCount} onChange={(v) => setForm((p) => ({ ...p, studentsCount: v }))} />
          </div>
        </FieldGroup>
        <Button type="button" size="lg" className="mt-6 w-full" disabled={pending} onClick={onSubmit}>
          {pending ? c.saving : c.registerCta}
        </Button>
        <p className="mt-4 text-sm">
          <Link href="/login" className="text-muted-foreground hover:text-foreground">
            {t("backToLogin")}
          </Link>
        </p>
      </div>
    </div>
  );
}
