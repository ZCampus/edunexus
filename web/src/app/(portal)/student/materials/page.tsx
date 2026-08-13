"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { StudentHeader, materialLabel } from "@/components/student/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useStudentCopy } from "@/lib/student-copy";
import { materials } from "@/lib/student-mvp";

export default function StudentMaterialsPage() {
  const c = useStudentCopy();
  const subjects = useMemo(
    () => ["all", ...Array.from(new Set(materials.map((item) => item.subject)))],
    [],
  );
  const [subject, setSubject] = useState("all");
  const visible =
    subject === "all"
      ? materials
      : materials.filter((item) => item.subject === subject);

  return (
    <div className="flex flex-col gap-4">
      <StudentHeader title={c.materialsTitle} hint={c.materialsHint} />

      <div className="flex flex-wrap gap-1.5">
        {subjects.map((name) => (
          <Button
            key={name}
            type="button"
            size="sm"
            variant={subject === name ? "default" : "outline"}
            onClick={() => setSubject(name)}
          >
            {name === "all" ? c.allSubjects : name}
          </Button>
        ))}
      </div>

      {visible.map((item) => (
        <Card key={item.id} size="sm">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>
                {item.subject} · {item.topic} · {item.size}
              </CardDescription>
            </div>
            <Badge variant="outline">{materialLabel(item.type, c)}</Badge>
          </CardHeader>
          <CardContent>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => toast.success(c.downloaded)}
            >
              {c.download}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
