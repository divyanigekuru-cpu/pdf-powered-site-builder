import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import * as P from "./progress-logic";

const STORAGE_KEY = "bhashabuddy.progress.v1";

interface ProgressContextValue {
  state: P.ProgressState;
  streak: number;
  learnedToday: number;
  markLearned: (id: string) => P.ProgressState;
  recordScore: (id: string, score: number) => void;
  recordQuiz: (score: number, total: number) => void;
  setGoal: (n: number) => void;
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<P.ProgressState>(() => P.initialProgress(P.dayKey()));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState(P.rollOver({ ...P.initialProgress(P.dayKey()), ...JSON.parse(raw) }, P.dayKey()));
    } catch {
      /* corrupted storage: start fresh */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, loaded]);

  const markLearned = useCallback(
    (id: string) => {
      const next = P.markLearned(state, id, P.dayKey());
      setState(next);
      return next;
    },
    [state],
  );

  const value = useMemo<ProgressContextValue>(() => {
    const today = P.dayKey();
    const current = P.rollOver(state, today);
    return {
      state: current,
      streak: P.currentStreak(current, today),
      learnedToday: current.todayWords.length,
      markLearned,
      recordScore: (id, score) => setState((s) => P.recordScore(s, id, score)),
      recordQuiz: (score, total) => setState((s) => P.recordQuiz(s, score, total, P.dayKey())),
      setGoal: (n) => setState((s) => ({ ...s, goal: Math.min(20, Math.max(1, n)) })),
      reset: () => setState(P.initialProgress(P.dayKey())),
    };
  }, [state, markLearned]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}
