import type { LucideIcon } from "lucide-react";
import {
  Home,
  FileText,
  ClipboardCheck,
  PenLine,
  Wallet,
  Bell,
  UserRound,
  CalendarDays,
  BookOpen,
  LayoutDashboard,
  Clock,
  NotebookPen,
  CalendarCheck,
  GraduationCap,
  Megaphone,
  MessageCircle,
  Settings,
} from "lucide-react";

import type { UserRole } from "@/lib/auth";
import type { MessageKey } from "@/lib/i18n";

export type PortalNavItem = {
  href: string;
  labelKey: MessageKey;
  icon: LucideIcon;
  exact?: boolean;
};

export const portalNavByRole: Record<UserRole, PortalNavItem[]> = {
  student: [
    { href: "/student", labelKey: "navHome", icon: Home, exact: true },
    { href: "/student/profile", labelKey: "navProfile", icon: UserRound },
    { href: "/student/timetable", labelKey: "navTimetable", icon: Clock },
    { href: "/student/homework", labelKey: "navHomework", icon: NotebookPen },
    { href: "/student/attendance", labelKey: "navAttendance", icon: CalendarCheck },
    { href: "/student/exams", labelKey: "navExams", icon: GraduationCap },
    { href: "/student/results", labelKey: "navResults", icon: FileText },
    { href: "/student/announcements", labelKey: "navAnnouncements", icon: Megaphone },
    { href: "/student/materials", labelKey: "navMaterials", icon: BookOpen },
    { href: "/student/messages", labelKey: "navMessages", icon: MessageCircle },
    { href: "/student/calendar", labelKey: "navCalendar", icon: CalendarDays },
    { href: "/student/settings", labelKey: "navSettings", icon: Settings },
  ],
  parent: [
    { href: "/parent", labelKey: "navHome", icon: Home },
    { href: "/report-card", labelKey: "navResults", icon: FileText },
    { href: "/fees", labelKey: "navFees", icon: Wallet },
    { href: "/notifications", labelKey: "navNotifications", icon: Bell },
    { href: "/parent", labelKey: "navCalendar", icon: CalendarDays },
  ],
  teacher: [
    { href: "/teacher/attendance", labelKey: "navHome", icon: Home },
    { href: "/teacher/attendance", labelKey: "navTeacher", icon: ClipboardCheck },
    { href: "/teacher/marks", labelKey: "navMarks", icon: PenLine },
    { href: "/teacher/attendance", labelKey: "navClassroom", icon: BookOpen },
    { href: "/notifications", labelKey: "navNotifications", icon: Bell },
  ],
  headmaster: [
    { href: "/headmaster", labelKey: "navHome", icon: Home },
    { href: "/headmaster", labelKey: "navHeadmaster", icon: LayoutDashboard },
    { href: "/fees", labelKey: "navFees", icon: Wallet },
    { href: "/notifications", labelKey: "navNotifications", icon: Bell },
    { href: "/report-card", labelKey: "navResults", icon: FileText },
  ],
};
