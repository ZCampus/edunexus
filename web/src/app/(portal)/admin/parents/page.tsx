"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { AdminEmpty, AdminHeader, AdminSkeleton, Can, StatusBadge } from "@/components/admin/ui";
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

export default function ParentsListPage() {
  const c = useAdminCopy();
  const { user } = useAuth();
  const { state, ready } = useAdminStore();
  const [query, setQuery] = useState("");

  const parents = useMemo(() => {
    return state.parents.filter((item) => {
      const hay = `${item.firstName} ${item.lastName} ${item.phone} ${item.email}`.toLowerCase();
      return !query || hay.includes(query.toLowerCase());
    });
  }, [state.parents, query]);

  if (!user || !can(user.role, "parents", "view")) {
    return <AdminEmpty title={c.forbidden} hint="" />;
  }
  if (!ready) return <AdminSkeleton />;

  function exportRows() {
    downloadCsv("parents.csv", [
      [c.firstName, c.lastName, c.phone, c.email, c.children],
      ...parents.map((item) => [
        item.firstName,
        item.lastName,
        item.phone,
        item.email,
        String(state.students.filter((student) => student.parentIds.includes(item.id)).length),
      ]),
    ]);
  }

  return (
    <div className="flex flex-col gap-4">
      <AdminHeader
        title={c.parentsTitle}
        hint={c.parentsHint}
        actions={
          <>
            <Can module="parents" action="export">
              <Button type="button" variant="outline" onClick={exportRows}>
                {c.exportCsv}
              </Button>
            </Can>
            <Can module="parents" action="create">
              <Button asChild>
                <Link href="/admin/parents/new">{c.newParent}</Link>
              </Button>
            </Can>
          </>
        }
      />
      <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={c.search} />
      {parents.length === 0 ? (
        <AdminEmpty title={c.emptyTitle} hint={c.emptyHint} />
      ) : (
        <div className="rounded-xl border border-border/80 bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{c.parentsTitle}</TableHead>
                <TableHead>{c.phone}</TableHead>
                <TableHead>{c.email}</TableHead>
                <TableHead>{c.children}</TableHead>
                <TableHead>{c.status}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parents.map((item) => {
                const kids = state.students.filter((student) => student.parentIds.includes(item.id));
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Link href={`/admin/parents/${item.id}`} className="font-medium hover:underline">
                        {personName(item)}
                      </Link>
                    </TableCell>
                    <TableCell>{item.phone || c.none}</TableCell>
                    <TableCell>{item.email || c.none}</TableCell>
                    <TableCell>{kids.length}</TableCell>
                    <TableCell>
                      <StatusBadge status={item.status} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
