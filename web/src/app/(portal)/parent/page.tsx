"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FeedCard } from "@/components/feed-card";
import { campusFeed } from "@/lib/campus-feed";
import { useI18n } from "@/lib/i18n";
import { formatTzs, parentProfile } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusTone = {
  present: "bg-teal-600",
  late: "bg-amber-500",
  absent: "bg-rose-500",
};

export default function ParentDashboardPage() {
  const { t } = useI18n();
  const child = parentProfile.children[0];

  return (
    <div className="flex flex-col gap-4">
      <Card className="border-border/70 bg-card shadow-sm">
        <CardHeader className="pb-3">
          <CardDescription>
            {t("parentGreeting")}, {parentProfile.name}
          </CardDescription>
          <CardTitle className="font-[family-name:var(--font-display)] text-xl">
            {child.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{child.className}</p>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/fees">
              {t("parentPay")}
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/report-card">{t("viewResults")}</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>{t("parentBalance")}</CardDescription>
            <CardTitle className="font-[family-name:var(--font-display)] text-3xl tabular-nums">
              {formatTzs(parentProfile.balanceTzs)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t("parentAttendance")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {parentProfile.attendanceWeek.map((day) => (
                <div
                  key={day.day}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <span className="text-xs text-muted-foreground">{day.day}</span>
                  <span
                    className={cn("size-3 rounded-full", statusTone[day.status])}
                    title={day.status}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3">
        {campusFeed
          .filter((p) => p.category === "PARENTS" || p.category === "ACADEMICS")
          .map((post) => (
            <FeedCard key={post.id} post={post} />
          ))}
      </div>

      <Card className="border-border/70 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">{t("parentNotices")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {parentProfile.notices.map((notice, index) => (
            <div key={notice.id}>
              {index > 0 && <Separator className="mb-3" />}
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium leading-snug">{notice.title}</p>
                <Badge variant="secondary">{notice.time}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
