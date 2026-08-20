"use client";

import { isMockApi, mockDelay } from "@/lib/api/client";
import {
  createId,
  getAdminState,
  setStaffStatus,
  setStudentStatus,
  updateSchool,
  upsertClass,
  upsertParent,
  upsertStaff,
  upsertStudent,
  upsertSubject,
} from "@/lib/admin/store";
import type {
  ClassRecord,
  ParentRecord,
  SchoolSettings,
  StaffRecord,
  StudentRecord,
  SubjectRecord,
} from "@/lib/admin/types";

async function ensureMock() {
  await mockDelay(280);
  if (!isMockApi()) {
    throw new Error("API_NOT_WIRED");
  }
}

export async function saveStudent(
  input: Omit<StudentRecord, "id"> & { id?: string },
  actor: string,
) {
  await ensureMock();
  const isNew = !input.id;
  const record: StudentRecord = {
    ...input,
    id: input.id ?? createId("s"),
  };
  return upsertStudent(record, actor, isNew);
}

export async function archiveStudent(
  id: string,
  status: StudentRecord["status"],
  actor: string,
) {
  await ensureMock();
  return setStudentStatus(id, status, actor);
}

export async function saveParent(
  input: Omit<ParentRecord, "id"> & { id?: string },
  actor: string,
) {
  await ensureMock();
  const isNew = !input.id;
  const record: ParentRecord = {
    ...input,
    id: input.id ?? createId("p"),
  };
  return upsertParent(record, actor, isNew);
}

export async function saveStaff(
  input: Omit<StaffRecord, "id"> & { id?: string },
  actor: string,
) {
  await ensureMock();
  const isNew = !input.id;
  const record: StaffRecord = {
    ...input,
    id: input.id ?? createId("st"),
  };
  return upsertStaff(record, actor, isNew);
}

export async function archiveStaff(
  id: string,
  status: StaffRecord["status"],
  actor: string,
) {
  await ensureMock();
  return setStaffStatus(id, status, actor);
}

export async function saveClass(
  input: Omit<ClassRecord, "id"> & { id?: string },
  actor: string,
) {
  await ensureMock();
  const isNew = !input.id;
  const record: ClassRecord = {
    ...input,
    id: input.id ?? createId("c"),
  };
  return upsertClass(record, actor, isNew);
}

export async function saveSubject(
  input: Omit<SubjectRecord, "id"> & { id?: string },
  actor: string,
) {
  await ensureMock();
  const isNew = !input.id;
  const record: SubjectRecord = {
    ...input,
    id: input.id ?? createId("sub"),
  };
  return upsertSubject(record, actor, isNew);
}

export async function saveSchool(patch: Partial<SchoolSettings>, actor: string) {
  await ensureMock();
  return updateSchool(patch, actor);
}

export function snapshot() {
  return getAdminState();
}
