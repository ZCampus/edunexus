"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { AdminHeader, AdminSkeleton, ForbiddenState } from "@/components/admin/ui";
import { AreaField } from "@/components/admin/fields";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { createId } from "@/lib/saas/store";
import { replyTicket, saveTicket } from "@/lib/saas/api";
import { ticketStatusLabel } from "@/lib/saas/labels";
import { canSaas } from "@/lib/saas/permissions";
import { useSaasStore } from "@/lib/saas/store";
import type { TicketStatus } from "@/lib/saas/types";
import { useSaasCopy } from "@/lib/saas-copy";

export default function TicketDetailPage() {
  const c = useSaasCopy();
  const { user } = useAuth();
  const params = useParams<{ id: string }>();
  const { state, ready } = useSaasStore();
  const [body, setBody] = useState("");
  const ticket = state.tickets.find((item) => item.id === params.id);

  if (!user || !canSaas(user.role, "tickets", "view")) {
    return <ForbiddenState message={c.forbidden} />;
  }
  if (!ready) return <AdminSkeleton />;
  if (!ticket) return <ForbiddenState message={c.notFound} />;

  const school = state.schools.find((item) => item.id === ticket.schoolId);
  const record = ticket;

  async function onReply() {
    if (!body.trim() || !user) return;
    await replyTicket(
      record.id,
      { id: createId("tm"), at: new Date().toISOString(), author: user.name, body },
      user.name,
    );
    setBody("");
    toast.success(c.saved);
  }

  async function setStatus(status: TicketStatus) {
    if (!user) return;
    await saveTicket({ ...record, status }, user.name);
    toast.success(c.saved);
  }

  return (
    <div className="flex flex-col gap-4">
      <AdminHeader title={ticket.subject} hint={school?.name ?? ""} />
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">{ticketStatusLabel(ticket.status, c)}</Badge>
        {canSaas(user.role, "tickets", "edit") ? (
          <>
            <Button type="button" size="sm" variant="outline" onClick={() => setStatus("resolved")}>
              {c.resolved}
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => setStatus("closed")}>
              {c.closed}
            </Button>
          </>
        ) : null}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{c.message}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {ticket.messages.map((item) => (
            <div key={item.id} className="rounded-lg border border-border/70 px-3 py-2">
              <p className="text-xs text-muted-foreground">{item.author}</p>
              <p className="text-sm">{item.body}</p>
            </div>
          ))}
          {canSaas(user.role, "tickets", "edit") ? (
            <>
              <AreaField id="reply" label={c.reply} value={body} onChange={setBody} />
              <Button type="button" onClick={onReply}>{c.reply}</Button>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
