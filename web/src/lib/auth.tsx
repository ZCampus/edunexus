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

export type UserRole = "student" | "parent" | "teacher" | "headmaster";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  title: string;
  studentId?: string;
  avatarInitials: string;
  homePath: string;
};

/** Demo directory — in production this comes from NestJS /auth/login */
export const demoUsers: AuthUser[] = [
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
  {
    id: "u-teacher",
    email: "kimaro@mlimani.ac.tz",
    name: "Mr. Amani Kimaro",
    role: "teacher",
    title: "Teacher · Mathematics · Form 2A",
    avatarInitials: "AK",
    homePath: "/teacher/attendance",
  },
  {
    id: "u-head",
    email: "mtei@mlimani.ac.tz",
    name: "Dr. Joseph Mtei",
    role: "headmaster",
    title: "Headmaster · Mlimani Secondary",
    avatarInitials: "JM",
    homePath: "/headmaster",
  },
];

const STORAGE_KEY = "edunexus.user";

type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function resolveUserByEmail(email: string): AuthUser | null {
  const normalized = email.trim().toLowerCase();
  return (
    demoUsers.find((user) => user.email.toLowerCase() === normalized) ?? null
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        setUser(JSON.parse(raw) as AuthUser);
      }
    } catch {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    await new Promise((r) => window.setTimeout(r, 450));
    const found = resolveUserByEmail(email);
    if (!found) {
      throw new Error("INVALID_CREDENTIALS");
    }
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
    window.sessionStorage.setItem("edunexus.accessToken", "mock-access-token");
    setUser(found);
    return found;
  }, []);

  const logout = useCallback(() => {
    window.sessionStorage.removeItem(STORAGE_KEY);
    window.sessionStorage.removeItem("edunexus.accessToken");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, ready, login, logout }),
    [user, ready, login, logout],
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
