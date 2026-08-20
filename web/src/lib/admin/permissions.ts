import type { UserRole } from "@/lib/auth";
import type { AdminModule, PermissionAction, StaffRecord } from "@/lib/admin/types";

export const ADMIN_ROLES: UserRole[] = [
  "school_admin",
  "principal",
  "teacher",
  "accountant",
];

export function isAdminRole(role: UserRole): boolean {
  return ADMIN_ROLES.includes(role);
}

const FULL: PermissionAction[] = ["view", "create", "edit", "delete", "export"];
const READ: PermissionAction[] = ["view", "export"];
const NONE: PermissionAction[] = [];

const noneModules = {
  dashboard: NONE,
  students: NONE,
  parents: NONE,
  staff: NONE,
  classes: NONE,
  subjects: NONE,
  settings: NONE,
} as const;

const matrix: Record<UserRole, Record<AdminModule, PermissionAction[]>> = {
  super_admin: noneModules,
  sales: noneModules,
  support: noneModules,
  finance: noneModules,
  school_admin: {
    dashboard: FULL,
    students: FULL,
    parents: FULL,
    staff: FULL,
    classes: FULL,
    subjects: FULL,
    settings: FULL,
  },
  principal: {
    dashboard: READ,
    students: READ,
    parents: READ,
    staff: READ,
    classes: READ,
    subjects: READ,
    settings: ["view"],
  },
  teacher: {
    dashboard: ["view"],
    students: ["view", "export"],
    parents: NONE,
    staff: NONE,
    classes: ["view"],
    subjects: ["view"],
    settings: NONE,
  },
  accountant: {
    dashboard: ["view"],
    students: READ,
    parents: READ,
    staff: NONE,
    classes: ["view"],
    subjects: ["view"],
    settings: NONE,
  },
  student: {
    dashboard: NONE,
    students: NONE,
    parents: NONE,
    staff: NONE,
    classes: NONE,
    subjects: NONE,
    settings: NONE,
  },
  parent: {
    dashboard: NONE,
    students: NONE,
    parents: NONE,
    staff: NONE,
    classes: NONE,
    subjects: NONE,
    settings: NONE,
  },
};

export function can(
  role: UserRole,
  module: AdminModule,
  action: PermissionAction,
): boolean {
  return matrix[role][module].includes(action);
}

export function assignedClassIds(staff: StaffRecord | undefined): string[] {
  if (!staff) return [];
  const ids = new Set(staff.classIds);
  if (staff.classTeacherOfId) ids.add(staff.classTeacherOfId);
  return [...ids];
}
