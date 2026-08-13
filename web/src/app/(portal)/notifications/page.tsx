"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Bell, Mail, MessageCircle, Smartphone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import {
  defaultNotifPrefs,
  notificationLog,
  type NotifChannel,
  type NotifStatus,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const channelIcon = {
  sms: Smartphone,
  whatsapp: MessageCircle,
  email: Mail,
} as const;

export default function NotificationsPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const router = useRouter();
  const [prefs, setPrefs] = useState(defaultNotifPrefs);
  const [audience, setAudience] = useState("unpaid");
  const [channel, setChannel] = useState<NotifChannel>("sms");
  const [template, setTemplate] = useState("fee");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (user?.role === "student") {
      router.replace("/student");
    }
  }, [user, router]);

  const statusLabel: Record<NotifStatus, string> = {
    sent: t("notifStatusSent"),
    queued: t("notifStatusQueued"),
    failed: t("notifStatusFailed"),
  };

  const messagePreview =
    template === "fee"
      ? "Habari, deni la Term 2 bado lipo. Lipa kwa M-Pesa kupitia EduNexus."
      : template === "meeting"
        ? "Mkutano wa wazazi Ijumaa saa 9 jioni ukumbini. Tafadhali thibitisha."
        : "Mwanao alikosekana shuleni leo. Wasiliana na mwalimu wa darasa.";

  function onSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    window.setTimeout(() => {
      setPending(false);
      toast.success(t("notifSent"));
    }, 700);
  }

  if (user?.role === "student") {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="animate-rise flex flex-col gap-1">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Bell className="size-4" aria-hidden />
          <span className="text-sm">Africa&apos;s Talking · WhatsApp Cloud</span>
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          {t("notifTitle")}
        </h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="animate-rise-delay border-border/80">
          <CardHeader>
            <CardTitle className="text-base">{t("notifSend")}</CardTitle>
            <CardDescription>Demo queue — no real SMS charged</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSend} className="flex flex-col gap-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="audience">{t("notifAudience")}</FieldLabel>
                  <select
                    id="audience"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                  >
                    <option value="unpaid">{t("notifParentsUnpaid")}</option>
                    <option value="all">{t("notifAllParents")}</option>
                    <option value="form2a">{t("notifForm2a")}</option>
                  </select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="channel">{t("notifChannel")}</FieldLabel>
                  <select
                    id="channel"
                    value={channel}
                    onChange={(e) =>
                      setChannel(e.target.value as NotifChannel)
                    }
                    className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                  >
                    <option value="sms">{t("notifSms")}</option>
                    <option value="whatsapp">{t("notifWhatsapp")}</option>
                    <option value="email">{t("notifEmail")}</option>
                  </select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="template">{t("notifMessage")}</FieldLabel>
                  <select
                    id="template"
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                  >
                    <option value="fee">{t("notifFeeReminder")}</option>
                    <option value="meeting">{t("notifMeeting")}</option>
                    <option value="absent">{t("notifAbsent")}</option>
                  </select>
                </Field>
              </FieldGroup>

              <div className="rounded-lg border border-border/70 bg-muted/30 px-3 py-3 text-sm leading-relaxed text-foreground/90">
                {messagePreview}
              </div>

              <Button type="submit" size="lg" disabled={pending}>
                {t("notifSendAction")}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="animate-rise-delay border-border/80">
          <CardHeader>
            <CardTitle className="text-base">{t("notifPrefs")}</CardTitle>
            <CardDescription>
              Parent-facing channel preferences (demo)
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {(
              [
                ["sms", t("notifSms")],
                ["whatsapp", t("notifWhatsapp")],
                ["email", t("notifEmail")],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-3"
              >
                <span className="text-sm font-medium">{label}</span>
                <Checkbox
                  checked={prefs[key]}
                  onCheckedChange={(checked) =>
                    setPrefs((prev) => ({
                      ...prev,
                      [key]: checked === true,
                    }))
                  }
                  aria-label={label}
                />
              </label>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="animate-fade border-border/80">
        <CardHeader>
          <CardTitle className="text-base">{t("notifHistory")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {notificationLog.map((item, index) => {
            const Icon = channelIcon[item.channel];
            return (
              <div key={item.id} className="flex flex-col gap-3">
                {index > 0 && <Separator />}
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">{item.audience}</p>
                      <Badge
                        variant="secondary"
                        className={cn(
                          item.status === "failed" &&
                            "bg-rose-100 text-rose-950 dark:bg-rose-950/50 dark:text-rose-100",
                          item.status === "queued" &&
                            "bg-amber-100 text-amber-950 dark:bg-amber-950/50 dark:text-amber-100",
                        )}
                      >
                        {statusLabel[item.status]}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm leading-snug text-muted-foreground">
                      {item.preview}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.channel.toUpperCase()} · {item.time}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
