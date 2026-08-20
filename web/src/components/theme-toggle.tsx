"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";
  const label = isDark ? t("themeLight") : t("themeDark");

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      className={className}
      disabled={!mounted}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={mounted ? label : t("themeDark")}
      title={mounted ? label : t("themeDark")}
      suppressHydrationWarning
    >
      {mounted ? (
        isDark ? (
          <Sun aria-hidden suppressHydrationWarning />
        ) : (
          <Moon aria-hidden suppressHydrationWarning />
        )
      ) : (
        <span className="size-4" aria-hidden />
      )}
    </Button>
  );
}
