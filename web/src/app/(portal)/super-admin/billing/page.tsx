"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AdminEmpty, AdminHeader, AdminSkeleton } from "@/components/admin/ui";
import { AppSelect, TextField } from "@/components/admin/fields";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/lib/auth";
import { formatTzs } from "@/lib/mock-data";
import { generateInvoice, recordPlatformPayment } from "@/lib/saas/api";
import { invoiceStatusLabel } from "@/lib/saas/labels";
import { canSaas } from "@/lib/saas/permissions";
import { useSaasStore } from "@/lib/saas/store";
import type { PaymentMethod } from "@/lib/saas/types";
import { useSaasCopy } from "@/lib/saas-copy";

export default function BillingPage() {
  const c = useSaasCopy();
  const { user } = useAuth();
  const { state, ready } = useSaasStore();
  const [schoolId, setSchoolId] = useState(state.schools[0]?.id ?? "");
  const [invoiceId, setInvoiceId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("mpesa");
  const [reference, setReference] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!schoolId && state.schools[0]) setSchoolId(state.schools[0].id);
  }, [schoolId, state.schools]);

  const unpaid = state.invoices.filter(
    (item) => item.schoolId === schoolId && item.status !== "paid" && item.status !== "cancelled",
  );

  if (!user || !canSaas(user.role, "billing", "view")) {
    return <AdminEmpty title={c.forbidden} hint="" />;
  }
  if (!ready) return <AdminSkeleton />;

  async function onInvoice() {
    if (!user || !schoolId) return;
    setPending(true);
    try {
      await generateInvoice(schoolId, user.name);
      toast.success(c.saved);
    } finally {
      setPending(false);
    }
  }

  async function onPay() {
    if (!user || !invoiceId) return;
    const invoice = state.invoices.find((item) => item.id === invoiceId);
    setPending(true);
    try {
      await recordPlatformPayment(
        {
          schoolId: invoice?.schoolId ?? schoolId,
          invoiceId,
          amountTzs: Number(amount) || invoice?.amountTzs || 0,
          method,
          reference,
          paidAt: new Date().toISOString().slice(0, 10),
          recordedBy: user.name,
        },
        user.name,
      );
      toast.success(c.saved);
      setReference("");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <AdminHeader title={c.billingTitle} hint={c.billingHint} />

      {canSaas(user.role, "billing", "create") ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{c.recordPayment}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FieldGroup>
              <div className="grid gap-4 md:grid-cols-2">
                <AppSelect
                  id="school"
                  label={c.selectSchool}
                  value={schoolId}
                  onChange={setSchoolId}
                  options={state.schools.map((item) => ({ value: item.id, label: item.name }))}
                />
                <AppSelect
                  id="invoice"
                  label={c.selectInvoice}
                  value={invoiceId}
                  onChange={setInvoiceId}
                  options={unpaid.map((item) => ({
                    value: item.id,
                    label: `${item.number} · ${formatTzs(item.amountTzs)}`,
                  }))}
                />
                <TextField id="amount" label={c.amount} type="number" value={amount} onChange={setAmount} />
                <AppSelect
                  id="method"
                  label={c.method}
                  value={method}
                  onChange={(value) => setMethod(value as PaymentMethod)}
                  options={[
                    { value: "mpesa", label: c.mpesa },
                    { value: "bank", label: c.bank },
                    { value: "card", label: c.card },
                    { value: "cash", label: c.cash },
                    { value: "other", label: c.other },
                  ]}
                />
                <TextField id="ref" label={c.reference} value={reference} onChange={setReference} />
              </div>
            </FieldGroup>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={onInvoice} disabled={pending}>
                {c.generateInvoice}
              </Button>
              <Button type="button" onClick={onPay} disabled={pending || !invoiceId}>
                {c.recordPayment}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{c.invoices}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>{c.schoolName}</TableHead>
                <TableHead>{c.amount}</TableHead>
                <TableHead>{c.status}</TableHead>
                <TableHead>{c.due}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.invoices.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.number}</TableCell>
                  <TableCell>{state.schools.find((school) => school.id === item.schoolId)?.name}</TableCell>
                  <TableCell>{formatTzs(item.amountTzs)}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === "paid" ? "secondary" : "outline"}>
                      {invoiceStatusLabel(item.status, c)}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.dueAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{c.payments}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{c.due}</TableHead>
                <TableHead>{c.schoolName}</TableHead>
                <TableHead>{c.amount}</TableHead>
                <TableHead>{c.method}</TableHead>
                <TableHead>{c.reference}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.payments.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.paidAt}</TableCell>
                  <TableCell>{state.schools.find((school) => school.id === item.schoolId)?.name}</TableCell>
                  <TableCell>{formatTzs(item.amountTzs)}</TableCell>
                  <TableCell>{item.method}</TableCell>
                  <TableCell>{item.reference}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
