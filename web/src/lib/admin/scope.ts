import { assignedClassIds } from "@/lib/admin/permissions";
import type { AdminState, ClassRecord, StudentRecord } from "@/lib/admin/types";
import type { AuthUser } from "@/lib/auth";

export function staffForUser(state: AdminState, user: AuthUser) {
  if (!user.staffId) return undefined;
  return state.staff.find((item) => item.id === user.staffId);
}

export function scopedStudents(state: AdminState, user: AuthUser): StudentRecord[] {
  if (user.role !== "teacher") return state.students;
  const allowed = new Set(assignedClassIds(staffForUser(state, user)));
  return state.students.filter((item) => allowed.has(item.classId));
}

export function scopedClasses(state: AdminState, user: AuthUser): ClassRecord[] {
  if (user.role !== "teacher") return state.classes;
  const allowed = new Set(assignedClassIds(staffForUser(state, user)));
  return state.classes.filter((item) => allowed.has(item.id));
}

export function canViewStudent(
  state: AdminState,
  user: AuthUser,
  studentId: string,
) {
  return scopedStudents(state, user).some((item) => item.id === studentId);
}

export function canViewClass(state: AdminState, user: AuthUser, classId: string) {
  return scopedClasses(state, user).some((item) => item.id === classId);
}

export function formatIsoDate(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function isNewAdmission(admissionDate: string, now = new Date("2026-08-13")) {
  const date = new Date(admissionDate);
  if (Number.isNaN(date.getTime())) return false;
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - 30);
  return date >= cutoff;
}
