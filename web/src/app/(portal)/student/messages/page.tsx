"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { StudentHeader } from "@/components/student/ui";
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
import { useStudentCopy } from "@/lib/student-copy";
import { messages as seedMessages } from "@/lib/student-mvp";

export default function StudentMessagesPage() {
  const c = useStudentCopy();
  const [activeId, setActiveId] = useState(seedMessages[0]?.id);
  const [draft, setDraft] = useState("");
  const active = seedMessages.find((item) => item.id === activeId);

  function onSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.trim()) return;
    setDraft("");
    toast.success(c.sentToast);
  }

  return (
    <div className="flex flex-col gap-4">
      <StudentHeader title={c.messagesTitle} hint={c.messagesHint} />

      <div className="grid gap-3 md:grid-cols-[minmax(0,16rem)_1fr]">
        <div className="flex flex-col gap-2">
          {seedMessages.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              className="rounded-xl border border-border/80 bg-card px-3 py-2 text-left shadow-sm hover:bg-muted/50"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{item.from}</p>
                {item.unread ? <Badge variant="outline">{c.unreadMail}</Badge> : null}
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
                    <FieldLabel htmlFor="reply">{c.reply}</FieldLabel>
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
