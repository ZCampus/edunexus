import type { UserRole } from "@/lib/auth";
import type { PermissionAction, SaasModule } from "@/lib/saas/types";

export const PLATFORM_ROLES: UserRole[] = [
  "super_admin",
  "sales",
  "support",
  "finance",
];

export const SCHOOL_PORTAL_ROLES: UserRole[] = [
  "school_admin",
  "principal",
  "teacher",
  "accountant",
];

export function isPlatformRole(role: UserRole): boolean {
  return PLATFORM_ROLES.includes(role);
}

export function isSchoolPortalRole(role: UserRole): boolean {
  return SCHOOL_PORTAL_ROLES.includes(role);
}

const FULL: PermissionAction[] = ["view", "create", "edit", "delete", "export"];
const READ: PermissionAction[] = ["view", "export"];
const NONE: PermissionAction[] = [];

const matrix: Record<string, Record<SaasModule, PermissionAction[]>> = {
  super_admin: {
    dashboard: FULL,
    schools: FULL,
    plans: FULL,
    billing: FULL,
    tickets: FULL,
    team: FULL,
    analytics: READ,
  },
  sales: {
    dashboard: ["view"],
    schools: ["view", "create", "edit", "export"],
    plans: READ,
    billing: NONE,
    tickets: ["view"],
    team: NONE,
    analytics: ["view"],
  },
  support: {
    dashboard: ["view"],
    schools: READ,
    plans: NONE,
    billing: NONE,
    tickets: FULL,
    team: NONE,
    analytics: ["view"],
  },
  finance: {
    dashboard: ["view"],
    schools: READ,
    plans: READ,
    billing: FULL,
    tickets: ["view"],
    team: NONE,
    analytics: READ,
  },
};

export function canSaas(
  role: UserRole,
  module: SaasModule,
  action: PermissionAction,
): boolean {
  return matrix[role]?.[module]?.includes(action) ?? false;
}
