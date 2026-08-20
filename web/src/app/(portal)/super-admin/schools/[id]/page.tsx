"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { AdminHeader, AdminSkeleton, ForbiddenState } from "@/components/admin/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { formatTzs } from "@/lib/mock-data";
import {
  extendTrial,
  generateInvoice,
  updateSchoolPlan,
  updateSchoolStatus,
} from "@/lib/saas/api";
import { invoiceStatusLabel, schoolStatusLabel, schoolTypeLabel } from "@/lib/saas/labels";
import { canSaas } from "@/lib/saas/permissions";
import { schoolOwnerUser, useSaasStore } from "@/lib/saas/store";
import { useSaasCopy } from "@/lib/saas-copy";

export default function SchoolDetailPage() {
  const c = useSaasCopy();
  const { user, impersonate } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { state, ready } = useSaasStore();
  const school = state.schools.find((item) => item.id === params.id);

  if (!user || !canSaas(user.role, "schools", "view")) {
    return <ForbiddenState message={c.forbidden} />;
  }
  if (!ready) return <AdminSkeleton />;
  if (!school) return <ForbiddenState message={c.notFound} />;

  const plan = state.plans.find((item) => item.id === school.planId);
  const invoices = state.invoices.filter((item) => item.schoolId === school.id);
  const payments = state.payments.filter((item) => item.schoolId === school.id);
  const tickets = state.tickets.filter((item) => item.schoolId === school.id);
  const record = school;
  const actor = user.name;
  const canEdit = canSaas(user.role, "schools", "edit");
  const canBill = canSaas(user.role, "billing", "create");

  async function run(action: () => Promise<unknown>) {
    await action();
    toast.success(c.saved);
  }

  return (
    <div className="flex flex-col gap-4">
      <AdminHeader
        title={school.name}
        hint={`${school.subdomain}.edunexus.app · ${schoolTypeLabel(school.type, c)}`}
        actions={
          <>
            {canEdit ? (
              <Button asChild variant="outline">
                <Link href={`/super-admin/schools/${school.id}/edit`}>{c.edit}</Link>
              </Button>
            ) : null}
            {canEdit ? (
              <Button
                type="button"
                onClick={() => {
                  impersonate(schoolOwnerUser(record));
                  router.replace("/admin");
                }}
              >
                {c.impersonate}
              </Button>
            ) : null}
          </>
        }
      />

      <div className="flex flex-wrap gap-2">
        {canEdit && school.status !== "suspended" ? (
          <Button type="button" variant="outline" onClick={() => run(() => updateSchoolStatus(record.id, "suspended", actor))}>
            {c.suspend}
          </Button>
        ) : null}
        {canEdit && school.status === "suspended" ? (
          <Button type="button" onClick={() => run(() => updateSchoolStatus(record.id, "active", actor))}>
            {c.reactivate}
          </Button>
        ) : null}
        {canEdit ? (
          <Button type="button" variant="outline" onClick={() => run(() => updateSchoolStatus(record.id, "cancelled", actor))}>
            {c.cancelSub}
          </Button>
        ) : null}
        {canEdit ? (
          <Button type="button" variant="outline" onClick={() => run(() => extendTrial(record.id, 14, actor))}>
            {c.extendTrial}
          </Button>
        ) : null}
        {canBill ? (
          <Button type="button" variant="outline" onClick={() => run(() => generateInvoice(record.id, actor))}>
            {c.generateInvoice}
          </Button>
        ) : null}
      </div>

      {canEdit ? (
        <div className="flex flex-wrap gap-2">
          {state.plans.map((item) => (
            <Button
              key={item.id}
              type="button"
              size="sm"
              variant={item.id === school.planId ? "default" : "outline"}
              onClick={() => run(() => updateSchoolPlan(record.id, item.id, actor))}
            >
              {item.name}
            </Button>
          ))}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{c.contact}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <p>{school.ownerName}</p>
            <p>{school.ownerEmail}</p>
            <p>{school.ownerPhone || c.none}</p>
            <p>{school.city}, {school.region}, {school.country}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{c.usage}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <p>{c.plan}: {plan?.name}</p>
            <p>{c.status}: <Badge variant="secondary">{schoolStatusLabel(school.status, c)}</Badge></p>
            <p>{c.students}: {school.studentsCount}</p>
            <p>{c.staffCount}: {school.staffCount}</p>
            <p>{c.parentsCount}: {school.parentsCount}</p>
            <p>{c.fee}: {formatTzs(school.monthlyFeeTzs)}</p>
            <p>{c.outstanding}: {formatTzs(school.outstandingTzs)}</p>
            <p>{c.expiry}: {school.subscriptionEndsAt}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{c.invoices}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            {invoices.length === 0 ? c.none : invoices.map((item) => (
              <p key={item.id}>{item.number} · {formatTzs(item.amountTzs)} · {invoiceStatusLabel(item.status, c)}</p>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{c.payments}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            {payments.length === 0 ? c.none : payments.map((item) => (
              <p key={item.id}>{item.paidAt} · {formatTzs(item.amountTzs)} · {item.method}</p>
            ))}
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">{c.tickets}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {tickets.length === 0 ? (
              <p className="text-sm">{c.none}</p>
            ) : (
              tickets.map((item) => (
                <Link key={item.id} href={`/super-admin/tickets/${item.id}`} className="text-sm hover:underline">
                  {item.subject}
                </Link>
              ))
            )}
            {school.notes ? <p className="text-sm text-muted-foreground">{school.notes}</p> : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
