"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { AdminEmpty, AdminHeader, AdminSkeleton, Can } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { downloadCsv } from "@/lib/admin/csv";
import { can } from "@/lib/admin/permissions";
import { scopedClasses } from "@/lib/admin/scope";
import { useAdminStore } from "@/lib/admin/store";
import { classLabel, personName } from "@/lib/admin/types";
import { useAdminCopy } from "@/lib/admin-copy";
import { useAuth } from "@/lib/auth";

export default function ClassesListPage() {
  const c = useAdminCopy();
  const { user } = useAuth();
  const { state, ready } = useAdminStore();
  const [query, setQuery] = useState("");

  const classes = useMemo(() => {
    if (!user) return [];
    return scopedClasses(state, user).filter((item) =>
      classLabel(item).toLowerCase().includes(query.toLowerCase()),
    );
  }, [state, user, query]);

  if (!user || !can(user.role, "classes", "view")) {
    return <AdminEmpty title={c.forbidden} hint="" />;
  }
  if (!ready) return <AdminSkeleton />;

  function exportRows() {
    downloadCsv("classes.csv", [
      [c.class, c.section, c.classTeacher, c.capacity, c.enrolled],
      ...classes.map((item) => {
        const teacher = state.staff.find((entry) => entry.id === item.classTeacherId);
        const count = state.students.filter(
          (student) => student.classId === item.id && student.status !== "archived",
        ).length;
        return [
          item.name,
          item.section,
          teacher ? personName(teacher) : "",
          String(item.capacity),
          String(count),
        ];
      }),
    ]);
  }

  return (
    <div className="flex flex-col gap-4">
      <AdminHeader
        title={c.classesTitle}
        hint={c.classesHint}
        actions={
          <>
            <Can module="classes" action="export">
              <Button type="button" variant="outline" onClick={exportRows}>
                {c.exportCsv}
              </Button>
            </Can>
            <Can module="classes" action="create">
              <Button asChild>
                <Link href="/admin/classes/new">{c.newClass}</Link>
              </Button>
            </Can>
          </>
        }
      />
      <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={c.search} />
      {classes.length === 0 ? (
        <AdminEmpty title={c.emptyTitle} hint={c.emptyHint} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {classes.map((item) => {
            const teacher = state.staff.find((entry) => entry.id === item.classTeacherId);
            const count = state.students.filter(
              (student) => student.classId === item.id && student.status !== "archived",
            ).length;
            return (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle>
                    <Link href={`/admin/classes/${item.id}`} className="hover:underline">
                      {classLabel(item)}
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    {teacher ? personName(teacher) : c.unassigned}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {count}/{item.capacity} {c.enrolled} · {item.subjectIds.length} {c.subjects}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
