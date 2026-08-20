"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";

import { LocaleToggle } from "@/components/locale-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { resolveUserByEmail } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const [pending, setPending] = useState(false);
  const [sentEmail, setSentEmail] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    await new Promise((resolve) => window.setTimeout(resolve, 400));
    const found = resolveUserByEmail(email);
    setSentEmail(found ? email : email);
    toast.success(t("forgotSent"));
    setPending(false);
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-background px-4 py-10">
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2 md:right-8 md:top-6">
        <LocaleToggle />
        <ThemeToggle />
      </div>
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border/80 bg-card p-6 md:p-8">
        <Link href="/" className="mb-6 flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap aria-hidden />
          </span>
          <span className="font-[family-name:var(--font-display)] text-xl">
            {t("brand")}
          </span>
        </Link>
        <h1 className="text-xl font-semibold tracking-tight">{t("forgotTitle")}</h1>
        <p className="mt-1 mb-5 text-sm text-muted-foreground">{t("forgotSubtitle")}</p>

        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
              <Input id="email" name="email" type="email" required autoComplete="username" />
            </Field>
          </FieldGroup>
          <Button type="submit" size="lg" disabled={pending} className="w-full">
            {t("forgotSubmit")}
          </Button>
        </form>

        {sentEmail ? (
          <p className="mt-4 text-sm">
            <Link
              className="font-medium text-primary underline-offset-4 hover:underline"
              href={`/reset-password?email=${encodeURIComponent(sentEmail)}`}
            >
              {t("resetTitle")}
            </Link>
          </p>
        ) : null}

        <p className="mt-6 text-sm">
          <Link href="/login" className="text-muted-foreground hover:text-foreground">
            {t("backToLogin")}
          </Link>
        </p>
      </div>
    </div>
  );
}
