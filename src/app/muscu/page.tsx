'use client';

import { useEffect, useMemo, useState } from 'react';
import { useData } from '@/components/DataProvider';
import SessionEditor from '@/components/SessionEditor';
import { catalogue, lookupExercise, planIdsForDay } from '@/lib/program';
import {
  WEEK_ORDERED,
  dayXp,
  formatDate,
  planForDate,
  shiftKey,
  todayKey,
  uid,
  weekDatesFrom,
  workoutOn,
} from '@/lib/logic';
import { isDone, objectivesForDate, xpOnDate } from '@/lib/xp';
import type { DailyEntry, Exercise, Objective, SetEntry } from '@/lib/types';

type Draft = Record<string, SetEntry[]>;

function Check() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />
    </svg>
  );
}

function Arrow({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d={dir === 'left' ? 'M14.5 5.5 8 12l6.5 6.5' : 'M9.5 5.5 16 12l-6.5 6.5'} />
    </svg>
  );
}

export default function WeekPage() {
  const { data, update } = useData();
  const tz = data.settings.timezone;
  const today = todayKey(tz);

  const [anchor, setAnchor] = useState(today);
  const [selected, setSelected] = useState(today);
  const [draft, setDraft] = useState<Draft>({});
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);

  const dates = useMemo(() => weekDatesFrom(anchor), [anchor]);
  const plan = planForDate(selected);
  const logged = workoutOn(data.workouts, selected);
  const cat = useMemo(() => catalogue(data.customExercises), [data.customExercises]);

  const exercises = useMemo(() => {
    const ids = planIdsForDay(data.plan, plan.id);
    return ids
      .map((id) => lookupExercise(id, data.customExercises))
      .filter((e): e is Exercise => Boolean(e));
  }, [data.plan, data.customExercises, plan.id]);

  const exerciseKey = exercises.map((e) => e.id).join(',');

  const objectives = useMemo(
    () => objectivesForDate(data.objectives, selected),
    [data.objectives, selected],
  );
  const entry = data.daily[selected];

  useEffect(() => {
    const next: Draft = {};
    for (const ex of exercises) {
      const weight = data.loads[ex.id] ?? ex.defaultWeight;
      next[ex.id] = Array.from({ length: ex.sets }, () => ({ weight, reps: 0 }));
    }
    setDraft(next);
    setSaved(false);
    setEditing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, exerciseKey]);

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
    const logs = exercises
      .map((ex) => ({ exerciseId: ex.id, sets: (draft[ex.id] ?? []).filter((s) => s.reps > 0) }))
      .filter((e) => e.sets.length > 0);
    if (logs.length === 0) return;

    update((d) => {
      const loads = { ...d.loads };
      for (const e of logs) loads[e.exerciseId] = Math.max(...e.sets.map((s) => s.weight));
      const e: DailyEntry = d.daily[selected] ?? { tasks: {} };
      const tasks: Record<string, boolean> = { ...e.tasks, activite: true };
      if (!plan.rest) tasks.seance = true;
      return {
        ...d,
        loads,
        workouts: [
          { id: uid(), date: selected, sessionId: plan.id, exercises: logs },
          ...d.workouts.filter((w) => w.date !== selected),
        ],
        daily: { ...d.daily, [selected]: { ...e, tasks } },
      };
    });
    setSaved(true);
  }

  function toggleObjective(o: Objective) {
    update((d) => {
      const e: DailyEntry = d.daily[selected] ?? { tasks: {} };
      const list = e.objectives ?? [];
      return {
        ...d,
        daily: {
          ...d.daily,
          [selected]: {
            ...e,
            objectives: list.includes(o.id) ? list.filter((x) => x !== o.id) : [...list, o.id],
          },
        },
      };
    });
  }

  const monthLabel = new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${dates[0]}T12:00:00Z`));

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Musculation</h1>
          <p className="sub" style={{ textTransform: 'capitalize' }}>
            {monthLabel}
          </p>
        </div>
        <div className="week-nav">
          <button onClick={() => setAnchor(shiftKey(anchor, -7))} aria-label="Semaine précédente">
            <Arrow dir="left" />
          </button>
          <button onClick={() => setAnchor(today)} className="week-today">
            Auj.
          </button>
          <button onClick={() => setAnchor(shiftKey(anchor, 7))} aria-label="Semaine suivante">
            <Arrow dir="right" />
          </button>
        </div>
      </header>

      <section className="section" style={{ marginTop: 12 }}>
        {WEEK_ORDERED.map((d, i) => {
          const date = dates[i];
          const done = Boolean(workoutOn(data.workouts, date));
          const xp = xpOnDate(data, date, dayXp);
          const objs = objectivesForDate(data.objectives, date);
          const objDone = objs.filter((o) => isDone(data.daily[date], o.id)).length;
          return (
            <button
              key={d.id}
              className="day"
              data-today={date === today}
              data-selected={date === selected}
              onClick={() => setSelected(date)}
            >
              <span className="day-tag">
                {d.label.slice(0, 3)}
                <span className="day-num mono">{date.slice(8)}</span>
              </span>
              <span className="day-main">
                <span className="day-title">{d.title}</span>
                <span className="day-focus">
                  {objs.length > 0 ? `${objDone}/${objs.length} objectifs` : d.focus}
                </span>
              </span>
              <span className="day-marks">
                {xp > 0 ? <span className="day-xp mono">+{xp}</span> : null}
                {done ? <span className="dot" /> : null}
              </span>
            </button>
          );
        })}
      </section>

      {objectives.length > 0 ? (
        <section className="section">
          <h2 className="section-title">Objectifs du {formatDate(selected)}</h2>
          {objectives.map((o) => {
            const on = isDone(entry, o.id);
            return (
              <button key={o.id} className="check" data-on={on} onClick={() => toggleObjective(o)}>
                <span className="box">{on ? <Check /> : null}</span>
                <span className="check-main">
                  <span className="check-label">{o.title}</span>
                  <span className="check-hint">{o.time ?? ''}</span>
                </span>
                <span className="xp-chip">+{o.xp}</span>
              </button>
            );
          })}
        </section>
      ) : null}

      <section className="section">
        <div className="row" style={{ marginBottom: 10 }}>
          <h2 className="section-title" style={{ margin: 0 }}>
            {plan.title}
            {logged ? ' · enregistrée' : ''}
          </h2>
          <button className="link-sm" onClick={() => setEditing((v) => !v)}>
            {editing ? 'Terminer' : 'Modifier la séance'}
          </button>
        </div>

        {editing ? (
          <SessionEditor
            dayId={plan.id}
            ids={exercises.map((e) => e.id)}
            catalogue={cat}
            onChange={(ids) =>
              update((d) => ({ ...d, plan: { ...d.plan, [plan.id]: ids } }))
            }
            onReset={() =>
              update((d) => {
                const next = { ...d.plan };
                delete next[plan.id];
                return { ...d, plan: next };
              })
            }
            onCreate={(ex) =>
              update((d) => ({
                ...d,
                customExercises: [...d.customExercises, ex],
                plan: { ...d.plan, [plan.id]: [...planIdsForDay(d.plan, plan.id), ex.id] },
              }))
            }
          />
        ) : (
          <>
            {exercises.map((ex) => {
              const sets = draft[ex.id] ?? [];
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
                </div>
              );
            })}

            <div style={{ marginTop: 14 }}>
              <button className="btn btn-accent" onClick={saveSession} disabled={filled === 0}>
                {saved ? 'Enregistré' : `Enregistrer (${filled} série${filled > 1 ? 's' : ''})`}
              </button>
            </div>
          </>
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
