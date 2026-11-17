/** Edit distance between two strings (insertions, deletions, substitutions). */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    prev = curr;
  }
  return prev[b.length];
}

export function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z]/g, "");
}

/** Accent-friendly grading: within this many edits still counts as a correct pronunciation. */
export const MAX_ACCEPTED_DISTANCE = 2;

export interface PronunciationResult {
  score: number;
  distance: number;
  heard: string;
  matched: boolean;
}

/** Score one or more recognition alternatives against the target word; best alternative wins. */
export function scorePronunciation(alternatives: string[], target: string): PronunciationResult {
  const goal = normalize(target);
  let best: PronunciationResult = { score: 0, distance: goal.length, heard: alternatives[0] ?? "", matched: false };

  for (const alt of alternatives) {
    const candidates = [normalize(alt), ...alt.split(/\s+/).map(normalize)].filter(Boolean);
    for (const c of candidates) {
      const distance = levenshtein(c, goal);
      const score = Math.max(0, Math.round((1 - distance / Math.max(c.length, goal.length)) * 100));
      if (score > best.score) {
        best = { score, distance, heard: alt, matched: distance <= MAX_ACCEPTED_DISTANCE };
      }
    }
  }
  return best;
}
