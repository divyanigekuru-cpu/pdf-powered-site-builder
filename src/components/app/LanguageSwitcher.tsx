import { STRINGS } from "@/lib/i18n-strings";
import { LOCALES, useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  return (
    <div
      role="radiogroup"
      aria-label="Language"
      className={cn("inline-flex rounded-xl border-2 border-ink bg-card p-0.5 shadow-stamp-sm", className)}
    >
      {LOCALES.map((l) => (
        <button
          key={l}
          role="radio"
          aria-checked={locale === l}
          aria-label={STRINGS[l]["lang.name"]}
          title={STRINGS[l]["lang.name"]}
          onClick={() => setLocale(l)}
          className={cn(
            "min-w-9 rounded-lg px-2.5 py-1 text-sm font-semibold transition-colors",
            locale === l ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary",
          )}
        >
          {STRINGS[l]["lang.short"]}
        </button>
      ))}
    </div>
  );
}
