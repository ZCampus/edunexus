"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { TeacherHeader } from "@/components/teacher/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  averageOf,
  defaultMarks,
  incidents,
  parentLog,
  pastoralNotes,
  studentAttendance,
  studentById,
  studentMarks,
} from "@/lib/class-teacher";
import { useClassTeacherCopy } from "@/lib/class-teacher-copy";

export default function ClassStudentProfilePage() {
  const { id } = useParams<{ id: string }>();
  const c = useClassTeacherCopy();
  const student = studentById(id);
  const marks = studentMarks[id] ?? defaultMarks;
  const attendance = studentAttendance[id];
  const notes = pastoralNotes[id];
  const studentIncidents = incidents.filter((item) => item.studentId === id);
  const comms = parentLog.filter((item) => item.studentId === id);

  if (!student) {
    return <p className="text-sm text-muted-foreground">{c.backClass}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <Button asChild variant="outline" className="w-fit">
        <Link href="/teacher/form">{c.backClass}</Link>
      </Button>

      <TeacherHeader
        title={student.name}
        hint={`${student.admissionNo} · ${c.profileHint}`}
      />

      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
        <span>{student.parentName}</span>
        <span>{student.parentPhone}</span>
        <span>{student.address}</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{c.allSubjects}</CardTitle>
          <CardDescription>
            {c.classAverage} {averageOf(student.id)}%
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {marks.map((row) => (
            <div
              key={row.subject}
              className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2 text-sm"
            >
              <span>{row.subject}</span>
              <span className="tabular-nums font-medium">
                {row.score} · {row.grade}
              </span>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            className="w-fit"
            onClick={() => toast.success(c.askSent)}
          >
            {c.askSubject}
          </Button>
        </CardContent>
      </Card>

      {attendance ? (
        <Card>
          <CardHeader>
            <CardTitle>{c.attendancePattern}</CardTitle>
            <CardDescription>{attendance.pct}%</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {attendance.missedSubjects.length
              ? attendance.missedSubjects.join(", ")
              : "—"}
            {` · late ${attendance.lateDays}`}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>{c.navDiscipline}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {studentIncidents.length === 0 ? (
            <p className="text-sm text-muted-foreground">—</p>
          ) : (
            studentIncidents.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-border/70 px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  <Badge variant={item.kind === "merit" ? "secondary" : "destructive"}>
                    {item.kind === "merit" ? c.merit : c.demerit}
                  </Badge>
                  <span className="font-medium">{item.title}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.date} · {item.detail}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {notes ? (
        <Card>
          <CardHeader>
            <CardTitle>{c.pastoral}</CardTitle>
            <CardDescription>{c.confidential}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <p>
              <span className="font-medium">{c.home}: </span>
              {notes.home}
            </p>
            <p className="rounded-lg bg-muted/60 px-3 py-2">
              <span className="font-medium">{c.confidential}: </span>
              {notes.confidential}
            </p>
            <p>
              <span className="font-medium">{c.goal}: </span>
              {notes.goal}
            </p>
            <p>
              <span className="font-medium">{c.referral}: </span>
              {notes.referral}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {comms.length ? (
        <Card>
          <CardHeader>
            <CardTitle>{c.commLog}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {comms.map((item) => (
              <p key={item.id} className="text-sm">
                <span className="font-medium">{item.date}</span>
                {" · "}
                {item.with}: {item.note}
              </p>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
