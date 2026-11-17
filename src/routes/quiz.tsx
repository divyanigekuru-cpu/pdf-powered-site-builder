import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, RotateCcw, Volume2, XCircle } from "lucide-react";
import { Bi } from "@/components/app/Bi";
import { GoalBar } from "@/components/app/GoalMeter";
import { Button } from "@/components/ui/button";
import type { Word } from "@/data/vocabulary";
import { useLocale } from "@/lib/i18n";
import { useProgress } from "@/lib/progress";
import { dayKey } from "@/lib/progress-logic";
import { blankSentence, buildDailyQuiz, translationFor, type QuizQuestion } from "@/lib/quiz";
import { speak } from "@/lib/speech";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Daily vocabulary quiz — BhashaBuddy" },
      {
        name: "description",
        content: "Five bilingual multiple-choice and sentence-completion questions every day to lock in technical English words.",
      },
      { property: "og:title", content: "Daily vocabulary quiz — BhashaBuddy" },
      { property: "og:description", content: "Quick bilingual drills that reinforce today's engineering English words." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  const { t, locale } = useLocale();
  const progress = useProgress();
  const [attempt, setAttempt] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [frozen, setFrozen] = useState<QuizQuestion[] | null>(null);
  useEffect(() => setMounted(true), []);
  const learnedKey = progress.state.todayWords.join(",");
  const live = useMemo(
    () => buildDailyQuiz(dayKey(), learnedKey ? learnedKey.split(",") : [], attempt),
    [learnedKey, attempt],
  );
  // Freeze the set once the student starts answering so it never reshuffles mid-quiz.
  const questions = frozen ?? live;
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[Math.min(index, questions.length - 1)]!;

  function choose(w: Word) {
    if (picked) return;
    if (!frozen) setFrozen(questions);
    setPicked(w.id);
    if (w.id === q.word.id) setScore((s) => s + 1);
  }

  function next() {
    if (index + 1 >= questions.length) {
      progress.recordQuiz(score, questions.length);
      setFinished(true);
      return;
    }
    setIndex(index + 1);
    setPicked(null);
  }

  function restart() {
    setAttempt((a) => a + 1);
    setFrozen(null);
    setIndex(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Bi as="h1" k="quiz.title" className="text-4xl font-extrabold" />
      <p className="mt-2 text-muted-foreground">{t("quiz.subtitle")}</p>

      {!mounted ? (
        <div className="sticker mt-8 h-80 animate-pulse" />
      ) : finished ? (
        <div className="sticker mt-8 animate-pop p-8 text-center">
          <p className="text-6xl" aria-hidden>
            {score >= 4 ? "🏆" : "📘"}
          </p>
          <p className="mt-4 font-display text-3xl font-extrabold">{t("quiz.result", { score, total: questions.length })}</p>
          <p className="mt-2 text-muted-foreground">{score >= 4 ? t("quiz.resultGood") : t("quiz.resultOk")}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="hero" size="xl" onClick={restart}>
              <RotateCcw /> {t("quiz.retry")}
            </Button>
            <Button asChild variant="paper" size="xl">
              <Link to="/learn" search={{ unit: "programming", i: 0 }}>
                {t("quiz.review")}
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between text-sm font-semibold text-muted-foreground">
            <span>{t("quiz.question", { n: index + 1, total: questions.length })}</span>
            <span>
              ✓ {score}
            </span>
          </div>
          <GoalBar value={index + (picked ? 1 : 0)} max={questions.length} />
          <QuestionCard q={q} picked={picked} onPick={choose} locale={locale} />
          {picked && (
            <div className="mt-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <p
                className={cn(
                  "flex items-center gap-2 font-semibold",
                  picked === q.word.id ? "text-success" : "text-destructive",
                )}
              >
                {picked === q.word.id ? (
                  <>
                    <CheckCircle2 className="size-5" /> {t("quiz.correct")}
                  </>
                ) : (
                  <>
                    <XCircle className="size-5" /> {t("quiz.wrong")}: {q.word.term} ({translationFor(q.word, locale)})
                  </>
                )}
              </p>
              <Button variant="ink" size="xl" onClick={next}>
                {index + 1 >= questions.length ? t("quiz.finish") : t("quiz.next")}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function QuestionCard({
  q,
  picked,
  onPick,
  locale,
}: {
  q: QuizQuestion;
  picked: string | null;
  onPick: (w: Word) => void;
  locale: ReturnType<typeof useLocale>["locale"];
}) {
  const { t } = useLocale();
  const prompt =
    q.kind === "meaning" ? (
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-5xl" aria-hidden>
          {q.word.emoji}
        </span>
        <span className="font-display text-4xl font-extrabold">{q.word.term}</span>
        <Button variant="paper" size="icon" onClick={() => speak(q.word.term, 0.8)} aria-label="Listen">
          <Volume2 />
        </Button>
      </div>
    ) : q.kind === "word" ? (
      <p className="font-display text-3xl font-extrabold text-primary">{translationFor(q.word, locale)}</p>
    ) : (
      <p className="text-xl leading-relaxed sm:text-2xl">{blankSentence(q.word)}</p>
    );

  const label = (w: Word) => (q.kind === "meaning" ? translationFor(w, locale) : w.term);
  const questionKey = q.kind === "meaning" ? "quiz.meaningQ" : q.kind === "word" ? "quiz.wordQ" : "quiz.fillQ";

  return (
    <div className="sticker mt-5 p-6">
      <Bi k={questionKey} className="block text-sm font-semibold uppercase tracking-wide text-muted-foreground" />
      <div className="mt-4">{prompt}</div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {q.options.map((w, i) => {
          const isAnswer = w.id === q.word.id;
          const isPicked = w.id === picked;
          return (
            <button
              key={w.id}
              onClick={() => onPick(w)}
              disabled={!!picked}
              className={cn(
                "flex items-center gap-3 rounded-xl border-2 border-ink bg-card px-4 py-3 text-left text-lg font-semibold shadow-stamp-sm transition-transform",
                !picked && "hover:-translate-y-0.5",
                picked && isAnswer && "bg-success text-success-foreground",
                picked && isPicked && !isAnswer && "bg-destructive text-destructive-foreground",
                picked && !isAnswer && !isPicked && "opacity-60",
              )}
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-md border-2 border-current text-sm">
                {String.fromCharCode(65 + i)}
              </span>
              {label(w)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
