import { useLocale } from "@/lib/i18n";
import type { StringKey } from "@/lib/i18n-strings";
import { cn } from "@/lib/utils";

/** Bilingual text: the chosen language, with the English underneath when they differ. */
export function Bi({
  k,
  vars,
  className,
  subClassName,
  as: Tag = "span",
}: {
  k: StringKey;
  vars?: Record<string, string | number>;
  className?: string;
  subClassName?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}) {
  const { t, en, locale } = useLocale();
  return (
    <Tag className={className}>
      {t(k, vars)}
      {locale !== "en" && (
        <span className={cn("mt-1 block text-[0.55em] font-medium tracking-normal opacity-60", subClassName)}>
          {en(k, vars)}
        </span>
      )}
    </Tag>
  );
}
