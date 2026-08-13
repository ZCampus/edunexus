"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";

import { LocaleToggle } from "@/components/locale-toggle";
import { OfflineBanner } from "@/components/offline-banner";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { demoUsers } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.9_0.05_170/0.55)_0%,transparent_55%),linear-gradient(180deg,var(--background),oklch(0.94_0.02_165/0.35))] dark:bg-[radial-gradient(ellipse_at_top_right,oklch(0.35_0.05_170/0.45)_0%,transparent_55%),linear-gradient(180deg,var(--background),oklch(0.22_0.03_165))]"
      />

      <OfflineBanner />

      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-5 py-5 md:px-8">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap aria-hidden />
          </span>
          <span className="font-[family-name:var(--font-display)] text-xl tracking-tight text-foreground md:text-2xl">
            {t("brand")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <LocaleToggle />
          <ThemeToggle />
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-5xl flex-col gap-10 px-5 pb-16 pt-10 md:px-8 md:pt-16">
        <div className="max-w-2xl">
          <h1 className="animate-rise font-[family-name:var(--font-display)] text-4xl leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {t("brand")}
          </h1>
          <p className="animate-rise-delay mt-4 max-w-xl text-lg text-foreground/80 md:text-xl">
            {t("tagline")}
          </p>
          <p className="animate-fade mt-3 max-w-lg text-base text-muted-foreground">
            {t("heroSupport")}
          </p>
          <div className="animate-fade mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/login">
                {t("ctaLogin")}
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        </div>

        <section className="animate-fade max-w-xl rounded-2xl border border-border/80 bg-card/80 p-5 backdrop-blur-sm">
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            {t("demoAccountsHint")}
          </p>
          <ul className="flex flex-col gap-2 text-sm">
            {demoUsers.map((account) => (
              <li
                key={account.id}
                className="flex flex-col gap-0.5 rounded-lg border border-border/60 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-medium capitalize">{account.role}</span>
                <span className="text-muted-foreground">{account.email}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Password: demo-password
          </p>
        </section>
      </main>
    </div>
  );
}
