"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AdminSkeleton } from "@/components/admin/ui";
import { isAdminRole } from "@/lib/admin/permissions";
import { useAuth } from "@/lib/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready || !user) return;
    if (!isAdminRole(user.role)) {
      router.replace(user.homePath);
    }
  }, [ready, user, router]);

  if (!ready || !user || !isAdminRole(user.role)) {
    return <AdminSkeleton />;
  }

  return children;
}
