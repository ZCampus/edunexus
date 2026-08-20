import type { SaasCopy } from "@/lib/saas-copy";
import type {
  InvoiceStatus,
  SchoolStatus,
  SchoolType,
  TicketStatus,
} from "@/lib/saas/types";

export function schoolStatusLabel(status: SchoolStatus, c: SaasCopy) {
  if (status === "trial") return c.trial;
  if (status === "active") return c.active;
  if (status === "suspended") return c.suspended;
  return c.cancelled;
}

export function invoiceStatusLabel(status: InvoiceStatus, c: SaasCopy) {
  if (status === "paid") return c.paid;
  if (status === "overdue") return c.overdue;
  if (status === "sent") return c.sent;
  if (status === "draft") return c.draft;
  return c.cancelled;
}

export function ticketStatusLabel(status: TicketStatus, c: SaasCopy) {
  if (status === "open") return c.open;
  if (status === "pending") return c.pending;
  if (status === "resolved") return c.resolved;
  return c.closed;
}

export function schoolTypeLabel(type: SchoolType, c: SaasCopy) {
  if (type === "primary") return c.primary;
  if (type === "secondary") return c.secondary;
  if (type === "international") return c.international;
  return c.mixed;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 24) || "school";
}
