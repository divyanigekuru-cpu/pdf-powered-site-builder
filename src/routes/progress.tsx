import { createFileRoute } from "@tanstack/react-router";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { Bi } from "@/components/app/Bi";
import { GoalBar, GoalMeter } from "@/components/app/GoalMeter";
import { Button } from "@/components/ui/button";
import { UNITS, WORDS_BY_ID, wordsInUnit } from "@/data/vocabulary";
import { useLocale } from "@/lib/i18n";
import type { StringKey } from "@/lib/i18n-strings";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Your progress — BhashaBuddy" },
      {
        name: "description",
        content: "Track your daily word goal, learning streak, mastered vocabulary and pronunciation scores.",
      },
      { property: "og:title", content: "Your progress — BhashaBuddy" },
      { property: "og:description", content: "Daily goals, streaks and pronunciation scores for your technical English." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const { t } = useLocale();
  const { state, setGoal, reset } = useProgress();
  const scores = Object.entries(state.bestScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Bi as="h1" k="progress.title" className="text-4xl font-extrabold" />
      <p className="mt-2 text-muted-foreground">{t("progress.subtitle")}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="space-y-6">
          <GoalMeter />
          <div className="sticker p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t("progress.dailyGoal")}</p>
            <div className="mt-3 flex items-center gap-3">
              <Button variant="paper" size="icon" onClick={() => setGoal(state.goal - 1)} aria-label="Decrease goal">
                <Minus />
              </Button>
              <p className="font-display text-3xl font-bold tabular-nums">{state.goal}</p>
              <Button variant="paper" size="icon" onClick={() => setGoal(state.goal + 1)} aria-label="Increase goal">
                <Plus />
              </Button>
              <span className="text-sm text-muted-foreground">{t("progress.wordsPerDay")}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              if (window.confirm(t("progress.resetConfirm"))) reset();
            }}
          >
            <RotateCcw /> {t("progress.reset")}
          </Button>
        </div>

        <div className="space-y-6">
          <section className="sticker p-5">
            <h2 className="text-xl font-bold">{t("progress.byUnit")}</h2>
            <ul className="mt-4 space-y-4">
              {UNITS.map((u) => {
                const words = wordsInUnit(u.id);
                const done = words.filter((w) => state.mastered.includes(w.id)).length;
                return (
                  <li key={u.id}>
                    <div className="mb-1.5 flex justify-between text-sm font-semibold">
                      <span>
                        {u.emoji} {t(`unit.${u.id}` as StringKey)}
                      </span>
                      <span className="tabular-nums text-muted-foreground">
                        {done}/{words.length}
                      </span>
                    </div>
                    <GoalBar value={done} max={words.length} />
                  </li>
                );
              })}
            </ul>
          </section>

          <div className="grid gap-6 md:grid-cols-2">
            <section className="sticker p-5">
              <h2 className="text-xl font-bold">{t("progress.scores")}</h2>
              {scores.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">{t("progress.none")}</p>
              ) : (
                <ul className="mt-3 divide-y divide-border">
                  {scores.map(([id, s]) => (
                    <li key={id} className="flex items-center justify-between py-2">
                      <span className="font-medium">
                        {WORDS_BY_ID[id]?.emoji} {WORDS_BY_ID[id]?.term ?? id}
                      </span>
                      <span className="rounded-md bg-secondary px-2 py-0.5 font-display font-bold tabular-nums">{s}%</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section className="sticker p-5">
              <h2 className="text-xl font-bold">{t("progress.quizHistory")}</h2>
              {state.quizHistory.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">{t("progress.none")}</p>
              ) : (
                <ul className="mt-3 divide-y divide-border">
                  {state.quizHistory.map((q, i) => (
                    <li key={i} className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">{q.day}</span>
                      <span className="font-display font-bold tabular-nums">
                        {q.score}/{q.total}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
