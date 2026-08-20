"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Bell,
  GraduationCap,
  LogOut,
  Search,
} from "lucide-react";

import { LocaleToggle } from "@/components/locale-toggle";
import { OfflineBanner } from "@/components/offline-banner";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isAdminRole } from "@/lib/admin/permissions";
import { useAdminStore } from "@/lib/admin/store";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { isClassTeacher } from "@/lib/class-teacher";
import { navForRole } from "@/lib/portal-nav";
import { useTenant } from "@/lib/tenant";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function PortalShell({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const { user, ready, logout, impersonator, stopImpersonation } = useAuth();
  const { tenant } = useTenant();
  const { state: adminState } = useAdminStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) {
      router.replace("/login");
    }
  }, [ready, user, router]);

  useEffect(() => {
    if (!user) return;
    const idleMs = 30 * 60 * 1000;
    let timer = window.setTimeout(kick, idleMs);
    function kick() {
      logout();
      toast.error(t("sessionExpired"));
      router.replace("/login");
    }
    function bump() {
      window.clearTimeout(timer);
      timer = window.setTimeout(kick, idleMs);
    }
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"] as const;
    events.forEach((event) => window.addEventListener(event, bump));
    return () => {
      window.clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, bump));
    };
  }, [user, logout, router, t]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-muted/40 text-sm text-muted-foreground">
        Loading portal…
      </div>
    );
  }

  const nav = navForRole(user.role).filter((item) => {
    if (item.href === "/teacher/form") return isClassTeacher(user);
    return true;
  });

  return (
    <div className="min-h-dvh bg-[oklch(0.96_0.008_160)] text-foreground dark:bg-background">
      <OfflineBanner />

      {impersonator ? (
        <div className="bg-accent px-3 py-2 text-center text-sm text-accent-foreground">
          {user.name} · {user.title}
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="ml-3"
            onClick={() => {
              stopImpersonation();
              router.replace(impersonator.homePath);
            }}
          >
            {t("exitImpersonate")}
          </Button>
        </div>
      ) : null}

      {/* Digii-style top institutional bar */}
      <header className="sticky top-0 z-40 border-b border-primary/20 bg-primary text-primary-foreground shadow-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-3 md:gap-6 md:px-6">
          <Link href={user.homePath} className="flex shrink-0 items-center gap-2">
            <span className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-primary-foreground/15 ring-1 ring-primary-foreground/30">
              {isAdminRole(user.role) && adminState.school.logoUrl ? (
                <img
                  src={adminState.school.logoUrl}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <GraduationCap className="size-4" aria-hidden />
              )}
            </span>
            <span className="font-[family-name:var(--font-display)] text-lg tracking-tight">
              {t("brand")}
            </span>
            <span className="hidden text-xs text-primary-foreground/75 sm:inline">
              {tenant.code}
            </span>
          </Link>

          <div className="relative mx-auto hidden min-w-0 flex-1 md:block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder")}
              className="h-9 rounded-full border-0 bg-white pl-9 text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-white/50 dark:bg-card"
              aria-label={t("searchPlaceholder")}
            />
          </div>

          <div className="ml-auto flex items-center gap-1.5 md:gap-2">
            {user.role === "parent" || user.role === "teacher" ? (
              <Button
                asChild
                variant="ghost"
                size="icon-sm"
                className="text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
              >
                <Link
                  href={
                    user.role === "teacher"
                      ? "/teacher/announcements"
                      : "/notifications"
                  }
                  aria-label={t("navNotifications")}
                >
                  <Bell />
                </Link>
              </Button>
            ) : null}
            <div className="hidden sm:flex sm:items-center sm:gap-1.5">
              <LocaleToggle className="border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground" />
              <ThemeToggle className="border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground" />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
              onClick={() => {
                logout();
                router.replace("/login");
              }}
              aria-label={t("logout")}
            >
              <LogOut />
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-4 px-3 py-4 md:grid-cols-[260px_1fr] md:gap-6 md:px-6 md:py-6">
        {/* Digii-style left column: profile + nav */}
        <aside className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm">
            <div className="bg-primary px-4 pt-5 pb-10">
              <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary-foreground text-2xl font-semibold text-primary ring-4 ring-primary-foreground/35">
                {user.avatarInitials}
              </div>
            </div>
            <div className="-mt-4 space-y-1 px-4 pb-4 text-center">
              <p className="text-base font-semibold tracking-tight">{user.name}</p>
              {user.studentId ? (
                <p className="text-xs font-medium text-primary">{user.studentId}</p>
              ) : null}
              <p className="text-xs leading-snug text-muted-foreground">
                {user.title}
              </p>
            </div>
          </div>

          <nav
            aria-label="Portal"
            className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm md:max-h-[min(70vh,40rem)] md:overflow-y-auto"
          >
            {nav.map((item, index) => {
              const Icon = item.icon;
              const firstIndex = nav.findIndex((n) => n.href === item.href);
              const isPrimaryForHref = index === firstIndex;
              const pathMatch = item.exact
                ? pathname === item.href
                : pathname === item.href ||
                  (item.href.length > 1 &&
                    pathname.startsWith(`${item.href}/`));
              const active = pathMatch && isPrimaryForHref;
              return (
                <Link
                  key={`${item.href}-${item.labelKey}`}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 border-b border-border/60 px-4 py-3 text-sm transition-colors last:border-b-0",
                    active
                      ? "bg-primary/8 font-semibold text-primary"
                      : "text-foreground/80 hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4",
                      active ? "text-primary" : "text-muted-foreground",
                    )}
                    aria-hidden
                  />
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>

        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
