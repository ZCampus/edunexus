"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { AdminEmpty, AdminHeader, AdminSkeleton, Can, StatusBadge } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { formatIsoDate, scopedStudents } from "@/lib/admin/scope";
import { useAdminStore } from "@/lib/admin/store";
import { classLabel, personName, type PersonStatus } from "@/lib/admin/types";
import { useAdminCopy } from "@/lib/admin-copy";
import { useAuth } from "@/lib/auth";

export default function StudentsListPage() {
  const c = useAdminCopy();
  const { user } = useAuth();
  const { state, ready } = useAdminStore();
  const [query, setQuery] = useState("");
  const [classId, setClassId] = useState("all");
  const [status, setStatus] = useState<PersonStatus | "all">("active");

  const students = useMemo(() => {
    if (!user) return [];
    return scopedStudents(state, user).filter((item) => {
      const hay = `${item.firstName} ${item.lastName} ${item.admissionNo}`.toLowerCase();
      if (query && !hay.includes(query.toLowerCase())) return false;
      if (classId !== "all" && item.classId !== classId) return false;
      if (status !== "all" && item.status !== status) return false;
      return true;
    });
  }, [state, user, query, classId, status]);

  if (!user) return null;
  if (!can(user.role, "students", "view")) {
    return <AdminEmpty title={c.forbidden} hint="" />;
  }
  if (!ready) return <AdminSkeleton />;

  function exportRows() {
    downloadCsv("students.csv", [
      [c.admissionNo, c.firstName, c.lastName, c.class, c.status, c.email, c.phone],
      ...students.map((item) => {
        const klass = state.classes.find((entry) => entry.id === item.classId);
        return [
          item.admissionNo,
          item.firstName,
          item.lastName,
          klass ? classLabel(klass) : "",
          item.status,
          item.email,
          item.phone,
        ];
      }),
    ]);
  }

  return (
    <div className="flex flex-col gap-4">
      <AdminHeader
        title={c.studentsTitle}
        hint={c.studentsHint}
        actions={
          <>
            <Can module="students" action="export">
              <Button type="button" variant="outline" onClick={exportRows}>
                {c.exportCsv}
              </Button>
            </Can>
            <Can module="students" action="create">
              <Button asChild>
                <Link href="/admin/students/new">{c.addStudent}</Link>
              </Button>
            </Can>
          </>
        }
      />

      <div className="flex flex-col gap-2 md:flex-row">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={c.search}
          aria-label={c.search}
        />
        <Select value={classId} onValueChange={setClassId}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder={c.filterClass} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">{c.all}</SelectItem>
              {state.classes.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {classLabel(item)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(value) => setStatus(value as PersonStatus | "all")}>
          <SelectTrigger className="md:w-40">
            <SelectValue placeholder={c.filterStatus} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">{c.all}</SelectItem>
              <SelectItem value="active">{c.active}</SelectItem>
              <SelectItem value="inactive">{c.inactive}</SelectItem>
              <SelectItem value="archived">{c.archived}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {students.length === 0 ? (
        <AdminEmpty title={c.emptyTitle} hint={c.emptyHint} />
      ) : (
        <div className="rounded-xl border border-border/80 bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{c.admissionNo}</TableHead>
                <TableHead>{c.studentsTitle}</TableHead>
                <TableHead>{c.class}</TableHead>
                <TableHead>{c.status}</TableHead>
                <TableHead>{c.admissionDate}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((item) => {
                const klass = state.classes.find((entry) => entry.id === item.classId);
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.admissionNo}</TableCell>
                    <TableCell>
                      <Link href={`/admin/students/${item.id}`} className="hover:underline">
                        {personName(item)}
                      </Link>
                    </TableCell>
                    <TableCell>{klass ? classLabel(klass) : c.noClass}</TableCell>
                    <TableCell>
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell>{formatIsoDate(item.admissionDate)}</TableCell>
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
