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

import {
  parentChildren,
  type ParentChild,
} from "@/lib/parent-mvp";

const STORAGE_KEY = "edunexus.parent.child";

type Value = {
  child: ParentChild;
  setChildId: (id: string) => void;
};

const Ctx = createContext<Value | null>(null);

export function ParentChildProvider({ children }: { children: ReactNode }) {
  const [childId, setId] = useState(parentChildren[0].id);

  useEffect(() => {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (stored && parentChildren.some((item) => item.id === stored)) {
      setId(stored);
    }
  }, []);

  const setChildId = useCallback((id: string) => {
    setId(id);
    window.sessionStorage.setItem(STORAGE_KEY, id);
  }, []);

  const child =
    parentChildren.find((item) => item.id === childId) ?? parentChildren[0];

  const value = useMemo(() => ({ child, setChildId }), [child, setChildId]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useParentChild() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useParentChild must be used within ParentChildProvider");
  }
  return ctx;
}
