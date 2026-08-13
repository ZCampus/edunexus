export type AttendanceStatus = "present" | "absent" | "late";

export const school = {
  name: "Mlimani Secondary School",
  code: "MLM-041",
  term: "Term 2 · 2026",
};

export const tenants = [
  {
    id: "t1",
    name: "Mlimani Secondary School",
    code: "MLM-041",
    term: "Term 2 · 2026",
  },
  {
    id: "t2",
    name: "Uhuru Primary School",
    code: "UHU-012",
    term: "Term 2 · 2026",
  },
  {
    id: "t3",
    name: "Green Valley Academy",
    code: "GVA-088",
    term: "Term 2 · 2026",
  },
] as const;

export type TenantId = (typeof tenants)[number]["id"];

export const reportCard = {
  studentName: "Neema Juma",
  className: "Form 2A",
  term: "Term 2 · 2026",
  overallAverage: 76,
  grade: "B",
  position: "7 / 38",
  attendance: { present: 58, total: 62 },
  subjects: [
    { name: "Mathematics", score: 78, grade: "B", remark: "Good effort" },
    { name: "Kiswahili", score: 86, grade: "A", remark: "Excellent" },
    { name: "English", score: 71, grade: "B", remark: "Improving" },
    { name: "Biology", score: 64, grade: "C", remark: "Needs practice" },
    { name: "History", score: 80, grade: "A", remark: "Strong essays" },
    { name: "Geography", score: 75, grade: "B", remark: "Solid map work" },
  ],
  classTeacherRemark:
    "Neema is attentive and cooperative. Encourage more practice in Biology practicals.",
  headRemark: "Promoted with advice to maintain consistency.",
};

export const parentProfile = {
  name: "Asha Juma",
  children: [
    { id: "s1", name: "Neema Juma", className: "Form 2A" },
    { id: "s2", name: "Baraka Juma", className: "Standard 6" },
  ],
  balanceTzs: 185_000,
  attendanceWeek: [
    { day: "Mon", status: "present" as AttendanceStatus },
    { day: "Tue", status: "present" as AttendanceStatus },
    { day: "Wed", status: "late" as AttendanceStatus },
    { day: "Thu", status: "present" as AttendanceStatus },
    { day: "Fri", status: "absent" as AttendanceStatus },
  ],
  marks: [
    { subject: "Mathematics", score: 78, max: 100 },
    { subject: "Kiswahili", score: 86, max: 100 },
    { subject: "English", score: 71, max: 100 },
    { subject: "Biology", score: 64, max: 100 },
  ],
  notices: [
    { id: "n1", title: "Parent meeting — Friday 3pm", time: "2 days ago" },
    { id: "n2", title: "Fee reminder: Term 2 balance", time: "Yesterday" },
    { id: "n3", title: "Sports day registration open", time: "Today" },
  ],
};

export const studentProfile = {
  name: "Neema Juma",
  className: "Form 2A",
  timetable: [
    { period: "1", time: "07:30", subject: "Mathematics", room: "B12" },
    { period: "2", time: "08:20", subject: "English", room: "A04" },
    { period: "3", time: "09:10", subject: "Biology", room: "Lab 1" },
    { period: "4", time: "10:20", subject: "Kiswahili", room: "A04" },
    { period: "5", time: "11:10", subject: "History", room: "C02" },
  ],
  homework: [
    { id: "h1", subject: "Mathematics", title: "Exercise 4.2 — all odd numbers", due: "Tomorrow" },
    { id: "h2", subject: "English", title: "Essay: Our school garden", due: "Fri" },
    { id: "h3", subject: "Biology", title: "Label the digestive system", due: "Mon" },
  ],
};

export const teacherClass = {
  name: "Form 2A",
  dateLabel: "Sun 9 Aug 2026",
  students: [
    { id: "1", name: "Amani Kimaro", status: "present" as AttendanceStatus },
    { id: "2", name: "Neema Juma", status: "present" as AttendanceStatus },
    { id: "3", name: "Joseph Mwita", status: "late" as AttendanceStatus },
    { id: "4", name: "Grace Lyimo", status: "present" as AttendanceStatus },
    { id: "5", name: "Daniel Mushi", status: "absent" as AttendanceStatus },
    { id: "6", name: "Fatuma Ally", status: "present" as AttendanceStatus },
    { id: "7", name: "Peter Ngowi", status: "present" as AttendanceStatus },
    { id: "8", name: "Rehema Said", status: "present" as AttendanceStatus },
  ],
};

export const marksEntry = {
  className: "Form 2A",
  subject: "Mathematics",
  exam: "Mid-term",
  maxScore: 100,
  students: [
    { id: "1", name: "Amani Kimaro", score: 72 },
    { id: "2", name: "Neema Juma", score: 78 },
    { id: "3", name: "Joseph Mwita", score: 55 },
    { id: "4", name: "Grace Lyimo", score: 88 },
    { id: "5", name: "Daniel Mushi", score: null as number | null },
    { id: "6", name: "Fatuma Ally", score: 91 },
    { id: "7", name: "Peter Ngowi", score: 63 },
    { id: "8", name: "Rehema Said", score: 80 },
  ],
};

export const demoRoles = [
  { id: "headmaster", href: "/headmaster", labelKey: "navHeadmaster" as const },
  { id: "teacher", href: "/teacher/attendance", labelKey: "navTeacher" as const },
  { id: "parent", href: "/parent", labelKey: "navParent" as const },
  { id: "student", href: "/student", labelKey: "navStudent" as const },
] as const;

export type NotifChannel = "sms" | "whatsapp" | "email";
export type NotifStatus = "sent" | "queued" | "failed";

export const notificationLog = [
  {
    id: "m1",
    channel: "sms" as NotifChannel,
    audience: "Parents with balance due",
    preview: "Habari Asha, deni la Term 2 ni TZS 185,000. Lipa kwa M-Pesa.",
    time: "Today · 09:12",
    status: "sent" as NotifStatus,
  },
  {
    id: "m2",
    channel: "whatsapp" as NotifChannel,
    audience: "Form 2A parents",
    preview: "Parent meeting Friday 3pm at the hall. Please confirm.",
    time: "Yesterday · 16:40",
    status: "sent" as NotifStatus,
  },
  {
    id: "m3",
    channel: "sms" as NotifChannel,
    audience: "Neema Juma guardians",
    preview: "Neema was marked absent on Fri. Contact the class teacher.",
    time: "Fri · 13:05",
    status: "failed" as NotifStatus,
  },
  {
    id: "m4",
    channel: "email" as NotifChannel,
    audience: "All parents",
    preview: "Sports day registration is open until next Wednesday.",
    time: "Thu · 08:20",
    status: "queued" as NotifStatus,
  },
];

export const defaultNotifPrefs = {
  sms: true,
  whatsapp: true,
  email: false,
};

export const feeHistory = [
  { id: "p1", date: "12 Jul 2026", method: "M-Pesa", amount: 50_000, status: "Paid" },
  { id: "p2", date: "28 Jun 2026", method: "M-Pesa", amount: 100_000, status: "Paid" },
  { id: "p3", date: "02 Jun 2026", method: "Bank", amount: 75_000, status: "Paid" },
];

export const headmasterProfile = {
  name: "Dr. Joseph Mtei",
  role: "Headmaster",
  kpis: {
    students: 842,
    teachers: 38,
    attendanceTodayPct: 94,
    feesCollectedTzs: 48_200_000,
    feesTargetTzs: 72_000_000,
  },
  classAttendance: [
    { className: "Form 1A", present: 38, total: 40 },
    { className: "Form 1B", present: 35, total: 39 },
    { className: "Form 2A", present: 36, total: 38 },
    { className: "Form 2B", present: 33, total: 37 },
    { className: "Form 3A", present: 41, total: 42 },
    { className: "Form 4A", present: 29, total: 34 },
  ],
  pendingApprovals: [
    {
      id: "a1",
      title: "Exam marks — Form 2A Mathematics",
      requester: "Mr. Kimaro",
      type: "marks",
    },
    {
      id: "a2",
      title: "Expense: Lab chemicals (TZS 420,000)",
      requester: "Bursar",
      type: "expense",
    },
    {
      id: "a3",
      title: "Leave request — Ms. Lyimo (3 days)",
      requester: "HR",
      type: "leave",
    },
  ],
  alerts: [
    {
      id: "al1",
      severity: "high" as const,
      text: "Form 4A attendance dropped below 85% this week",
    },
    {
      id: "al2",
      severity: "medium" as const,
      text: "128 parents have unpaid Term 2 balances over 30 days",
    },
    {
      id: "al3",
      severity: "low" as const,
      text: "3 teachers have not submitted weekly lesson plans",
    },
  ],
};

export function formatTzs(amount: number) {
  return new Intl.NumberFormat("sw-TZ", {
    style: "currency",
    currency: "TZS",
    maximumFractionDigits: 0,
  }).format(amount);
}
