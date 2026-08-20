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
import { useAdminStore } from "@/lib/admin/store";
import { personName, type StaffRole } from "@/lib/admin/types";
import { useAdminCopy } from "@/lib/admin-copy";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { roleLabelKey } from "@/lib/role-label";

export default function StaffListPage() {
  const c = useAdminCopy();
  const { t } = useI18n();
  const { user } = useAuth();
  const { state, ready } = useAdminStore();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<StaffRole | "all">("all");

  const staff = useMemo(() => {
    return state.staff.filter((item) => {
      const hay = `${item.firstName} ${item.lastName} ${item.email}`.toLowerCase();
      if (query && !hay.includes(query.toLowerCase())) return false;
      if (role !== "all" && item.role !== role) return false;
      return true;
    });
  }, [state.staff, query, role]);

  if (!user || !can(user.role, "staff", "view")) {
    return <AdminEmpty title={c.forbidden} hint="" />;
  }
  if (!ready) return <AdminSkeleton />;

  function exportRows() {
    downloadCsv("staff.csv", [
      [c.firstName, c.lastName, c.role, c.email, c.phone, c.status],
      ...staff.map((item) => [
        item.firstName,
        item.lastName,
        item.role,
        item.email,
        item.phone,
        item.status,
      ]),
    ]);
  }

  return (
    <div className="flex flex-col gap-4">
      <AdminHeader
        title={c.staffTitle}
        hint={c.staffHint}
        actions={
          <>
            <Can module="staff" action="export">
              <Button type="button" variant="outline" onClick={exportRows}>
                {c.exportCsv}
              </Button>
            </Can>
            <Can module="staff" action="create">
              <Button asChild>
                <Link href="/admin/staff/new">{c.newStaff}</Link>
              </Button>
            </Can>
          </>
        }
      />
      <div className="flex flex-col gap-2 md:flex-row">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={c.search} />
        <Select value={role} onValueChange={(value) => setRole(value as StaffRole | "all")}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder={c.filterRole} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">{c.all}</SelectItem>
              <SelectItem value="school_admin">{t("roleSchoolAdmin")}</SelectItem>
              <SelectItem value="principal">{t("rolePrincipal")}</SelectItem>
              <SelectItem value="teacher">{t("roleTeacher")}</SelectItem>
              <SelectItem value="accountant">{t("roleAccountant")}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {staff.length === 0 ? (
        <AdminEmpty title={c.emptyTitle} hint={c.emptyHint} />
      ) : (
        <div className="rounded-xl border border-border/80 bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{c.staffTitle}</TableHead>
                <TableHead>{c.role}</TableHead>
                <TableHead>{c.email}</TableHead>
                <TableHead>{c.loginAccess}</TableHead>
                <TableHead>{c.status}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Link href={`/admin/staff/${item.id}`} className="font-medium hover:underline">
                      {personName(item)}
                    </Link>
                  </TableCell>
                  <TableCell>{t(roleLabelKey(item.role))}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.hasLogin ? c.hasLogin : c.noLogin}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
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
