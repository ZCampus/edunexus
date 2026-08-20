"use client";

import { useParams } from "next/navigation";

import { AdminHeader, AdminSkeleton, ForbiddenState } from "@/components/admin/ui";
import { ClassForm } from "@/components/admin/class-form";
import { can } from "@/lib/admin/permissions";
import { canViewClass } from "@/lib/admin/scope";
import { useAdminStore } from "@/lib/admin/store";
import { useAdminCopy } from "@/lib/admin-copy";
import { useAuth } from "@/lib/auth";

export default function EditClassPage() {
  const c = useAdminCopy();
  const { user } = useAuth();
  const params = useParams<{ id: string }>();
  const { state, ready } = useAdminStore();
  const klass = state.classes.find((item) => item.id === params.id);

  if (!user || !can(user.role, "classes", "edit")) {
    return <ForbiddenState message={c.forbidden} />;
  }
  if (!ready) return <AdminSkeleton />;
  if (!klass || !canViewClass(state, user, klass.id)) {
    return <ForbiddenState message={c.notFound} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <AdminHeader title={c.editClass} hint={c.classesHint} />
      <ClassForm klass={klass} />
    </div>
  );
}
