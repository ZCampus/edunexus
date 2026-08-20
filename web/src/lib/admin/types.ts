export type PersonStatus = "active" | "inactive" | "archived";
export type Gender = "female" | "male" | "other";
export type StaffRole = "super_admin" | "school_admin" | "principal" | "teacher" | "accountant";

export type AdminModule =
  | "dashboard"
  | "students"
  | "parents"
  | "staff"
  | "classes"
  | "subjects"
  | "settings";

export type PermissionAction = "view" | "create" | "edit" | "delete" | "export";

export type SchoolSettings = {
  name: string;
  code: string;
  logoInitials: string;
  logoUrl: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
  academicYear: string;
  term: string;
};

export type ActivityLog = {
  id: string;
  at: string;
  actor: string;
  entityType: "student" | "parent" | "staff" | "class" | "subject" | "school";
  entityId: string;
  summary: string;
};

export type ParentRecord = {
  id: string;
  firstName: string;
  lastName: string;
  relation: string;
  gender: Gender;
  phone: string;
  email: string;
  address: string;
  occupation: string;
  status: PersonStatus;
};

export type StudentRecord = {
  id: string;
  firstName: string;
  lastName: string;
  admissionNo: string;
  admissionDate: string;
  gender: Gender;
  dateOfBirth: string;
  classId: string;
  parentIds: string[];
  status: PersonStatus;
  phone: string;
  email: string;
  address: string;
};

export type StaffRecord = {
  id: string;
  firstName: string;
  lastName: string;
  role: StaffRole;
  gender: Gender;
  phone: string;
  email: string;
  subjectIds: string[];
  classIds: string[];
  classTeacherOfId: string | null;
  hasLogin: boolean;
  status: PersonStatus;
};

export type ClassRecord = {
  id: string;
  name: string;
  section: string;
  classTeacherId: string | null;
  capacity: number;
  subjectIds: string[];
};

export type SubjectRecord = {
  id: string;
  name: string;
  code: string;
  teacherIds: string[];
};

export type AdminState = {
  school: SchoolSettings;
  students: StudentRecord[];
  parents: ParentRecord[];
  staff: StaffRecord[];
  classes: ClassRecord[];
  subjects: SubjectRecord[];
  activity: ActivityLog[];
};

export function classLabel(item: Pick<ClassRecord, "name" | "section">) {
  return `${item.name} ${item.section}`.trim();
}

export function personName(person: { firstName: string; lastName: string }) {
  return `${person.firstName} ${person.lastName}`.trim();
}

export function initials(person: { firstName: string; lastName: string }) {
  return `${person.firstName[0] ?? ""}${person.lastName[0] ?? ""}`.toUpperCase();
}
