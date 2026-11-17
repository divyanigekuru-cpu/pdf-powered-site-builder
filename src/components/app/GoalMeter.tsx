import { Flame, Target, Trophy } from "lucide-react";
import { useLocale } from "@/lib/i18n";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export function GoalBar({ value, max, className }: { value: number; max: number; className?: string }) {
  const pct = Math.min(100, Math.round((value / Math.max(1, max)) * 100));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn("h-3 w-full overflow-hidden rounded-full border-2 border-ink bg-muted", className)}
    >
      <div className="h-full rounded-full bg-meter transition-[width] duration-700 ease-out" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function GoalPill() {
  const { learnedToday, state, streak } = useProgress();
  return (
    <div className="flex items-center gap-3 rounded-xl border-2 border-ink bg-card px-3 py-1.5 text-sm font-semibold shadow-stamp-sm">
      <span className="flex items-center gap-1" aria-label="Today's goal">
        <Target className="size-4 text-primary" />
        {Math.min(learnedToday, state.goal)}/{state.goal}
      </span>
      <span className="flex items-center gap-1" aria-label="Streak">
        <Flame className="size-4 text-highlight" />
        {streak}
      </span>
    </div>
  );
}

export function GoalMeter({ className }: { className?: string }) {
  const { t } = useLocale();
  const { learnedToday, state, streak } = useProgress();
  const done = learnedToday >= state.goal;
  return (
    <div className={cn("sticker p-5", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t("goal.today")}</p>
        <p className="font-display text-3xl font-bold">
          {Math.min(learnedToday, state.goal)}
          <span className="text-muted-foreground">/{state.goal}</span>{" "}
          <span className="text-base font-medium text-muted-foreground">{t("goal.words")}</span>
        </p>
      </div>
      <GoalBar value={learnedToday} max={state.goal} className="mt-3" />
      <p className="mt-3 text-sm text-muted-foreground">
        {done ? t("goal.done") : t("goal.keepGoing", { left: state.goal - learnedToday })}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-secondary px-3 py-2">
          <p className="flex items-center gap-1.5 font-display text-2xl font-bold">
            <Flame className="size-5 text-highlight" /> {streak}
          </p>
          <p className="text-xs text-muted-foreground">{t("goal.streak")}</p>
        </div>
        <div className="rounded-lg bg-secondary px-3 py-2">
          <p className="flex items-center gap-1.5 font-display text-2xl font-bold">
            <Trophy className="size-5 text-accent-foreground" /> {state.mastered.length}
          </p>
          <p className="text-xs text-muted-foreground">{t("goal.mastered")}</p>
        </div>
      </div>
    </div>
  );
}
