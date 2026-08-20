export type SchoolStatus = "trial" | "active" | "suspended" | "cancelled";
export type SchoolType = "primary" | "secondary" | "international" | "mixed";
export type BillingCycle = "monthly" | "yearly";
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";
export type PaymentMethod = "mpesa" | "bank" | "card" | "cash" | "other";
export type TicketStatus = "open" | "pending" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high";
export type TicketCategory =
  | "technical"
  | "billing"
  | "feature"
  | "bug"
  | "account"
  | "training";
export type PlatformRole = "super_admin" | "sales" | "support" | "finance";
export type PersonStatus = "active" | "inactive";

export type SaasModule =
  | "dashboard"
  | "schools"
  | "plans"
  | "billing"
  | "tickets"
  | "team"
  | "analytics";

export type PermissionAction = "view" | "create" | "edit" | "delete" | "export";

export type SubscriptionPlan = {
  id: string;
  name: string;
  code: string;
  monthlyTzs: number;
  yearlyTzs: number;
  maxStudents: number | null;
  smsCredits: number;
  storageGb: number;
  modules: string[];
  supportLevel: string;
  enabled: boolean;
  description: string;
};

export type TenantSchool = {
  id: string;
  name: string;
  code: string;
  type: SchoolType;
  country: string;
  region: string;
  city: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  planId: string;
  status: SchoolStatus;
  billingCycle: BillingCycle;
  trialEndsAt: string;
  subscriptionEndsAt: string;
  studentsCount: number;
  staffCount: number;
  parentsCount: number;
  monthlyFeeTzs: number;
  lastPaymentAt: string;
  outstandingTzs: number;
  subdomain: string;
  createdAt: string;
  notes: string;
};

export type PlatformInvoice = {
  id: string;
  schoolId: string;
  number: string;
  amountTzs: number;
  status: InvoiceStatus;
  issuedAt: string;
  dueAt: string;
  paidAt: string;
};

export type PlatformPayment = {
  id: string;
  schoolId: string;
  invoiceId: string;
  amountTzs: number;
  method: PaymentMethod;
  reference: string;
  paidAt: string;
  recordedBy: string;
};

export type TicketMessage = {
  id: string;
  at: string;
  author: string;
  body: string;
};

export type SupportTicket = {
  id: string;
  schoolId: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  requester: string;
  assigneeId: string | null;
  createdAt: string;
  messages: TicketMessage[];
};

export type PlatformStaff = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: PlatformRole;
  status: PersonStatus;
};

export type SaasActivity = {
  id: string;
  at: string;
  actor: string;
  summary: string;
};

export type SaasState = {
  plans: SubscriptionPlan[];
  schools: TenantSchool[];
  invoices: PlatformInvoice[];
  payments: PlatformPayment[];
  tickets: SupportTicket[];
  staff: PlatformStaff[];
  activity: SaasActivity[];
};
