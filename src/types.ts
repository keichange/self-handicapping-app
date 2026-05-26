export type TriggerType =
  | "smartphone"
  | "youtube"
  | "sns"
  | "game"
  | "sleep_delay"
  | "cleaning"
  | "research"
  | "other_task"
  | "food"
  | "other";

export type ExcuseType =
  | "tired"
  | "sleepy"
  | "no_time"
  | "not_ready"
  | "better_method"
  | "fear_failure"
  | "low_motivation"
  | "unclear"
  | "other";

export type FocusSessionResult = "completed" | "escaped" | "not_started";

export type GaveExcuseLevel = "none" | "little" | "yes";

export type DailyPlan = {
  id: string;
  date: string;
  mainTask: string;
  firstAction: string;
  avoidExcuse: string;
  status: "active" | "completed" | "skipped";
  createdAt: string;
  updatedAt: string;
};

export type HandicapLog = {
  id: string;
  dailyPlanId: string;
  triggerType: TriggerType;
  excuseType: ExcuseType;
  note?: string;
  returnedToTask: boolean | null;
  createdAt: string;
};

export type FocusSession = {
  id: string;
  dailyPlanId: string;
  startedAt: string;
  endedAt?: string;
  durationMinutes: number;
  result: FocusSessionResult;
  memo?: string;
  createdAt: string;
};

export type NightlyReview = {
  id: string;
  date: string;
  gaveExcuseLevel: GaveExcuseLevel;
  mainExcuseSource?: string;
  memo?: string;
  tomorrowTask?: string;
  tomorrowFirstAction?: string;
  tomorrowAvoidExcuse?: string;
  createdAt: string;
};

export type AppState = {
  dailyPlans: DailyPlan[];
  handicapLogs: HandicapLog[];
  focusSessions: FocusSession[];
  nightlyReviews: NightlyReview[];
};
