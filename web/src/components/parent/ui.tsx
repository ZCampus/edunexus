"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { parentChildren } from "@/lib/parent-mvp";
import { useParentChild } from "@/lib/parent-child";
import type { ParentCopy } from "@/lib/parent-copy";
import type { AttendanceMark, HomeworkStatus } from "@/lib/parent-mvp";

export function ParentHeader({
  title,
  hint,
}: {
  title: string;
  hint: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="font-[family-name:var(--font-display)] text-2xl tracking-tight md:text-3xl">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}

export function ChildSwitcher() {
  const { child, setChildId } = useParentChild();

  return (
    <div className="flex flex-wrap gap-2">
      {parentChildren.map((item) => {
        const active = item.id === child.id;
        return (
          <Button
            key={item.id}
            type="button"
            size="sm"
            variant={active ? "default" : "outline"}
            onClick={() => setChildId(item.id)}
            className="gap-2"
          >
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-full text-[10px] font-semibold",
                active
                  ? "bg-primary-foreground/20"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {item.initials}
            </span>
            <span className="flex flex-col items-start leading-tight">
              <span>{item.name.split(" ")[0]}</span>
              <span
                className={cn(
                  "text-[10px] font-normal",
                  active ? "text-primary-foreground/80" : "text-muted-foreground",
                )}
              >
                {item.className}
              </span>
            </span>
          </Button>
        );
      })}
    </div>
  );
}

const homeworkTone: Record<HomeworkStatus, string> = {
  not_submitted: "border-border text-foreground",
  submitted: "border-primary/30 bg-primary/10 text-primary",
  late: "border-accent bg-accent text-accent-foreground",
  graded: "border-primary/30 bg-primary/10 text-primary",
  returned: "border-border text-muted-foreground",
  overdue: "border-destructive/20 bg-destructive/10 text-destructive",
};

export function HomeworkBadge({
  status,
  copy,
}: {
  status: HomeworkStatus;
  copy: ParentCopy;
}) {
  const map: Record<HomeworkStatus, string> = {
    not_submitted: copy.hwNotSubmitted,
    submitted: copy.hwSubmitted,
    late: copy.hwLate,
    graded: copy.hwGraded,
    returned: copy.hwReturned,
    overdue: copy.hwOverdue,
  };
  return (
    <Badge variant="outline" className={cn(homeworkTone[status])}>
      {map[status]}
    </Badge>
  );
}

const attendanceTone: Record<AttendanceMark, string> = {
  present: "border-primary/30 bg-primary/10 text-primary",
  absent: "border-destructive/20 bg-destructive/10 text-destructive",
  late: "border-accent bg-accent text-accent-foreground",
  excused: "border-border text-muted-foreground",
  leave: "border-border text-muted-foreground",
};

export function AttendanceBadge({
  status,
  copy,
}: {
  status: AttendanceMark;
  copy: ParentCopy;
}) {
  const map: Record<AttendanceMark, string> = {
    present: copy.attPresent,
    absent: copy.attAbsent,
    late: copy.attLate,
    excused: copy.attExcused,
    leave: copy.attLeave,
  };
  return (
    <Badge variant="outline" className={cn(attendanceTone[status])}>
      {map[status]}
    </Badge>
  );
}
