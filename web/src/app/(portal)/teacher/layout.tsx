"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && user && user.role !== "teacher") {
      router.replace(user.homePath);
    }
  }, [ready, user, router]);

  if (user && user.role !== "teacher") {
    return null;
  }

  return children;
}
