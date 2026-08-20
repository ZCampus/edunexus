import type { UserRole } from "@/lib/auth";
import type { MessageKey } from "@/lib/i18n";

const keys: Record<UserRole, MessageKey> = {
  school_admin: "roleSchoolAdmin",
  principal: "rolePrincipal",
  accountant: "roleAccountant",
  super_admin: "roleSuperAdmin",
  teacher: "roleTeacher",
  student: "roleStudent",
  parent: "roleParent",
  sales: "roleSales",
  support: "roleSupport",
  finance: "roleFinance",
};

export function roleLabelKey(role: UserRole): MessageKey {
  return keys[role];
}
