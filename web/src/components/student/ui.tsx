import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  AttendanceMark,
  ExamStatus,
  HomeworkStatus,
  MaterialType,
} from "@/lib/student-mvp";
import type { StudentCopy } from "@/lib/student-copy";

export function StudentHeader({
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

export function SectionLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-primary hover:underline"
    >
      {children}
    </Link>
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

export function homeworkLabel(status: HomeworkStatus, c: StudentCopy) {
  const map: Record<HomeworkStatus, string> = {
    not_submitted: c.hwNotSubmitted,
    submitted: c.hwSubmitted,
    late: c.hwLate,
    graded: c.hwGraded,
    returned: c.hwReturned,
    overdue: c.hwOverdue,
  };
  return map[status];
}

export function HomeworkBadge({
  status,
  copy,
}: {
  status: HomeworkStatus;
  copy: StudentCopy;
}) {
  return (
    <Badge variant="outline" className={cn(homeworkTone[status])}>
      {homeworkLabel(status, copy)}
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

export function attendanceLabel(status: AttendanceMark, c: StudentCopy) {
  const map: Record<AttendanceMark, string> = {
    present: c.attPresent,
    absent: c.attAbsent,
    late: c.attLate,
    excused: c.attExcused,
    leave: c.attLeave,
  };
  return map[status];
}

export function AttendanceBadge({
  status,
  copy,
}: {
  status: AttendanceMark;
  copy: StudentCopy;
}) {
  return (
    <Badge variant="outline" className={cn(attendanceTone[status])}>
      {attendanceLabel(status, copy)}
    </Badge>
  );
}

const examTone: Record<ExamStatus, string> = {
  upcoming: "border-primary/30 bg-primary/10 text-primary",
  ongoing: "border-accent bg-accent text-accent-foreground",
  completed: "border-border text-muted-foreground",
  results_released: "border-primary/30 bg-primary/10 text-primary",
};

export function examLabel(status: ExamStatus, c: StudentCopy) {
  const map: Record<ExamStatus, string> = {
    upcoming: c.examUpcoming,
    ongoing: c.examOngoing,
    completed: c.examCompleted,
    results_released: c.examResults,
  };
  return map[status];
}

export function ExamBadge({
  status,
  copy,
}: {
  status: ExamStatus;
  copy: StudentCopy;
}) {
  return (
    <Badge variant="outline" className={cn(examTone[status])}>
      {examLabel(status, copy)}
    </Badge>
  );
}

export function materialLabel(type: MaterialType, c: StudentCopy) {
  const map: Record<MaterialType, string> = {
    document: c.typeDocument,
    video: c.typeVideo,
    presentation: c.typePresentation,
    worksheet: c.typeWorksheet,
    past_paper: c.typePastPaper,
    link: c.typeLink,
  };
  return map[type];
}
