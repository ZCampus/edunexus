"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";

import { LocaleToggle } from "@/components/locale-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { demoUsers, useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { school } from "@/lib/mock-data";

export default function LoginPage() {
  const { t } = useI18n();
  const { login } = useAuth();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [email, setEmail] = useState(demoUsers[0].email);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const form = new FormData(event.currentTarget);
    try {
      const user = await login(
        String(form.get("email") ?? ""),
        String(form.get("password") ?? ""),
      );
      toast.success(`${user.name} · ${user.role}`);
      router.replace(user.homePath);
    } catch {
      toast.error(t("loginUnknown"));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-background px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,oklch(0.9_0.04_170/0.5),transparent_45%),radial-gradient(circle_at_80%_0%,oklch(0.92_0.05_85/0.35),transparent_40%)] dark:bg-[radial-gradient(circle_at_20%_20%,oklch(0.35_0.05_170/0.4),transparent_45%),radial-gradient(circle_at_80%_0%,oklch(0.35_0.05_85/0.25),transparent_40%)]"
      />
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2 md:right-8 md:top-6">
        <LocaleToggle />
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-md animate-rise rounded-2xl border border-border/80 bg-card p-6 shadow-[0_24px_60px_-40px_oklch(0.3_0.05_170)] md:p-8">
        <div className="mb-6 flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap aria-hidden />
            </span>
            <span className="font-[family-name:var(--font-display)] text-xl">
              {t("brand")}
            </span>
          </Link>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              {t("loginTitle")}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("loginSubtitle")}
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="school">{t("schoolCode")}</FieldLabel>
              <Input
                id="school"
                name="school"
                defaultValue={school.code}
                autoComplete="organization"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
              <Input
                id="email"
                name="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                defaultValue="demo-password"
                autoComplete="current-password"
                required
              />
            </Field>
          </FieldGroup>

          <Button type="submit" size="lg" disabled={pending} className="w-full">
            {t("signIn")}
          </Button>
        </form>

        <div className="mt-6 rounded-xl border border-border/70 bg-muted/30 p-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            {t("demoAccountsHint")}
          </p>
          <div className="flex flex-col gap-1.5">
            {demoUsers.map((account) => (
              <button
                key={account.id}
                type="button"
                onClick={() => setEmail(account.email)}
                className="rounded-lg px-2 py-1.5 text-left text-xs transition-colors hover:bg-background"
              >
                <span className="font-medium text-foreground">{account.role}</span>
                <span className="text-muted-foreground"> · {account.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
