export type Unit = 'kg' | 'bw' | 'sec' | 'min';

export type MuscleGroup =
  | 'jambes'
  | 'dos'
  | 'pectoraux'
  | 'epaules'
  | 'bras'
  | 'abdos'
  | 'cardio'
  | 'autre';

export type Equipment = 'barre' | 'halteres' | 'poulie' | 'machine' | 'poids-du-corps' | 'aucun';

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
  group?: MuscleGroup;
  equipment?: Equipment;
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

/* ---------- objectifs ---------- */

export type Category =
  | 'sport'
  | 'entrepreneuriat'
  | 'travail'
  | 'etudes'
  | 'discipline'
  | 'habitudes'
  | 'personnel'
  | 'autre';

export type Difficulty = 'facile' | 'moyen' | 'difficile';

/** How often an objective comes back on the day list. */
export type Recurrence = 'once' | 'daily' | 'weekdays';

export type Objective = {
  id: string;
  title: string;
  category: Category;
  difficulty: Difficulty;
  xp: number;
  time?: string; // HH:MM
  recurrence: Recurrence;
  days?: number[]; // recurrence === 'weekdays'
  date?: string; // recurrence === 'once'
  createdAt: string;
  archived?: boolean;
};

/** A day: checklist ticks, objectives completed, and whether it was closed. */
export type DailyEntry = {
  tasks: Record<string, boolean>;
  objectives?: string[];
  note?: string;
  closed?: boolean;
};

export type Measurement = {
  id: string;
  date: string;
  weightKg?: number;
  armCm?: number;
  chestCm?: number;
  waistCm?: number;
  thighCm?: number;
};

export type Reward = {
  id: string;
  level: number;
  label: string;
  custom: boolean;
};

export type Profile = {
  name: string;
  pseudo: string;
  email: string;
  /** Small square data URL, resized before storage. */
  avatar: string;
  age: number;
  heightCm: number;
  weightKg: number;
  goal: string;
};

/* ---------- entrepreneuriat ---------- */

export type ProjectStage = 'idee' | 'construction' | 'lancement' | 'croissance' | 'expansion';

export type SubGoal = { id: string; label: string; done: boolean };

export type FinanceEntry = {
  id: string;
  date: string;
  kind: 'revenu' | 'depense';
  category: string;
  label?: string;
  amount: number;
};

export type Project = {
  id: string;
  name: string;
  type: string;
  description?: string;
  mainGoal?: string;
  subGoals: SubGoal[];
  createdAt: string;
  deadline?: string;
  stage: ProjectStage;
  archived?: boolean;
  entries: FinanceEntry[];
};

export type SavingsEntry = { id: string; date: string; amount: number };

export type Savings = {
  target: number;
  entries: SavingsEntry[];
};

export type NotificationSettings = {
  creatine: { enabled: boolean; time: string };
  hydration: { enabled: boolean; start: string; end: string; everyHours: number };
  meals: { enabled: boolean; times: string[] };
  sleep: { enabled: boolean; time: string };
  workout: { enabled: boolean; time: string; days: number[] };
  objectives: { enabled: boolean; time: string };
  review: { enabled: boolean; time: string };
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
  objectives: Objective[];
  rewards: Reward[];
  /** dayId -> ordered exercise ids. Absent = the default day is used. */
  plan: Record<string, string[]>;
  /** Exercises the user created, merged into the catalogue. */
  customExercises: Exercise[];
  projects: Project[];
  /** Personal ledger, outside any project. */
  finances: FinanceEntry[];
  savings: Savings;
};

export type PushSub = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};
