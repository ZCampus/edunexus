"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { AdminEmpty, AdminHeader, AdminSkeleton } from "@/components/admin/ui";
import { Badge } from "@/components/ui/badge";
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
import { useAuth } from "@/lib/auth";
import { formatTzs } from "@/lib/mock-data";
import { saveSchool } from "@/lib/saas/api";
import { schoolStatusLabel, slugify } from "@/lib/saas/labels";
import { canSaas } from "@/lib/saas/permissions";
import { useSaasStore } from "@/lib/saas/store";
import type { SchoolStatus, SchoolType } from "@/lib/saas/types";
import { useSaasCopy } from "@/lib/saas-copy";

export default function SchoolsPage() {
  const c = useSaasCopy();
  const { user } = useAuth();
  const { state, ready } = useSaasStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<SchoolStatus | "all">("all");
  const fileRef = useRef<HTMLInputElement>(null);

  const rows = useMemo(() => {
    return state.schools.filter((item) => {
      const hay = `${item.name} ${item.ownerEmail} ${item.region}`.toLowerCase();
      if (query && !hay.includes(query.toLowerCase())) return false;
      if (status !== "all" && item.status !== status) return false;
      return true;
    });
  }, [state.schools, query, status]);

  if (!user || !canSaas(user.role, "schools", "view")) {
    return <AdminEmpty title={c.forbidden} hint="" />;
  }
  if (!ready) return <AdminSkeleton />;

  async function importCsv(file: File) {
    if (!user) return;
    const text = await file.text();
    const lines = text.trim().split(/\r?\n/).slice(1);
    const starter = state.plans.find((item) => item.code === "starter") ?? state.plans[0];
    const trial = new Date();
    trial.setDate(trial.getDate() + 14);
    const trialEndsAt = trial.toISOString().slice(0, 10);
    for (const line of lines) {
      const [name, type, country, region, ownerName, ownerEmail, phone, students] = line.split(",").map((part) => part.trim());
      if (!name || !ownerEmail) continue;
      await saveSchool(
        {
          name,
          code: name.slice(0, 3).toUpperCase(),
          type: (type as SchoolType) || "secondary",
          country: country || "Tanzania",
          region: region || "",
          city: region || "",
          ownerName: ownerName || name,
          ownerEmail,
          ownerPhone: phone || "",
          planId: starter.id,
          status: "trial",
          billingCycle: "monthly",
          trialEndsAt,
          subscriptionEndsAt: trialEndsAt,
          studentsCount: Number(students) || 0,
          staffCount: 1,
          parentsCount: 0,
          monthlyFeeTzs: starter.monthlyTzs,
          lastPaymentAt: "",
          outstandingTzs: 0,
          subdomain: slugify(name),
          createdAt: new Date().toISOString().slice(0, 10),
          notes: "Bulk import",
        },
        user.name,
      );
    }
    toast.success(c.bulkDone);
  }

  return (
    <div className="flex flex-col gap-4">
      <AdminHeader
        title={c.schoolsTitle}
        hint={c.schoolsHint}
        actions={
          <>
            {canSaas(user.role, "schools", "export") ? (
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  downloadCsv("schools.csv", [
                    [c.schoolName, c.status, c.plan, c.students, c.fee],
                    ...rows.map((item) => [
                      item.name,
                      item.status,
                      state.plans.find((plan) => plan.id === item.planId)?.name ?? "",
                      String(item.studentsCount),
                      String(item.monthlyFeeTzs),
                    ]),
                  ])
                }
              >
                {c.exportCsv}
              </Button>
            ) : null}
            {canSaas(user.role, "schools", "create") ? (
              <>
                <Input
                  ref={fileRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = "";
                    if (file) void importCsv(file);
                  }}
                />
                <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
                  {c.bulkImport}
                </Button>
                <Button asChild>
                  <Link href="/super-admin/schools/new">{c.addSchool}</Link>
                </Button>
              </>
            ) : null}
          </>
        }
      />
      <p className="text-xs text-muted-foreground">{c.bulkHint}</p>
      <div className="flex flex-col gap-2 md:flex-row">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={c.search} />
        <Select value={status} onValueChange={(value) => setStatus(value as SchoolStatus | "all")}>
          <SelectTrigger className="md:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">{c.all}</SelectItem>
              <SelectItem value="active">{c.active}</SelectItem>
              <SelectItem value="trial">{c.trial}</SelectItem>
              <SelectItem value="suspended">{c.suspended}</SelectItem>
              <SelectItem value="cancelled">{c.cancelled}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {rows.length === 0 ? (
        <AdminEmpty title={c.emptyTitle} hint={c.emptyHint} />
      ) : (
        <div className="rounded-xl border border-border/80 bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{c.schoolName}</TableHead>
                <TableHead>{c.plan}</TableHead>
                <TableHead>{c.status}</TableHead>
                <TableHead>{c.students}</TableHead>
                <TableHead>{c.fee}</TableHead>
                <TableHead>{c.outstanding}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Link href={`/super-admin/schools/${item.id}`} className="font-medium hover:underline">
                      {item.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{item.region}</p>
                  </TableCell>
                  <TableCell>{state.plans.find((plan) => plan.id === item.planId)?.name}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === "active" ? "secondary" : "outline"}>
                      {schoolStatusLabel(item.status, c)}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.studentsCount}</TableCell>
                  <TableCell>{formatTzs(item.monthlyFeeTzs)}</TableCell>
                  <TableCell>{formatTzs(item.outstandingTzs)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
