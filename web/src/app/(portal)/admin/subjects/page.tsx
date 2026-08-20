"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { AdminEmpty, AdminHeader, AdminSkeleton, Can } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { downloadCsv } from "@/lib/admin/csv";
import { can } from "@/lib/admin/permissions";
import { useAdminStore } from "@/lib/admin/store";
import { personName } from "@/lib/admin/types";
import { useAdminCopy } from "@/lib/admin-copy";
import { useAuth } from "@/lib/auth";

export default function SubjectsListPage() {
  const c = useAdminCopy();
  const { user } = useAuth();
  const { state, ready } = useAdminStore();
  const [query, setQuery] = useState("");

  const subjects = useMemo(() => {
    return state.subjects.filter((item) => {
      const hay = `${item.name} ${item.code}`.toLowerCase();
      return !query || hay.includes(query.toLowerCase());
    });
  }, [state.subjects, query]);

  if (!user || !can(user.role, "subjects", "view")) {
    return <AdminEmpty title={c.forbidden} hint="" />;
  }
  if (!ready) return <AdminSkeleton />;

  function exportRows() {
    downloadCsv("subjects.csv", [
      [c.subjectsTitle, c.code, c.teachers],
      ...subjects.map((item) => [
        item.name,
        item.code,
        item.teacherIds
          .map((id) => {
            const teacher = state.staff.find((entry) => entry.id === id);
            return teacher ? personName(teacher) : id;
          })
          .join("; "),
      ]),
    ]);
  }

  return (
    <div className="flex flex-col gap-4">
      <AdminHeader
        title={c.subjectsTitle}
        hint={c.subjectsHint}
        actions={
          <>
            <Can module="subjects" action="export">
              <Button type="button" variant="outline" onClick={exportRows}>
                {c.exportCsv}
              </Button>
            </Can>
            <Can module="subjects" action="create">
              <Button asChild>
                <Link href="/admin/subjects/new">{c.newSubject}</Link>
              </Button>
            </Can>
          </>
        }
      />
      <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={c.search} />
      {subjects.length === 0 ? (
        <AdminEmpty title={c.emptyTitle} hint={c.emptyHint} />
      ) : (
        <div className="rounded-xl border border-border/80 bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{c.subjectsTitle}</TableHead>
                <TableHead>{c.code}</TableHead>
                <TableHead>{c.teachers}</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>
                    {item.teacherIds
                      .map((id) => state.staff.find((entry) => entry.id === id))
                      .filter(Boolean)
                      .map((teacher) => personName(teacher!))
                      .join(", ") || c.none}
                  </TableCell>
                  <TableCell>
                    <Can module="subjects" action="edit">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/subjects/${item.id}/edit`}>{c.edit}</Link>
                      </Button>
                    </Can>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
