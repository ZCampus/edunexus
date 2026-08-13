"use client";

import { useEffect, useState } from "react";
import { CloudOff, Wifi, RefreshCw } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type NetState = "online" | "offline" | "syncing";

export function OfflineBanner() {
  const { t } = useI18n();
  const [state, setState] = useState<NetState>("online");

  useEffect(() => {
    const goOnline = () => {
      setState("syncing");
      const timer = window.setTimeout(() => setState("online"), 1200);
      return () => window.clearTimeout(timer);
    };
    const goOffline = () => setState("offline");

    setState(navigator.onLine ? "online" : "offline");
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  const label =
    state === "offline"
      ? t("offlineOffline")
      : state === "syncing"
        ? t("offlineSyncing")
        : t("offlineOnline");

  const Icon =
    state === "offline" ? CloudOff : state === "syncing" ? RefreshCw : Wifi;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-center justify-center gap-2 border-b px-3 py-1.5 text-xs font-medium tracking-wide transition-colors duration-300",
        state === "offline" &&
          "border-amber-700/20 bg-amber-50 text-amber-950 dark:border-amber-400/20 dark:bg-amber-950/40 dark:text-amber-100",
        state === "syncing" &&
          "border-teal-800/15 bg-teal-50 text-teal-950 dark:border-teal-400/20 dark:bg-teal-950/40 dark:text-teal-100",
        state === "online" &&
          "border-transparent bg-transparent text-muted-foreground",
      )}
    >
      <Icon
        className={cn("size-3.5", state === "syncing" && "animate-spin")}
        aria-hidden
      />
      <span className="inline-flex items-center gap-2">
        <span
          className={cn(
            "size-1.5 rounded-full",
            state === "offline" && "bg-amber-600",
            state === "syncing" && "bg-teal-600 animate-pulse",
            state === "online" && "bg-teal-600",
          )}
          aria-hidden
        />
        {label}
      </span>
    </div>
  );
}
