import { WORDS, type Word } from "@/data/vocabulary";

export type BuddyIntent =
  | { kind: "word"; word: Word }
  | { kind: "greet" }
  | { kind: "thanks" }
  | { kind: "interview" }
  | { kind: "unknown" };

const GREET = /\b(hi|hello|hey|namaste|namaskar)\b|నమస్తే|నమస్కారం|नमस्ते|नमस्कार|வணக்கம்/i;
const THANKS = /\b(thanks|thank you|thx)\b|ధన్యవాదాలు|धन्यवाद|शुक्रिया|நன்றி/i;
const TIPS = /\b(tip|tips|advice|prepare)\b|చిట్కా|सुझाव|टिप|குறிப்பு/i;

export function understand(message: string): BuddyIntent {
  const text = message.trim();
  const lower = text.toLowerCase();

  // Longest match first so "Thermodynamics" wins over shorter overlaps.
  const candidates = [...WORDS].sort((a, b) => b.term.length - a.term.length);
  for (const w of candidates) {
    if (new RegExp(`\\b${w.term.toLowerCase()}\\b`).test(lower)) {
      if (w.id === "interview" && TIPS.test(text)) return { kind: "interview" };
      return { kind: "word", word: w };
    }
  }
  for (const w of candidates) {
    const forms = [...Object.values(w.translation), ...Object.values(w.sayAs)];
    if (forms.some((f) => f.length > 1 && text.includes(f))) return { kind: "word", word: w };
  }
  if (TIPS.test(text)) return { kind: "interview" };
  if (THANKS.test(text)) return { kind: "thanks" };
  if (GREET.test(text)) return { kind: "greet" };
  return { kind: "unknown" };
}
