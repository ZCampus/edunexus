"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  Menu,
  UserRound,
  BookOpen,
  Wallet,
  ClipboardCheck,
  LayoutDashboard,
  PenLine,
  Bell,
  FileText,
} from "lucide-react";

import { LocaleToggle } from "@/components/locale-toggle";
import { OfflineBanner } from "@/components/offline-banner";
import { SchoolSwitcher } from "@/components/school-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useI18n } from "@/lib/i18n";
import { useTenant } from "@/lib/tenant";
import { cn } from "@/lib/utils";

const links = [
  {
    href: "/headmaster",
    key: "navHeadmaster" as const,
    icon: LayoutDashboard,
  },
  { href: "/parent", key: "navParent" as const, icon: UserRound },
  { href: "/student", key: "navStudent" as const, icon: BookOpen },
  {
    href: "/report-card",
    key: "navReport" as const,
    icon: FileText,
  },
  {
    href: "/teacher/attendance",
    key: "navTeacher" as const,
    icon: ClipboardCheck,
  },
  {
    href: "/teacher/marks",
    key: "navMarks" as const,
    icon: PenLine,
  },
  { href: "/fees", key: "navFees" as const, icon: Wallet },
  {
    href: "/notifications",
    key: "navNotifications" as const,
    icon: Bell,
  },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <nav className="flex flex-col gap-1" aria-label={t("roles")}>
      {links.map(({ href, key, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-foreground/80 hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon aria-hidden />
            {t(key)}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const { tenant } = useTenant();

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <OfflineBanner />
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-6xl">
        <aside className="hidden w-60 shrink-0 flex-col border-r border-border/80 bg-sidebar px-4 py-6 md:flex">
          <Link href="/" className="mb-6 flex items-center gap-2 px-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap aria-hidden />
            </span>
            <span className="font-[family-name:var(--font-display)] text-lg tracking-tight">
              {t("brand")}
            </span>
          </Link>
          <SchoolSwitcher className="mb-5" />
          <NavLinks />
          <div className="mt-auto flex flex-col gap-3 px-1 pt-8">
            <div className="flex items-center gap-2">
              <LocaleToggle className="flex-1" />
              <ThemeToggle />
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/login">{t("ctaLogin")}</Link>
            </Button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between gap-3 border-b border-border/80 px-4 py-3 md:px-8">
            <div className="flex items-center gap-2 md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon-sm" aria-label="Menu">
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72">
                  <SheetHeader>
                    <SheetTitle className="font-[family-name:var(--font-display)]">
                      {t("brand")}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 flex flex-col gap-6 px-2">
                    <SchoolSwitcher />
                    <NavLinks />
                    <div className="flex items-center gap-2">
                      <LocaleToggle className="flex-1" />
                      <ThemeToggle />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <span className="font-[family-name:var(--font-display)] text-base">
                {t("brand")}
              </span>
            </div>
            <div className="hidden text-sm text-muted-foreground md:block">
              {tenant.code} · {tenant.term}
            </div>
            <div className="flex items-center gap-2 md:hidden">
              <LocaleToggle />
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
