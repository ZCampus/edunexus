"use client";

import { toast } from "sonner";
import { FileText, Printer } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchReportCard } from "@/lib/api/report-card";
import { useI18n } from "@/lib/i18n";
import { useTenant } from "@/lib/tenant";

export default function ReportCardPage() {
  const { t } = useI18n();
  const { tenantId, tenant } = useTenant();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["report-card", tenantId],
    queryFn: () => fetchReportCard(tenantId),
  });

  if (isLoading || !data) {
    return (
      <div className="animate-pulse text-sm text-muted-foreground">
        Loading report…
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">Failed to load report card.</p>
    );
  }

  const attendancePct = Math.round(
    (data.attendance.present / data.attendance.total) * 100,
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="animate-rise flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2 text-muted-foreground">
            <FileText className="size-4" aria-hidden />
            <span className="text-sm">{tenant.name}</span>
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
            {t("reportTitle")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {data.studentName} · {data.className} · {data.term}
          </p>
        </div>
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            window.print();
            toast.success(t("reportPrint"));
          }}
        >
          <Printer data-icon="inline-start" />
          {t("reportPrint")}
        </Button>
      </div>

      <div className="animate-rise-delay grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardDescription>{t("reportOverall")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-[family-name:var(--font-display)] text-3xl tabular-nums">
              {data.overallAverage}%
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardDescription>{t("reportGrade")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-[family-name:var(--font-display)] text-3xl">
              {data.grade}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardDescription>{t("reportPosition")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-[family-name:var(--font-display)] text-3xl tabular-nums">
              {data.position}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardDescription>{t("reportAttendance")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p className="text-sm tabular-nums">
              {data.attendance.present}/{data.attendance.total}{" "}
              <span className="text-muted-foreground">
                ({t("reportDaysPresent")})
              </span>
            </p>
            <Progress value={attendancePct} aria-label={t("reportAttendance")} />
          </CardContent>
        </Card>
      </div>

      <Card className="animate-fade border-border/80">
        <CardHeader>
          <CardTitle className="text-base">{t("reportSubjects")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Remark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.subjects.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {row.score}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{row.grade}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.remark}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="animate-fade border-border/80">
          <CardHeader>
            <CardTitle className="text-base">{t("reportRemarks")}</CardTitle>
            <CardDescription>Class teacher</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-foreground/90">
              {data.classTeacherRemark}
            </p>
          </CardContent>
        </Card>
        <Card className="animate-fade border-border/80">
          <CardHeader>
            <CardTitle className="text-base">{t("reportRemarks")}</CardTitle>
            <CardDescription>Headmaster</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-foreground/90">
              {data.headRemark}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
