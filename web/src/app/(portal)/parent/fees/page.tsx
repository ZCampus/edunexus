"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { ParentHeader } from "@/components/parent/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
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
import { useParentChild } from "@/lib/parent-child";
import { useParentCopy } from "@/lib/parent-copy";
import { childFees, formatTzs, parentAccount } from "@/lib/parent-mvp";

export default function ParentFeesPage() {
  const { t } = useI18n();
  const { child } = useParentChild();
  const c = useParentCopy();
  const [pending, setPending] = useState(false);
  const [amount, setAmount] = useState(String(child.feeBalanceTzs));
  const history = childFees[child.id as keyof typeof childFees] ?? [];

  useEffect(() => {
    setAmount(String(child.feeBalanceTzs));
  }, [child.feeBalanceTzs]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    window.setTimeout(() => {
      setPending(false);
      toast.success(c.paid);
    }, 900);
  }

  return (
    <div className="flex flex-col gap-4">
      <ParentHeader
        title={c.feesTitle}
        hint={`${child.name} · ${c.feesHint}`}
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <Card className="border-border/80 bg-[linear-gradient(160deg,oklch(0.42_0.08_170)_0%,oklch(0.35_0.06_180)_100%)] text-primary-foreground">
          <CardHeader>
            <CardDescription className="text-primary-foreground/75">
              {t("feesDue")}
            </CardDescription>
            <CardTitle className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-primary-foreground tabular-nums">
              {formatTzs(child.feeBalanceTzs)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-primary-foreground/80">
            {child.name} · {child.className}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{c.payFees}</CardTitle>
            <CardDescription>{c.feesHint}</CardDescription>
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
                    defaultValue={parentAccount.phone.replace(/\s/g, "")}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="amount">{c.amount}</FieldLabel>
                  <Input
                    id="amount"
                    name="amount"
                    inputMode="numeric"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    required
                  />
                </Field>
              </FieldGroup>
              <Button type="submit" size="lg" disabled={pending}>
                {c.pay}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{c.history}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{c.date}</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>{c.amount}</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((row) => (
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
