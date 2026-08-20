"use client";

import { toast } from "sonner";

import { TeacherHeader } from "@/components/teacher/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTeacherCopy } from "@/lib/teacher-copy";
import { teacherMaterials } from "@/lib/teacher-mvp";

export default function TeacherMaterialsPage() {
  const c = useTeacherCopy();

  return (
    <div className="flex flex-col gap-4">
      <TeacherHeader title={c.materialsTitle} hint={c.materialsHint} />

      <Button
        type="button"
        className="w-fit"
        onClick={() => toast.success(c.uploaded)}
      >
        {c.upload}
      </Button>

      {teacherMaterials.map((item) => (
        <Card key={item.id} size="sm">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>
                {item.className} · {item.topic}
              </CardDescription>
            </div>
            <Badge variant="outline">{item.type}</Badge>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
