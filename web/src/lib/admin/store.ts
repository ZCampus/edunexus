"use client";

import { useEffect, useState } from "react";

import { seedAdminState } from "@/lib/admin/data";
import type {
  ActivityLog,
  AdminState,
  ClassRecord,
  ParentRecord,
  StaffRecord,
  StudentRecord,
  SubjectRecord,
  SchoolSettings,
} from "@/lib/admin/types";

const STORAGE_KEY = "edunexus.admin.store";

function cloneSeed(): AdminState {
  return structuredClone(seedAdminState);
}

let state: AdminState = cloneSeed();
const listeners = new Set<(next: AdminState) => void>();
let hydrated = false;

function persist() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota / private mode
  }
}

function emit() {
  persist();
  for (const listener of listeners) listener(state);
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AdminState;
      if (parsed?.students && parsed?.school) {
        state = {
          ...parsed,
          school: { ...seedAdminState.school, ...parsed.school },
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

function log(
  actor: string,
  entityType: ActivityLog["entityType"],
  entityId: string,
  summary: string,
) {
  state = {
    ...state,
    activity: [
      {
        id: nextId("act"),
        at: new Date().toISOString(),
        actor,
        entityType,
        entityId,
        summary,
      },
      ...state.activity,
    ].slice(0, 80),
  };
}

export function getAdminState() {
  return state;
}

export function subscribeAdminStore(listener: (next: AdminState) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useAdminStore() {
  const [current, setCurrent] = useState<AdminState>(state);
  const [ready, setReady] = useState(hydrated);

  useEffect(() => {
    hydrate();
    setCurrent(state);
    setReady(true);
    return subscribeAdminStore(setCurrent);
  }, []);

  return { state: current, ready };
}

export function upsertStudent(input: StudentRecord, actor: string, isNew: boolean) {
  const students = isNew
    ? [input, ...state.students]
    : state.students.map((item) => (item.id === input.id ? input : item));
  state = { ...state, students };
  log(
    actor,
    "student",
    input.id,
    isNew
      ? `Admitted ${input.firstName} ${input.lastName}`
      : `Updated ${input.firstName} ${input.lastName}`,
  );
  emit();
  return input;
}

export function setStudentStatus(
  id: string,
  status: StudentRecord["status"],
  actor: string,
) {
  const current = state.students.find((item) => item.id === id);
  if (!current) return null;
  const next = { ...current, status };
  state = {
    ...state,
    students: state.students.map((item) => (item.id === id ? next : item)),
  };
  log(actor, "student", id, `Set ${current.firstName} ${current.lastName} to ${status}`);
  emit();
  return next;
}

export function upsertParent(input: ParentRecord, actor: string, isNew: boolean) {
  const parents = isNew
    ? [input, ...state.parents]
    : state.parents.map((item) => (item.id === input.id ? input : item));
  state = { ...state, parents };
  log(
    actor,
    "parent",
    input.id,
    isNew
      ? `Added parent ${input.firstName} ${input.lastName}`
      : `Updated parent ${input.firstName} ${input.lastName}`,
  );
  emit();
  return input;
}

export function upsertStaff(input: StaffRecord, actor: string, isNew: boolean) {
  const staff = isNew
    ? [input, ...state.staff]
    : state.staff.map((item) => (item.id === input.id ? input : item));
  const classes = state.classes.map((item) => {
    if (input.classTeacherOfId && item.id === input.classTeacherOfId) {
      return { ...item, classTeacherId: input.id };
    }
    if (item.classTeacherId === input.id) {
      return { ...item, classTeacherId: null };
    }
    return item;
  });
  state = { ...state, staff, classes };
  log(
    actor,
    "staff",
    input.id,
    isNew
      ? `Added staff ${input.firstName} ${input.lastName}`
      : `Updated staff ${input.firstName} ${input.lastName}`,
  );
  emit();
  return input;
}

export function setStaffStatus(
  id: string,
  status: StaffRecord["status"],
  actor: string,
) {
  const current = state.staff.find((item) => item.id === id);
  if (!current) return null;
  const next = { ...current, status };
  state = {
    ...state,
    staff: state.staff.map((item) => (item.id === id ? next : item)),
  };
  log(actor, "staff", id, `Set ${current.firstName} ${current.lastName} to ${status}`);
  emit();
  return next;
}

export function upsertClass(input: ClassRecord, actor: string, isNew: boolean) {
  const classes = isNew
    ? [input, ...state.classes]
    : state.classes.map((item) => (item.id === input.id ? input : item));
  let staff = state.staff;
  if (input.classTeacherId) {
    staff = staff.map((item) =>
      item.id === input.classTeacherId
        ? {
            ...item,
            classTeacherOfId: input.id,
            classIds: item.classIds.includes(input.id)
              ? item.classIds
              : [...item.classIds, input.id],
          }
        : item.classTeacherOfId === input.id
          ? { ...item, classTeacherOfId: null }
          : item,
    );
  }
  state = { ...state, classes, staff };
  log(
    actor,
    "class",
    input.id,
    isNew ? `Created class ${input.name} ${input.section}` : `Updated class ${input.name} ${input.section}`,
  );
  emit();
  return input;
}

export function upsertSubject(input: SubjectRecord, actor: string, isNew: boolean) {
  const subjects = isNew
    ? [input, ...state.subjects]
    : state.subjects.map((item) => (item.id === input.id ? input : item));
  state = { ...state, subjects };
  log(
    actor,
    "subject",
    input.id,
    isNew ? `Created subject ${input.name}` : `Updated subject ${input.name}`,
  );
  emit();
  return input;
}

export function updateSchool(patch: Partial<SchoolSettings>, actor: string) {
  state = { ...state, school: { ...state.school, ...patch } };
  log(actor, "school", "school", "Updated school profile");
  emit();
  return state.school;
}

export function createId(prefix: string) {
  return nextId(prefix);
}
