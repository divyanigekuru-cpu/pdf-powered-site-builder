import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Ear, Languages, ListChecks, Mic } from "lucide-react";
import heroImg from "@/assets/hero-student-genz.jpg";
import doodlesBg from "@/assets/genz-doodles-bg.jpg";
import { Bi } from "@/components/app/Bi";
import { GoalMeter } from "@/components/app/GoalMeter";
import { WordCard } from "@/components/app/WordCard";
import { Button } from "@/components/ui/button";
import { UNITS, WORDS_BY_ID, wordsInUnit } from "@/data/vocabulary";
import { useLocale } from "@/lib/i18n";
import type { StringKey } from "@/lib/i18n-strings";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BhashaBuddy — Speak engineering English with confidence" },
      {
        name: "description",
        content:
          "Bilingual flashcards, pronunciation scoring and daily quizzes that teach technical English through Telugu, Hindi and Tamil.",
      },
      { property: "og:title", content: "BhashaBuddy — Speak engineering English with confidence" },
      {
        property: "og:description",
        content: "Learn technical English words in your own language, hear them, and check your pronunciation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const FEATURES: { icon: typeof Ear; key: string }[] = [
  { icon: Languages, key: "bilingual" },
  { icon: Ear, key: "listen" },
  { icon: Mic, key: "speak" },
  { icon: ListChecks, key: "quiz" },
];

function Index() {
  const { t } = useLocale();
  const { state } = useProgress();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b-2 border-ink">
        <img
          src={doodlesBg}
          alt=""
          aria-hidden
          width={1920}
          height={1088}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="bg-hero pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-[1.15fr_1fr] md:py-20">
          <div className="animate-rise">
            <p className="inline-block rounded-full border-2 border-ink bg-card px-3 py-1 text-sm font-semibold shadow-stamp-sm">
              {t("hero.kicker")}
            </p>
            <Bi
              as="h1"
              k="hero.title"
              className="mt-5 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl"
              subClassName="text-[0.45em] mt-3"
            />
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">{t("hero.subtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/learn" search={{ unit: "programming", i: 0 }}>
                  {t("hero.ctaLearn")} <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="paper" size="xl">
                <Link to="/quiz">{t("hero.ctaQuiz")}</Link>
              </Button>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <img
              src={heroImg}
              alt="A student in a lavender hoodie talking on his phone with Telugu, Hindi and English speech bubbles"
              width={1024}
              height={1024}
              className="sticker aspect-square w-full animate-float object-cover"
            />
            <div className="absolute -bottom-5 -left-4 rotate-[-4deg] rounded-xl border-2 border-ink bg-accent px-4 py-2 font-display font-bold text-accent-foreground shadow-stamp">
              Algorithm = క్రమసూత్ర పద్ధతి
            </div>
            <div className="absolute -top-4 -right-3 rotate-[6deg] rounded-full border-2 border-ink bg-card px-3 py-1 text-sm font-bold shadow-stamp-sm">
              ✨ main character energy
            </div>
          </div>
        </div>
      </section>

      {/* Try now */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-6">
          <Bi as="h2" k="home.tryNow" className="text-3xl font-extrabold sm:text-4xl" />
          <p className="mt-2 text-muted-foreground">{t("home.tryNowSub")}</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <WordCard word={WORDS_BY_ID["algorithm"]!} compact />
          <GoalMeter className="h-fit" />
        </div>
      </section>

      {/* Features */}
      <section className="border-y-2 border-ink bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <Bi as="h2" k="home.howTitle" className="text-3xl font-extrabold sm:text-4xl" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <div
                key={f.key}
                className="animate-rise rounded-xl border-2 border-ink bg-card p-5 text-card-foreground shadow-stamp"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="grid size-11 place-items-center rounded-lg border-2 border-ink bg-accent text-accent-foreground">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-lg font-bold">{t(`feature.${f.key}.title` as StringKey)}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t(`feature.${f.key}.desc` as StringKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Units */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <Bi as="h2" k="home.unitsTitle" className="text-3xl font-extrabold sm:text-4xl" />
        <p className="mt-2 text-muted-foreground">{t("home.unitsSub")}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {UNITS.map((u, i) => {
            const words = wordsInUnit(u.id);
            const done = words.filter((w) => state.mastered.includes(w.id)).length;
            return (
              <Link
                key={u.id}
                to="/learn"
                search={{ unit: u.id, i: 0 }}
                className="group sticker flex flex-col gap-3 p-5 transition-transform hover:-translate-y-1"
              >
                <span className="text-xs font-semibold text-muted-foreground">0{i + 1}</span>
                <span className="text-4xl" aria-hidden>
                  {u.emoji}
                </span>
                <span className="font-display text-lg font-bold leading-tight">{t(`unit.${u.id}` as StringKey)}</span>
                <span className="mt-auto text-sm text-muted-foreground">
                  {done}/{words.length} · {words.slice(0, 3).map((w) => w.term).join(", ")}…
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
