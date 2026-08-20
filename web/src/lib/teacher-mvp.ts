import { teacherClass, type AttendanceStatus } from "@/lib/mock-data";

export type TeacherAttendanceMark = AttendanceStatus | "excused";

export type AssessmentType = "cat" | "exam" | "practical" | "quiz";

export const teacherProfile = {
  name: "Mr. Amani Kimaro",
  subject: "Mathematics",
  employeeNo: "MLM-T-014",
  phone: "+255 754 880 112",
  email: "kimaro@mlimani.ac.tz",
  qualification: "B.Sc. Education (Mathematics)",
};

export const teacherRoster = teacherClass.students.map((row) => ({
  ...row,
  initials: row.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2),
  admissionNo: `MLM25F2A${row.id.padStart(2, "0")}`,
}));

export const teacherClasses = [
  {
    id: "c-f2a",
    className: "Form 2A",
    subject: "Mathematics",
    students: 8,
    room: "B12",
    periodToday: "1 · 07:30–08:15",
    attendanceDue: true,
  },
  {
    id: "c-f1b",
    className: "Form 1B",
    subject: "Mathematics",
    students: 36,
    room: "B08",
    periodToday: "4 · 10:20–11:05",
    attendanceDue: true,
  },
];

export const todayLessons = [
  {
    id: "p1",
    classId: "c-f2a",
    className: "Form 2A",
    subject: "Mathematics",
    period: "1",
    time: "07:30–08:15",
    room: "B12",
    taken: false,
  },
  {
    id: "p2",
    classId: "c-f1b",
    className: "Form 1B",
    subject: "Mathematics",
    period: "4",
    time: "10:20–11:05",
    room: "B08",
    taken: false,
  },
];

export const teacherStats = {
  pendingGrading: 1,
  upcomingExams: 1,
  absentToday: 1,
  homeworkOpen: 2,
};

export type HomeworkRecord = {
  id: string;
  title: string;
  className: string;
  due: string;
  submitted: number;
  total: number;
  status: "open" | "grading" | "returned";
};

export const teacherHomework: HomeworkRecord[] = [
  {
    id: "hw-1",
    title: "Exercise 4.2 — odd numbers",
    className: "Form 2A",
    due: "Thu 13 Aug",
    submitted: 5,
    total: 8,
    status: "open",
  },
  {
    id: "hw-2",
    title: "Linear equations worksheet",
    className: "Form 1B",
    due: "Fri 14 Aug",
    submitted: 22,
    total: 36,
    status: "open",
  },
  {
    id: "hw-3",
    title: "Quiz 3 — factorisation",
    className: "Form 2A",
    due: "Mon 10 Aug",
    submitted: 8,
    total: 8,
    status: "returned",
  },
];

export const homeworkSubmissions = [
  { id: "1", name: "Amani Kimaro", status: "submitted" as const, score: null as number | null, feedback: "" },
  { id: "2", name: "Neema Juma", status: "pending" as const, score: null as number | null, feedback: "" },
  { id: "3", name: "Joseph Mwita", status: "late" as const, score: null as number | null, feedback: "" },
  { id: "4", name: "Grace Lyimo", status: "submitted" as const, score: null as number | null, feedback: "" },
  { id: "5", name: "Daniel Mushi", status: "pending" as const, score: null as number | null, feedback: "" },
  { id: "6", name: "Fatuma Ally", status: "submitted" as const, score: null as number | null, feedback: "" },
  { id: "7", name: "Peter Ngowi", status: "submitted" as const, score: null as number | null, feedback: "" },
  { id: "8", name: "Rehema Said", status: "submitted" as const, score: null as number | null, feedback: "" },
];

export const pastAttendance = [
  {
    id: "pa1",
    date: "Wed 12 Aug",
    className: "Form 2A",
    period: "1",
    present: 7,
    late: 0,
    absent: 1,
  },
  {
    id: "pa2",
    date: "Tue 11 Aug",
    className: "Form 2A",
    period: "2",
    present: 8,
    late: 0,
    absent: 0,
  },
  {
    id: "pa3",
    date: "Mon 10 Aug",
    className: "Form 2A",
    period: "1",
    present: 6,
    late: 1,
    absent: 1,
  },
];

export const teacherMaterials = [
  { id: "tm1", title: "Quadratic equations — notes", className: "Form 2A", topic: "Algebra", type: "PDF" },
  { id: "tm2", title: "Factorisation slides", className: "Form 2A", topic: "Algebra", type: "Slides" },
  { id: "tm3", title: "Form 1 linear equations", className: "Form 1B", topic: "Algebra", type: "Worksheet" },
];

/** NECTA O-level style bands */
export function letterGrade(score: number, max = 100) {
  const pct = (score / max) * 100;
  if (pct >= 75) return "A";
  if (pct >= 65) return "B";
  if (pct >= 45) return "C";
  if (pct >= 30) return "D";
  return "F";
}
