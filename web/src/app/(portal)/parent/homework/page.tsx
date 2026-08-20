"use client";

import { HomeworkBadge, ParentHeader } from "@/components/parent/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParentChild } from "@/lib/parent-child";
import { useParentCopy } from "@/lib/parent-copy";
import { childHomework } from "@/lib/parent-mvp";

export default function ParentHomeworkPage() {
  const { child } = useParentChild();
  const c = useParentCopy();
  const items = childHomework[child.id] ?? [];

  return (
    <div className="flex flex-col gap-4">
      <ParentHeader
        title={c.homeworkTitle}
        hint={`${child.name} · ${c.homeworkHint}`}
      />

      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>
                {item.subject} · {item.teacher}
              </CardDescription>
            </div>
            <HomeworkBadge status={item.status} copy={c} />
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              <span className="text-muted-foreground">{c.due}: </span>
              {item.due}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
