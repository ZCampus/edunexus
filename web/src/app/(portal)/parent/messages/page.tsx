"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
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
import { useParentChild } from "@/lib/parent-child";
import { useParentCopy } from "@/lib/parent-copy";
import { parentMessages } from "@/lib/parent-mvp";

export default function ParentMessagesPage() {
  const { child } = useParentChild();
  const c = useParentCopy();
  const threads = useMemo(
    () => parentMessages.filter((item) => item.childId === child.id),
    [child.id],
  );
  const [activeId, setActiveId] = useState<string | undefined>(threads[0]?.id);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    setActiveId(
      parentMessages.find((item) => item.childId === child.id)?.id,
    );
    setDraft("");
  }, [child.id]);
  const active = threads.find((item) => item.id === activeId) ?? threads[0];

  function onSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.trim()) return;
    setDraft("");
    toast.success(c.sent);
  }

  return (
    <div className="flex flex-col gap-4">
      <ParentHeader
        title={c.messagesTitle}
        hint={`${child.classTeacher} · ${c.messagesHint}`}
      />

      <div className="grid gap-3 md:grid-cols-[minmax(0,16rem)_1fr]">
        <div className="flex flex-col gap-2">
          {threads.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              className="rounded-xl border border-border/80 bg-card px-3 py-2 text-left shadow-sm hover:bg-muted/50"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{item.from}</p>
                <Badge variant="outline">{item.role}</Badge>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {item.preview}
              </p>
            </button>
          ))}
        </div>

        {active ? (
          <Card>
            <CardHeader>
              <CardTitle>{active.from}</CardTitle>
              <CardDescription>
                {active.role} · {active.time}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm leading-relaxed">{active.body}</p>
              <form onSubmit={onSend}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="reply">{c.messageTeacher}</FieldLabel>
                    <textarea
                      id="reply"
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      placeholder={c.replyPlaceholder}
                      rows={3}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    />
                  </Field>
                  <Button type="submit" className="w-fit">
                    {c.send}
                  </Button>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
