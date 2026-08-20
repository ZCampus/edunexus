"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { can } from "@/lib/admin/permissions";
import type { AdminModule, PermissionAction, PersonStatus } from "@/lib/admin/types";
import { useAdminCopy, type AdminCopy } from "@/lib/admin-copy";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function AdminHeader({
  title,
  hint,
  actions,
}: {
  title: string;
  hint: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="font-[family-name:var(--font-display)] text-2xl tracking-tight md:text-3xl">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function AdminSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full" />
      ))}
    </div>
  );
}

export function AdminEmpty({
  title,
  hint,
  action,
}: {
  title: string;
  hint: string;
  action?: ReactNode;
}) {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        {hint ? <EmptyDescription>{hint}</EmptyDescription> : null}
      </EmptyHeader>
      {action ? <EmptyContent>{action}</EmptyContent> : null}
    </Empty>
  );
}

export function ForbiddenState({ message }: { message: string }) {
  return (
    <AdminEmpty
      title={message}
      hint=""
      action={
        <Button asChild variant="outline">
          <Link href="/admin">Dashboard</Link>
        </Button>
      }
    />
  );
}

export function StatusBadge({ status }: { status: PersonStatus }) {
  const c = useAdminCopy();
  const label =
    status === "active" ? c.active : status === "inactive" ? c.inactive : c.archived;
  return (
    <Badge
      variant={status === "active" ? "secondary" : "outline"}
      className={cn(
        status === "inactive" && "text-muted-foreground",
        status === "archived" && "text-muted-foreground",
      )}
    >
      {label}
    </Badge>
  );
}

export function Can({
  module,
  action,
  children,
}: {
  module: AdminModule;
  action: PermissionAction;
  children: ReactNode;
}) {
  const { user } = useAuth();
  if (!user || !can(user.role, module, action)) return null;
  return children;
}

export function ComingSoonButton({ label, hint }: { label: string; hint: string }) {
  return (
    <Button type="button" variant="outline" disabled title={hint}>
      {label}
    </Button>
  );
}

export function statusLabel(status: PersonStatus, c: AdminCopy) {
  if (status === "active") return c.active;
  if (status === "inactive") return c.inactive;
  return c.archived;
}
