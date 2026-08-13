"use client";

import { StudentHeader } from "@/components/student/ui";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useStudentCopy } from "@/lib/student-copy";
import { calendarEvents } from "@/lib/student-mvp";

export default function StudentCalendarPage() {
  const c = useStudentCopy();
  const typeLabel = {
    homework: c.typeHomework,
    exam: c.typeExam,
    event: c.typeEvent,
    holiday: c.typeHoliday,
  } as const;

  return (
    <div className="flex flex-col gap-4">
      <StudentHeader title={c.calendarTitle} hint={c.calendarHint} />

      {calendarEvents.map((item) => (
        <Card key={item.id} size="sm">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>
                {item.date} · {item.time} · {item.venue}
              </CardDescription>
            </div>
            <Badge variant="secondary">
              {typeLabel[item.type as keyof typeof typeLabel]}
            </Badge>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
