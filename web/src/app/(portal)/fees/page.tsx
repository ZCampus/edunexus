"use client";

import { FormEvent, useState } from "react";
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
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
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
import { feeHistory, formatTzs, parentProfile } from "@/lib/mock-data";

export default function FeesPage() {
  const { t } = useI18n();
  const [pending, setPending] = useState(false);
  const [amount, setAmount] = useState(String(parentProfile.balanceTzs));

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    window.setTimeout(() => {
      setPending(false);
      toast.success("STK Push sent — confirm on your phone");
    }, 900);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="animate-rise">
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          {t("feesTitle")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          M-Pesa STK Push · Selcom / Flutterwave ready
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <Card className="animate-rise-delay border-border/80 bg-[linear-gradient(160deg,oklch(0.42_0.08_170)_0%,oklch(0.35_0.06_180)_100%)] text-primary-foreground">
          <CardHeader>
            <CardDescription className="text-primary-foreground/75">
              {t("feesDue")}
            </CardDescription>
            <CardTitle className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-primary-foreground">
              {formatTzs(parentProfile.balanceTzs)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-primary-foreground/80">
            {parentProfile.children[0].name} · Term 2 balance
          </CardContent>
        </Card>

        <Card className="animate-rise-delay border-border/80">
          <CardHeader>
            <CardTitle className="text-base">{t("parentPay")}</CardTitle>
            <CardDescription>Demo UI — no real charge</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="phone">{t("feesPhone")}</FieldLabel>
                  <Input
                    id="phone"
                    name="phone"
                    inputMode="tel"
                    defaultValue="255712345678"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="amount">{t("feesAmount")}</FieldLabel>
                  <Input
                    id="amount"
                    name="amount"
                    inputMode="numeric"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </Field>
              </FieldGroup>
              <Button type="submit" size="lg" disabled={pending}>
                {t("feesPay")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="animate-fade border-border/80">
        <CardHeader>
          <CardTitle className="text-base">{t("feesHistory")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feeHistory.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.method}</TableCell>
                  <TableCell className="tabular-nums">
                    {formatTzs(row.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{row.status}</Badge>
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
