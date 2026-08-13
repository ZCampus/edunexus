"use client";

import { StudentHeader } from "@/components/student/ui";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useStudentCopy } from "@/lib/student-copy";
import { announcements } from "@/lib/student-mvp";

export default function StudentAnnouncementsPage() {
  const c = useStudentCopy();
  const categoryLabel = {
    exam: c.catExam,
    class: c.catClass,
    event: c.catEvent,
    general: c.catGeneral,
  } as const;

  return (
    <div className="flex flex-col gap-4">
      <StudentHeader
        title={c.announcementsTitle}
        hint={c.announcementsHint}
      />

      {announcements.map((item) => (
        <Card key={item.id}>
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <div className="mb-1 flex flex-wrap items-center gap-1.5">
                <Badge variant="secondary">
                  {categoryLabel[item.category as keyof typeof categoryLabel]}
                </Badge>
                {item.pinned ? <Badge>{c.pinned}</Badge> : null}
                {item.unread ? (
                  <Badge variant="outline">{c.unreadMail}</Badge>
                ) : null}
              </div>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>
                {item.author} · {item.time}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{item.body}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
