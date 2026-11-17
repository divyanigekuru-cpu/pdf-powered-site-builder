import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { Bi } from "@/components/app/Bi";
import { WordCard } from "@/components/app/WordCard";
import { Button } from "@/components/ui/button";
import { UNITS, wordsInUnit } from "@/data/vocabulary";
import { useLocale } from "@/lib/i18n";
import type { StringKey } from "@/lib/i18n-strings";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  unit: z.enum(["programming", "engineering", "math", "lab", "career"]).catch("programming"),
  i: z.number().int().min(0).catch(0),
});

export const Route = createFileRoute("/learn")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Vocabulary deck — BhashaBuddy" },
      {
        name: "description",
        content: "Flashcards for 50 engineering English words with Telugu, Hindi and Tamil meanings, audio and voice practice.",
      },
      { property: "og:title", content: "Vocabulary deck — BhashaBuddy" },
      { property: "og:description", content: "Listen, speak and learn technical English words in your own language." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LearnPage,
});

function LearnPage() {
  const { unit, i } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { t } = useLocale();
  const { state } = useProgress();
  const words = wordsInUnit(unit);
  const index = Math.min(i, words.length - 1);
  const word = words[index];

  const go = (next: number) =>
    navigate({ search: { unit, i: (next + words.length) % words.length }, replace: true, resetScroll: false });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Bi as="h1" k="learn.title" className="text-4xl font-extrabold" />
      <p className="mt-2 text-muted-foreground">{t("learn.subtitle")}</p>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {UNITS.map((u) => {
          const active = u.id === unit;
          return (
            <Link
              key={u.id}
              to="/learn"
              search={{ unit: u.id, i: 0 }}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-xl border-2 border-ink px-3 py-2 text-sm font-semibold transition-transform",
                active ? "bg-primary text-primary-foreground shadow-stamp-sm" : "bg-card hover:-translate-y-0.5",
              )}
            >
              <span aria-hidden>{u.emoji}</span>
              {t(`unit.${u.id}` as StringKey)}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_240px]">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-muted-foreground">
              {t("learn.wordOf", { n: index + 1, total: words.length })}
            </p>
            <div className="flex gap-2">
              <Button variant="paper" size="sm" onClick={() => go(index - 1)} aria-label={t("learn.prev")}>
                <ChevronLeft /> <span className="hidden sm:inline">{t("learn.prev")}</span>
              </Button>
              <Button variant="paper" size="sm" onClick={() => go(index + 1)} aria-label={t("learn.next")}>
                <span className="hidden sm:inline">{t("learn.next")}</span> <ChevronRight />
              </Button>
            </div>
          </div>
          <WordCard key={word.id} word={word} />
        </div>

        <aside className="sticker h-fit p-3">
          <ol className="grid grid-cols-2 gap-1 lg:grid-cols-1">
            {words.map((w, idx) => {
              const learned = state.mastered.includes(w.id);
              return (
                <li key={w.id}>
                  <button
                    onClick={() => go(idx)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm font-medium transition-colors",
                      idx === index ? "bg-accent text-accent-foreground" : "hover:bg-secondary",
                    )}
                  >
                    <span aria-hidden>{w.emoji}</span>
                    <span className="flex-1 truncate">{w.term}</span>
                    {learned && <CheckCircle2 className="size-4 shrink-0 text-success" aria-label={t("learn.learned")} />}
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>
      </div>
    </div>
  );
}
