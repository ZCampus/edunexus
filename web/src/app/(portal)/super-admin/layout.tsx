"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AdminSkeleton } from "@/components/admin/ui";
import { isPlatformRole } from "@/lib/saas/permissions";
import { useAuth } from "@/lib/auth";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready || !user) return;
    if (!isPlatformRole(user.role)) {
      router.replace(user.homePath);
    }
  }, [ready, user, router]);

  if (!ready || !user || !isPlatformRole(user.role)) {
    return <AdminSkeleton />;
  }

  return children;
}
