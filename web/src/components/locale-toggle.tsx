"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function LocaleToggle({ className }: { className?: string }) {
  const { t, toggleLocale, locale } = useI18n();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={toggleLocale}
      className={className}
      aria-label={locale === "sw" ? "Switch to English" : "Badili kwa Kiswahili"}
    >
      {t("localeToggle")}
    </Button>
  );
}
