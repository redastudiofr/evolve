'use client';

import { useEffect, useMemo, useState } from 'react';
import { useData } from '@/components/DataProvider';
import { findExercise } from '@/lib/program';
import {
  WEEK_ORDERED,
  formatDate,
  suggestLoad,
  todayKey,
  uid,
  weekDates,
  workoutOn,
} from '@/lib/logic';
import type { DailyEntry, SetEntry } from '@/lib/types';

type Draft = Record<string, SetEntry[]>;

export default function WeekPage() {
  const { data, update } = useData();
  const tz = data.settings.timezone;
  const today = todayKey(tz);
  const dates = useMemo(() => weekDates(tz), [tz]);
  const todayIndex = dates.indexOf(today);

  const [index, setIndex] = useState(todayIndex >= 0 ? todayIndex : 0);
  const [draft, setDraft] = useState<Draft>({});
  const [saved, setSaved] = useState(false);

  const plan = WEEK_ORDERED[index];
  const date = dates[index];
  const logged = workoutOn(data.workouts, date);

  useEffect(() => {
    const next: Draft = {};
    for (const ex of plan.exercises) {
      const weight = suggestLoad(ex.id, data.loads[ex.id] ?? ex.defaultWeight, data.workouts).weight;
      next[ex.id] = Array.from({ length: ex.sets }, () => ({ weight, reps: 0 }));
    }
    setDraft(next);
    setSaved(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  function setCell(exId: string, i: number, field: keyof SetEntry, value: string) {
    setDraft((prev) => {
      const sets = [...(prev[exId] ?? [])];
      const num = value === '' ? 0 : Number(value.replace(',', '.'));
      sets[i] = { ...sets[i], [field]: Number.isFinite(num) ? num : 0 };
      return { ...prev, [exId]: sets };
    });
  }

  const filled = Object.values(draft).reduce((a, s) => a + s.filter((x) => x.reps > 0).length, 0);

  function saveSession() {
    const exercises = plan.exercises
      .map((ex) => ({ exerciseId: ex.id, sets: (draft[ex.id] ?? []).filter((s) => s.reps > 0) }))
      .filter((e) => e.sets.length > 0);
    if (exercises.length === 0) return;

    update((d) => {
      const loads = { ...d.loads };
      for (const e of exercises) loads[e.exerciseId] = Math.max(...e.sets.map((s) => s.weight));
      const current: DailyEntry = d.daily[date] ?? { tasks: {} };
      const tasks: Record<string, boolean> = { ...current.tasks, activite: true };
      if (!plan.rest) tasks.seance = true;
      return {
        ...d,
        loads,
        workouts: [
          { id: uid(), date, sessionId: plan.id, exercises },
          ...d.workouts.filter((w) => w.date !== date),
        ],
        daily: { ...d.daily, [date]: { ...current, tasks } },
      };
    });
    setSaved(true);
  }

  const history = [...data.workouts].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 8);

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Semaine</h1>
          <p className="sub">Planning fixe, du lundi au dimanche</p>
        </div>
      </header>

      <section className="section">
        {WEEK_ORDERED.map((d, i) => {
          const dDate = dates[i];
          const done = Boolean(workoutOn(data.workouts, dDate));
          return (
            <button
              key={d.id}
              className="day"
              data-today={dDate === today}
              onClick={() => setIndex(i)}
              style={i === index ? { background: 'var(--surface-2)' } : undefined}
            >
              <span className="day-tag">{d.label.slice(0, 3)}</span>
              <span className="day-main">
                <span className="day-title">{d.title}</span>
                <span className="day-focus">{d.focus}</span>
              </span>
              {done ? <span className="dot" /> : null}
            </button>
          );
        })}
      </section>

      <section className="section">
        <h2 className="section-title">
          {plan.label} {formatDate(date)}
          {logged ? ' · déjà enregistrée' : ''}
        </h2>

        {plan.exercises.map((ex) => {
          const sets = draft[ex.id] ?? [];
          const tip = suggestLoad(ex.id, data.loads[ex.id] ?? ex.defaultWeight, data.workouts);
          const isTime = ex.unit === 'sec' || ex.unit === 'min';
          return (
            <div key={ex.id} className="ex">
              <div className="ex-head">
                <div>
                  <div className="ex-name">{ex.name}</div>
                  <div className="ex-meta">
                    {ex.sets} × {ex.repMin}–{ex.repMax}
                    {ex.unit === 'min' ? ' min' : ex.unit === 'sec' ? ' s' : ' reps'}
                    {ex.restSec > 0 ? ` · repos ${ex.restSec}s` : ''} · RPE {ex.rpe}
                    {ex.note ? ` · ${ex.note}` : ''}
                  </div>
                </div>
                {!isTime ? (
                  <div className="xp-chip mono">{data.loads[ex.id] ?? ex.defaultWeight} kg</div>
                ) : null}
              </div>

              <div className="sets">
                <div className="lbl" />
                <div className="lbl">{isTime ? 'Lest (kg)' : 'Charge (kg)'}</div>
                <div className="lbl">
                  {ex.unit === 'min' ? 'Minutes' : ex.unit === 'sec' ? 'Secondes' : 'Reps'}
                </div>
                {sets.map((s, i) => (
                  <Row
                    key={i}
                    index={i}
                    set={s}
                    onWeight={(v) => setCell(ex.id, i, 'weight', v)}
                    onReps={(v) => setCell(ex.id, i, 'reps', v)}
                  />
                ))}
              </div>

              {!isTime ? (
                <div className="hint">
                  {tip.reason}
                  {tip.raise ? ` ${tip.weight} kg` : ''}
                </div>
              ) : null}
            </div>
          );
        })}

        <div style={{ marginTop: 14 }}>
          <button className="btn btn-accent" onClick={saveSession} disabled={filled === 0}>
            {saved ? 'Enregistré' : `Enregistrer (${filled} série${filled > 1 ? 's' : ''})`}
          </button>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Historique</h2>
        {history.length === 0 ? (
          <div className="card empty">Aucune séance enregistrée pour le moment.</div>
        ) : (
          <div className="card">
            {history.map((w) => {
              const day = WEEK_ORDERED.find((d) => d.id === w.sessionId);
              const volume = w.exercises.reduce(
                (a, e) => a + e.sets.reduce((b, s) => b + s.weight * s.reps, 0),
                0,
              );
              const first = findExercise(w.exercises[0]?.exerciseId ?? '')?.name;
              return (
                <div key={w.id} className="rec">
                  <div>
                    <div className="ex-name">{day?.title ?? w.sessionId}</div>
                    <div className="ex-meta">
                      {formatDate(w.date)} · {w.exercises.length} exercices
                      {first ? ` · ${first}…` : ''}
                    </div>
                  </div>
                  <div className="rec-val">
                    <b className="mono">{Math.round(volume)}</b>
                    <div className="ex-meta">kg de volume</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

function Row({
  index,
  set,
  onWeight,
  onReps,
}: {
  index: number;
  set: SetEntry;
  onWeight: (v: string) => void;
  onReps: (v: string) => void;
}) {
  return (
    <>
      <div className="lbl mono">{index + 1}</div>
      <input
        className="input"
        type="number"
        inputMode="decimal"
        step="0.5"
        value={set.weight === 0 ? '' : String(set.weight)}
        placeholder="0"
        onChange={(e) => onWeight(e.target.value)}
      />
      <input
        className="input"
        type="number"
        inputMode="numeric"
        value={set.reps === 0 ? '' : String(set.reps)}
        placeholder="0"
        onChange={(e) => onReps(e.target.value)}
      />
    </>
  );
}
