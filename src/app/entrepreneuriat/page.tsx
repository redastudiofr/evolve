'use client';

import { useMemo, useState } from 'react';
import { useData } from '@/components/DataProvider';
import QuickAmount from '@/components/QuickAmount';
import DualCurve from '@/components/DualCurve';
import { formatDate, todayKey, uid } from '@/lib/logic';
import {
  EXPENSE_CATEGORIES,
  PERSONAL_EXPENSE_CATEGORIES,
  PERSONAL_INCOME_CATEGORIES,
  analyse,
  PROJECT_TYPES,
  REVENUE_CATEGORIES,
  STAGES,
  DEFAULT_CAC40_RATE,
  DEFAULT_SP500_RATE,
  checkGoalAchievements,
  formatMoney,
  formatMonth,
  investedTotal,
  monthKey,
  monthlySeries,
  projectProgress,
  projection,
  savedTotal,
  savingsDueThisMonth,
  savingsProgress,
  simulate,
  stageOf,
  suggestGoalXp,
  totals,
  totalsForMonth,
  type SimFrequency,
} from '@/lib/business';
import type { FinanceEntry, FinancialGoal, Project, ProjectStage } from '@/lib/types';

export default function BusinessPage() {
  const { data, update } = useData();
  const tz = data.settings.timezone;
  const today = todayKey(tz);
  const month = monthKey(today);

  const [openId, setOpenId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState(PROJECT_TYPES[0]);
  const [mainGoal, setMainGoal] = useState('');

  const [entryKind, setEntryKind] = useState<'revenu' | 'depense'>('revenu');
  const [entryCat, setEntryCat] = useState(REVENUE_CATEGORIES[0]);
  const [entryAmount, setEntryAmount] = useState('');
  const [subGoal, setSubGoal] = useState('');

  const [savingTarget, setSavingTarget] = useState('');

  const [pKind, setPKind] = useState<'revenu' | 'depense'>('depense');
  const [pCat, setPCat] = useState(PERSONAL_EXPENSE_CATEGORIES[0]);
  const [pAmount, setPAmount] = useState('');
  const [pLabel, setPLabel] = useState('');

  // Which quick-tap sheet is open, if any.
  const [quick, setQuick] = useState<'gagne' | 'depense' | 'epargne' | 'investissement' | null>(
    null,
  );

  const [goalLabel, setGoalLabel] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalXp, setGoalXp] = useState('');

  const [simInitial, setSimInitial] = useState('1000');
  const [simMonthly, setSimMonthly] = useState('200');
  const [simYears, setSimYears] = useState('10');
  const [simFreq, setSimFreq] = useState<SimFrequency>('mensuel');
  const [spRate, setSpRate] = useState(String(DEFAULT_SP500_RATE));
  const [cacRate, setCacRate] = useState(String(DEFAULT_CAC40_RATE));

  const personalMonth = totalsForMonth(data.finances, month);
  const monthEntries = useMemo(
    () =>
      data.finances
        .filter((e) => monthKey(e.date) === month)
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
    [data.finances, month],
  );
  const insights = useMemo(
    () => analyse(data.finances, month, data.savings),
    [data.finances, month, data.savings],
  );

  function addPersonal() {
    const amount = Number(pAmount.replace(',', '.'));
    if (!Number.isFinite(amount) || amount <= 0) return;
    const entry: FinanceEntry = {
      id: uid(),
      date: today,
      kind: pKind,
      category: pCat,
      label: pLabel.trim() || undefined,
      amount: Math.round(amount * 100) / 100,
    };
    update((d) => ({ ...d, finances: [entry, ...d.finances] }));
    setPAmount('');
    setPLabel('');
  }

  function removePersonal(id: string) {
    update((d) => ({ ...d, finances: d.finances.filter((e) => e.id !== id) }));
  }

  /** One tap on "Gagné" / "Dépensé" — no category, no friction. */
  function quickAddPersonal(kind: 'revenu' | 'depense', amount: number) {
    const entry: FinanceEntry = {
      id: uid(),
      date: today,
      kind,
      category: kind === 'revenu' ? 'Autres revenus' : 'Autres dépenses',
      amount,
    };
    update((d) => ({ ...d, finances: [entry, ...d.finances] }));
    setQuick(null);
  }

  const projects = data.projects.filter((p) => !p.archived);

  const allEntries = useMemo(() => projects.flatMap((p) => p.entries), [projects]);
  const global = totals(allEntries);
  const globalMonth = totalsForMonth(allEntries, month);

  const saved = savedTotal(data.savings);
  const invested = investedTotal(data.investments);
  const cash = totals(data.finances).benefice;
  const patrimoine = cash + saved + invested;

  const savingsRatio = savingsProgress(data.savings);
  const savingsDue = savingsDueThisMonth(data.savings, today);
  const savingsHistory = useMemo(
    () => [...data.savings.entries].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 5),
    [data.savings.entries],
  );
  const investmentsHistory = useMemo(
    () => [...data.investments.entries].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 5),
    [data.investments.entries],
  );

  function createProject() {
    if (name.trim() === '') return;
    const project: Project = {
      id: uid(),
      name: name.trim(),
      type,
      mainGoal: mainGoal.trim() || undefined,
      subGoals: [],
      createdAt: today,
      stage: 'idee',
      entries: [],
    };
    update((d) => ({ ...d, projects: [project, ...d.projects] }));
    setName('');
    setMainGoal('');
    setCreating(false);
    setOpenId(project.id);
  }

  function patch(id: string, fn: (p: Project) => Project) {
    update((d) => ({ ...d, projects: d.projects.map((p) => (p.id === id ? fn(p) : p)) }));
  }

  function setStage(id: string, stage: ProjectStage) {
    patch(id, (p) => ({ ...p, stage }));
  }

  function addSubGoal(id: string) {
    if (subGoal.trim() === '') return;
    patch(id, (p) => ({
      ...p,
      subGoals: [...p.subGoals, { id: uid(), label: subGoal.trim(), done: false }],
    }));
    setSubGoal('');
  }

  function addEntry(id: string) {
    const amount = Number(entryAmount.replace(',', '.'));
    if (!Number.isFinite(amount) || amount <= 0) return;
    const entry: FinanceEntry = {
      id: uid(),
      date: today,
      kind: entryKind,
      category: entryCat,
      amount: Math.round(amount * 100) / 100,
    };
    patch(id, (p) => ({ ...p, entries: [entry, ...p.entries] }));
    setEntryAmount('');
  }

  /** Adds (or, if negative, withdraws) money to savings and checks goals. */
  function addToSavings(amount: number) {
    update((d) => {
      const entries = [{ id: uid(), date: today, amount }, ...d.savings.entries];
      const newTotal = entries.reduce((a, e) => a + e.amount, 0);
      return {
        ...d,
        savings: { ...d.savings, entries },
        financialGoals: checkGoalAchievements(d.financialGoals, newTotal, today),
      };
    });
    setQuick(null);
  }

  function addToInvestments(amount: number) {
    update((d) => ({
      ...d,
      investments: { entries: [{ id: uid(), date: today, amount }, ...d.investments.entries] },
    }));
    setQuick(null);
  }

  function removeSavingsEntry(id: string) {
    update((d) => ({
      ...d,
      savings: { ...d.savings, entries: d.savings.entries.filter((e) => e.id !== id) },
    }));
  }

  function removeInvestmentEntry(id: string) {
    update((d) => ({
      ...d,
      investments: { entries: d.investments.entries.filter((e) => e.id !== id) },
    }));
  }

  function saveTarget() {
    const target = Number(savingTarget.replace(',', '.'));
    if (!Number.isFinite(target) || target < 0) return;
    update((d) => ({
      ...d,
      savings: { ...d.savings, target: Math.round(target) },
      financialGoals: checkGoalAchievements(d.financialGoals, savedTotal(d.savings), today),
    }));
    setSavingTarget('');
  }

  function createGoal() {
    const target = Number(goalTarget.replace(',', '.'));
    if (goalLabel.trim() === '' || !Number.isFinite(target) || target <= 0) return;
    const xpParsed = Number(goalXp);
    const xp = Number.isFinite(xpParsed) && xpParsed > 0 ? Math.round(xpParsed) : suggestGoalXp(target);
    const goal: FinancialGoal = {
      id: uid(),
      label: goalLabel.trim(),
      target: Math.round(target),
      xp,
      createdAt: today,
    };
    update((d) => ({
      ...d,
      financialGoals: checkGoalAchievements([goal, ...d.financialGoals], savedTotal(d.savings), today),
    }));
    setGoalLabel('');
    setGoalTarget('');
    setGoalXp('');
  }

  function removeGoal(id: string) {
    update((d) => ({ ...d, financialGoals: d.financialGoals.filter((g) => g.id !== id) }));
  }

  const simYearsNum = Number(simYears.replace(',', '.')) || 0;
  const simResult = useMemo(() => {
    if (simYearsNum <= 0) return null;
    const initial = Number(simInitial.replace(',', '.')) || 0;
    const monthly = Number(simMonthly.replace(',', '.')) || 0;
    const sp = simulate(initial, monthly, simYearsNum, simFreq, Number(spRate) || 0);
    const cac = simulate(initial, monthly, simYearsNum, simFreq, Number(cacRate) || 0);
    return { sp, cac };
  }, [simInitial, simMonthly, simYearsNum, simFreq, spRate, cacRate]);

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Business</h1>
          <p className="sub">
            {projects.length} projet{projects.length > 1 ? 's' : ''} · {formatMoney(global.benefice)}{' '}
            de bénéfice
          </p>
        </div>
      </header>

      {/* ---------- patrimoine ---------- */}

      <section className="section" style={{ marginTop: 4 }}>
        <h2 className="section-title">Patrimoine</h2>
        <div className="stat-row" style={{ marginTop: 0 }}>
          <div className="stat">
            <b className="mono">{formatMoney(cash)}</b>
            <span>Cash</span>
          </div>
          <div className="stat">
            <b className="mono">{formatMoney(saved)}</b>
            <span>Épargne</span>
          </div>
          <div className="stat">
            <b className="mono">{formatMoney(invested)}</b>
            <span>Investi</span>
          </div>
        </div>
        <div className="patrimoine-total">
          <span>Total</span>
          <b className="mono">{formatMoney(patrimoine)}</b>
        </div>
      </section>

      {/* ---------- projets ---------- */}

      <section className="section">
        <h2 className="section-title">Projets</h2>

        {projects.length === 0 && !creating ? (
          <div className="card empty">
            Aucun projet. Crée le premier — marque, e-commerce, application, agence, ce que tu veux
            faire grandir.
          </div>
        ) : null}

        {projects.map((p) => {
          const ratio = projectProgress(p);
          const stage = stageOf(p.stage);
          const t = totals(p.entries);
          const isOpen = openId === p.id;
          return (
            <div key={p.id} className="project" data-open={isOpen}>
              <button className="project-head" onClick={() => setOpenId(isOpen ? null : p.id)}>
                <span className="project-main">
                  <span className="project-name">{p.name}</span>
                  <span className="project-meta">
                    {p.type} · Niveau {stage.level} — {stage.label}
                  </span>
                </span>
                <span className="project-pct mono">{Math.round(ratio * 100)}%</span>
              </button>
              <div className="bar" style={{ marginTop: 10 }}>
                <i style={{ width: `${Math.round(ratio * 100)}%` }} />
              </div>

              {isOpen ? (
                <div className="project-body">
                  {p.mainGoal ? <div className="hint">{p.mainGoal}</div> : null}

                  <div className="field">
                    <span>Étape</span>
                    <div className="stage-row">
                      {STAGES.map((s) => (
                        <button
                          key={s.id}
                          className="stage"
                          data-on={stage.level >= s.level}
                          data-current={p.stage === s.id}
                          onClick={() => setStage(p.id, s.id)}
                        >
                          <span className="stage-level mono">{s.level}</span>
                          <span className="stage-label">{s.label}</span>
                        </button>
                      ))}
                    </div>
                    <div className="ex-meta" style={{ marginTop: 6 }}>
                      {stage.hint}
                    </div>
                  </div>

                  <div className="field">
                    <span>Objectifs du projet</span>
                    {p.subGoals.map((g) => (
                      <button
                        key={g.id}
                        className="check"
                        data-on={g.done}
                        onClick={() =>
                          patch(p.id, (x) => ({
                            ...x,
                            subGoals: x.subGoals.map((y) =>
                              y.id === g.id ? { ...y, done: !y.done } : y,
                            ),
                          }))
                        }
                      >
                        <span className="box">
                          {g.done ? (
                            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />
                            </svg>
                          ) : null}
                        </span>
                        <span className="check-main">
                          <span className="check-label">{g.label}</span>
                        </span>
                      </button>
                    ))}
                    <div className="inline-add">
                      <input
                        className="input"
                        placeholder="Ajouter un objectif"
                        value={subGoal}
                        onChange={(e) => setSubGoal(e.target.value)}
                      />
                      <button className="btn btn-sm btn-accent" onClick={() => addSubGoal(p.id)}>
                        Ajouter
                      </button>
                    </div>
                  </div>

                  {/* finances du projet */}
                  <div className="field">
                    <span>Finances</span>
                    <div className="stat-row" style={{ marginTop: 0 }}>
                      <div className="stat">
                        <b className="mono">{formatMoney(t.revenus)}</b>
                        <span>Revenus</span>
                      </div>
                      <div className="stat">
                        <b className="mono">{formatMoney(t.depenses)}</b>
                        <span>Dépenses</span>
                      </div>
                      <div className="stat">
                        <b className="mono">{formatMoney(t.benefice)}</b>
                        <span>Bénéfice</span>
                      </div>
                    </div>

                    <div className="segmented" style={{ marginTop: 12 }}>
                      <button
                        data-on={entryKind === 'revenu'}
                        onClick={() => {
                          setEntryKind('revenu');
                          setEntryCat(REVENUE_CATEGORIES[0]);
                        }}
                      >
                        Revenu
                      </button>
                      <button
                        data-on={entryKind === 'depense'}
                        onClick={() => {
                          setEntryKind('depense');
                          setEntryCat(EXPENSE_CATEGORIES[0]);
                        }}
                      >
                        Dépense
                      </button>
                    </div>

                    <div className="chip-grid" style={{ marginTop: 10 }}>
                      {(entryKind === 'revenu' ? REVENUE_CATEGORIES : EXPENSE_CATEGORIES).map(
                        (c) => (
                          <button
                            key={c}
                            className="chip"
                            data-on={entryCat === c}
                            onClick={() => setEntryCat(c)}
                          >
                            {c}
                          </button>
                        ),
                      )}
                    </div>

                    <div className="inline-add">
                      <input
                        className="input"
                        type="number"
                        inputMode="decimal"
                        placeholder="Montant"
                        value={entryAmount}
                        onChange={(e) => setEntryAmount(e.target.value)}
                      />
                      <button className="btn btn-sm btn-accent" onClick={() => addEntry(p.id)}>
                        Ajouter
                      </button>
                    </div>

                    {monthlySeries(p.entries).length > 0 ? (
                      <div style={{ marginTop: 12 }}>
                        {monthlySeries(p.entries)
                          .slice(-6)
                          .reverse()
                          .map((m) => (
                            <div key={m.month} className="rec">
                              <div className="ex-name">{formatMonth(m.month)}</div>
                              <div className="rec-val">
                                <b className="mono">{formatMoney(m.benefice)}</b>
                              </div>
                            </div>
                          ))}
                        {projection(p.entries) !== null ? (
                          <div className="hint" style={{ marginTop: 10 }}>
                            Sur la base des derniers mois enregistrés :{' '}
                            {formatMoney(projection(p.entries) as number)} par mois. Simple moyenne,
                            pas une prévision.
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>

                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => patch(p.id, (x) => ({ ...x, archived: true }))}
                  >
                    Archiver le projet
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}

        {creating ? (
          <div className="card">
            <label className="field">
              <span>Nom du projet</span>
              <input
                className="input"
                placeholder="Reda Studio"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <div className="field">
              <span>Type</span>
              <div className="chip-grid">
                {PROJECT_TYPES.map((t) => (
                  <button key={t} className="chip" data-on={type === t} onClick={() => setType(t)}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <label className="field">
              <span>Objectif principal</span>
              <input
                className="input"
                placeholder="Lancer la marque"
                value={mainGoal}
                onChange={(e) => setMainGoal(e.target.value)}
              />
            </label>
            <div className="grid-2" style={{ marginTop: 14 }}>
              <button className="btn btn-ghost" onClick={() => setCreating(false)}>
                Annuler
              </button>
              <button className="btn btn-accent" onClick={createProject} disabled={name.trim() === ''}>
                Créer
              </button>
            </div>
          </div>
        ) : (
          <button className="btn btn-accent add-objective" onClick={() => setCreating(true)}>
            + Nouveau projet
          </button>
        )}
      </section>

      {/* ---------- gestion de finance ---------- */}

      <section className="section">
        <h2 className="section-title">Gestion de finance · {formatMonth(month)}</h2>

        <div className="money-card">
          <div className="money-split">
            <button className="money-tap" onClick={() => setQuick('gagne')}>
              <span>Gagné ce mois</span>
              <b className="mono money-in">+{formatMoney(personalMonth.revenus)}</b>
            </button>
            <button className="money-tap" onClick={() => setQuick('depense')}>
              <span>Dépensé ce mois</span>
              <b className="mono money-out">−{formatMoney(personalMonth.depenses)}</b>
            </button>
          </div>
          <div className="money-balance">
            <span>Il te reste</span>
            <b className="mono" data-negative={personalMonth.benefice < 0}>
              {formatMoney(personalMonth.benefice)}
            </b>
          </div>
        </div>

        <div className="ex-meta" style={{ margin: '10px 2px' }}>
          Tape directement sur un montant ci-dessus pour l&apos;ajouter en un geste, ou détaille avec
          une catégorie ci-dessous.
        </div>

        <div className="card">
          <div className="segmented">
            <button
              data-on={pKind === 'revenu'}
              onClick={() => {
                setPKind('revenu');
                setPCat(PERSONAL_INCOME_CATEGORIES[0]);
              }}
            >
              J&apos;ai gagné
            </button>
            <button
              data-on={pKind === 'depense'}
              onClick={() => {
                setPKind('depense');
                setPCat(PERSONAL_EXPENSE_CATEGORIES[0]);
              }}
            >
              J&apos;ai dépensé
            </button>
          </div>

          <div className="chip-grid" style={{ marginTop: 10 }}>
            {(pKind === 'revenu' ? PERSONAL_INCOME_CATEGORIES : PERSONAL_EXPENSE_CATEGORIES).map(
              (c) => (
                <button key={c} className="chip" data-on={pCat === c} onClick={() => setPCat(c)}>
                  {c}
                </button>
              ),
            )}
          </div>

          <div className="inline-add">
            <input
              className="input"
              placeholder="Libellé (facultatif)"
              value={pLabel}
              onChange={(e) => setPLabel(e.target.value)}
            />
          </div>
          <div className="inline-add">
            <input
              className="input"
              type="number"
              inputMode="decimal"
              placeholder="Montant"
              value={pAmount}
              onChange={(e) => setPAmount(e.target.value)}
            />
            <button className="btn btn-sm btn-accent" onClick={addPersonal}>
              Ajouter
            </button>
          </div>
        </div>

        {monthEntries.length > 0 ? (
          <div className="card" style={{ marginTop: 10 }}>
            {monthEntries.map((e) => (
              <div key={e.id} className="rec">
                <div style={{ minWidth: 0 }}>
                  <div className="ex-name">{e.label || e.category}</div>
                  <div className="ex-meta">
                    {e.label ? `${e.category} · ` : ''}
                    {formatDate(e.date)}
                  </div>
                </div>
                <div className="rec-val">
                  <b className="mono" style={{ color: e.kind === 'revenu' ? '#4ec38a' : undefined }}>
                    {e.kind === 'revenu' ? '+' : '−'}
                    {formatMoney(e.amount)}
                  </b>
                  <button className="btn btn-ghost btn-sm" onClick={() => removePersonal(e.id)}>
                    Retirer
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      {/* ---------- analyse ---------- */}

      <section className="section">
        <h2 className="section-title">Analyse du mois</h2>
        <div className="card">
          {insights.map((i, n) => (
            <div key={n} className="insight" data-tone={i.tone}>
              <span className="insight-dot" />
              <span>{i.text}</span>
            </div>
          ))}
          <div className="ex-meta" style={{ marginTop: 12 }}>
            Observations calculées sur tes propres chiffres, sur ton appareil. Ce ne sont pas des
            conseils financiers.
          </div>
        </div>
      </section>

      {/* ---------- épargne ---------- */}

      <section className="section">
        <h2 className="section-title">Épargne</h2>
        <div className="card">
          <button className="money-tap-block" onClick={() => setQuick('epargne')}>
            <div className="level-number mono" style={{ fontSize: 28 }}>
              {formatMoney(saved)}
            </div>
            {data.savings.target > 0 ? (
              <div className="ex-meta">sur {formatMoney(data.savings.target)}</div>
            ) : (
              <div className="ex-meta">Tape pour ajouter ou retirer</div>
            )}
          </button>

          {data.savings.target > 0 ? (
            <>
              <div className="bar">
                <i style={{ width: `${Math.round(savingsRatio * 100)}%` }} />
              </div>
              {savingsDue ? (
                <div className="banner">Rien mis de côté ce mois-ci pour l&apos;instant.</div>
              ) : null}
            </>
          ) : (
            <div className="inline-add">
              <input
                className="input"
                type="number"
                inputMode="decimal"
                placeholder="Objectif rapide, ex. 5000"
                value={savingTarget}
                onChange={(e) => setSavingTarget(e.target.value)}
              />
              <button className="btn btn-sm btn-accent" onClick={saveTarget}>
                Définir
              </button>
            </div>
          )}

          {savingsHistory.length > 0 ? (
            <div style={{ marginTop: 12 }}>
              {savingsHistory.map((e) => (
                <div key={e.id} className="rec">
                  <div className="ex-name">{formatDate(e.date)}</div>
                  <div className="rec-val">
                    <b className="mono" style={{ color: e.amount >= 0 ? '#4ec38a' : '#e0806f' }}>
                      {e.amount >= 0 ? '+' : ''}
                      {formatMoney(e.amount)}
                    </b>
                    <button className="btn btn-ghost btn-sm" onClick={() => removeSavingsEntry(e.id)}>
                      Retirer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* ---------- investissements ---------- */}

      <section className="section">
        <h2 className="section-title">Investissements</h2>
        <div className="card">
          <button className="money-tap-block" onClick={() => setQuick('investissement')}>
            <div className="level-number mono" style={{ fontSize: 28 }}>
              {formatMoney(invested)}
            </div>
            <div className="ex-meta">Tape pour ajouter ou retirer</div>
          </button>

          {investmentsHistory.length > 0 ? (
            <div style={{ marginTop: 12 }}>
              {investmentsHistory.map((e) => (
                <div key={e.id} className="rec">
                  <div className="ex-name">{formatDate(e.date)}</div>
                  <div className="rec-val">
                    <b className="mono" style={{ color: e.amount >= 0 ? '#4ec38a' : '#e0806f' }}>
                      {e.amount >= 0 ? '+' : ''}
                      {formatMoney(e.amount)}
                    </b>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => removeInvestmentEntry(e.id)}
                    >
                      Retirer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* ---------- objectifs financiers ---------- */}

      <section className="section">
        <h2 className="section-title">Objectifs financiers</h2>

        {data.financialGoals.length === 0 ? (
          <div className="card empty">
            Fixe un objectif d&apos;épargne — atteint-le et tu gagnes de l&apos;XP.
          </div>
        ) : (
          data.financialGoals.map((g) => {
            const ratio = g.target > 0 ? Math.min(1, saved / g.target) : 0;
            return (
              <div key={g.id} className="goal" data-done={Boolean(g.achievedAt)}>
                <div className="row">
                  <div style={{ minWidth: 0 }}>
                    <div className="goal-title">{g.label}</div>
                    <div className="goal-detail">
                      {g.achievedAt
                        ? `Atteint le ${formatDate(g.achievedAt)}`
                        : `${formatMoney(saved)} sur ${formatMoney(g.target)}`}
                    </div>
                  </div>
                  <span className="xp-chip">+{g.xp} XP</span>
                </div>
                {!g.achievedAt ? (
                  <div className="bar" style={{ marginTop: 10 }}>
                    <i style={{ width: `${Math.round(ratio * 100)}%` }} />
                  </div>
                ) : null}
                <div style={{ marginTop: 10 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => removeGoal(g.id)}>
                    Supprimer
                  </button>
                </div>
              </div>
            );
          })
        )}

        <div className="card" style={{ marginTop: 10 }}>
          <label className="field" style={{ marginTop: 0 }}>
            <span>Objectif</span>
            <input
              className="input"
              placeholder="Ex. Fonds d'urgence"
              value={goalLabel}
              onChange={(e) => setGoalLabel(e.target.value)}
            />
          </label>
          <div className="grid-2">
            <label className="field">
              <span>Montant</span>
              <input
                className="input"
                type="number"
                inputMode="decimal"
                placeholder="5000"
                value={goalTarget}
                onChange={(e) => setGoalTarget(e.target.value)}
              />
            </label>
            <label className="field">
              <span>XP à la clé</span>
              <input
                className="input"
                type="number"
                inputMode="numeric"
                placeholder={String(
                  suggestGoalXp(Number(goalTarget.replace(',', '.')) || 0) || 'auto',
                )}
                value={goalXp}
                onChange={(e) => setGoalXp(e.target.value)}
              />
            </label>
          </div>
          <div style={{ marginTop: 14 }}>
            <button
              className="btn btn-accent"
              onClick={createGoal}
              disabled={goalLabel.trim() === '' || goalTarget === ''}
            >
              Fixer l&apos;objectif
            </button>
          </div>
        </div>
      </section>

      {/* ---------- simulateur d'investissement ---------- */}

      <section className="section">
        <h2 className="section-title">Simulateur d&apos;investissement</h2>
        <div className="card">
          <div className="grid-2">
            <label className="field" style={{ marginTop: 0 }}>
              <span>Montant initial</span>
              <input
                className="input"
                type="number"
                inputMode="decimal"
                value={simInitial}
                onChange={(e) => setSimInitial(e.target.value)}
              />
            </label>
            <label className="field" style={{ marginTop: 0 }}>
              <span>Ajout par versement</span>
              <input
                className="input"
                type="number"
                inputMode="decimal"
                value={simMonthly}
                onChange={(e) => setSimMonthly(e.target.value)}
              />
            </label>
          </div>

          <div className="field">
            <span>Fréquence des versements</span>
            <div className="segmented">
              <button data-on={simFreq === 'mensuel'} onClick={() => setSimFreq('mensuel')}>
                Mensuel
              </button>
              <button data-on={simFreq === 'annuel'} onClick={() => setSimFreq('annuel')}>
                Annuel
              </button>
            </div>
          </div>

          <label className="field">
            <span>Durée (années)</span>
            <input
              className="input"
              type="number"
              inputMode="numeric"
              value={simYears}
              onChange={(e) => setSimYears(e.target.value)}
            />
          </label>

          <div className="grid-2">
            <label className="field">
              <span>Rendement S&amp;P 500 (%/an)</span>
              <input
                className="input"
                type="number"
                inputMode="decimal"
                value={spRate}
                onChange={(e) => setSpRate(e.target.value)}
              />
            </label>
            <label className="field">
              <span>Rendement CAC 40 (%/an)</span>
              <input
                className="input"
                type="number"
                inputMode="decimal"
                value={cacRate}
                onChange={(e) => setCacRate(e.target.value)}
              />
            </label>
          </div>

          {simResult ? (
            <>
              <div className="sim-legend">
                <span>
                  <i className="sim-dot sim-dot-sp" /> S&amp;P 500
                </span>
                <span>
                  <i className="sim-dot sim-dot-cac" /> CAC 40
                </span>
              </div>
              <DualCurve
                suffix=" €"
                series={[
                  { label: 'S&P 500', color: '#4d86ea', points: simResult.sp.points },
                  { label: 'CAC 40', color: '#e0a06f', points: simResult.cac.points },
                ]}
              />

              <div className="sim-table">
                <div className="sim-row sim-head">
                  <span />
                  <span>S&amp;P 500</span>
                  <span>CAC 40</span>
                </div>
                <div className="sim-row">
                  <span>Argent versé</span>
                  <span className="mono">{formatMoney(simResult.sp.versed)}</span>
                  <span className="mono">{formatMoney(simResult.cac.versed)}</span>
                </div>
                <div className="sim-row">
                  <span>Valeur simulée</span>
                  <span className="mono">{formatMoney(simResult.sp.finalValue)}</span>
                  <span className="mono">{formatMoney(simResult.cac.finalValue)}</span>
                </div>
                <div className="sim-row">
                  <span>Gain simulé</span>
                  <span className="mono">{formatMoney(simResult.sp.gain)}</span>
                  <span className="mono">{formatMoney(simResult.cac.gain)}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="empty">Indique une durée pour lancer la simulation.</div>
          )}

          <div className="hint" style={{ marginTop: 14 }}>
            Simulation basée sur des hypothèses de rendement que tu peux modifier toi-même — ce ne
            sont pas des données historiques certifiées ni une prévision. Les performances passées
            ne garantissent pas les performances futures : les marchés peuvent aussi bien monter que
            baisser, et le résultat réel peut être très différent de cette estimation. Frais, taxes
            et autres coûts ne sont pas pris en compte. Ceci n&apos;est pas un conseil financier.
          </div>
        </div>
      </section>

      {quick === 'gagne' ? (
        <QuickAmount
          title="Argent gagné"
          confirmLabel="Ajouter"
          onConfirm={(amount) => quickAddPersonal('revenu', amount)}
          onClose={() => setQuick(null)}
        />
      ) : null}
      {quick === 'depense' ? (
        <QuickAmount
          title="Dépense"
          confirmLabel="Ajouter"
          onConfirm={(amount) => quickAddPersonal('depense', amount)}
          onClose={() => setQuick(null)}
        />
      ) : null}
      {quick === 'epargne' ? (
        <QuickAmount
          title="Épargne"
          allowWithdraw
          confirmLabel="Valider"
          onConfirm={addToSavings}
          onClose={() => setQuick(null)}
        />
      ) : null}
      {quick === 'investissement' ? (
        <QuickAmount
          title="Investissements"
          allowWithdraw
          confirmLabel="Valider"
          onConfirm={addToInvestments}
          onClose={() => setQuick(null)}
        />
      ) : null}
    </>
  );
}
