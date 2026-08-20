"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AdminEmpty, AdminHeader, AdminSkeleton } from "@/components/admin/ui";
import { AppSelect, TextField } from "@/components/admin/fields";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/lib/auth";
import { saveTicket } from "@/lib/saas/api";
import { ticketStatusLabel } from "@/lib/saas/labels";
import { canSaas } from "@/lib/saas/permissions";
import { useSaasStore } from "@/lib/saas/store";
import type { TicketCategory, TicketPriority } from "@/lib/saas/types";
import { useSaasCopy } from "@/lib/saas-copy";

export default function TicketsPage() {
  const c = useSaasCopy();
  const { user } = useAuth();
  const { state, ready } = useSaasStore();
  const [schoolId, setSchoolId] = useState(state.schools[0]?.id ?? "");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<TicketCategory>("technical");
  const [priority, setPriority] = useState<TicketPriority>("medium");

  useEffect(() => {
    if (!schoolId && state.schools[0]) setSchoolId(state.schools[0].id);
  }, [schoolId, state.schools]);

  if (!user || !canSaas(user.role, "tickets", "view")) {
    return <AdminEmpty title={c.forbidden} hint="" />;
  }
  if (!ready) return <AdminSkeleton />;

  async function onCreate() {
    if (!user || !subject.trim()) {
      toast.error(c.required);
      return;
    }
    await saveTicket(
      {
        schoolId,
        subject,
        category,
        priority,
        status: "open",
        requester: user.name,
        assigneeId: user.role === "support" ? "ps-support" : null,
        createdAt: new Date().toISOString(),
      },
      user.name,
    );
    setSubject("");
    toast.success(c.saved);
  }

  return (
    <div className="flex flex-col gap-4">
      <AdminHeader title={c.ticketsTitle} hint={c.ticketsHint} />
      {canSaas(user.role, "tickets", "create") ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{c.openTicket}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FieldGroup>
              <div className="grid gap-4 md:grid-cols-2">
                <AppSelect
                  id="school"
                  label={c.selectSchool}
                  value={schoolId}
                  onChange={setSchoolId}
                  options={state.schools.map((item) => ({ value: item.id, label: item.name }))}
                />
                <TextField id="subject" label={c.subject} value={subject} onChange={setSubject} />
                <AppSelect
                  id="cat"
                  label={c.category}
                  value={category}
                  onChange={(value) => setCategory(value as TicketCategory)}
                  options={[
                    { value: "technical", label: "Technical" },
                    { value: "billing", label: "Billing" },
                    { value: "feature", label: "Feature" },
                    { value: "bug", label: "Bug" },
                    { value: "account", label: "Account" },
                    { value: "training", label: "Training" },
                  ]}
                />
                <AppSelect
                  id="pri"
                  label={c.priority}
                  value={priority}
                  onChange={(value) => setPriority(value as TicketPriority)}
                  options={[
                    { value: "low", label: c.low },
                    { value: "medium", label: c.medium },
                    { value: "high", label: c.high },
                  ]}
                />
              </div>
            </FieldGroup>
            <Button type="button" onClick={onCreate}>{c.openTicket}</Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="rounded-xl border border-border/80 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{c.subject}</TableHead>
              <TableHead>{c.schoolName}</TableHead>
              <TableHead>{c.priority}</TableHead>
              <TableHead>{c.status}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.tickets.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Link href={`/super-admin/tickets/${item.id}`} className="font-medium hover:underline">
                    {item.subject}
                  </Link>
                </TableCell>
                <TableCell>{state.schools.find((school) => school.id === item.schoolId)?.name}</TableCell>
                <TableCell>{item.priority}</TableCell>
                <TableCell>
                  <Badge variant="outline">{ticketStatusLabel(item.status, c)}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
