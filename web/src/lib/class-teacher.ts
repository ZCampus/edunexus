import { seedAdminState } from "@/lib/admin/data";
import type { AuthUser } from "@/lib/auth";

export type ConductKind = "merit" | "demerit";
export type IncidentAction =
  | "logged"
  | "parent_called"
  | "referred_head"
  | "apology_letter"
  | "counseling";

export function classTeacherAssignment(staffId?: string) {
  if (!staffId) return null;
  const staff = seedAdminState.staff.find((item) => item.id === staffId);
  if (!staff?.classTeacherOfId) return null;
  const klass = seedAdminState.classes.find(
    (item) => item.id === staff.classTeacherOfId,
  );
  if (!klass) return null;
  return {
    staff,
    klass,
    label: `${klass.name} ${klass.section}`,
  };
}

export function isClassTeacher(user: AuthUser | null) {
  return Boolean(classTeacherAssignment(user?.staffId));
}

const form2a = seedAdminState.students.filter((item) => item.classId === "c-f2a");

export const classStudents = form2a.map((student) => {
  const parent = seedAdminState.parents.find((item) =>
    student.parentIds.includes(item.id),
  );
  return {
    id: student.id,
    name: `${student.firstName} ${student.lastName}`,
    firstName: student.firstName,
    admissionNo: student.admissionNo,
    initials: `${student.firstName[0]}${student.lastName[0]}`,
    parentName: parent ? `${parent.firstName} ${parent.lastName}` : "—",
    parentPhone: parent?.phone ?? "—",
    parentId: parent?.id ?? null,
    address: student.address,
    gender: student.gender,
    dateOfBirth: student.dateOfBirth,
  };
});

export const classOverview = {
  presentToday: 6,
  total: classStudents.length,
  disciplineOpen: 2,
  classAverage: 74,
  feeAlerts: 2,
  chronicAbsent: 1,
};

export const classAlerts = [
  {
    id: "al1",
    severity: "high" as const,
    studentId: "s-daniel",
    text: "Daniel Mushi — absent 4 of last 6 school days",
  },
  {
    id: "al2",
    severity: "medium" as const,
    studentId: "s-joseph",
    text: "Joseph Mwita — Term 2 fee balance overdue",
  },
  {
    id: "al3",
    severity: "medium" as const,
    studentId: "s-neema",
    text: "Neema Juma — missed Biology + History on 12 Aug",
  },
  {
    id: "al4",
    severity: "low" as const,
    studentId: "s-amani",
    text: "Amani Ngowi — two demerits this week (late to assembly)",
  },
];

export const classEvents = [
  {
    id: "ev1",
    title: "Class meeting with parents",
    when: "Sat 15 Aug · 10:00",
    venue: "Hall A",
  },
  {
    id: "ev2",
    title: "Inter-house sports heats",
    when: "Sat 22 Aug · 08:00",
    venue: "Main field",
  },
  {
    id: "ev3",
    title: "Mid-term Mathematics",
    when: "Wed 19 Aug · 08:00",
    venue: "Hall A",
  },
];

export const subjectAverages = [
  { subject: "Mathematics", classPct: 76, peerPct: 71, teacher: "Mr. Kimaro" },
  { subject: "English", classPct: 72, peerPct: 74, teacher: "Ms. Said" },
  { subject: "Biology", classPct: 64, peerPct: 70, teacher: "Ms. Lyimo" },
  { subject: "Kiswahili", classPct: 81, peerPct: 78, teacher: "Ms. Said" },
  { subject: "History", classPct: 69, peerPct: 68, teacher: "Mr. Hassan" },
  { subject: "Geography", classPct: 75, peerPct: 73, teacher: "Mr. Hassan" },
];

export const studentMarks = {
  "s-neema": [
    { subject: "Mathematics", score: 78, grade: "B" },
    { subject: "Kiswahili", score: 86, grade: "A" },
    { subject: "English", score: 71, grade: "B" },
    { subject: "Biology", score: 64, grade: "C" },
    { subject: "History", score: 80, grade: "A" },
    { subject: "Geography", score: 75, grade: "B" },
  ],
  "s-joseph": [
    { subject: "Mathematics", score: 55, grade: "C" },
    { subject: "Kiswahili", score: 62, grade: "C" },
    { subject: "English", score: 48, grade: "C" },
    { subject: "Biology", score: 41, grade: "D" },
    { subject: "History", score: 58, grade: "C" },
    { subject: "Geography", score: 52, grade: "C" },
  ],
  "s-daniel": [
    { subject: "Mathematics", score: 44, grade: "D" },
    { subject: "Kiswahili", score: 51, grade: "C" },
    { subject: "English", score: 39, grade: "D" },
    { subject: "Biology", score: 33, grade: "D" },
    { subject: "History", score: 47, grade: "C" },
    { subject: "Geography", score: 42, grade: "D" },
  ],
} as Record<string, { subject: string; score: number; grade: string }[]>;

export const studentAttendance = {
  "s-neema": { pct: 94, missedSubjects: ["Biology", "History"], lateDays: 1 },
  "s-daniel": { pct: 61, missedSubjects: ["Mathematics", "English", "Biology"], lateDays: 3 },
  "s-joseph": { pct: 82, missedSubjects: ["English"], lateDays: 2 },
  "s-amani": { pct: 88, missedSubjects: [], lateDays: 4 },
} as Record<string, { pct: number; missedSubjects: string[]; lateDays: number }>;

export const incidents = [
  {
    id: "inc1",
    studentId: "s-amani",
    kind: "demerit" as ConductKind,
    title: "Late to morning assembly",
    detail: "Arrived 07:20. Second late this week.",
    date: "Tue 11 Aug",
    action: "parent_called" as IncidentAction,
    points: -1,
  },
  {
    id: "inc2",
    studentId: "s-neema",
    kind: "merit" as ConductKind,
    title: "Helped clean the science lab",
    detail: "Stayed after Biology practical to tidy equipment.",
    date: "Mon 10 Aug",
    action: "logged" as IncidentAction,
    points: 2,
  },
  {
    id: "inc3",
    studentId: "s-daniel",
    kind: "demerit" as ConductKind,
    title: "Left school during lunch",
    detail: "Reported by gate attendant. Parent not yet reached.",
    date: "Fri 7 Aug",
    action: "referred_head" as IncidentAction,
    points: -3,
  },
];

export const excuses = [
  {
    id: "ex1",
    studentId: "s-neema",
    date: "Fri 7 Aug",
    reason: "Clinic visit — malaria test",
    from: "Asha Juma",
    status: "pending" as "pending" | "approved" | "rejected",
  },
  {
    id: "ex2",
    studentId: "s-joseph",
    date: "Thu 6 Aug",
    reason: "Family bereavement (uncle)",
    from: "Joyce Mwita",
    status: "pending" as "pending" | "approved" | "rejected",
  },
];

export const parentLog = [
  {
    id: "cl1",
    studentId: "s-daniel",
    channel: "phone",
    with: "Guardian (neighbour)",
    date: "Mon 10 Aug",
    note: "No answer. Left message to visit school.",
  },
  {
    id: "cl2",
    studentId: "s-neema",
    channel: "meeting",
    with: "Asha Juma",
    date: "Wed 5 Aug",
    note: "Discussed Biology practice. Parent will supervise homework.",
  },
];

export const pastoralNotes: Record<
  string,
  { home: string; confidential: string; goal: string; referral: string }
> = {
  "s-neema": {
    home: "Lives with mother (trader) and father (driver) in Mikocheni. Two children.",
    confidential: "Mother asked that fee reminders go to her phone only — not the student.",
    goal: "Raise Biology from C to B this term.",
    referral: "None",
  },
  "s-daniel": {
    home: "Lives with aunt in Mbezi. Guardian contact often unavailable.",
    confidential: "Possible transport money issues. Do not discuss fees in class.",
    goal: "Attend at least 90% of periods in the next 3 weeks.",
    referral: "Referred to guidance counsellor — 8 Aug",
  },
  "s-joseph": {
    home: "Mother is a nurse (shifts). Often late pick-ups.",
    confidential: "Fee balance overdue; bursar handling. Avoid shaming.",
    goal: "Complete English homework on time for 4 weeks.",
    referral: "None",
  },
};

export const defaultMarks = [
  { subject: "Mathematics", score: 70, grade: "B" },
  { subject: "Kiswahili", score: 72, grade: "B" },
  { subject: "English", score: 68, grade: "B" },
  { subject: "Biology", score: 66, grade: "B" },
  { subject: "History", score: 69, grade: "B" },
  { subject: "Geography", score: 71, grade: "B" },
];

export function studentById(id: string) {
  return classStudents.find((item) => item.id === id);
}

export function averageOf(id: string) {
  const rows = studentMarks[id] ?? defaultMarks;
  return Math.round(rows.reduce((sum, row) => sum + row.score, 0) / rows.length);
}
