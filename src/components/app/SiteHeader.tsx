import { Link } from "@tanstack/react-router";
import { BookOpen, Home, ListChecks, MessageCircle, BarChart3 } from "lucide-react";
import { useLocale } from "@/lib/i18n";
import type { StringKey } from "@/lib/i18n-strings";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { GoalPill } from "./GoalMeter";

const NAV: { to: "/" | "/learn" | "/quiz" | "/progress" | "/buddy"; key: StringKey; icon: typeof Home }[] = [
  { to: "/", key: "nav.home", icon: Home },
  { to: "/learn", key: "nav.learn", icon: BookOpen },
  { to: "/quiz", key: "nav.quiz", icon: ListChecks },
  { to: "/progress", key: "nav.progress", icon: BarChart3 },
  { to: "/buddy", key: "nav.buddy", icon: MessageCircle },
];

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="grid size-9 place-items-center rounded-xl border-2 border-ink bg-accent font-display text-lg font-extrabold text-accent-foreground shadow-stamp-sm">
        అ
      </span>
      <span className="font-display text-xl font-extrabold tracking-tight">
        Bhasha<span className="text-highlight">Buddy</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const { t } = useLocale();
  return (
    <>
      <header className="sticky top-0 z-40 border-b-2 border-ink bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-primary data-[status=active]:text-primary-foreground"
              >
                {t(n.key)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <GoalPill />
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t-2 border-ink bg-card md:hidden">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            activeOptions={{ exact: n.to === "/" }}
            className="flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold text-muted-foreground data-[status=active]:text-primary"
          >
            <n.icon className="size-5" />
            <span className="max-w-full truncate px-1">{t(n.key)}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}

export function SiteFooter() {
  const { t } = useLocale();
  return (
    <footer className="mx-auto max-w-6xl px-4 pb-24 pt-10 text-sm text-muted-foreground md:pb-10">
      <div className="flex flex-col items-start justify-between gap-3 border-t-2 border-dashed border-border pt-6 sm:flex-row sm:items-center">
        <Logo />
        <p>{t("footer.note")}</p>
      </div>
    </footer>
  );
}
