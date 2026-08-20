"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { findSchoolByOwnerEmail } from "@/lib/saas/api";
import { schoolOwnerUser } from "@/lib/saas/store";

export type UserRole =
  | "student"
  | "parent"
  | "teacher"
  | "super_admin"
  | "school_admin"
  | "principal"
  | "accountant"
  | "sales"
  | "support"
  | "finance";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  title: string;
  studentId?: string;
  staffId?: string;
  schoolId?: string;
  avatarInitials: string;
  homePath: string;
};

export const DEMO_PASSWORD = "demo-password";

export const platformDemoUsers: AuthUser[] = [
  {
    id: "u-super",
    email: "super@edunexus.app",
    name: "EduNexus Super Admin",
    role: "super_admin",
    title: "Super Admin · EduNexus",
    avatarInitials: "EN",
    homePath: "/super-admin",
  },
  {
    id: "u-sales",
    email: "sales@edunexus.app",
    name: "Baraka Mushi",
    role: "sales",
    title: "Sales · EduNexus",
    avatarInitials: "BM",
    homePath: "/super-admin",
  },
  {
    id: "u-support",
    email: "support@edunexus.app",
    name: "Neema Support",
    role: "support",
    title: "Support · EduNexus",
    avatarInitials: "NS",
    homePath: "/super-admin",
  },
  {
    id: "u-finance",
    email: "finance@edunexus.app",
    name: "Fatma Billing",
    role: "finance",
    title: "Finance · EduNexus",
    avatarInitials: "FB",
    homePath: "/super-admin",
  },
];

export const adminDemoUsers: AuthUser[] = [
  {
    id: "u-admin",
    email: "admin@mlimani.ac.tz",
    name: "Zawadi Mkapa",
    role: "school_admin",
    title: "School Admin · Mlimani Secondary",
    staffId: "st-admin",
    schoolId: "sch-mlimani",
    avatarInitials: "ZM",
    homePath: "/admin",
  },
  {
    id: "u-principal",
    email: "mtei@mlimani.ac.tz",
    name: "Dr. Joseph Mtei",
    role: "principal",
    title: "Principal · Mlimani Secondary",
    staffId: "st-mtei",
    schoolId: "sch-mlimani",
    avatarInitials: "JM",
    homePath: "/admin",
  },
  {
    id: "u-teacher",
    email: "kimaro@mlimani.ac.tz",
    name: "Mr. Amani Kimaro",
    role: "teacher",
    title: "Mathematics · Class teacher Form 2A",
    staffId: "st-kimaro",
    schoolId: "sch-mlimani",
    avatarInitials: "AK",
    homePath: "/teacher",
  },
  {
    id: "u-accountant",
    email: "accounts@mlimani.ac.tz",
    name: "John Masawe",
    role: "accountant",
    title: "Accountant · Mlimani Secondary",
    staffId: "st-masawe",
    schoolId: "sch-mlimani",
    avatarInitials: "JM",
    homePath: "/admin",
  },
];

export const portalDemoUsers: AuthUser[] = [
  {
    id: "u-student",
    email: "neema.juma@mlimani.ac.tz",
    name: "Neema Juma",
    role: "student",
    title: "Form 2A · Mlimani Secondary School",
    studentId: "MLM25F2A07",
    avatarInitials: "NJ",
    homePath: "/student",
  },
  {
    id: "u-parent",
    email: "asha.juma@example.com",
    name: "Asha Juma",
    role: "parent",
    title: "Parent · 2 children",
    avatarInitials: "AJ",
    homePath: "/parent",
  },
];

export const demoUsers: AuthUser[] = [
  ...platformDemoUsers,
  ...adminDemoUsers,
  ...portalDemoUsers,
];

const STORAGE_KEY = "edunexus.user";
const IMPERSONATOR_KEY = "edunexus.impersonator";

type AuthContextValue = {
  user: AuthUser | null;
  impersonator: AuthUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  impersonate: (target: AuthUser) => void;
  stopImpersonation: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function resolveUserByEmail(email: string): AuthUser | null {
  const normalized = email.trim().toLowerCase();
  const demo =
    demoUsers.find((user) => user.email.toLowerCase() === normalized) ?? null;
  if (demo) return demo;
  if (typeof window === "undefined") return null;
  const school = findSchoolByOwnerEmail(normalized);
  return school ? schoolOwnerUser(school) : null;
}

function persistUser(user: AuthUser | null) {
  if (!user) {
    window.sessionStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [impersonator, setImpersonator] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AuthUser;
        const fresh = resolveUserByEmail(parsed.email);
        setUser(fresh ?? parsed);
      }
      const mask = window.sessionStorage.getItem(IMPERSONATOR_KEY);
      if (mask) setImpersonator(JSON.parse(mask) as AuthUser);
    } catch {
      window.sessionStorage.removeItem(STORAGE_KEY);
      window.sessionStorage.removeItem(IMPERSONATOR_KEY);
    }
    setReady(true);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await new Promise((r) => window.setTimeout(r, 450));
    const found = resolveUserByEmail(email);
    if (!found || password !== DEMO_PASSWORD) {
      throw new Error("INVALID_CREDENTIALS");
    }
    persistUser(found);
    window.sessionStorage.setItem("edunexus.accessToken", "mock-access-token");
    window.sessionStorage.removeItem(IMPERSONATOR_KEY);
    setImpersonator(null);
    setUser(found);
    return found;
  }, []);

  const logout = useCallback(() => {
    persistUser(null);
    window.sessionStorage.removeItem("edunexus.accessToken");
    window.sessionStorage.removeItem(IMPERSONATOR_KEY);
    setImpersonator(null);
    setUser(null);
  }, []);

  const impersonate = useCallback(
    (target: AuthUser) => {
      if (!user) return;
      window.sessionStorage.setItem(IMPERSONATOR_KEY, JSON.stringify(user));
      persistUser(target);
      setImpersonator(user);
      setUser(target);
    },
    [user],
  );

  const stopImpersonation = useCallback(() => {
    if (!impersonator) return;
    persistUser(impersonator);
    window.sessionStorage.removeItem(IMPERSONATOR_KEY);
    setUser(impersonator);
    setImpersonator(null);
  }, [impersonator]);

  const value = useMemo(
    () => ({
      user,
      impersonator,
      ready,
      login,
      logout,
      impersonate,
      stopImpersonation,
    }),
    [user, impersonator, ready, login, logout, impersonate, stopImpersonation],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
