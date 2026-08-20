"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { TeacherHeader } from "@/components/teacher/ui";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTeacherCopy } from "@/lib/teacher-copy";
import { teacherClasses, teacherRoster } from "@/lib/teacher-mvp";

export default function TeacherClassRosterPage() {
  const { id } = useParams<{ id: string }>();
  const c = useTeacherCopy();
  const cls = teacherClasses.find((item) => item.id === id) ?? teacherClasses[0];
  const roster = cls.id === "c-f2a" ? teacherRoster : teacherRoster.slice(0, 6);

  return (
    <div className="flex flex-col gap-4">
      <TeacherHeader
        title={`${cls.className} · ${cls.subject}`}
        hint={`${roster.length} ${c.students} · ${c.classesHint}`}
      />

      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link href="/teacher/attendance">{c.takeAttendance}</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/teacher/homework">{c.assignHomework}</Link>
        </Button>
      </div>

      {roster.map((student) => (
        <Card key={student.id} size="sm">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {student.initials}
            </div>
            <div>
              <CardTitle>{student.name}</CardTitle>
              <CardDescription>{student.admissionNo}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Form 2A · Mathematics
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
