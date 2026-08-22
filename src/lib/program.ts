import type { WorkoutTemplate, AppData, Settings } from './types';

export const PROGRAM: WorkoutTemplate[] = [
  {
    id: 's1',
    name: 'Jambes',
    focus: 'Quadriceps, ischios, mollets',
    exercises: [
      { id: 'squat-barre', name: 'Squat barre', sets: 4, repMin: 6, repMax: 8, restSec: 180, rpe: 8, unit: 'kg', defaultWeight: 60, increment: 2.5 },
      { id: 'presse-cuisses', name: 'Presse à cuisses', sets: 4, repMin: 10, repMax: 12, restSec: 120, rpe: 8, unit: 'kg', defaultWeight: 110, increment: 5 },
      { id: 'leg-curl-allonge', name: 'Leg curl allongé', sets: 3, repMin: 10, repMax: 12, restSec: 90, rpe: 8, unit: 'kg', defaultWeight: 35, increment: 2.5 },
      { id: 'fentes-bulgares', name: 'Fentes bulgares haltères', sets: 3, repMin: 8, repMax: 10, restSec: 90, rpe: 8, unit: 'kg', defaultWeight: 16, increment: 2, note: 'Par jambe' },
      { id: 'mollets-debout', name: 'Mollets debout', sets: 4, repMin: 12, repMax: 15, restSec: 60, rpe: 9, unit: 'kg', defaultWeight: 60, increment: 5 },
      { id: 'gainage-s1', name: 'Gainage', sets: 3, repMin: 45, repMax: 60, restSec: 45, rpe: 8, unit: 'sec', defaultWeight: 0, increment: 0 },
    ],
  },
  {
    id: 's2',
    name: 'Pectoraux + Triceps',
    focus: 'Poussée horizontale et bras',
    exercises: [
      { id: 'developpe-couche', name: 'Développé couché barre', sets: 4, repMin: 6, repMax: 8, restSec: 180, rpe: 8, unit: 'kg', defaultWeight: 50, increment: 2.5 },
      { id: 'developpe-incline-halteres', name: 'Développé incliné haltères', sets: 4, repMin: 8, repMax: 10, restSec: 120, rpe: 8, unit: 'kg', defaultWeight: 20, increment: 2 },
      { id: 'dips', name: 'Dips', sets: 3, repMin: 8, repMax: 12, restSec: 120, rpe: 8, unit: 'bw', defaultWeight: 0, increment: 2.5, note: 'Lest additionnel' },
      { id: 'ecarte-poulie', name: 'Écarté poulie', sets: 3, repMin: 12, repMax: 15, restSec: 75, rpe: 8, unit: 'kg', defaultWeight: 12, increment: 2.5 },
      { id: 'extensions-triceps-poulie', name: 'Extensions triceps poulie', sets: 3, repMin: 12, repMax: 15, restSec: 60, rpe: 8, unit: 'kg', defaultWeight: 25, increment: 2.5 },
      { id: 'barre-au-front', name: 'Extensions triceps barre au front', sets: 3, repMin: 10, repMax: 12, restSec: 90, rpe: 8, unit: 'kg', defaultWeight: 20, increment: 2.5 },
    ],
  },
  {
    id: 's3',
    name: 'Dos + Biceps',
    focus: 'Tirage vertical et horizontal',
    exercises: [
      { id: 'tractions', name: 'Tractions', sets: 4, repMin: 6, repMax: 10, restSec: 150, rpe: 8, unit: 'bw', defaultWeight: 0, increment: 2.5, note: 'Lest additionnel' },
      { id: 'rowing-barre', name: 'Rowing barre', sets: 4, repMin: 8, repMax: 10, restSec: 120, rpe: 8, unit: 'kg', defaultWeight: 45, increment: 2.5 },
      { id: 'tirage-vertical-serre', name: 'Tirage vertical prise serrée', sets: 3, repMin: 10, repMax: 12, restSec: 90, rpe: 8, unit: 'kg', defaultWeight: 45, increment: 2.5 },
      { id: 'rowing-unilateral', name: 'Rowing unilatéral haltère', sets: 3, repMin: 10, repMax: 12, restSec: 90, rpe: 8, unit: 'kg', defaultWeight: 24, increment: 2, note: 'Par bras' },
      { id: 'curl-barre', name: 'Curl biceps barre', sets: 3, repMin: 8, repMax: 12, restSec: 75, rpe: 8, unit: 'kg', defaultWeight: 25, increment: 2.5 },
      { id: 'curl-marteau', name: 'Curl marteau', sets: 3, repMin: 10, repMax: 12, restSec: 60, rpe: 8, unit: 'kg', defaultWeight: 12, increment: 2 },
    ],
  },
  {
    id: 's4',
    name: 'Épaules + Abdos + Cou',
    focus: 'Deltoïdes, ceinture abdominale, cou',
    exercises: [
      { id: 'developpe-militaire-halteres', name: 'Développé militaire haltères', sets: 4, repMin: 8, repMax: 10, restSec: 120, rpe: 8, unit: 'kg', defaultWeight: 16, increment: 2 },
      { id: 'elevations-laterales', name: 'Élévations latérales', sets: 4, repMin: 12, repMax: 15, restSec: 60, rpe: 9, unit: 'kg', defaultWeight: 8, increment: 1 },
      { id: 'oiseau', name: 'Oiseau', sets: 3, repMin: 12, repMax: 15, restSec: 60, rpe: 9, unit: 'kg', defaultWeight: 8, increment: 1 },
      { id: 'elevations-frontales', name: 'Élévations frontales', sets: 3, repMin: 12, repMax: 15, restSec: 60, rpe: 8, unit: 'kg', defaultWeight: 8, increment: 1 },
      { id: 'gainage-complet', name: 'Gainage complet', sets: 3, repMin: 45, repMax: 60, restSec: 45, rpe: 8, unit: 'sec', defaultWeight: 0, increment: 0, note: 'Planche, latéral, hollow' },
      { id: 'cou-isometrique', name: 'Travail cou isométrique', sets: 3, repMin: 20, repMax: 30, restSec: 45, rpe: 6, unit: 'sec', defaultWeight: 0, increment: 0, note: 'Résistance légère, 4 directions' },
    ],
  },
  {
    id: 's5',
    name: 'Jambes variante',
    focus: 'Chaîne postérieure',
    exercises: [
      { id: 'souleve-terre-roumain', name: 'Soulevé de terre roumain', sets: 4, repMin: 8, repMax: 10, restSec: 150, rpe: 8, unit: 'kg', defaultWeight: 60, increment: 2.5 },
      { id: 'squat-gobelet', name: 'Squat gobelet', sets: 3, repMin: 10, repMax: 12, restSec: 90, rpe: 8, unit: 'kg', defaultWeight: 24, increment: 2 },
      { id: 'presse-pieds-hauts', name: 'Presse à cuisses pieds hauts', sets: 3, repMin: 12, repMax: 15, restSec: 120, rpe: 8, unit: 'kg', defaultWeight: 90, increment: 5 },
      { id: 'hip-thrust', name: 'Hip thrust', sets: 4, repMin: 10, repMax: 12, restSec: 120, rpe: 8, unit: 'kg', defaultWeight: 60, increment: 5 },
      { id: 'mollets-assis', name: 'Mollets assis', sets: 4, repMin: 15, repMax: 20, restSec: 60, rpe: 9, unit: 'kg', defaultWeight: 40, increment: 2.5 },
    ],
  },
];

export const ALL_EXERCISES = PROGRAM.flatMap((s) =>
  s.exercises.map((e) => ({ ...e, sessionId: s.id, sessionName: s.name })),
);

export function findExercise(id: string) {
  return ALL_EXERCISES.find((e) => e.id === id);
}

export function findSession(id: string) {
  return PROGRAM.find((s) => s.id === id);
}

export const DEFAULT_SETTINGS: Settings = {
  profile: {
    name: 'Athlète',
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
  },
};

export function defaultLoads(): Record<string, number> {
  const loads: Record<string, number> = {};
  for (const e of ALL_EXERCISES) loads[e.id] = e.defaultWeight;
  return loads;
}

export function defaultData(): AppData {
  return {
    version: 1,
    updatedAt: Date.now(),
    settings: DEFAULT_SETTINGS,
    loads: defaultLoads(),
    daily: {},
    workouts: [],
    measurements: [],
  };
}

/** Merge stored data with defaults so a new field never breaks an old payload. */
export function normalizeData(raw: unknown): AppData {
  const base = defaultData();
  if (!raw || typeof raw !== 'object') return base;
  const d = raw as Partial<AppData>;
  const s = (d.settings ?? {}) as Partial<Settings>;
  const n = (s.notifications ?? {}) as Partial<Settings['notifications']>;
  return {
    version: 1,
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
      },
    },
    loads: { ...base.loads, ...(d.loads ?? {}) },
    daily: d.daily ?? {},
    workouts: Array.isArray(d.workouts) ? d.workouts : [],
    measurements: Array.isArray(d.measurements) ? d.measurements : [],
  };
}
