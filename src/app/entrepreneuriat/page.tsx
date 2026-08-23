'use client';

import { useMemo, useState } from 'react';
import { useData } from '@/components/DataProvider';
import { todayKey, uid } from '@/lib/logic';
import {
  EXPENSE_CATEGORIES,
  PROJECT_TYPES,
  REVENUE_CATEGORIES,
  STAGES,
  formatMoney,
  formatMonth,
  monthKey,
  monthlySeries,
  projectProgress,
  projection,
  savedTotal,
  savingsDueThisMonth,
  savingsProgress,
  stageOf,
  totals,
  totalsForMonth,
} from '@/lib/business';
import type { FinanceEntry, Project, ProjectStage } from '@/lib/types';

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
  const [savingAmount, setSavingAmount] = useState('');

  const projects = data.projects.filter((p) => !p.archived);
  const open = projects.find((p) => p.id === openId) ?? null;

  const allEntries = useMemo(() => projects.flatMap((p) => p.entries), [projects]);
  const global = totals(allEntries);
  const globalMonth = totalsForMonth(allEntries, month);

  const saved = savedTotal(data.savings);
  const savingsRatio = savingsProgress(data.savings);
  const savingsDue = savingsDueThisMonth(data.savings, today);

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

  function addSaving() {
    const amount = Number(savingAmount.replace(',', '.'));
    if (!Number.isFinite(amount) || amount <= 0) return;
    update((d) => ({
      ...d,
      savings: {
        ...d.savings,
        entries: [{ id: uid(), date: today, amount }, ...d.savings.entries],
      },
    }));
    setSavingAmount('');
  }

  function saveTarget() {
    const target = Number(savingTarget.replace(',', '.'));
    if (!Number.isFinite(target) || target < 0) return;
    update((d) => ({ ...d, savings: { ...d.savings, target: Math.round(target) } }));
    setSavingTarget('');
  }

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

      <div className="stat-row" style={{ marginTop: 4 }}>
        <div className="stat">
          <b className="mono">{formatMoney(globalMonth.revenus)}</b>
          <span>Revenus du mois</span>
        </div>
        <div className="stat">
          <b className="mono">{formatMoney(globalMonth.depenses)}</b>
          <span>Dépenses</span>
        </div>
        <div className="stat">
          <b className="mono">{formatMoney(globalMonth.benefice)}</b>
          <span>Bénéfice</span>
        </div>
      </div>

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

      {/* ---------- épargne ---------- */}

      <section className="section">
        <h2 className="section-title">Mise de côté</h2>
        <div className="card">
          {data.savings.target > 0 ? (
            <>
              <div className="row">
                <div>
                  <div className="level-number mono" style={{ fontSize: 28 }}>
                    {formatMoney(saved)}
                  </div>
                  <div className="ex-meta">sur {formatMoney(data.savings.target)}</div>
                </div>
                <div className="project-pct mono">{Math.round(savingsRatio * 100)}%</div>
              </div>
              <div className="bar">
                <i style={{ width: `${Math.round(savingsRatio * 100)}%` }} />
              </div>
              {savingsDue ? (
                <div className="banner">Rien mis de côté ce mois-ci pour l&apos;instant.</div>
              ) : null}
              <div className="inline-add">
                <input
                  className="input"
                  type="number"
                  inputMode="decimal"
                  placeholder="Montant à ajouter"
                  value={savingAmount}
                  onChange={(e) => setSavingAmount(e.target.value)}
                />
                <button className="btn btn-sm btn-accent" onClick={addSaving}>
                  Ajouter
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="ex-meta">
                Fixe un montant à atteindre, puis ajoute ce que tu mets de côté au fil du temps.
              </div>
              <div className="inline-add">
                <input
                  className="input"
                  type="number"
                  inputMode="decimal"
                  placeholder="Objectif, ex. 5000"
                  value={savingTarget}
                  onChange={(e) => setSavingTarget(e.target.value)}
                />
                <button className="btn btn-sm btn-accent" onClick={saveTarget}>
                  Définir
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
