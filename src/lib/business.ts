import type { FinanceEntry, Project, ProjectStage, Savings } from './types';

/* ---------- étapes du projet ---------- */

export const STAGES: { id: ProjectStage; level: number; label: string; hint: string }[] = [
  { id: 'idee', level: 1, label: 'Idée', hint: 'Projet créé' },
  { id: 'construction', level: 2, label: 'Construction', hint: 'Première version' },
  { id: 'lancement', level: 3, label: 'Lancement', hint: 'Premier client' },
  { id: 'croissance', level: 4, label: 'Croissance', hint: 'Revenus réguliers' },
  { id: 'expansion', level: 5, label: 'Expansion', hint: 'Objectifs financiers atteints' },
];

export function stageOf(id: ProjectStage) {
  return STAGES.find((s) => s.id === id) ?? STAGES[0];
}

export const PROJECT_TYPES = [
  'E-commerce',
  'Marque de vêtements',
  'SaaS',
  'Application',
  'Agence',
  'Projet personnel',
  'Startup',
  'Autre',
];

/**
 * Overall progress: the sub-goals if there are any, otherwise the stage alone.
 * Stage always contributes so a project without sub-goals still advances.
 */
export function projectProgress(project: Project): number {
  const stage = stageOf(project.stage).level / STAGES.length;
  if (project.subGoals.length === 0) return stage;
  const done = project.subGoals.filter((g) => g.done).length / project.subGoals.length;
  return Math.min(1, stage * 0.5 + done * 0.5);
}

/* ---------- finances ---------- */

export const REVENUE_CATEGORIES = ['Ventes', 'Prestations', 'Autres revenus'];
export const EXPENSE_CATEGORIES = [
  'Publicité',
  'Fournisseurs',
  'Logiciels',
  'Abonnements',
  'Matériel',
  'Autres dépenses',
];

export type Totals = { revenus: number; depenses: number; benefice: number };

export function totals(entries: FinanceEntry[]): Totals {
  let revenus = 0;
  let depenses = 0;
  for (const e of entries) {
    if (e.kind === 'revenu') revenus += e.amount;
    else depenses += e.amount;
  }
  return { revenus, depenses, benefice: revenus - depenses };
}

export function monthKey(date: string): string {
  return date.slice(0, 7);
}

export function totalsForMonth(entries: FinanceEntry[], month: string): Totals {
  return totals(entries.filter((e) => monthKey(e.date) === month));
}

/** Monthly profit series, oldest first. */
export function monthlySeries(entries: FinanceEntry[]): { month: string; benefice: number }[] {
  const months = [...new Set(entries.map((e) => monthKey(e.date)))].sort();
  return months.map((month) => ({ month, benefice: totalsForMonth(entries, month).benefice }));
}

/**
 * Rough projection: the average monthly profit over the last three recorded
 * months. Descriptive only — it is not advice.
 */
export function projection(entries: FinanceEntry[]): number | null {
  const series = monthlySeries(entries);
  if (series.length === 0) return null;
  const last = series.slice(-3);
  const sum = last.reduce((a, m) => a + m.benefice, 0);
  return Math.round(sum / last.length);
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatMonth(month: string): string {
  const [y, m] = month.split('-').map(Number);
  return new Intl.DateTimeFormat('fr-FR', { month: 'short', year: '2-digit' }).format(
    new Date(Date.UTC(y, m - 1, 1)),
  );
}

/* ---------- épargne ---------- */

export function savedTotal(savings: Savings): number {
  return savings.entries.reduce((a, e) => a + e.amount, 0);
}

export function savingsProgress(savings: Savings): number {
  if (savings.target <= 0) return 0;
  return Math.min(1, savedTotal(savings) / savings.target);
}

/** True when nothing was put aside during the current month. */
export function savingsDueThisMonth(savings: Savings, today: string): boolean {
  if (savings.target <= 0) return false;
  const month = monthKey(today);
  return !savings.entries.some((e) => monthKey(e.date) === month);
}
