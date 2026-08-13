export type HomeworkStatus =
  | "not_submitted"
  | "submitted"
  | "late"
  | "graded"
  | "returned"
  | "overdue";

export type AttendanceMark =
  | "present"
  | "absent"
  | "late"
  | "excused"
  | "leave";

export type ExamStatus =
  | "upcoming"
  | "ongoing"
  | "completed"
  | "results_released";

export type MaterialType =
  | "document"
  | "video"
  | "presentation"
  | "worksheet"
  | "past_paper"
  | "link";

export const studentRecord = {
  fullName: "Neema Juma",
  photoInitials: "NJ",
  admissionNo: "MLM25F2A07",
  className: "Form 2A",
  section: "A",
  rollNumber: "07",
  gender: "Female",
  dateOfBirth: "12 Mar 2012",
  academicYear: "2026",
  term: "Term 2 · 2026",
  house: "Kilimanjaro House",
  status: "Active",
  email: "neema.juma@mlimani.ac.tz",
  phone: "—",
  parent: {
    name: "Asha Juma",
    relation: "Mother",
    phone: "+255 754 221 008",
    email: "asha.juma@example.com",
  },
  emergency: {
    name: "Hassan Juma",
    relation: "Father",
    phone: "+255 713 440 192",
  },
};

export const studentStats = {
  pendingHomework: 2,
  upcomingExams: 2,
  unreadMessages: 1,
  unreadAnnouncements: 2,
};

export const todayTimetable = [
  {
    period: "1",
    time: "07:30–08:15",
    subject: "Mathematics",
    teacher: "Mr. Amani Kimaro",
    room: "B12",
    kind: "lesson" as const,
  },
  {
    period: "2",
    time: "08:20–09:05",
    subject: "English",
    teacher: "Ms. Rehema Said",
    room: "A04",
    kind: "lesson" as const,
  },
  {
    period: "3",
    time: "09:10–09:55",
    subject: "Biology",
    teacher: "Mr. Joseph Mwita",
    room: "Lab 1",
    kind: "lesson" as const,
  },
  {
    period: "B",
    time: "09:55–10:15",
    subject: "Break",
    teacher: "—",
    room: "Yard",
    kind: "break" as const,
  },
  {
    period: "4",
    time: "10:20–11:05",
    subject: "Kiswahili",
    teacher: "Bi. Fatuma Ally",
    room: "A04",
    kind: "lesson" as const,
  },
  {
    period: "5",
    time: "11:10–11:55",
    subject: "History",
    teacher: "Mr. Peter Ngowi",
    room: "C02",
    kind: "lesson" as const,
  },
  {
    period: "L",
    time: "11:55–12:40",
    subject: "Lunch",
    teacher: "—",
    room: "Hall",
    kind: "break" as const,
  },
  {
    period: "6",
    time: "12:40–13:25",
    subject: "Geography",
    teacher: "Ms. Grace Lyimo",
    room: "C02",
    kind: "lesson" as const,
  },
];

export const weekTimetable = [
  { day: "Mon", daySw: "Jumatatu", periods: todayTimetable },
  {
    day: "Tue",
    daySw: "Jumanne",
    periods: [
      { period: "1", time: "07:30–08:15", subject: "English", teacher: "Ms. Rehema Said", room: "A04", kind: "lesson" as const },
      { period: "2", time: "08:20–09:05", subject: "Mathematics", teacher: "Mr. Amani Kimaro", room: "B12", kind: "lesson" as const },
      { period: "3", time: "09:10–09:55", subject: "Geography", teacher: "Ms. Grace Lyimo", room: "C02", kind: "lesson" as const },
      { period: "B", time: "09:55–10:15", subject: "Break", teacher: "—", room: "Yard", kind: "break" as const },
      { period: "4", time: "10:20–11:05", subject: "Biology", teacher: "Mr. Joseph Mwita", room: "Lab 1", kind: "lesson" as const },
      { period: "5", time: "11:10–11:55", subject: "Kiswahili", teacher: "Bi. Fatuma Ally", room: "A04", kind: "lesson" as const },
      { period: "L", time: "11:55–12:40", subject: "Lunch", teacher: "—", room: "Hall", kind: "break" as const },
      { period: "6", time: "12:40–13:25", subject: "PE", teacher: "Coach Daniel", room: "Field", kind: "lesson" as const },
    ],
  },
  { day: "Wed", daySw: "Jumatano", periods: todayTimetable },
  { day: "Thu", daySw: "Alhamisi", periods: todayTimetable },
  {
    day: "Fri",
    daySw: "Ijumaa",
    periods: [
      { period: "1", time: "07:30–08:15", subject: "Kiswahili", teacher: "Bi. Fatuma Ally", room: "A04", kind: "lesson" as const },
      { period: "2", time: "08:20–09:05", subject: "History", teacher: "Mr. Peter Ngowi", room: "C02", kind: "lesson" as const },
      { period: "3", time: "09:10–09:55", subject: "Mathematics", teacher: "Mr. Amani Kimaro", room: "B12", kind: "lesson" as const },
      { period: "B", time: "09:55–10:15", subject: "Break", teacher: "—", room: "Yard", kind: "break" as const },
      { period: "4", time: "10:20–11:05", subject: "English", teacher: "Ms. Rehema Said", room: "A04", kind: "lesson" as const },
      { period: "5", time: "11:10–11:55", subject: "Club", teacher: "Ms. Lyimo", room: "Hall", kind: "lesson" as const },
    ],
  },
];

export const homeworkItems = [
  {
    id: "h1",
    subject: "Mathematics",
    title: "Exercise 4.2 — odd numbers",
    teacher: "Mr. Amani Kimaro",
    due: "Thu 13 Aug",
    dueLabel: "Today",
    instructions: "Complete all odd-numbered questions. Show working.",
    status: "not_submitted" as HomeworkStatus,
    marks: null as number | null,
    max: 20,
    feedback: "",
  },
  {
    id: "h2",
    subject: "English",
    title: "Essay: Our school garden",
    teacher: "Ms. Rehema Said",
    due: "Fri 14 Aug",
    dueLabel: "Tomorrow",
    instructions: "350–400 words. Include a title and three paragraphs.",
    status: "not_submitted" as HomeworkStatus,
    marks: null as number | null,
    max: 25,
    feedback: "",
  },
  {
    id: "h3",
    subject: "Biology",
    title: "Label the digestive system",
    teacher: "Mr. Joseph Mwita",
    due: "Mon 17 Aug",
    dueLabel: "Mon",
    instructions: "Use the worksheet attached in class. Pencil only.",
    status: "submitted" as HomeworkStatus,
    marks: null as number | null,
    max: 15,
    feedback: "",
  },
  {
    id: "h4",
    subject: "History",
    title: "Majimaji uprising notes",
    teacher: "Mr. Peter Ngowi",
    due: "Mon 10 Aug",
    dueLabel: "Overdue",
    instructions: "One page summary of causes and effects.",
    status: "overdue" as HomeworkStatus,
    marks: null as number | null,
    max: 10,
    feedback: "",
  },
  {
    id: "h5",
    subject: "Kiswahili",
    title: "Insha: Shule yangu",
    teacher: "Bi. Fatuma Ally",
    due: "Wed 5 Aug",
    dueLabel: "Graded",
    instructions: "Insha ya maneno 250.",
    status: "graded" as HomeworkStatus,
    marks: 18,
    max: 20,
    feedback: "Lugha safi. Ongeza mifano halisi ya maisha ya shuleni.",
  },
];

export type PeriodAttendance = {
  date: string;
  day: string;
  period: string;
  time: string;
  subject: string;
  teacher: string;
  status: AttendanceMark;
  note?: string;
};

const teachers = {
  Mathematics: "Mr. Amani Kimaro",
  English: "Ms. Rehema Said",
  Biology: "Mr. Joseph Mwita",
  Kiswahili: "Bi. Fatuma Ally",
  History: "Mr. Peter Ngowi",
  Geography: "Ms. Grace Lyimo",
} as const;

type Weekday = (typeof weekTimetable)[number]["day"];

function academicLessons(day: Weekday) {
  const block = weekTimetable.find((item) => item.day === day);
  if (!block) return [];
  return block.periods
    .filter(
      (row) =>
        row.kind === "lesson" &&
        Object.prototype.hasOwnProperty.call(teachers, row.subject),
    )
    .map((row) => ({
      period: row.period,
      time: row.time,
      subject: row.subject as keyof typeof teachers,
    }));
}

function markFromTimetable(
  date: string,
  day: Weekday,
  patch?: (
    row: PeriodAttendance,
  ) => Pick<PeriodAttendance, "status" | "note"> | void,
): PeriodAttendance[] {
  return academicLessons(day).map((lesson) => {
    const base: PeriodAttendance = {
      date,
      day,
      period: lesson.period,
      time: lesson.time,
      subject: lesson.subject,
      teacher: teachers[lesson.subject],
      status: "present",
    };
    return { ...base, ...patch?.(base) };
  });
}

/** Each teacher marks their own period from that day's timetable. */
export const periodAttendance: PeriodAttendance[] = [
  ...markFromTimetable("03 Aug", "Mon"),
  ...markFromTimetable("04 Aug", "Tue"),
  ...markFromTimetable("05 Aug", "Wed", (row) =>
    row.subject === "Mathematics"
      ? { status: "late", note: "Arrived 07:48 · Mr. Kimaro" }
      : undefined,
  ),
  ...markFromTimetable("06 Aug", "Thu"),
  ...markFromTimetable("07 Aug", "Fri", () => ({
    status: "absent",
    note: "Unexcused",
  })),
  ...markFromTimetable("10 Aug", "Mon", (row) =>
    row.period === "1" || row.period === "2"
      ? { status: "excused", note: "Clinic · morning" }
      : undefined,
  ),
  ...markFromTimetable("11 Aug", "Tue"),
  ...markFromTimetable("12 Aug", "Wed", (row) =>
    row.subject === "Biology"
      ? { status: "absent", note: "Missed Biology practical" }
      : row.subject === "History"
        ? { status: "absent", note: "Missed History" }
        : undefined,
  ),
  ...markFromTimetable("13 Aug", "Thu"),
];

export function isPeriodAttended(status: AttendanceMark) {
  return status === "present" || status === "late";
}

export type AttendanceSummary = {
  total: number;
  attended: number;
  pct: number;
  present: number;
  late: number;
  absent: number;
  excused: number;
  leave: number;
};

export function summarizeAttendance(
  records: PeriodAttendance[],
): AttendanceSummary {
  const counts = {
    present: 0,
    late: 0,
    absent: 0,
    excused: 0,
    leave: 0,
  };
  for (const row of records) {
    counts[row.status] += 1;
  }
  const total = records.length;
  const attended = counts.present + counts.late;
  return {
    total,
    attended,
    pct: total ? Math.round((attended / total) * 100) : 0,
    ...counts,
  };
}

export function attendanceBySubject(records: PeriodAttendance[] = periodAttendance) {
  const order = Object.keys(teachers);
  return order
    .map((subject) => {
      const rows = records.filter((row) => row.subject === subject);
      return {
        subject,
        teacher: teachers[subject as keyof typeof teachers],
        records: [...rows].reverse(),
        ...summarizeAttendance(rows),
      };
    })
    .filter((item) => item.total > 0);
}

export function attendanceByDay(records: PeriodAttendance[] = periodAttendance) {
  const dates: string[] = [];
  for (const row of records) {
    if (!dates.includes(row.date)) dates.push(row.date);
  }
  return dates
    .map((date) => {
      const rows = records.filter((row) => row.date === date);
      return {
        date,
        day: rows[0]?.day ?? "",
        records: rows,
        ...summarizeAttendance(rows),
      };
    })
    .reverse();
}

export const attendanceOverall = summarizeAttendance(periodAttendance);
export const attendanceSubjects = attendanceBySubject();
export const attendanceDays = attendanceByDay();
export const todayAttendance =
  attendanceDays.find((day) => day.date === "13 Aug") ?? attendanceDays[0];

export const exams = [
  {
    id: "e1",
    name: "Mid-term Mathematics",
    subject: "Mathematics",
    date: "Wed 19 Aug 2026",
    time: "08:00–10:00",
    venue: "Hall A · Seat 14",
    status: "upcoming" as ExamStatus,
    instructions: "Bring ruler, mathematical set. Calculators not allowed.",
  },
  {
    id: "e2",
    name: "Mid-term Biology",
    subject: "Biology",
    date: "Fri 21 Aug 2026",
    time: "08:00–10:00",
    venue: "Lab 1 · Seat 08",
    status: "upcoming" as ExamStatus,
    instructions: "Practical paper. Wear lab coat.",
  },
  {
    id: "e3",
    name: "Continuous assessment — English",
    subject: "English",
    date: "Fri 31 Jul 2026",
    time: "10:20–11:05",
    venue: "A04",
    status: "results_released" as ExamStatus,
    instructions: "",
  },
  {
    id: "e4",
    name: "Opener test — Kiswahili",
    subject: "Kiswahili",
    date: "Mon 13 Jul 2026",
    time: "08:00–09:30",
    venue: "A04",
    status: "completed" as ExamStatus,
    instructions: "",
  },
];

export const recentResults = [
  { subject: "Kiswahili", exam: "Insha", score: 18, max: 20, grade: "A" },
  { subject: "English", exam: "CA", score: 71, max: 100, grade: "B" },
  { subject: "Mathematics", exam: "Quiz 3", score: 14, max: 20, grade: "B" },
];

export const announcements = [
  {
    id: "a1",
    category: "exam",
    pinned: true,
    unread: true,
    title: "Mid-term timetable published",
    body: "Form 2 mid-terms start Wednesday 19 August. Check Exams for venues and seat numbers.",
    author: "Deputy Head Academic",
    time: "Today · 07:40",
  },
  {
    id: "a2",
    category: "class",
    pinned: false,
    unread: true,
    title: "Form 2A Biology practical",
    body: "Bring your lab coat on Friday. Late students will not enter the lab.",
    author: "Mr. Joseph Mwita",
    time: "Yesterday · 16:10",
  },
  {
    id: "a3",
    category: "event",
    pinned: false,
    unread: false,
    title: "Sports day registration",
    body: "Register with your house captain before next Wednesday.",
    author: "Games master",
    time: "Tue · 09:00",
  },
  {
    id: "a4",
    category: "general",
    pinned: false,
    unread: false,
    title: "Library hours extended",
    body: "Library stays open until 17:30 during exam week.",
    author: "Librarian",
    time: "Mon · 11:20",
  },
];

export const materials = [
  {
    id: "m1",
    subject: "Mathematics",
    title: "Quadratic equations — notes",
    type: "document" as MaterialType,
    topic: "Algebra",
    size: "1.2 MB",
  },
  {
    id: "m2",
    subject: "Biology",
    title: "Digestive system worksheet",
    type: "worksheet" as MaterialType,
    topic: "Human body",
    size: "420 KB",
  },
  {
    id: "m3",
    subject: "English",
    title: "Comprehension: The baobab",
    type: "document" as MaterialType,
    topic: "Reading",
    size: "310 KB",
  },
  {
    id: "m4",
    subject: "History",
    title: "Majimaji uprising — past paper 2024",
    type: "past_paper" as MaterialType,
    topic: "Resistance",
    size: "880 KB",
  },
  {
    id: "m5",
    subject: "Geography",
    title: "Map work slides",
    type: "presentation" as MaterialType,
    topic: "Map skills",
    size: "4.1 MB",
  },
  {
    id: "m6",
    subject: "Mathematics",
    title: "Revision video: factorisation",
    type: "video" as MaterialType,
    topic: "Algebra",
    size: "12 min",
  },
];

export const messages = [
  {
    id: "msg1",
    from: "Mr. Amani Kimaro",
    role: "Mathematics teacher",
    preview: "Please attempt the odd numbers only for Exercise 4.2.",
    time: "Today · 08:12",
    unread: true,
    body: "Habari Neema. For tomorrow, complete the odd-numbered questions and bring your working to class. If you get stuck on Q7, see me after period 1.",
  },
  {
    id: "msg2",
    from: "Ms. Rehema Said",
    role: "Class teacher",
    preview: "Essay due Friday. Use the garden visit notes.",
    time: "Yesterday · 14:30",
    unread: false,
    body: "Remember the English essay is due Friday. Use notes from our garden visit. Title + three paragraphs, 350–400 words.",
  },
  {
    id: "msg3",
    from: "School office",
    role: "Admin",
    preview: "Your student ID is ready for collection.",
    time: "Mon · 10:05",
    unread: false,
    body: "Your replacement student ID is ready at the office. Collect during break with your class teacher.",
  },
];

export const calendarEvents = [
  {
    id: "c1",
    date: "Fri 14 Aug",
    title: "English essay due",
    type: "homework",
    time: "Before 16:00",
    venue: "A04",
  },
  {
    id: "c2",
    date: "Wed 19 Aug",
    title: "Mid-term Mathematics",
    type: "exam",
    time: "08:00–10:00",
    venue: "Hall A",
  },
  {
    id: "c3",
    date: "Fri 21 Aug",
    title: "Mid-term Biology practical",
    type: "exam",
    time: "08:00–10:00",
    venue: "Lab 1",
  },
  {
    id: "c4",
    date: "Sat 22 Aug",
    title: "Sports day heats",
    type: "event",
    time: "08:00",
    venue: "Main field",
  },
  {
    id: "c5",
    date: "Mon 24 Aug – Fri 4 Sep",
    title: "Mid-term break",
    type: "holiday",
    time: "All day",
    venue: "—",
  },
];
