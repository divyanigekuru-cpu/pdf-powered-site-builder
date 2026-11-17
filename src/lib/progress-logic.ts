export interface ProgressState {
  goal: number;
  day: string;
  todayWords: string[];
  streak: number;
  lastGoalDay: string | null;
  mastered: string[];
  bestScores: Record<string, number>;
  quizHistory: { day: string; score: number; total: number }[];
}

export const DEFAULT_GOAL = 5;

export function dayKey(d: Date = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function previousDay(day: string) {
  const [y = 1970, m = 1, d = 1] = day.split("-").map(Number);
  return dayKey(new Date(y, m - 1, d - 1));
}

export function initialProgress(today: string): ProgressState {
  return {
    goal: DEFAULT_GOAL,
    day: today,
    todayWords: [],
    streak: 0,
    lastGoalDay: null,
    mastered: [],
    bestScores: {},
    quizHistory: [],
  };
}

/** Start a fresh daily list when the calendar day changes. */
export function rollOver(state: ProgressState, today: string): ProgressState {
  if (state.day === today) return state;
  return { ...state, day: today, todayWords: [] };
}

/** Streak shown to the user: broken if the goal was not met yesterday or today. */
export function currentStreak(state: ProgressState, today: string) {
  if (!state.lastGoalDay) return 0;
  if (state.lastGoalDay === today || state.lastGoalDay === previousDay(today)) return state.streak;
  return 0;
}

export function markLearned(state: ProgressState, wordId: string, today: string): ProgressState {
  const s = rollOver(state, today);
  if (s.todayWords.includes(wordId)) return s;
  const todayWords = [...s.todayWords, wordId];
  const mastered = s.mastered.includes(wordId) ? s.mastered : [...s.mastered, wordId];
  let { streak, lastGoalDay } = s;
  if (todayWords.length >= s.goal && lastGoalDay !== today) {
    streak = lastGoalDay === previousDay(today) ? streak + 1 : 1;
    lastGoalDay = today;
  }
  return { ...s, todayWords, mastered, streak, lastGoalDay };
}

export function recordScore(state: ProgressState, wordId: string, score: number): ProgressState {
  const prev = state.bestScores[wordId] ?? 0;
  if (score <= prev) return state;
  return { ...state, bestScores: { ...state.bestScores, [wordId]: score } };
}

export function recordQuiz(state: ProgressState, score: number, total: number, today: string): ProgressState {
  return { ...state, quizHistory: [{ day: today, score, total }, ...state.quizHistory].slice(0, 10) };
}
