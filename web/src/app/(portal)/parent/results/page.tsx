"use client";

import Link from "next/link";
import { FileText } from "lucide-react";

import { ParentHeader } from "@/components/parent/ui";
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
import { useParentChild } from "@/lib/parent-child";
import { useParentCopy } from "@/lib/parent-copy";
import { childReport, childResults } from "@/lib/parent-mvp";

export default function ParentResultsPage() {
  const { t } = useI18n();
  const { child } = useParentChild();
  const c = useParentCopy();
  const report = childReport[child.id as keyof typeof childReport];
  const rows = childResults[child.id] ?? [];

  return (
    <div className="flex flex-col gap-4">
      <ParentHeader
        title={c.resultsTitle}
        hint={`${child.name} · ${c.resultsHint}`}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card size="sm">
          <CardHeader>
            <CardDescription>{report.term}</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {report.average}% · {report.grade}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>{c.position}</CardDescription>
            <CardTitle>{report.position}</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>{c.classTeacher}</CardDescription>
            <CardTitle className="text-base">{child.classTeacher}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {child.id === "s-neema" ? (
        <Button asChild>
          <Link href="/report-card">
            <FileText data-icon="inline-start" />
            {c.openReport}
          </Link>
        </Button>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>{c.results}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("marksSubject")}</TableHead>
                <TableHead>{t("marksExam")}</TableHead>
                <TableHead className="text-right">{t("marksScore")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
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
    </div>
  );
}
