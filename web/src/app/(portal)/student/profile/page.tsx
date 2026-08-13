"use client";

import Link from "next/link";

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
import { useAuth } from "@/lib/auth";
import { useStudentCopy } from "@/lib/student-copy";
import { studentRecord } from "@/lib/student-mvp";

export default function StudentProfilePage() {
  const { user } = useAuth();
  const c = useStudentCopy();
  const name = user?.name ?? studentRecord.fullName;

  const fields = [
    { label: c.admission, value: studentRecord.admissionNo },
    { label: c.classSection, value: `${studentRecord.className} · ${studentRecord.section}` },
    { label: c.roll, value: studentRecord.rollNumber },
    { label: c.gender, value: studentRecord.gender },
    { label: c.dob, value: studentRecord.dateOfBirth },
    { label: c.year, value: `${studentRecord.academicYear} · ${studentRecord.term}` },
    { label: c.house, value: studentRecord.house },
    { label: c.studentStatus, value: studentRecord.status },
  ];

  return (
    <div className="flex flex-col gap-4">
      <StudentHeader title={c.profileTitle} hint={c.profileHint} />

      <Card>
        <div className="bg-primary px-4 pt-6 pb-12">
          <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-primary-foreground text-3xl font-semibold text-primary ring-4 ring-primary-foreground/35">
            {user?.avatarInitials ?? studentRecord.photoInitials}
          </div>
        </div>
        <CardHeader className="text-center">
          <CardTitle>{name}</CardTitle>
          <CardDescription>{studentRecord.className}</CardDescription>
          <Badge className="mx-auto">{studentRecord.admissionNo}</Badge>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {fields.map((field) => (
            <div
              key={field.label}
              className="rounded-lg border border-border/70 px-3 py-2"
            >
              <p className="text-xs text-muted-foreground">{field.label}</p>
              <p className="font-medium">{field.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{c.parent}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 text-sm">
          <p className="font-medium">{studentRecord.parent.name}</p>
          <p className="text-muted-foreground">
            {studentRecord.parent.relation} · {studentRecord.parent.phone}
          </p>
          <p className="text-muted-foreground">{studentRecord.parent.email}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{c.emergency}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 text-sm">
          <p className="font-medium">{studentRecord.emergency.name}</p>
          <p className="text-muted-foreground">
            {studentRecord.emergency.relation} · {studentRecord.emergency.phone}
          </p>
        </CardContent>
      </Card>

      <Button asChild variant="outline">
        <Link href="/student/settings">{c.changePassword}</Link>
      </Button>
    </div>
  );
}
