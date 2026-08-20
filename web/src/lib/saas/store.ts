"use client";

import { useEffect, useState } from "react";

import { seedSaasState } from "@/lib/saas/data";
import type {
  PlatformInvoice,
  PlatformPayment,
  PlatformStaff,
  SaasState,
  SchoolStatus,
  SubscriptionPlan,
  SupportTicket,
  TenantSchool,
  TicketMessage,
} from "@/lib/saas/types";

const STORAGE_KEY = "edunexus.saas.store";

function cloneSeed(): SaasState {
  return structuredClone(seedSaasState);
}

let state: SaasState = cloneSeed();
const listeners = new Set<(next: SaasState) => void>();
let hydrated = false;

function persist() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota
  }
}

function emit() {
  persist();
  for (const listener of listeners) listener(state);
}

export function hydrateSaas() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SaasState;
      if (parsed?.schools && parsed?.plans) {
        state = {
          ...cloneSeed(),
          ...parsed,
          plans: parsed.plans?.length ? parsed.plans : seedSaasState.plans,
        };
      }
    }
  } catch {
    window.sessionStorage.removeItem(STORAGE_KEY);
    state = cloneSeed();
  }
  emit();
}

function nextId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}

function log(actor: string, summary: string) {
  state = {
    ...state,
    activity: [
      {
        id: nextId("sa"),
        at: new Date().toISOString(),
        actor,
        summary,
      },
      ...state.activity,
    ].slice(0, 80),
  };
}

export function getSaasState() {
  return state;
}

export function subscribeSaasStore(listener: (next: SaasState) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useSaasStore() {
  const [current, setCurrent] = useState<SaasState>(state);
  const [ready, setReady] = useState(hydrated);

  useEffect(() => {
    hydrateSaas();
    setCurrent(state);
    setReady(true);
    return subscribeSaasStore(setCurrent);
  }, []);

  return { state: current, ready };
}

export function createId(prefix: string) {
  return nextId(prefix);
}

export function upsertSchool(input: TenantSchool, actor: string, isNew: boolean) {
  const schools = isNew
    ? [input, ...state.schools]
    : state.schools.map((item) => (item.id === input.id ? input : item));
  state = { ...state, schools };
  log(actor, isNew ? `Registered ${input.name}` : `Updated ${input.name}`);
  emit();
  return input;
}

export function setSchoolStatus(id: string, status: SchoolStatus, actor: string) {
  const current = state.schools.find((item) => item.id === id);
  if (!current) return null;
  const next = { ...current, status };
  state = {
    ...state,
    schools: state.schools.map((item) => (item.id === id ? next : item)),
  };
  log(actor, `Set ${current.name} to ${status}`);
  emit();
  return next;
}

export function changeSchoolPlan(id: string, planId: string, actor: string) {
  const school = state.schools.find((item) => item.id === id);
  const plan = state.plans.find((item) => item.id === planId);
  if (!school || !plan) return null;
  const next = {
    ...school,
    planId,
    monthlyFeeTzs: plan.monthlyTzs || school.monthlyFeeTzs,
  };
  state = {
    ...state,
    schools: state.schools.map((item) => (item.id === id ? next : item)),
  };
  log(actor, `Moved ${school.name} to ${plan.name}`);
  emit();
  return next;
}

export function extendSchoolTrial(id: string, days: number, actor: string) {
  const school = state.schools.find((item) => item.id === id);
  if (!school) return null;
  const base = new Date(school.trialEndsAt || Date.now());
  if (Number.isNaN(base.getTime()) || base < new Date()) {
    base.setTime(Date.now());
  }
  base.setDate(base.getDate() + days);
  const iso = base.toISOString().slice(0, 10);
  const next = {
    ...school,
    status: school.status === "cancelled" ? school.status : ("trial" as const),
    trialEndsAt: iso,
    subscriptionEndsAt: iso,
  };
  state = {
    ...state,
    schools: state.schools.map((item) => (item.id === id ? next : item)),
  };
  log(actor, `Extended trial for ${school.name} by ${days} days`);
  emit();
  return next;
}

export function upsertPlan(input: SubscriptionPlan, actor: string, isNew: boolean) {
  const plans = isNew
    ? [...state.plans, input]
    : state.plans.map((item) => (item.id === input.id ? input : item));
  state = { ...state, plans };
  log(actor, isNew ? `Created plan ${input.name}` : `Updated plan ${input.name}`);
  emit();
  return input;
}

export function addInvoice(input: PlatformInvoice, actor: string) {
  state = { ...state, invoices: [input, ...state.invoices] };
  const school = state.schools.find((item) => item.id === input.schoolId);
  if (school && input.status !== "paid") {
    const next = {
      ...school,
      outstandingTzs: school.outstandingTzs + input.amountTzs,
    };
    state = {
      ...state,
      schools: state.schools.map((item) => (item.id === school.id ? next : item)),
    };
  }
  log(actor, `Issued ${input.number}`);
  emit();
  return input;
}

export function addPayment(input: PlatformPayment, actor: string) {
  const invoice = state.invoices.find((item) => item.id === input.invoiceId);
  const invoices = invoice
    ? state.invoices.map((item) =>
        item.id === invoice.id
          ? { ...item, status: "paid" as const, paidAt: input.paidAt }
          : item,
      )
    : state.invoices;
  const school = state.schools.find((item) => item.id === input.schoolId);
  const schools = school
    ? state.schools.map((item) =>
        item.id === school.id
          ? {
              ...item,
              outstandingTzs: Math.max(0, item.outstandingTzs - input.amountTzs),
              lastPaymentAt: input.paidAt,
              status: item.status === "suspended" ? "active" : item.status,
            }
          : item,
      )
    : state.schools;
  state = {
    ...state,
    payments: [input, ...state.payments],
    invoices,
    schools,
  };
  log(actor, `Recorded payment ${input.reference || input.id}`);
  emit();
  return input;
}

export function upsertTicket(input: SupportTicket, actor: string, isNew: boolean) {
  const tickets = isNew
    ? [input, ...state.tickets]
    : state.tickets.map((item) => (item.id === input.id ? input : item));
  state = { ...state, tickets };
  log(actor, isNew ? `Opened ticket: ${input.subject}` : `Updated ticket: ${input.subject}`);
  emit();
  return input;
}

export function addTicketMessage(id: string, message: TicketMessage, actor: string) {
  const ticket = state.tickets.find((item) => item.id === id);
  if (!ticket) return null;
  const next = { ...ticket, messages: [...ticket.messages, message], status: "pending" as const };
  state = {
    ...state,
    tickets: state.tickets.map((item) => (item.id === id ? next : item)),
  };
  log(actor, `Replied to ticket: ${ticket.subject}`);
  emit();
  return next;
}

export function upsertPlatformStaff(input: PlatformStaff, actor: string, isNew: boolean) {
  const staff = isNew
    ? [input, ...state.staff]
    : state.staff.map((item) => (item.id === input.id ? input : item));
  state = { ...state, staff };
  log(actor, isNew ? `Added team member ${input.name}` : `Updated ${input.name}`);
  emit();
  return input;
}

export function schoolOwnerUser(school: TenantSchool) {
  const parts = school.ownerName.split(" ");
  const avatarInitials = `${parts[0]?.[0] ?? "S"}${parts[1]?.[0] ?? "A"}`.toUpperCase();
  return {
    id: `owner-${school.id}`,
    email: school.ownerEmail,
    name: school.ownerName,
    role: "school_admin" as const,
    title: `School Admin · ${school.name}`,
    avatarInitials,
    homePath: "/admin",
    schoolId: school.id,
  };
}
