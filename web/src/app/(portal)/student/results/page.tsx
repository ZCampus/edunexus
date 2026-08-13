"use client";

import Link from "next/link";
import { FileText } from "lucide-react";

import { StudentHeader } from "@/components/student/ui";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useI18n } from "@/lib/i18n";
import { reportCard } from "@/lib/mock-data";
import { useStudentCopy } from "@/lib/student-copy";
import { recentResults } from "@/lib/student-mvp";

export default function StudentResultsPage() {
  const { t } = useI18n();
  const c = useStudentCopy();

  return (
    <div className="flex flex-col gap-4">
      <StudentHeader title={c.resultsTitle} hint={c.resultsHint} />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card size="sm">
          <CardHeader>
            <CardDescription>{reportCard.term}</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {reportCard.overallAverage}% · {reportCard.grade}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>{t("reportPosition")}</CardDescription>
            <CardTitle>{reportCard.position}</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>{c.attendance}</CardDescription>
            <CardTitle>
              {reportCard.attendance.present}/{reportCard.attendance.total}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Button asChild>
        <Link href="/report-card">
          <FileText data-icon="inline-start" />
          {c.openReport}
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{c.recentResults}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("marksSubject")}</TableHead>
                <TableHead>{t("marksExam")}</TableHead>
                <TableHead className="text-right">{c.marks}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentResults.map((row) => (
                <TableRow key={`${row.subject}-${row.exam}`}>
                  <TableCell>{row.subject}</TableCell>
                  <TableCell>{row.exam}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {row.score}/{row.max} · {row.grade}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{reportCard.term}</CardTitle>
          <CardDescription>{reportCard.classTeacherRemark}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {reportCard.subjects.map((subject) => (
            <div
              key={subject.name}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-2 text-sm"
            >
              <span className="font-medium">{subject.name}</span>
              <span className="tabular-nums">
                {subject.score} · {subject.grade}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
