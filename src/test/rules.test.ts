import { describe, expect, it } from "vitest";
import { WORDS } from "@/data/vocabulary";
import { levenshtein, scorePronunciation } from "@/lib/pronunciation";
import { currentStreak, initialProgress, markLearned } from "@/lib/progress-logic";
import { buildDailyQuiz } from "@/lib/quiz";
import { understand } from "@/lib/buddy";

describe("vocabulary dataset", () => {
  it("has 50 words, each with Telugu, Hindi and Tamil meanings", () => {
    expect(WORDS).toHaveLength(50);
    for (const w of WORDS) {
      expect(w.translation.te && w.translation.hi && w.translation.ta).toBeTruthy();
    }
  });
  it("uses the brief's Telugu explanation for Algorithm", () => {
    expect(WORDS.find((w) => w.id === "algorithm")?.translation.te).toBe("క్రమసూత్ర పద్ధతి");
  });
  it("every example sentence contains its word (needed for sentence completion)", () => {
    for (const w of WORDS) expect(w.sentence.toLowerCase()).toContain(w.term.toLowerCase());
  });
});

describe("pronunciation grading", () => {
  it("computes Levenshtein distance", () => {
    expect(levenshtein("algorithm", "algoritham")).toBe(1);
  });
  it("accepts accented speech within 2 edits", () => {
    expect(scorePronunciation(["algoridam"], "Algorithm").matched).toBe(true);
  });
  it("rejects speech more than 2 edits away", () => {
    expect(scorePronunciation(["rhythm"], "Algorithm").matched).toBe(false);
  });
  it("scores an exact match 100%", () => {
    expect(scorePronunciation(["Algorithm"], "Algorithm").score).toBe(100);
  });
});

describe("daily goal and streak", () => {
  it("defaults to a 5-word daily goal", () => {
    expect(initialProgress("2026-11-17").goal).toBe(5);
  });
  it("counts each word once per day", () => {
    let s = initialProgress("2026-11-17");
    s = markLearned(s, "loop", "2026-11-17");
    s = markLearned(s, "loop", "2026-11-17");
    expect(s.todayWords).toHaveLength(1);
  });
  it("starts a streak when the 5th word is learned and extends it the next day", () => {
    let s = initialProgress("2026-11-16");
    ["a", "b", "c", "d"].forEach((id) => (s = markLearned(s, id, "2026-11-16")));
    expect(s.streak).toBe(0);
    s = markLearned(s, "e", "2026-11-16");
    expect(s.streak).toBe(1);
    ["f", "g", "h", "i", "j"].forEach((id) => (s = markLearned(s, id, "2026-11-17")));
    expect(s.streak).toBe(2);
    expect(s.todayWords).toHaveLength(5);
  });
  it("shows a broken streak as 0 after a missed day", () => {
    let s = initialProgress("2026-11-10");
    ["a", "b", "c", "d", "e"].forEach((id) => (s = markLearned(s, id, "2026-11-10")));
    expect(currentStreak(s, "2026-11-12")).toBe(0);
  });
});

describe("daily quiz", () => {
  it("has 5 questions with 4 options including the answer", () => {
    const quiz = buildDailyQuiz("2026-11-17", []);
    expect(quiz).toHaveLength(5);
    for (const q of quiz) {
      expect(q.options).toHaveLength(4);
      expect(q.options.map((o) => o.id)).toContain(q.word.id);
    }
  });
});

describe("buddy", () => {
  it("understands a Telugu question about voltage", () => {
    const r = understand("వోల్టేజ్ అంటే ఏమిటి?");
    expect(r.kind === "word" && r.word.id).toBe("voltage");
  });
});
