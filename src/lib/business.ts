import type {
  AppData,
  FinanceEntry,
  FinancialGoal,
  Investments,
  Project,
  ProjectStage,
  Savings,
} from './types';

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

/* ---------- finances personnelles ---------- */

export const PERSONAL_INCOME_CATEGORIES = ['Salaire', 'Ventes', 'Aide', 'Autres revenus'];

export const PERSONAL_EXPENSE_CATEGORIES = [
  'Nourriture',
  'Vêtements',
  'Sorties',
  'Abonnements',
  'Transport',
  'Matériel',
  'Autres dépenses',
];

export function previousMonth(month: string): string {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 2, 1));
  return d.toISOString().slice(0, 7);
}

export type CategoryTotal = { category: string; amount: number; count: number };

/** Expense totals for a month, biggest first. */
export function expensesByCategory(entries: FinanceEntry[], month: string): CategoryTotal[] {
  const map = new Map<string, CategoryTotal>();
  for (const e of entries) {
    if (e.kind !== 'depense' || monthKey(e.date) !== month) continue;
    const row = map.get(e.category) ?? { category: e.category, amount: 0, count: 0 };
    row.amount += e.amount;
    row.count += 1;
    map.set(e.category, row);
  }
  return [...map.values()].sort((a, b) => b.amount - a.amount);
}

export type Insight = { tone: 'good' | 'watch' | 'info'; text: string };

/**
 * Plain observations computed from the numbers the user typed in. No model, no
 * network, nothing leaves the device. Descriptive only — never advice.
 */
export function analyse(entries: FinanceEntry[], month: string, savings: Savings): Insight[] {
  const out: Insight[] = [];
  const now = totalsForMonth(entries, month);
  const prevKey = previousMonth(month);

  if (now.revenus === 0 && now.depenses === 0) {
    return [
      {
        tone: 'info',
        text: 'Rien d’enregistré ce mois-ci. Ajoute tes revenus et tes dépenses pour voir apparaître une analyse.',
      },
    ];
  }

  // Solde du mois
  if (now.benefice > 0) {
    const suggestion = Math.round(now.benefice * 0.2);
    out.push({
      tone: 'good',
      text: `Tu es à +${formatMoney(now.benefice)} ce mois. Mettre 20 % de côté représenterait ${formatMoney(suggestion)}.`,
    });
  } else if (now.benefice < 0) {
    out.push({
      tone: 'watch',
      text: `Tu as dépensé ${formatMoney(Math.abs(now.benefice))} de plus que ce que tu as gagné ce mois.`,
    });
  }

  const byCat = expensesByCategory(entries, month);
  const prevByCat = expensesByCategory(entries, prevKey);

  // Poste le plus lourd
  if (byCat.length > 0 && now.depenses > 0) {
    const top = byCat[0];
    const share = Math.round((top.amount / now.depenses) * 100);
    out.push({
      tone: 'info',
      text: `Ton plus gros poste : ${top.category}, ${formatMoney(top.amount)} — ${share} % de tes dépenses.`,
    });
  }

  // Hausses nettes d'un mois sur l'autre
  for (const cat of byCat.slice(0, 4)) {
    const before = prevByCat.find((c) => c.category === cat.category)?.amount ?? 0;
    if (before <= 0) continue;
    const delta = Math.round(((cat.amount - before) / before) * 100);
    if (delta >= 25) {
      out.push({
        tone: 'watch',
        text: `${cat.category} : ${formatMoney(cat.amount)}, soit ${delta} % de plus que le mois dernier.`,
      });
    } else if (delta <= -25) {
      out.push({
        tone: 'good',
        text: `${cat.category} : ${formatMoney(cat.amount)}, ${Math.abs(delta)} % de moins que le mois dernier.`,
      });
    }
  }

  // Dépenses fragmentées : beaucoup de petits achats
  const fragmented = byCat.find((c) => c.count >= 4);
  if (fragmented) {
    const avg = fragmented.amount / fragmented.count;
    out.push({
      tone: 'watch',
      text: `${fragmented.count} achats en ${fragmented.category} ce mois, ${formatMoney(fragmented.amount)} au total, soit ${formatMoney(Math.round(avg))} en moyenne. C’est ton poste le plus fragmenté.`,
    });
  }

  // Rappel de mise de côté
  if (savings.target > 0) {
    const missing = Math.max(0, savings.target - savedTotal(savings));
    if (savingsDueThisMonth(savings, `${month}-15`) && now.benefice > 0) {
      out.push({
        tone: 'info',
        text: `Rien mis de côté ce mois-ci. Il te reste ${formatMoney(missing)} pour atteindre ton objectif.`,
      });
    }
  }

  return out;
}

/* ---------- investissements ---------- */

export function investedTotal(investments: Investments): number {
  return investments.entries.reduce((a, e) => a + e.amount, 0);
}

/* ---------- objectifs financiers et XP ---------- */

/** Flat reward for a savings or investment contribution — never proportional
 * to the amount, so the system rewards the habit, not the wealth. */
const CONTRIBUTION_XP = 8;

/** Bonus for contributing in two consecutive months — rewards regularity. */
const REGULARITY_BONUS_XP = 15;

/** Suggested XP for a financial goal, scaled gently with its size and capped. */
export function suggestGoalXp(target: number): number {
  return Math.max(20, Math.min(600, Math.round(target / 10)));
}

function contributionMonths(savings: Savings, investments: Investments): Set<string> {
  const months = new Set<string>();
  for (const e of savings.entries) if (e.amount > 0) months.add(monthKey(e.date));
  for (const e of investments.entries) if (e.amount > 0) months.add(monthKey(e.date));
  return months;
}

function earliestContributionInMonth(
  savings: Savings,
  investments: Investments,
  month: string,
): string | null {
  const dates = [
    ...savings.entries.filter((e) => e.amount > 0 && monthKey(e.date) === month).map((e) => e.date),
    ...investments.entries
      .filter((e) => e.amount > 0 && monthKey(e.date) === month)
      .map((e) => e.date),
  ].sort();
  return dates[0] ?? null;
}

/**
 * Every date that can carry finance-driven XP: contributions and the day a
 * financial goal was first reached. Used to fold finance activity into the
 * global XP total and curve without requiring a checklist entry that day.
 */
export function financeActivityDates(data: AppData): string[] {
  const dates = new Set<string>();
  for (const e of data.savings.entries) if (e.amount > 0) dates.add(e.date);
  for (const e of data.investments.entries) if (e.amount > 0) dates.add(e.date);
  for (const g of data.financialGoals) if (g.achievedAt) dates.add(g.achievedAt);
  return [...dates];
}

/**
 * XP earned from finance activity on one date: a flat reward per contribution
 * (never per euro), a one-time goal-completion bonus, and a small regularity
 * bonus the first time a month follows a month that also had a contribution.
 */
export function financeXpOnDate(data: AppData, date: string): number {
  let xp = 0;
  for (const e of data.savings.entries) if (e.date === date && e.amount > 0) xp += CONTRIBUTION_XP;
  for (const e of data.investments.entries)
    if (e.date === date && e.amount > 0) xp += CONTRIBUTION_XP;
  for (const g of data.financialGoals) if (g.achievedAt === date) xp += g.xp;

  const months = contributionMonths(data.savings, data.investments);
  const thisMonth = monthKey(date);
  if (months.has(thisMonth) && months.has(previousMonth(thisMonth))) {
    if (earliestContributionInMonth(data.savings, data.investments, thisMonth) === date) {
      xp += REGULARITY_BONUS_XP;
    }
  }
  return xp;
}

/**
 * Marks any financial goal that has newly been reached (target <= current
 * savings) as achieved today. Idempotent: a goal already carrying achievedAt
 * is left untouched, so XP is granted exactly once.
 */
export function checkGoalAchievements(
  goals: FinancialGoal[],
  savingsTotal: number,
  today: string,
): FinancialGoal[] {
  return goals.map((g) =>
    !g.achievedAt && savingsTotal >= g.target ? { ...g, achievedAt: today } : g,
  );
}

/* ---------- simulateur d'investissement ---------- */

export type SimFrequency = 'mensuel' | 'annuel';

export type SimPoint = { year: number; value: number };

export type SimResult = {
  points: SimPoint[];
  versed: number;
  finalValue: number;
  gain: number;
};

/**
 * Hypothetical default annual return rates (%), for the user to adjust.
 * Editable placeholders, not fetched or certified data — see the disclaimer
 * shown next to the simulator.
 */
export const DEFAULT_SP500_RATE = 8;
export const DEFAULT_CAC40_RATE = 6;

/** Month-by-month compounding with periodic contributions. Illustrative only. */
export function simulate(
  initial: number,
  contribution: number,
  years: number,
  frequency: SimFrequency,
  annualRatePercent: number,
): SimResult {
  const months = Math.max(1, Math.round(years * 12));
  const monthlyRate = Math.pow(1 + annualRatePercent / 100, 1 / 12) - 1;

  let capital = Math.max(0, initial);
  let versed = Math.max(0, initial);
  const points: SimPoint[] = [{ year: 0, value: Math.round(capital) }];

  for (let m = 1; m <= months; m++) {
    capital *= 1 + monthlyRate;
    if (frequency === 'mensuel') {
      capital += contribution;
      versed += contribution;
    } else if (m % 12 === 0) {
      capital += contribution;
      versed += contribution;
    }
    if (m % 12 === 0) points.push({ year: m / 12, value: Math.round(capital) });
  }

  return {
    points,
    versed: Math.round(versed),
    finalValue: Math.round(capital),
    gain: Math.round(capital - versed),
  };
}
