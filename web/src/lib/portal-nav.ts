import type { LucideIcon } from "lucide-react";
import {
  Home,
  FileText,
  PenLine,
  Wallet,
  Mail,
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
  Users,
  Library,
  Building2,
  BadgePercent,
  LifeBuoy,
  BarChart3,
} from "lucide-react";

import type { AdminModule } from "@/lib/admin/types";
import { can, isAdminRole } from "@/lib/admin/permissions";
import { canSaas, isPlatformRole } from "@/lib/saas/permissions";
import type { SaasModule } from "@/lib/saas/types";
import type { UserRole } from "@/lib/auth";
import type { MessageKey } from "@/lib/i18n";

export type PortalNavItem = {
  href: string;
  labelKey: MessageKey;
  icon: LucideIcon;
  exact?: boolean;
  module?: AdminModule;
  saasModule?: SaasModule;
};

const studentNav: PortalNavItem[] = [
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
];

const parentNav: PortalNavItem[] = [
  { href: "/parent", labelKey: "navHome", icon: Home, exact: true },
  { href: "/parent/results", labelKey: "navResults", icon: FileText },
  { href: "/parent/attendance", labelKey: "navAttendance", icon: CalendarCheck },
  { href: "/parent/homework", labelKey: "navHomework", icon: NotebookPen },
  { href: "/parent/fees", labelKey: "navFees", icon: Wallet },
  { href: "/parent/messages", labelKey: "navMessages", icon: MessageCircle },
  { href: "/parent/meetings", labelKey: "navMeetings", icon: CalendarDays },
  { href: "/parent/excuses", labelKey: "navExcuses", icon: Mail },
  { href: "/parent/settings", labelKey: "navSettings", icon: Settings },
];

const adminNav: PortalNavItem[] = [
  { href: "/admin", labelKey: "navHome", icon: LayoutDashboard, exact: true, module: "dashboard" },
  { href: "/admin/students", labelKey: "navStudents", icon: GraduationCap, module: "students" },
  { href: "/admin/parents", labelKey: "navParents", icon: UserRound, module: "parents" },
  { href: "/admin/staff", labelKey: "navStaff", icon: Users, module: "staff" },
  { href: "/admin/classes", labelKey: "navClasses", icon: BookOpen, module: "classes" },
  { href: "/admin/subjects", labelKey: "navSubjects", icon: Library, module: "subjects" },
  { href: "/admin/settings", labelKey: "navSettings", icon: Settings, module: "settings" },
  { href: "/admin/profile", labelKey: "navProfile", icon: UserRound },
];

export const teacherPortalNav: PortalNavItem[] = [
  { href: "/teacher", labelKey: "navHome", icon: Home, exact: true },
  { href: "/teacher/form", labelKey: "navFormClass", icon: Users },
  { href: "/teacher/classes", labelKey: "navClasses", icon: BookOpen },
  { href: "/teacher/attendance", labelKey: "navAttendance", icon: CalendarCheck },
  { href: "/teacher/homework", labelKey: "navHomework", icon: NotebookPen },
  { href: "/teacher/marks", labelKey: "navMarks", icon: PenLine },
  { href: "/teacher/announcements", labelKey: "navAnnouncements", icon: Megaphone },
  { href: "/teacher/materials", labelKey: "navMaterials", icon: BookOpen },
  { href: "/teacher/settings", labelKey: "navSettings", icon: Settings },
];

const platformNav: PortalNavItem[] = [
  { href: "/super-admin", labelKey: "navHome", icon: LayoutDashboard, exact: true, saasModule: "dashboard" },
  { href: "/super-admin/schools", labelKey: "navSchools", icon: Building2, saasModule: "schools" },
  { href: "/super-admin/plans", labelKey: "navPlans", icon: BadgePercent, saasModule: "plans" },
  { href: "/super-admin/billing", labelKey: "navBilling", icon: Wallet, saasModule: "billing" },
  { href: "/super-admin/tickets", labelKey: "navTickets", icon: LifeBuoy, saasModule: "tickets" },
  { href: "/super-admin/team", labelKey: "navTeam", icon: Users, saasModule: "team" },
  { href: "/super-admin/analytics", labelKey: "navAnalytics", icon: BarChart3, saasModule: "analytics" },
];

export function navForRole(role: UserRole): PortalNavItem[] {
  if (role === "student") return studentNav;
  if (role === "parent") return parentNav;
  if (role === "teacher") return teacherPortalNav;
  if (isPlatformRole(role)) {
    return platformNav.filter(
      (item) => !item.saasModule || canSaas(role, item.saasModule, "view"),
    );
  }
  if (!isAdminRole(role)) return [];
  return adminNav.filter((item) => !item.module || can(role, item.module, "view"));
}

export const portalNavByRole: Record<UserRole, PortalNavItem[]> = {
  student: studentNav,
  parent: parentNav,
  teacher: teacherPortalNav,
  school_admin: navForRole("school_admin"),
  principal: navForRole("principal"),
  accountant: navForRole("accountant"),
  super_admin: navForRole("super_admin"),
  sales: navForRole("sales"),
  support: navForRole("support"),
  finance: navForRole("finance"),
};
