"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { AdminHeader, AdminSkeleton, Can, ForbiddenState } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { can } from "@/lib/admin/permissions";
import { canViewClass } from "@/lib/admin/scope";
import { useAdminStore } from "@/lib/admin/store";
import { classLabel, personName } from "@/lib/admin/types";
import { useAdminCopy } from "@/lib/admin-copy";
import { useAuth } from "@/lib/auth";

export default function ClassDetailPage() {
  const c = useAdminCopy();
  const { user } = useAuth();
  const params = useParams<{ id: string }>();
  const { state, ready } = useAdminStore();
  const klass = state.classes.find((item) => item.id === params.id);

  if (!user || !can(user.role, "classes", "view")) {
    return <ForbiddenState message={c.forbidden} />;
  }
  if (!ready) return <AdminSkeleton />;
  if (!klass || !canViewClass(state, user, klass.id)) {
    return <ForbiddenState message={c.notFound} />;
  }

  const teacher = state.staff.find((item) => item.id === klass.classTeacherId);
  const students = state.students.filter(
    (item) => item.classId === klass.id && item.status !== "archived",
  );
  const subjects = state.subjects.filter((item) => klass.subjectIds.includes(item.id));

  return (
    <div className="flex flex-col gap-4">
      <AdminHeader
        title={classLabel(klass)}
        hint={`${students.length}/${klass.capacity} ${c.enrolled}`}
        actions={
          <Can module="classes" action="edit">
            <Button asChild variant="outline">
              <Link href={`/admin/classes/${klass.id}/edit`}>{c.edit}</Link>
            </Button>
          </Can>
        }
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{c.classTeacher}</CardTitle>
          </CardHeader>
          <CardContent>
            {teacher ? (
              <Link href={`/admin/staff/${teacher.id}`} className="text-sm font-medium hover:underline">
                {personName(teacher)}
              </Link>
            ) : (
              <p className="text-sm text-muted-foreground">{c.unassigned}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{c.subjectsInClass}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {subjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">{c.none}</p>
            ) : (
              subjects.map((item) => (
                <p key={item.id} className="text-sm">
                  {item.name} · {item.code}
                </p>
              ))
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">{c.studentsInClass}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {students.length === 0 ? (
              <p className="text-sm text-muted-foreground">{c.none}</p>
            ) : (
              students.map((item) => (
                <Link
                  key={item.id}
                  href={`/admin/students/${item.id}`}
                  className="rounded-lg border border-border/70 px-3 py-2 text-sm hover:bg-muted/40"
                >
                  {personName(item)} · {item.admissionNo}
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
