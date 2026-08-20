"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/lib/auth";
import { isClassTeacher } from "@/lib/class-teacher";
import { useClassTeacherCopy } from "@/lib/class-teacher-copy";
import { cn } from "@/lib/utils";

export default function ClassTeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const c = useClassTeacherCopy();

  useEffect(() => {
    if (ready && user && !isClassTeacher(user)) {
      router.replace("/teacher");
    }
  }, [ready, user, router]);

  if (user && !isClassTeacher(user)) {
    return (
      <p className="text-sm text-muted-foreground">{c.notClassTeacher}</p>
    );
  }

  const items = [
    { href: "/teacher/form", label: c.hubTitle, exact: true },
    { href: "/teacher/form/discipline", label: c.navDiscipline },
    { href: "/teacher/form/reports", label: c.navReports },
    { href: "/teacher/form/parents", label: c.navParents },
    { href: "/teacher/form/attendance", label: c.navAttendance },
  ];

  return (
    <div className="flex flex-col gap-4">
      <nav className="flex flex-wrap gap-1.5" aria-label={c.hubTitle}>
        {items.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:bg-muted/60",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      {children}
    </div>
  );
}
