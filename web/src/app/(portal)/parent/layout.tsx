"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { ChildSwitcher } from "@/components/parent/ui";
import { useAuth } from "@/lib/auth";
import { ParentChildProvider } from "@/lib/parent-child";

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && user && user.role !== "parent") {
      router.replace(user.homePath);
    }
  }, [ready, user, router]);

  if (user && user.role !== "parent") {
    return null;
  }

  return (
    <ParentChildProvider>
      <div className="flex flex-col gap-4">
        <ChildSwitcher />
        {children}
      </div>
    </ParentChildProvider>
  );
}
