"use client";

import { isMockApi, mockDelay } from "@/lib/api/client";
import {
  addInvoice,
  addPayment,
  addTicketMessage,
  changeSchoolPlan,
  createId,
  extendSchoolTrial,
  getSaasState,
  hydrateSaas,
  setSchoolStatus,
  upsertPlan,
  upsertPlatformStaff,
  upsertSchool,
  upsertTicket,
} from "@/lib/saas/store";
import type {
  PlatformInvoice,
  PlatformPayment,
  PlatformStaff,
  SchoolStatus,
  SubscriptionPlan,
  SupportTicket,
  TenantSchool,
  TicketMessage,
} from "@/lib/saas/types";

async function ensureMock() {
  hydrateSaas();
  await mockDelay(240);
  if (!isMockApi()) throw new Error("API_NOT_WIRED");
}

export async function saveSchool(
  input: Omit<TenantSchool, "id"> & { id?: string },
  actor: string,
) {
  await ensureMock();
  const isNew = !input.id;
  const record: TenantSchool = { ...input, id: input.id ?? createId("sch") };
  return upsertSchool(record, actor, isNew);
}

export async function updateSchoolStatus(
  id: string,
  status: SchoolStatus,
  actor: string,
) {
  await ensureMock();
  return setSchoolStatus(id, status, actor);
}

export async function updateSchoolPlan(id: string, planId: string, actor: string) {
  await ensureMock();
  return changeSchoolPlan(id, planId, actor);
}

export async function extendTrial(id: string, days: number, actor: string) {
  await ensureMock();
  return extendSchoolTrial(id, days, actor);
}

export async function savePlan(
  input: Omit<SubscriptionPlan, "id"> & { id?: string },
  actor: string,
) {
  await ensureMock();
  const isNew = !input.id;
  const record: SubscriptionPlan = { ...input, id: input.id ?? createId("plan") };
  return upsertPlan(record, actor, isNew);
}

export async function generateInvoice(
  schoolId: string,
  actor: string,
) {
  await ensureMock();
  const school = getSaasState().schools.find((item) => item.id === schoolId);
  if (!school) throw new Error("SCHOOL_NOT_FOUND");
  const seq = String(getSaasState().invoices.length + 1).padStart(3, "0");
  const today = new Date().toISOString().slice(0, 10);
  const due = new Date();
  due.setDate(due.getDate() + 7);
  const invoice: PlatformInvoice = {
    id: createId("inv"),
    schoolId,
    number: `INV-2026-${seq}`,
    amountTzs: school.monthlyFeeTzs || 0,
    status: "sent",
    issuedAt: today,
    dueAt: due.toISOString().slice(0, 10),
    paidAt: "",
  };
  return addInvoice(invoice, actor);
}

export async function recordPlatformPayment(
  input: Omit<PlatformPayment, "id"> & { id?: string },
  actor: string,
) {
  await ensureMock();
  const payment: PlatformPayment = {
    ...input,
    id: input.id ?? createId("pay"),
  };
  return addPayment(payment, actor);
}

export async function saveTicket(
  input: Omit<SupportTicket, "id" | "messages"> & {
    id?: string;
    messages?: SupportTicket["messages"];
  },
  actor: string,
) {
  await ensureMock();
  const isNew = !input.id;
  const record: SupportTicket = {
    ...input,
    id: input.id ?? createId("tkt"),
    messages: input.messages ?? [],
  };
  return upsertTicket(record, actor, isNew);
}

export async function replyTicket(id: string, message: TicketMessage, actor: string) {
  await ensureMock();
  return addTicketMessage(id, message, actor);
}

export async function savePlatformStaff(
  input: Omit<PlatformStaff, "id"> & { id?: string },
  actor: string,
) {
  await ensureMock();
  const isNew = !input.id;
  const record: PlatformStaff = { ...input, id: input.id ?? createId("ps") };
  return upsertPlatformStaff(record, actor, isNew);
}

export function findSchoolByOwnerEmail(email: string) {
  hydrateSaas();
  const normalized = email.trim().toLowerCase();
  return (
    getSaasState().schools.find(
      (school) => school.ownerEmail.toLowerCase() === normalized,
    ) ?? null
  );
}
