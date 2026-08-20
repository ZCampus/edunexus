"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useI18n } from "@/lib/i18n";
import { marksEntry } from "@/lib/mock-data";
import { useTeacherCopy } from "@/lib/teacher-copy";
import { letterGrade, teacherClasses } from "@/lib/teacher-mvp";
import { cn } from "@/lib/utils";

type Row = { id: string; name: string; score: number | null };

export default function TeacherMarksPage() {
  const { t } = useI18n();
  const c = useTeacherCopy();
  const [className, setClassName] = useState(marksEntry.className);
  const [assessment, setAssessment] = useState<"cat" | "exam" | "practical" | "quiz">(
    "exam",
  );
  const [exam, setExam] = useState(marksEntry.exam);
  const [rows, setRows] = useState<Row[]>(marksEntry.students);

  const stats = useMemo(() => {
    const filled = rows.filter((r) => r.score !== null && r.score !== undefined);
    const missing = rows.length - filled.length;
    const average =
      filled.length === 0
        ? 0
        : Math.round(
            filled.reduce((sum, r) => sum + (r.score ?? 0), 0) / filled.length,
          );
    const passed = filled.filter((r) => letterGrade(r.score ?? 0) !== "F").length;
    const passRate =
      filled.length === 0 ? 0 : Math.round((passed / filled.length) * 100);
    return { filled: filled.length, missing, average, passRate };
  }, [rows]);

  function updateScore(id: string, raw: string) {
    const trimmed = raw.trim();
    if (trimmed === "") {
      setRows((prev) =>
        prev.map((row) => (row.id === id ? { ...row, score: null } : row)),
      );
      return;
    }
    const value = Number(trimmed);
    if (Number.isNaN(value)) return;
    const clamped = Math.max(0, Math.min(marksEntry.maxScore, value));
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, score: clamped } : row)),
    );
  }

  function saveDraft() {
    toast.success(t("marksDraftSaved"));
  }

  function submitForApproval() {
    if (stats.missing > 0) {
      toast.error(`${stats.missing} ${t("marksMissing").toLowerCase()}`);
      return;
    }
    toast.success(t("marksSubmitted"));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="animate-rise flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
            {t("marksTitle")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Mathematics · {c.marksHint}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="lg" onClick={saveDraft}>
            {t("marksSaveDraft")}
          </Button>
          <Button size="lg" onClick={submitForApproval}>
            {t("marksSubmit")}
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardDescription>{c.hwClass}</CardDescription>
          </CardHeader>
          <CardContent>
            <select
              aria-label={c.hwClass}
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            >
              {teacherClasses.map((item) => (
                <option key={item.id} value={item.className}>
                  {item.className}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>
        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardDescription>{c.assessment}</CardDescription>
          </CardHeader>
          <CardContent>
            <select
              aria-label={c.assessment}
              value={assessment}
              onChange={(e) =>
                setAssessment(e.target.value as typeof assessment)
              }
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            >
              <option value="cat">{c.cat}</option>
              <option value="exam">{c.exam}</option>
              <option value="practical">{c.practical}</option>
              <option value="quiz">{c.quiz}</option>
            </select>
          </CardContent>
        </Card>
        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardDescription>{t("marksExam")}</CardDescription>
          </CardHeader>
          <CardContent>
            <select
              aria-label={t("marksExam")}
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            >
              <option value="Mid-term">Mid-term</option>
              <option value="End-term">End-term</option>
              <option value="Quiz 3">Quiz 3</option>
            </select>
          </CardContent>
        </Card>
        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardDescription>{t("marksAverage")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-[family-name:var(--font-display)] text-2xl tabular-nums">
              {stats.average}
            </p>
            <p className="text-xs text-muted-foreground">
              {c.passRate} {stats.passRate}% · {stats.missing}{" "}
              {t("marksMissing").toLowerCase()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/80">
        <CardHeader>
          <CardTitle className="text-base">
            {className} · Mathematics · {exam}
          </CardTitle>
          <CardDescription>{c.marksHint}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("marksStudent")}</TableHead>
                <TableHead className="w-28 text-right">{t("marksScore")}</TableHead>
                <TableHead className="w-16 text-right">{c.grade}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((student) => {
                const missing = student.score === null;
                return (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell className="text-right">
                      <Input
                        inputMode="numeric"
                        className={cn(
                          "ml-auto w-24 text-right tabular-nums",
                          missing && "border-accent",
                        )}
                        value={student.score ?? ""}
                        placeholder="—"
                        aria-label={`${student.name} ${t("marksScore")}`}
                        onChange={(e) => updateScore(student.id, e.target.value)}
                      />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {student.score == null ? "—" : letterGrade(student.score)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
