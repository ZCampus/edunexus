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

import { tenants, type TenantId } from "@/lib/mock-data";

type Tenant = (typeof tenants)[number];

type TenantContextValue = {
  tenant: Tenant;
  tenantId: TenantId;
  setTenantId: (id: TenantId) => void;
  tenants: readonly Tenant[];
};

const TenantContext = createContext<TenantContextValue | null>(null);
const STORAGE_KEY = "edunexus.tenantId";

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenantId, setTenantIdState] = useState<TenantId>("t1");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as TenantId | null;
    if (saved && tenants.some((t) => t.id === saved)) {
      setTenantIdState(saved);
    }
    setReady(true);
  }, []);

  const setTenantId = useCallback((id: TenantId) => {
    setTenantIdState(id);
    window.localStorage.setItem(STORAGE_KEY, id);
  }, []);

  const tenant = useMemo(
    () => tenants.find((t) => t.id === tenantId) ?? tenants[0],
    [tenantId],
  );

  const value = useMemo(
    () => ({ tenant, tenantId, setTenantId, tenants }),
    [tenant, tenantId, setTenantId],
  );

  if (!ready) {
    return (
      <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
    );
  }

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
}

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) {
    throw new Error("useTenant must be used within TenantProvider");
  }
  return ctx;
}
