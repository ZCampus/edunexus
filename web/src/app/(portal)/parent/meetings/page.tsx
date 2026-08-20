"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ParentHeader } from "@/components/parent/ui";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParentChild } from "@/lib/parent-child";
import { useParentCopy } from "@/lib/parent-copy";
import { meetings } from "@/lib/parent-mvp";

export default function ParentMeetingsPage() {
  const { child } = useParentChild();
  const c = useParentCopy();
  const items = meetings.filter((item) => item.childId === child.id);
  const [rsvp, setRsvp] = useState<Record<string, boolean>>({});

  function confirm(id: string) {
    setRsvp((prev) => ({ ...prev, [id]: true }));
    toast.success(c.rsvpDone);
  }

  return (
    <div className="flex flex-col gap-4">
      <ParentHeader
        title={c.meetingsTitle}
        hint={`${child.name} · ${c.meetingsHint}`}
      />

      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>
              {item.with} · {item.when}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">{item.venue}</p>
            <Button
              type="button"
              className="w-fit"
              disabled={rsvp[item.id]}
              onClick={() => confirm(item.id)}
            >
              {rsvp[item.id] ? c.rsvpDone : c.rsvp}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
