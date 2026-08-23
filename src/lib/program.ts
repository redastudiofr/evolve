import type { AppData, DayPlan, Exercise, Objective, Reward, Settings } from './types';

/** Milestone rewards everyone starts with. The user can add their own. */
export const DEFAULT_REWARDS: Reward[] = [
  { id: 'r-5', level: 5, label: 'Premier pas', custom: false },
  { id: 'r-10', level: 10, label: 'Discipline', custom: false },
  { id: 'r-20', level: 20, label: 'Régularité', custom: false },
  { id: 'r-50', level: 50, label: 'Machine', custom: false },
  { id: 'r-100', level: 100, label: 'Elite', custom: false },
];

/** Walking is part of every session, and of the two rest days. */
const MARCHE: Exercise = {
  id: 'marche',
  name: 'Marche',
  sets: 1,
  repMin: 20,
  repMax: 40,
  restSec: 0,
  rpe: 4,
  unit: 'min',
  defaultWeight: 0,
  increment: 0,
  note: 'Après la séance ou dans la journée',
};

const MARCHE_LONGUE: Exercise = {
  ...MARCHE,
  repMin: 40,
  repMax: 60,
  note: 'Jour de repos — sortie plus longue',
};

/** Fixed weekly schedule, index 0 = dimanche. */
export const WEEK: DayPlan[] = [
  {
    id: 'dim',
    weekday: 0,
    label: 'Dimanche',
    title: 'Repos',
    focus: 'Récupération complète',
    rest: true,
    exercises: [MARCHE_LONGUE],
  },
  {
    id: 'lun',
    weekday: 1,
    label: 'Lundi',
    title: 'Jambes',
    focus: 'Quadriceps, ischios, mollets',
    rest: false,
    exercises: [
      { id: 'squat-barre', name: 'Squat barre', sets: 4, repMin: 6, repMax: 8, restSec: 180, rpe: 8, unit: 'kg', defaultWeight: 60, increment: 2.5 },
      { id: 'presse-cuisses', name: 'Presse à cuisses', sets: 4, repMin: 10, repMax: 12, restSec: 120, rpe: 8, unit: 'kg', defaultWeight: 110, increment: 5 },
      { id: 'leg-curl-allonge', name: 'Leg curl allongé', sets: 3, repMin: 10, repMax: 12, restSec: 90, rpe: 8, unit: 'kg', defaultWeight: 35, increment: 2.5 },
      { id: 'fentes-bulgares', name: 'Fentes bulgares haltères', sets: 3, repMin: 8, repMax: 10, restSec: 90, rpe: 8, unit: 'kg', defaultWeight: 16, increment: 2, note: 'Par jambe' },
      { id: 'mollets-debout', name: 'Mollets debout', sets: 4, repMin: 12, repMax: 15, restSec: 60, rpe: 9, unit: 'kg', defaultWeight: 60, increment: 5 },
      { id: 'gainage-lun', name: 'Gainage', sets: 3, repMin: 45, repMax: 60, restSec: 45, rpe: 8, unit: 'sec', defaultWeight: 0, increment: 0 },
      MARCHE,
    ],
  },
  {
    id: 'mar',
    weekday: 2,
    label: 'Mardi',
    title: 'Dos + Biceps',
    focus: 'Tirage vertical et horizontal',
    rest: false,
    exercises: [
      { id: 'tractions', name: 'Tractions', sets: 4, repMin: 6, repMax: 10, restSec: 150, rpe: 8, unit: 'bw', defaultWeight: 0, increment: 2.5, note: 'Lest additionnel' },
      { id: 'rowing-barre', name: 'Rowing barre', sets: 4, repMin: 8, repMax: 10, restSec: 120, rpe: 8, unit: 'kg', defaultWeight: 45, increment: 2.5 },
      { id: 'tirage-vertical-serre', name: 'Tirage vertical prise serrée', sets: 3, repMin: 10, repMax: 12, restSec: 90, rpe: 8, unit: 'kg', defaultWeight: 45, increment: 2.5 },
      { id: 'rowing-unilateral', name: 'Rowing unilatéral haltère', sets: 3, repMin: 10, repMax: 12, restSec: 90, rpe: 8, unit: 'kg', defaultWeight: 24, increment: 2, note: 'Par bras' },
      { id: 'curl-barre', name: 'Curl biceps barre', sets: 3, repMin: 8, repMax: 12, restSec: 75, rpe: 8, unit: 'kg', defaultWeight: 25, increment: 2.5 },
      { id: 'curl-marteau', name: 'Curl marteau', sets: 3, repMin: 10, repMax: 12, restSec: 60, rpe: 8, unit: 'kg', defaultWeight: 12, increment: 2 },
      MARCHE,
    ],
  },
  {
    id: 'mer',
    weekday: 3,
    label: 'Mercredi',
    title: 'Repos actif',
    focus: 'Marche et mobilité',
    rest: true,
    exercises: [MARCHE_LONGUE],
  },
  {
    id: 'jeu',
    weekday: 4,
    label: 'Jeudi',
    title: 'Pectoraux + Triceps',
    focus: 'Poussée horizontale et bras',
    rest: false,
    exercises: [
      { id: 'developpe-couche', name: 'Développé couché barre', sets: 4, repMin: 6, repMax: 8, restSec: 180, rpe: 8, unit: 'kg', defaultWeight: 50, increment: 2.5 },
      { id: 'developpe-incline-halteres', name: 'Développé incliné haltères', sets: 4, repMin: 8, repMax: 10, restSec: 120, rpe: 8, unit: 'kg', defaultWeight: 20, increment: 2 },
      { id: 'dips', name: 'Dips', sets: 3, repMin: 8, repMax: 12, restSec: 120, rpe: 8, unit: 'bw', defaultWeight: 0, increment: 2.5, note: 'Lest additionnel' },
      { id: 'ecarte-poulie', name: 'Écarté poulie', sets: 3, repMin: 12, repMax: 15, restSec: 75, rpe: 8, unit: 'kg', defaultWeight: 12, increment: 2.5 },
      { id: 'extensions-triceps-poulie', name: 'Extensions triceps poulie', sets: 3, repMin: 12, repMax: 15, restSec: 60, rpe: 8, unit: 'kg', defaultWeight: 25, increment: 2.5 },
      { id: 'barre-au-front', name: 'Barre au front', sets: 3, repMin: 10, repMax: 12, restSec: 90, rpe: 8, unit: 'kg', defaultWeight: 20, increment: 2.5 },
      MARCHE,
    ],
  },
  {
    id: 'ven',
    weekday: 5,
    label: 'Vendredi',
    title: 'Épaules + Abdos',
    focus: 'Deltoïdes, ceinture abdominale, cou',
    rest: false,
    exercises: [
      { id: 'developpe-militaire-halteres', name: 'Développé militaire haltères', sets: 4, repMin: 8, repMax: 10, restSec: 120, rpe: 8, unit: 'kg', defaultWeight: 16, increment: 2 },
      { id: 'elevations-laterales', name: 'Élévations latérales', sets: 4, repMin: 12, repMax: 15, restSec: 60, rpe: 9, unit: 'kg', defaultWeight: 8, increment: 1 },
      { id: 'oiseau', name: 'Oiseau', sets: 3, repMin: 12, repMax: 15, restSec: 60, rpe: 9, unit: 'kg', defaultWeight: 8, increment: 1 },
      { id: 'elevations-frontales', name: 'Élévations frontales', sets: 3, repMin: 12, repMax: 15, restSec: 60, rpe: 8, unit: 'kg', defaultWeight: 8, increment: 1 },
      { id: 'gainage-complet', name: 'Gainage complet', sets: 3, repMin: 45, repMax: 60, restSec: 45, rpe: 8, unit: 'sec', defaultWeight: 0, increment: 0, note: 'Planche, latéral, hollow' },
      { id: 'cou-isometrique', name: 'Travail cou isométrique', sets: 3, repMin: 20, repMax: 30, restSec: 45, rpe: 6, unit: 'sec', defaultWeight: 0, increment: 0, note: 'Résistance légère, 4 directions' },
      MARCHE,
    ],
  },
  {
    id: 'sam',
    weekday: 6,
    label: 'Samedi',
    title: 'Jambes',
    focus: 'Chaîne postérieure',
    rest: false,
    exercises: [
      { id: 'souleve-terre-roumain', name: 'Soulevé de terre roumain', sets: 4, repMin: 8, repMax: 10, restSec: 150, rpe: 8, unit: 'kg', defaultWeight: 60, increment: 2.5 },
      { id: 'squat-gobelet', name: 'Squat gobelet', sets: 3, repMin: 10, repMax: 12, restSec: 90, rpe: 8, unit: 'kg', defaultWeight: 24, increment: 2 },
      { id: 'presse-pieds-hauts', name: 'Presse à cuisses pieds hauts', sets: 3, repMin: 12, repMax: 15, restSec: 120, rpe: 8, unit: 'kg', defaultWeight: 90, increment: 5 },
      { id: 'hip-thrust', name: 'Hip thrust', sets: 4, repMin: 10, repMax: 12, restSec: 120, rpe: 8, unit: 'kg', defaultWeight: 60, increment: 5 },
      { id: 'mollets-assis', name: 'Mollets assis', sets: 4, repMin: 15, repMax: 20, restSec: 60, rpe: 9, unit: 'kg', defaultWeight: 40, increment: 2.5 },
      MARCHE,
    ],
  },
];

/** Training days only, in week order starting Monday. */
export const TRAINING_DAYS = WEEK.filter((d) => !d.rest);

/** Every distinct exercise, with the day it belongs to. Walking appears once. */
export const ALL_EXERCISES = (() => {
  const seen = new Map<string, Exercise & { dayId: string; dayTitle: string }>();
  for (const day of [...WEEK.slice(1), WEEK[0]]) {
    for (const ex of day.exercises) {
      if (!seen.has(ex.id)) seen.set(ex.id, { ...ex, dayId: day.id, dayTitle: day.title });
    }
  }
  return [...seen.values()];
})();

export function findExercise(id: string) {
  return ALL_EXERCISES.find((e) => e.id === id);
}

export function findDay(id: string) {
  return WEEK.find((d) => d.id === id);
}

export function dayForWeekday(weekday: number): DayPlan {
  return WEEK[weekday] ?? WEEK[0];
}

export const DEFAULT_SETTINGS: Settings = {
  profile: {
    name: 'Reda',
    age: 17,
    heightCm: 185,
    weightKg: 71,
    goal: 'Physique musclé, sec et proportionné — progression saine sur le long terme',
  },
  timezone: 'Europe/Paris',
  notifications: {
    creatine: { enabled: true, time: '09:00' },
    hydration: { enabled: true, start: '08:00', end: '22:00', everyHours: 2 },
    meals: { enabled: true, times: ['08:00', '12:30', '19:30'] },
    sleep: { enabled: true, time: '22:30' },
    workout: { enabled: true, time: '17:30', days: [1, 2, 4, 5, 6] },
    objectives: { enabled: true, time: '18:00' },
    review: { enabled: true, time: '21:30' },
  },
};

export function defaultLoads(): Record<string, number> {
  const loads: Record<string, number> = {};
  for (const e of ALL_EXERCISES) loads[e.id] = e.defaultWeight;
  return loads;
}

export function defaultData(): AppData {
  return {
    version: 3,
    updatedAt: Date.now(),
    settings: DEFAULT_SETTINGS,
    loads: defaultLoads(),
    daily: {},
    workouts: [],
    measurements: [],
    objectives: [],
    rewards: DEFAULT_REWARDS,
  };
}

/** Objectives used to be simple "goals". Carry them over rather than lose them. */
type LegacyGoal = { id?: string; title?: string; createdAt?: string; done?: boolean };

function migrateGoals(raw: unknown): Objective[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((g): g is LegacyGoal => Boolean(g) && typeof g === 'object')
    .filter((g) => typeof g.title === 'string' && g.title.length > 0)
    .map((g) => ({
      id: g.id ?? Math.random().toString(36).slice(2, 10),
      title: g.title as string,
      category: 'personnel' as const,
      difficulty: 'moyen' as const,
      xp: 25,
      recurrence: 'once' as const,
      date: g.createdAt,
      createdAt: g.createdAt ?? new Date().toISOString().slice(0, 10),
      archived: g.done === true,
    }));
}

/** Merge stored data with defaults so a new field never breaks an old payload. */
export function normalizeData(raw: unknown): AppData {
  const base = defaultData();
  if (!raw || typeof raw !== 'object') return base;
  const d = raw as Partial<AppData>;
  const s = (d.settings ?? {}) as Partial<Settings>;
  const n = (s.notifications ?? {}) as Partial<Settings['notifications']>;
  const legacy = (raw as { goals?: unknown }).goals;
  const objectives = Array.isArray(d.objectives) ? d.objectives : migrateGoals(legacy);
  const rewards = Array.isArray(d.rewards) && d.rewards.length > 0 ? d.rewards : DEFAULT_REWARDS;

  return {
    version: 3,
    updatedAt: typeof d.updatedAt === 'number' ? d.updatedAt : Date.now(),
    settings: {
      profile: { ...base.settings.profile, ...(s.profile ?? {}) },
      timezone: s.timezone || base.settings.timezone,
      notifications: {
        creatine: { ...base.settings.notifications.creatine, ...(n.creatine ?? {}) },
        hydration: { ...base.settings.notifications.hydration, ...(n.hydration ?? {}) },
        meals: { ...base.settings.notifications.meals, ...(n.meals ?? {}) },
        sleep: { ...base.settings.notifications.sleep, ...(n.sleep ?? {}) },
        workout: { ...base.settings.notifications.workout, ...(n.workout ?? {}) },
        objectives: { ...base.settings.notifications.objectives, ...(n.objectives ?? {}) },
        review: { ...base.settings.notifications.review, ...(n.review ?? {}) },
      },
    },
    loads: { ...base.loads, ...(d.loads ?? {}) },
    daily: d.daily ?? {},
    workouts: Array.isArray(d.workouts) ? d.workouts : [],
    measurements: Array.isArray(d.measurements) ? d.measurements : [],
    objectives,
    rewards,
  };
}
