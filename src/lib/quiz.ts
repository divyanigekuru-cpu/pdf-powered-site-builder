import { WORDS, type RegionalLocale, type Word } from "@/data/vocabulary";

export type QuestionKind = "meaning" | "word" | "fill";

export interface QuizQuestion {
  kind: QuestionKind;
  word: Word;
  options: Word[];
}

/** Small deterministic PRNG so each day gets the same quiz on every reload. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(s: string) {
  let h = 2166136261;
  for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

function shuffle<T>(arr: T[], rand: () => number) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/** Five questions, preferring words learned today, then filling from the deck. */
export function buildDailyQuiz(day: string, learnedIds: string[], attempt = 0, count = 5): QuizQuestion[] {
  const rand = mulberry32(hash(`${day}:${attempt}`));
  const learned = WORDS.filter((w) => learnedIds.includes(w.id));
  const rest = shuffle(
    WORDS.filter((w) => !learnedIds.includes(w.id)),
    rand,
  );
  const picks = [...shuffle(learned, rand), ...rest].slice(0, count);
  const kinds: QuestionKind[] = ["meaning", "word", "fill"];

  return picks.map((word, i) => {
    const distractors = shuffle(
      WORDS.filter((w) => w.id !== word.id),
      rand,
    )
      .sort((a, b) => Number(b.unit === word.unit) - Number(a.unit === word.unit))
      .slice(0, 3);
    return { kind: kinds[i % kinds.length]!, word, options: shuffle([word, ...distractors], rand) };
  });
}

export function blankSentence(word: Word) {
  return word.sentence.replace(new RegExp(word.term, "i"), "_____");
}

export function translationFor(word: Word, locale: RegionalLocale | "en") {
  return locale === "en" ? word.definition : word.translation[locale];
}
