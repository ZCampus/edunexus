"use client";

import Link from "next/link";

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
import { teacherClasses } from "@/lib/teacher-mvp";

export default function TeacherClassesPage() {
  const c = useTeacherCopy();

  return (
    <div className="flex flex-col gap-4">
      <TeacherHeader title={c.classesTitle} hint={c.classesHint} />

      {teacherClasses.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle>
              {item.className} · {item.subject}
            </CardTitle>
            <CardDescription>
              {item.students} {c.students} · {c.room} {item.room}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href={`/teacher/classes/${item.id}`}>{c.roster}</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/teacher/attendance">{c.takeAttendance}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/teacher/marks">{c.enterMarks}</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
