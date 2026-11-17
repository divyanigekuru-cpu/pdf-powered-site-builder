import { useEffect, useState } from "react";
import { Check, Mic, MicOff, PartyPopper, Volume2, MessageSquareQuote } from "lucide-react";
import { toast } from "sonner";
import type { Word } from "@/data/vocabulary";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n";
import { useProgress } from "@/lib/progress";
import { scorePronunciation, type PronunciationResult } from "@/lib/pronunciation";
import { speak, useSpeechRecognition } from "@/lib/speech";
import { cn } from "@/lib/utils";

function HighlightedSentence({ word }: { word: Word }) {
  const parts = word.sentence.split(new RegExp(`(${word.term})`, "i"));
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === word.term.toLowerCase() ? (
          <mark key={i} className="rounded bg-accent px-1 text-accent-foreground">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function WordCard({ word, compact = false }: { word: Word; compact?: boolean }) {
  const { t, locale } = useLocale();
  const progress = useProgress();
  const { supported, listening, error, start, stop } = useSpeechRecognition();
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const [typed, setTyped] = useState("");
  const learned = progress.state.mastered.includes(word.id);

  useEffect(() => {
    setResult(null);
    setTyped("");
  }, [word.id]);

  function handleResult(alts: string[]) {
    const r = scorePronunciation(alts, word.term);
    setResult(r);
    if (r.matched) {
      const next = progress.markLearned(word.id);
      const count = Math.min(next.todayWords.length, next.goal);
      toast.success(`${t("pron.great")} ${t("goal.today")}: ${count}/${next.goal}`, {
        icon: <PartyPopper className="size-4" />,
      });
    }
    // Functional update: applied on top of markLearned's state.
    progress.recordScore(word.id, r.score);
  }

  function markLearned() {
    const next = progress.markLearned(word.id);
    toast.success(`${t("learn.learned")} · ${t("goal.today")}: ${Math.min(next.todayWords.length, next.goal)}/${next.goal}`);
  }

  const showFallback = supported === false || error === "denied";
  const meaning = locale === "en" ? word.definition : word.translation[locale];
  const sayAs = locale === "en" ? word.phonetic : word.sayAs[locale];
  const tone = !result ? "" : result.matched ? "success" : result.score >= 50 ? "accent" : "highlight";

  return (
    <article className="sticker relative overflow-hidden">
      <div className="grid gap-0 md:grid-cols-[1fr_1.1fr]">
        {/* Word side */}
        <div className="relative flex flex-col justify-between gap-6 border-b-2 border-ink bg-secondary p-6 md:border-b-0 md:border-r-2">
          <div className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide">
            <span className="rounded-full border-2 border-ink bg-card px-2.5 py-0.5">{t(`unit.${word.unit}` as never)}</span>
            <span className="rounded-full bg-primary px-2.5 py-0.5 text-primary-foreground">{t(`tier.${word.tier}` as never)}</span>
          </div>
          <div>
            <div className="mb-3 text-6xl leading-none" aria-hidden>
              {word.emoji}
            </div>
            <h2 className="font-display text-4xl font-extrabold sm:text-5xl">{word.term}</h2>
            <p className="mt-2 font-mono text-sm text-muted-foreground">/{word.phonetic}/</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="ink" size="xl" onClick={() => speak(word.term, 0.8)}>
              <Volume2 /> {t("learn.listen")}
            </Button>
            {supported !== false && (
              <Button
                variant="speak"
                size="xl"
                onClick={() => (listening ? stop() : start(handleResult))}
                className={cn(listening && "animate-ring")}
                aria-pressed={listening}
              >
                {listening ? <MicOff /> : <Mic />} {listening ? t("learn.listening") : t("learn.speak")}
              </Button>
            )}
          </div>
        </div>

        {/* Meaning side */}
        <div className="flex flex-col gap-5 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("learn.meaning")}</p>
            <p className="mt-1 font-display text-3xl font-bold text-primary">{meaning}</p>
            {locale !== "en" && <p className="mt-1 text-sm text-muted-foreground">{word.definition}</p>}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("learn.sayItLike")}</p>
            <p className="mt-1 text-xl font-semibold">{sayAs}</p>
          </div>
          {!compact && (
            <div className="rounded-xl border-2 border-dashed border-border p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <MessageSquareQuote className="size-4" /> {t("learn.example")}
              </p>
              <p className="mt-2 text-lg leading-relaxed">
                <HighlightedSentence word={word} />
              </p>
              <Button variant="ghost" size="sm" className="mt-2 -ml-2" onClick={() => speak(word.sentence)}>
                <Volume2 /> {t("learn.listenSentence")}
              </Button>
            </div>
          )}

          {/* Pronunciation feedback */}
          <div aria-live="polite" className="min-h-0">
            {result && (
              <div
                className={cn(
                  "animate-pop rounded-xl border-2 border-ink p-4",
                  tone === "success" && "bg-success text-success-foreground",
                  tone === "accent" && "bg-accent text-accent-foreground",
                  tone === "highlight" && "bg-highlight text-highlight-foreground",
                )}
              >
                <p className="text-xs font-semibold uppercase tracking-wide opacity-80">{t("pron.match")}</p>
                <p className="font-display text-4xl font-extrabold">{result.score}%</p>
                <p className="mt-1 text-sm">
                  {t("pron.heard")}: “{result.heard}”
                </p>
                <p className="mt-2 font-semibold">
                  {result.matched ? `🎉 ${t("pron.great")}` : result.score >= 50 ? t("pron.good") : t("pron.retry")}
                </p>
              </div>
            )}
            {!result && error === "no-speech" && <p className="text-sm text-muted-foreground">{t("pron.noSpeech")}</p>}
            {showFallback && (
              <form
                className="mt-2 space-y-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (typed.trim()) handleResult([typed]);
                }}
              >
                <p className="text-sm text-muted-foreground">
                  {error === "denied" ? t("pron.micDenied") : t("pron.unsupported")}
                </p>
                <div className="flex gap-2">
                  <input
                    value={typed}
                    onChange={(e) => setTyped(e.target.value)}
                    placeholder={t("pron.typePlaceholder")}
                    className="h-11 flex-1 rounded-xl border-2 border-ink bg-card px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <Button type="submit" variant="ink" className="h-11">
                    {t("pron.check")}
                  </Button>
                </div>
              </form>
            )}
          </div>

          <div className="mt-auto">
            <Button variant={learned ? "secondary" : "paper"} onClick={markLearned} disabled={learned}>
              <Check /> {learned ? t("learn.learned") : t("learn.markLearned")}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
