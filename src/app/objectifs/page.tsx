'use client';

import { useState } from 'react';
import { useData } from '@/components/DataProvider';
import { formatDate, todayKey, uid } from '@/lib/logic';
import type { Goal } from '@/lib/types';

export default function GoalsPage() {
  const { data, update } = useData();
  const tz = data.settings.timezone;
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState('');
  const [open, setOpen] = useState(false);

  const goals = data.goals;
  const active = goals.filter((g) => !g.done);
  const done = goals.filter((g) => g.done);

  function addGoal() {
    if (title.trim() === '') return;
    const num = Number(target.replace(',', '.'));
    const goal: Goal = {
      id: uid(),
      title: title.trim(),
      detail: detail.trim() || undefined,
      target: target.trim() !== '' && Number.isFinite(num) ? num : undefined,
      current: target.trim() !== '' && Number.isFinite(num) ? 0 : undefined,
      unit: unit.trim() || undefined,
      done: false,
      createdAt: todayKey(tz),
    };
    update((d) => ({ ...d, goals: [goal, ...d.goals] }));
    setTitle('');
    setDetail('');
    setTarget('');
    setUnit('');
    setOpen(false);
  }

  function patch(id: string, fn: (g: Goal) => Goal) {
    update((d) => ({ ...d, goals: d.goals.map((g) => (g.id === id ? fn(g) : g)) }));
  }

  function remove(id: string) {
    update((d) => ({ ...d, goals: d.goals.filter((g) => g.id !== id) }));
  }

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Objectifs</h1>
          <p className="sub">
            {active.length} en cours · {done.length} atteint{done.length > 1 ? 's' : ''}
          </p>
        </div>
      </header>

      <section className="section">
        {open ? (
          <div className="card">
            <label className="field">
              <span>Objectif</span>
              <input
                className="input"
                placeholder="Ex. Développé couché à 80 kg"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label className="field">
              <span>Détail (facultatif)</span>
              <input
                className="input"
                placeholder="Ex. avant la fin de l'année"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
              />
            </label>
            <div className="grid-2">
              <label className="field">
                <span>Cible chiffrée (facultatif)</span>
                <input
                  className="input"
                  type="number"
                  inputMode="decimal"
                  placeholder="80"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                />
              </label>
              <label className="field">
                <span>Unité</span>
                <input
                  className="input"
                  placeholder="kg"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                />
              </label>
            </div>
            <div className="grid-2" style={{ marginTop: 14 }}>
              <button className="btn btn-ghost" onClick={() => setOpen(false)}>
                Annuler
              </button>
              <button className="btn btn-accent" onClick={addGoal} disabled={title.trim() === ''}>
                Ajouter
              </button>
            </div>
          </div>
        ) : (
          <button className="btn btn-accent" onClick={() => setOpen(true)}>
            Nouvel objectif
          </button>
        )}
      </section>

      <section className="section">
        <h2 className="section-title">En cours</h2>
        {active.length === 0 ? (
          <div className="card empty">
            Aucun objectif pour l&apos;instant. Note ce que tu veux atteindre, même simplement.
          </div>
        ) : (
          active.map((g) => (
            <GoalCard key={g.id} goal={g} onPatch={patch} onRemove={remove} />
          ))
        )}
      </section>

      {done.length > 0 ? (
        <section className="section">
          <h2 className="section-title">Atteints</h2>
          {done.map((g) => (
            <GoalCard key={g.id} goal={g} onPatch={patch} onRemove={remove} />
          ))}
        </section>
      ) : null}
    </>
  );
}

function GoalCard({
  goal,
  onPatch,
  onRemove,
}: {
  goal: Goal;
  onPatch: (id: string, fn: (g: Goal) => Goal) => void;
  onRemove: (id: string) => void;
}) {
  const hasTarget = typeof goal.target === 'number' && goal.target > 0;
  const current = goal.current ?? 0;
  const ratio = hasTarget ? Math.min(1, current / (goal.target as number)) : 0;

  return (
    <div className="goal" data-done={goal.done}>
      <div className="row">
        <div style={{ minWidth: 0 }}>
          <div className="goal-title">{goal.title}</div>
          <div className="goal-detail">
            {goal.detail ? `${goal.detail} · ` : ''}depuis le {formatDate(goal.createdAt)}
          </div>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => onPatch(goal.id, (g) => ({ ...g, done: !g.done }))}
        >
          {goal.done ? 'Rouvrir' : 'Atteint'}
        </button>
      </div>

      {hasTarget ? (
        <>
          <div className="bar">
            <i style={{ width: `${Math.round(ratio * 100)}%` }} />
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            <div className="mono small muted">
              {current} / {goal.target} {goal.unit ?? ''}
            </div>
            <div className="stepper">
              <button
                onClick={() =>
                  onPatch(goal.id, (g) => ({ ...g, current: Math.max(0, (g.current ?? 0) - 1) }))
                }
                aria-label="Diminuer"
              >
                −
              </button>
              <button
                onClick={() => onPatch(goal.id, (g) => ({ ...g, current: (g.current ?? 0) + 1 }))}
                aria-label="Augmenter"
              >
                +
              </button>
            </div>
          </div>
        </>
      ) : null}

      <div style={{ marginTop: 12 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => onRemove(goal.id)}>
          Supprimer
        </button>
      </div>
    </div>
  );
}
