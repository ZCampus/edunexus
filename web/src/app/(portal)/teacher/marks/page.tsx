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
import { cn } from "@/lib/utils";

type Row = { id: string; name: string; score: number | null };

export default function TeacherMarksPage() {
  const { t } = useI18n();
  const [subject, setSubject] = useState(marksEntry.subject);
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
    return { filled: filled.length, missing, average };
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
            {marksEntry.className} · max {marksEntry.maxScore}
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

      <div className="animate-rise-delay grid gap-3 sm:grid-cols-3">
        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardDescription>{t("marksSubject")}</CardDescription>
          </CardHeader>
          <CardContent>
            <select
              aria-label={t("marksSubject")}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            >
              <option value="Mathematics">Mathematics</option>
              <option value="Kiswahili">Kiswahili</option>
              <option value="English">English</option>
              <option value="Biology">Biology</option>
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
              <option value="Quiz">Quiz</option>
            </select>
          </CardContent>
        </Card>
        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardDescription>{t("marksAverage")}</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-2">
            <p className="font-[family-name:var(--font-display)] text-2xl tabular-nums">
              {stats.average}
            </p>
            <Badge variant="secondary">
              {stats.missing} {t("marksMissing").toLowerCase()}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card className="animate-fade border-border/80">
        <CardHeader>
          <CardTitle className="text-base">
            {subject} · {exam}
          </CardTitle>
          <CardDescription>
            Submit sends marks to headmaster approval queue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("marksStudent")}</TableHead>
                <TableHead className="w-36 text-right">{t("marksScore")}</TableHead>
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
                          missing && "border-amber-500/60",
                        )}
                        value={student.score ?? ""}
                        placeholder="—"
                        aria-label={`${student.name} ${t("marksScore")}`}
                        onChange={(e) => updateScore(student.id, e.target.value)}
                      />
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
