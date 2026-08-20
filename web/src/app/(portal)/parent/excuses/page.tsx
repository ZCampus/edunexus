"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { ParentHeader } from "@/components/parent/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useParentChild } from "@/lib/parent-child";
import { useParentCopy } from "@/lib/parent-copy";
import { childExcuses } from "@/lib/parent-mvp";

export default function ParentExcusesPage() {
  const { child } = useParentChild();
  const c = useParentCopy();
  const seed = childExcuses[child.id as keyof typeof childExcuses] ?? [];
  const [extra, setExtra] = useState<typeof seed>([]);
  const [date, setDate] = useState("14 Aug");
  const [reason, setReason] = useState("");

  useEffect(() => {
    setExtra([]);
    setReason("");
  }, [child.id]);
  const items = [...extra, ...seed];

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reason.trim()) return;
    setExtra((prev) => [
      {
        id: `new-${Date.now()}`,
        date,
        reason,
        status: "Pending",
        note: child.classTeacher,
      },
      ...prev,
    ]);
    setReason("");
    toast.success(c.excuseSent);
  }

  return (
    <div className="flex flex-col gap-4">
      <ParentHeader
        title={c.excusesTitle}
        hint={`${child.classTeacher} · ${c.excusesHint}`}
      />

      <Card>
        <CardHeader>
          <CardTitle>{c.submitExcuse}</CardTitle>
          <CardDescription>{child.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="excuse-date">{c.date}</FieldLabel>
                <Input
                  id="excuse-date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="excuse-reason">{c.reason}</FieldLabel>
                <textarea
                  id="excuse-reason"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  rows={3}
                  required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </Field>
              <Button type="submit" className="w-fit">
                {c.submitExcuse}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle>{item.reason}</CardTitle>
              <CardDescription>{item.date}</CardDescription>
            </div>
            <Badge variant={item.status === "Approved" ? "secondary" : "outline"}>
              {item.status}
            </Badge>
          </CardHeader>
          {item.note ? (
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.note}</p>
            </CardContent>
          ) : null}
        </Card>
      ))}
    </div>
  );
}
