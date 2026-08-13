"use client";

import { Building2 } from "lucide-react";
import { toast } from "sonner";

import { useI18n } from "@/lib/i18n";
import { useTenant } from "@/lib/tenant";
import type { TenantId } from "@/lib/mock-data";

export function SchoolSwitcher({ className }: { className?: string }) {
  const { t } = useI18n();
  const { tenant, tenants, setTenantId } = useTenant();

  return (
    <div className={className}>
      <label className="mb-1.5 flex items-center gap-1.5 px-1 text-xs text-muted-foreground">
        <Building2 className="size-3.5" aria-hidden />
        {t("schoolSwitcher")}
      </label>
      <select
        aria-label={t("schoolSwitcher")}
        value={tenant.id}
        onChange={(e) => {
          const id = e.target.value as TenantId;
          setTenantId(id);
          const next = tenants.find((item) => item.id === id);
          toast.success(`${t("schoolCurrent")}: ${next?.name ?? id}`);
        }}
        className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
      >
        {tenants.map((item) => (
          <option key={item.id} value={item.id}>
            {item.code} · {item.name}
          </option>
        ))}
      </select>
    </div>
  );
}
