import { formatTzs, reportCard } from "@/lib/mock-data";
import {
  attendanceByDay,
  attendanceBySubject,
  attendanceOverall,
  homeworkItems,
  periodAttendance,
  recentResults,
  summarizeAttendance,
  todayTimetable,
  type AttendanceMark,
  type HomeworkStatus,
  type PeriodAttendance,
} from "@/lib/student-mvp";

export type ParentChild = {
  id: string;
  name: string;
  initials: string;
  className: string;
  admissionNo: string;
  classTeacher: string;
  classTeacherTitle: string;
  feeBalanceTzs: number;
};

export const parentAccount = {
  name: "Asha Juma",
  phone: "+255 754 221 008",
  email: "asha.juma@example.com",
  emergencyName: "Hassan Juma",
  emergencyPhone: "+255 713 440 192",
  emergencyRelation: "Father",
};

export const parentChildren: ParentChild[] = [
  {
    id: "s-neema",
    name: "Neema Juma",
    initials: "NJ",
    className: "Form 2A",
    admissionNo: "MLM25F2A07",
    classTeacher: "Mr. Amani Kimaro",
    classTeacherTitle: "Class teacher · Mathematics",
    feeBalanceTzs: 185_000,
  },
  {
    id: "s-baraka",
    name: "Baraka Juma",
    initials: "BJ",
    className: "Form 1A",
    admissionNo: "MLM26F1A12",
    classTeacher: "Ms. Hawa Lyimo",
    classTeacherTitle: "Class teacher · Biology",
    feeBalanceTzs: 90_000,
  },
];

const barakaPeriods: PeriodAttendance[] = [
  { date: "10 Aug", day: "Mon", period: "1", time: "07:30–08:15", subject: "Mathematics", teacher: "Mr. Amani Kimaro", status: "present" },
  { date: "10 Aug", day: "Mon", period: "2", time: "08:20–09:05", subject: "English", teacher: "Ms. Rehema Said", status: "present" },
  { date: "11 Aug", day: "Tue", period: "1", time: "07:30–08:15", subject: "English", teacher: "Ms. Rehema Said", status: "late", note: "Arrived period 1" },
  { date: "11 Aug", day: "Tue", period: "2", time: "08:20–09:05", subject: "Mathematics", teacher: "Mr. Amani Kimaro", status: "present" },
  { date: "12 Aug", day: "Wed", period: "1", time: "07:30–08:15", subject: "Kiswahili", teacher: "Bi. Fatuma Ally", status: "present" },
  { date: "12 Aug", day: "Wed", period: "2", time: "08:20–09:05", subject: "English", teacher: "Ms. Rehema Said", status: "absent", note: "Unexcused" },
  { date: "13 Aug", day: "Thu", period: "1", time: "07:30–08:15", subject: "Mathematics", teacher: "Mr. Amani Kimaro", status: "present" },
  { date: "13 Aug", day: "Thu", period: "2", time: "08:20–09:05", subject: "English", teacher: "Ms. Rehema Said", status: "present" },
];

export const childHomework: Record<
  string,
  {
    id: string;
    subject: string;
    title: string;
    teacher: string;
    due: string;
    status: HomeworkStatus;
  }[]
> = {
  "s-neema": homeworkItems.map((item) => ({
    id: item.id,
    subject: item.subject,
    title: item.title,
    teacher: item.teacher,
    due: item.dueLabel,
    status: item.status,
  })),
  "s-baraka": [
    {
      id: "b1",
      subject: "English",
      title: "Spelling list 8",
      teacher: "Ms. Rehema Said",
      due: "Tomorrow",
      status: "not_submitted",
    },
    {
      id: "b2",
      subject: "Mathematics",
      title: "Addition worksheet",
      teacher: "Mr. Amani Kimaro",
      due: "Fri",
      status: "submitted",
    },
  ],
};

export const childResults: Record<
  string,
  { subject: string; exam: string; score: number; max: number; grade: string }[]
> = {
  "s-neema": recentResults,
  "s-baraka": [
    { subject: "Mathematics", exam: "Quiz 1", score: 16, max: 20, grade: "A" },
    { subject: "English", exam: "Dictation", score: 12, max: 20, grade: "C" },
    { subject: "Kiswahili", exam: "Insha", score: 15, max: 20, grade: "B" },
  ],
};

export const childReport = {
  "s-neema": {
    term: reportCard.term,
    average: reportCard.overallAverage,
    grade: reportCard.grade,
    position: reportCard.position,
  },
  "s-baraka": {
    term: "Term 2 · 2026",
    average: 72,
    grade: "B",
    position: "12 / 40",
  },
} as const;

export const childAlerts: Record<string, { id: string; text: string; href: string }[]> = {
  "s-neema": [
    { id: "a1", text: "Missed Biology and History on 12 Aug (2/4 periods)", href: "/parent/attendance" },
    { id: "a2", text: "Term 2 fee balance is overdue", href: "/parent/fees" },
    { id: "a3", text: "Class meeting Saturday 15 Aug · 10:00", href: "/parent/meetings" },
  ],
  "s-baraka": [
    { id: "b-a1", text: "English spelling homework due tomorrow", href: "/parent/homework" },
    { id: "b-a2", text: "Missed English on 12 Aug", href: "/parent/attendance" },
  ],
};

export const meetings = [
  {
    id: "m1",
    title: "Form 2A class meeting",
    with: "Mr. Amani Kimaro",
    when: "Sat 15 Aug · 10:00",
    venue: "Hall A",
    childId: "s-neema",
  },
  {
    id: "m2",
    title: "Sports day heats",
    with: "Games master",
    when: "Sat 22 Aug · 08:00",
    venue: "Main field",
    childId: "s-neema",
  },
  {
    id: "m3",
    title: "Form 1A orientation catch-up",
    with: "Ms. Hawa Lyimo",
    when: "Fri 21 Aug · 15:30",
    venue: "Staff room",
    childId: "s-baraka",
  },
];

export const parentMessages = [
  {
    id: "pm1",
    from: "Mr. Amani Kimaro",
    role: "Class teacher",
    time: "Yesterday · 16:10",
    preview: "Lab coat on Friday",
    body: "Please remind Neema about the Biology practical lab coat on Friday.",
    childId: "s-neema",
  },
  {
    id: "pm2",
    from: "School office",
    role: "Fees",
    time: "Mon · 09:00",
    preview: "Term 2 balance reminder",
    body: "Term 2 balance reminder. Pay via M-Pesa on the fees page.",
    childId: "s-neema",
  },
  {
    id: "pm3",
    from: "Ms. Hawa Lyimo",
    role: "Class teacher",
    time: "Tue · 11:20",
    preview: "Spelling list 8",
    body: "Baraka has spelling list 8 due tomorrow. Please practise the words at home.",
    childId: "s-baraka",
  },
];

export const childFees = {
  "s-neema": [
    { id: "p1", date: "12 Jul 2026", method: "M-Pesa", amount: 50_000, status: "Paid" },
    { id: "p2", date: "28 Jun 2026", method: "M-Pesa", amount: 100_000, status: "Paid" },
    { id: "p3", date: "02 Jun 2026", method: "Bank", amount: 75_000, status: "Paid" },
  ],
  "s-baraka": [
    { id: "bp1", date: "05 Jul 2026", method: "M-Pesa", amount: 80_000, status: "Paid" },
    { id: "bp2", date: "20 Jun 2026", method: "M-Pesa", amount: 40_000, status: "Paid" },
  ],
};

export const childExcuses = {
  "s-neema": [
    {
      id: "ex1",
      date: "10 Aug",
      reason: "Clinic · morning",
      status: "Approved",
      note: "Periods 1–2 excused",
    },
  ],
  "s-baraka": [] as {
    id: string;
    date: string;
    reason: string;
    status: string;
    note: string;
  }[],
};

export function childAttendance(childId: string) {
  const records = childId === "s-baraka" ? barakaPeriods : periodAttendance;
  return {
    overall: childId === "s-baraka" ? summarizeAttendance(records) : attendanceOverall,
    subjects: childId === "s-baraka" ? attendanceBySubject(records) : attendanceBySubject(),
    days: childId === "s-baraka" ? attendanceByDay(records) : attendanceByDay(),
    records,
  };
}

export function pendingHomework(childId: string) {
  return (childHomework[childId] ?? []).filter(
    (item) => item.status === "not_submitted" || item.status === "overdue",
  );
}

export function childTodayLessons(childId: string) {
  if (childId === "s-baraka") {
    return [
      { period: "1", time: "07:30–08:15", subject: "Mathematics", teacher: "Mr. Amani Kimaro" },
      { period: "2", time: "08:20–09:05", subject: "English", teacher: "Ms. Rehema Said" },
      { period: "3", time: "09:10–09:55", subject: "Kiswahili", teacher: "Bi. Fatuma Ally" },
    ];
  }
  return todayTimetable
    .filter((row) => row.kind === "lesson")
    .map((row) => ({
      period: row.period,
      time: row.time,
      subject: row.subject,
      teacher: row.teacher,
    }));
}

export type { AttendanceMark, HomeworkStatus, PeriodAttendance };
export { formatTzs };
