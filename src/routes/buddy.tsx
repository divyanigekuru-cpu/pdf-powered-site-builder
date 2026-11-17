import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bot, Send, Volume2 } from "lucide-react";
import { Bi } from "@/components/app/Bi";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/data/vocabulary";
import { understand, type BuddyIntent } from "@/lib/buddy";
import { useLocale } from "@/lib/i18n";
import { STRINGS, format, type StringKey } from "@/lib/i18n-strings";
import { speak } from "@/lib/speech";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/buddy")({
  head: () => ({
    meta: [
      { title: "Ask Buddy — bilingual vocabulary helper | BhashaBuddy" },
      {
        name: "description",
        content: "Ask the meaning of any engineering word in Telugu, Hindi, Tamil or English and get a bilingual answer.",
      },
      { property: "og:title", content: "Ask Buddy — bilingual vocabulary helper" },
      { property: "og:description", content: "A friendly chat buddy that explains technical English in your language." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BuddyPage,
});

interface Msg {
  from: "me" | "buddy";
  text?: string;
  intent?: BuddyIntent;
}

function reply(intent: BuddyIntent, locale: Locale): { text: string; english?: string | undefined } {
  const render = (l: Locale) => {
    const d = STRINGS[l];
    switch (intent.kind) {
      case "word": {
        const w = intent.word;
        return format(d["buddy.found"], {
          term: w.term,
          tr: l === "en" ? `“${w.translation.te}” (Telugu) / “${w.translation.hi}” (Hindi) / “${w.translation.ta}” (Tamil)` : w.translation[l],
          def: w.definition,
          say: l === "en" ? w.phonetic : w.sayAs[l],
          sentence: w.sentence,
        });
      }
      case "greet":
        return d["buddy.greet"];
      case "thanks":
        return d["buddy.thanks"];
      case "interview":
        return d["buddy.interview"];
      default:
        return d["buddy.unknown"];
    }
  };
  return { text: render(locale), english: locale === "en" ? undefined : intent.kind === "word" ? intent.word.definition : render("en") };
}

const SUGGESTIONS: Record<Locale, string[]> = {
  en: ["What is an algorithm?", "Explain voltage", "Interview tips"],
  te: ["వోల్టేజ్ అంటే ఏమిటి?", "అల్గారిథమ్ అర్థం?", "ఇంటర్వ్యూ చిట్కా"],
  hi: ["वोल्टेज क्या है?", "एल्गोरिदम का अर्थ?", "इंटरव्यू टिप"],
  ta: ["மின்னழுத்தம் என்றால் என்ன?", "அல்காரிதம் பொருள்?", "நேர்காணல் குறிப்பு"],
};

function BuddyPage() {
  const { t, locale } = useLocale();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  function send(text: string) {
    const clean = text.trim();
    if (!clean) return;
    setMessages((m) => [...m, { from: "me", text: clean }, { from: "buddy", intent: understand(clean) }]);
    setInput("");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Bi as="h1" k="buddy.title" className="text-4xl font-extrabold" />
      <p className="mt-2 text-muted-foreground">{t("buddy.subtitle")}</p>

      <div className="sticker mt-8 flex h-[60vh] min-h-[420px] flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <BuddyBubble text={t("buddy.hello")} />
          {messages.map((m, i) =>
            m.from === "me" ? (
              <div key={i} className="flex justify-end">
                <p className="max-w-[80%] rounded-2xl rounded-br-sm border-2 border-ink bg-primary px-4 py-2 text-primary-foreground">
                  {m.text}
                </p>
              </div>
            ) : (
              <BuddyBubble key={i} {...reply(m.intent!, locale)} speakText={m.intent?.kind === "word" ? m.intent.word.term : undefined} />
            ),
          )}
          <div ref={endRef} />
        </div>
        <div className="border-t-2 border-ink p-3">
          <div className="mb-2 flex flex-wrap gap-2">
            <span className="self-center text-xs font-semibold text-muted-foreground">{t("buddy.suggest" as StringKey)}:</span>
            {SUGGESTIONS[locale].map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border-2 border-ink bg-secondary px-3 py-1 text-sm font-medium transition-transform hover:-translate-y-0.5"
              >
                {s}
              </button>
            ))}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("buddy.placeholder")}
              aria-label={t("buddy.placeholder")}
              className="h-12 flex-1 rounded-xl border-2 border-ink bg-card px-4 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button type="submit" variant="hero" size="xl" aria-label={t("buddy.send")}>
              <Send /> <span className="hidden sm:inline">{t("buddy.send")}</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function BuddyBubble({
  text,
  english,
  speakText,
}: {
  text: string;
  english?: string | undefined;
  speakText?: string | undefined;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl border-2 border-ink bg-accent text-accent-foreground">
        <Bot className="size-5" />
      </span>
      <div className={cn("max-w-[85%] animate-pop rounded-2xl rounded-tl-sm border-2 border-ink bg-secondary px-4 py-3")}>
        <p className="leading-relaxed">{text}</p>
        {english && <p className="mt-2 border-t border-dashed border-border pt-2 text-sm text-muted-foreground">{english}</p>}
        {speakText && (
          <Button variant="ghost" size="sm" className="mt-1 -ml-2" onClick={() => speak(speakText, 0.8)}>
            <Volume2 /> {speakText}
          </Button>
        )}
      </div>
    </div>
  );
}
