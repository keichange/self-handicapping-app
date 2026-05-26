import type { AppState, DailyPlan, FocusSession, HandicapLog, NightlyReview } from "./types";

export const STORAGE_KEY = "return-button:appState";

export const initialAppState: AppState = {
  dailyPlans: [],
  handicapLogs: [],
  focusSessions: [],
  nightlyReviews: [],
};

export function todayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function dateKeyFromIso(iso: string) {
  return todayKey(new Date(iso));
}

export function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialAppState;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      dailyPlans: Array.isArray(parsed.dailyPlans) ? parsed.dailyPlans : [],
      handicapLogs: Array.isArray(parsed.handicapLogs) ? parsed.handicapLogs : [],
      focusSessions: Array.isArray(parsed.focusSessions) ? parsed.focusSessions : [],
      nightlyReviews: Array.isArray(parsed.nightlyReviews) ? parsed.nightlyReviews : [],
    };
  } catch {
    return initialAppState;
  }
}

export function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function upsertDailyPlan(state: AppState, plan: DailyPlan) {
  const next = {
    ...state,
    dailyPlans: [plan, ...state.dailyPlans.filter((item) => item.date !== plan.date)],
  };
  saveState(next);
  return next;
}

export function addHandicapLog(state: AppState, log: HandicapLog) {
  const next = { ...state, handicapLogs: [log, ...state.handicapLogs] };
  saveState(next);
  return next;
}

export function addFocusSession(state: AppState, session: FocusSession) {
  const next = { ...state, focusSessions: [session, ...state.focusSessions] };
  saveState(next);
  return next;
}

export function upsertNightlyReview(state: AppState, review: NightlyReview) {
  const next = {
    ...state,
    nightlyReviews: [review, ...state.nightlyReviews.filter((item) => item.date !== review.date)],
  };
  saveState(next);
  return next;
}
