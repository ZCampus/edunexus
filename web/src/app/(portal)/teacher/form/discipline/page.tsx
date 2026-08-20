"use client";

import { FormEvent, useState } from "react";
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  classStudents,
  incidents,
  type IncidentAction,
  type ConductKind,
} from "@/lib/class-teacher";
import { useClassTeacherCopy } from "@/lib/class-teacher-copy";

const actionKeys: IncidentAction[] = [
  "logged",
  "parent_called",
  "referred_head",
  "apology_letter",
  "counseling",
];

export default function ClassDisciplinePage() {
  const c = useClassTeacherCopy();
  const [studentId, setStudentId] = useState(classStudents[0]?.id ?? "");
  const [kind, setKind] = useState<ConductKind>("demerit");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [action, setAction] = useState<IncidentAction>("logged");

  const actionLabel: Record<IncidentAction, string> = {
    logged: c.actLogged,
    parent_called: c.actCalled,
    referred_head: c.actHead,
    apology_letter: c.actApology,
    counseling: c.actCounsel,
  };

  function onSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast.success(c.incidentSaved);
    setTitle("");
    setDetail("");
  }

  return (
    <div className="flex flex-col gap-4">
      <TeacherHeader title={c.disciplineTitle} hint={c.disciplineHint} />

      <Card>
        <CardHeader>
          <CardTitle>{c.logIncident}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSave}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="inc-student">{c.student}</FieldLabel>
                <select
                  id="inc-student"
                  value={studentId}
                  onChange={(event) => setStudentId(event.target.value)}
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                >
                  {classStudents.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field>
                <FieldLabel htmlFor="inc-kind">{c.action}</FieldLabel>
                <select
                  id="inc-kind"
                  value={kind}
                  onChange={(event) => setKind(event.target.value as ConductKind)}
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                >
                  <option value="merit">{c.merit}</option>
                  <option value="demerit">{c.demerit}</option>
                </select>
              </Field>
              <Field>
                <FieldLabel htmlFor="inc-title">{c.title}</FieldLabel>
                <Input
                  id="inc-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="inc-detail">{c.detail}</FieldLabel>
                <textarea
                  id="inc-detail"
                  value={detail}
                  onChange={(event) => setDetail(event.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="inc-action">{c.action}</FieldLabel>
                <select
                  id="inc-action"
                  value={action}
                  onChange={(event) =>
                    setAction(event.target.value as IncidentAction)
                  }
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                >
                  {actionKeys.map((key) => (
                    <option key={key} value={key}>
                      {actionLabel[key]}
                    </option>
                  ))}
                </select>
              </Field>
              <Button type="submit" className="w-fit">
                {c.saveIncident}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      {incidents.map((item) => {
        const student = classStudents.find((row) => row.id === item.studentId);
        return (
          <Card key={item.id} size="sm">
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>
                  {student?.name} · {item.date}
                </CardDescription>
              </div>
              <Badge variant={item.kind === "merit" ? "secondary" : "destructive"}>
                {item.kind === "merit" ? c.merit : c.demerit} {item.points}
              </Badge>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {item.detail} · {actionLabel[item.action]}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
