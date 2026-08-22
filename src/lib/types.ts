export type Unit = 'kg' | 'bw' | 'sec' | 'min';

export type Exercise = {
  id: string;
  name: string;
  sets: number;
  repMin: number;
  repMax: number;
  restSec: number;
  rpe: number;
  unit: Unit;
  defaultWeight: number;
  increment: number;
  note?: string;
};

/** One day of the fixed weekly schedule. */
export type DayPlan = {
  id: string;
  weekday: number; // 0 = dimanche … 6 = samedi
  label: string;
  title: string;
  focus: string;
  rest: boolean;
  exercises: Exercise[];
};

export type SetEntry = { weight: number; reps: number };
export type LoggedExercise = { exerciseId: string; sets: SetEntry[] };
export type LoggedWorkout = {
  id: string;
  date: string;
  sessionId: string;
  exercises: LoggedExercise[];
};

export type DailyEntry = { tasks: Record<string, boolean>; note?: string };

export type Measurement = {
  id: string;
  date: string;
  weightKg?: number;
  armCm?: number;
  chestCm?: number;
  waistCm?: number;
  thighCm?: number;
};

export type Goal = {
  id: string;
  title: string;
  detail?: string;
  target?: number;
  current?: number;
  unit?: string;
  done: boolean;
  createdAt: string;
};

export type Profile = {
  name: string;
  age: number;
  heightCm: number;
  weightKg: number;
  goal: string;
};

export type NotificationSettings = {
  creatine: { enabled: boolean; time: string };
  hydration: { enabled: boolean; start: string; end: string; everyHours: number };
  meals: { enabled: boolean; times: string[] };
  sleep: { enabled: boolean; time: string };
  workout: { enabled: boolean; time: string; days: number[] };
};

export type Settings = {
  profile: Profile;
  timezone: string;
  notifications: NotificationSettings;
};

export type AppData = {
  version: number;
  updatedAt: number;
  settings: Settings;
  loads: Record<string, number>;
  daily: Record<string, DailyEntry>;
  workouts: LoggedWorkout[];
  measurements: Measurement[];
  goals: Goal[];
};

export type PushSub = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};
