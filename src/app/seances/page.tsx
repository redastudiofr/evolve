'use client';

import { useEffect, useMemo, useState } from 'react';
import { useData } from '@/components/DataProvider';
import { PROGRAM, findExercise } from '@/lib/program';
import { formatDate, nextSessionId, suggestLoad, todayKey, uid } from '@/lib/logic';
import type { SetEntry } from '@/lib/types';

type Draft = Record<string, SetEntry[]>;

export default function SessionsPage() {
  const { data, update } = useData();
  const tz = data.settings.timezone;
  const suggested = useMemo(() => nextSessionId(data.workouts), [data.workouts]);
  const [sessionId, setSessionId] = useState(suggested);
  const [draft, setDraft] = useState<Draft>({});
  const [saved, setSaved] = useState(false);

  const session = PROGRAM.find((s) => s.id === sessionId) ?? PROGRAM[0];

  const advice = useMemo(() => {
    const out: Record<string, ReturnType<typeof suggestLoad>> = {};
    for (const ex of session.exercises) {
      out[ex.id] = suggestLoad(ex.id, data.loads[ex.id] ?? ex.defaultWeight, data.workouts);
    }
    return out;
  }, [session, data.loads, data.workouts]);

  // Rebuild the draft when the selected session changes (not on every keystroke).
  useEffect(() => {
    const next: Draft = {};
    for (const ex of session.exercises) {
      const weight = suggestLoad(ex.id, data.loads[ex.id] ?? ex.defaultWeight, data.workouts).weight;
      next[ex.id] = Array.from({ length: ex.sets }, () => ({ weight, reps: 0 }));
    }
    setDraft(next);
    setSaved(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  function setCell(exId: string, index: number, field: keyof SetEntry, value: string) {
    setDraft((prev) => {
      const sets = [...(prev[exId] ?? [])];
      const num = value === '' ? 0 : Number(value.replace(',', '.'));
      sets[index] = { ...sets[index], [field]: Number.isFinite(num) ? num : 0 };
      return { ...prev, [exId]: sets };
    });
  }

  const filledCount = Object.values(draft).reduce(
    (a, sets) => a + sets.filter((s) => s.reps > 0).length,
    0,
  );

  function saveSession() {
    const exercises = session.exercises
      .map((ex) => ({
        exerciseId: ex.id,
        sets: (draft[ex.id] ?? []).filter((s) => s.reps > 0),
      }))
      .filter((e) => e.sets.length > 0);
    if (exercises.length === 0) return;

    const date = todayKey(tz);
    update((d) => {
      const loads = { ...d.loads };
      for (const e of exercises) {
        const heaviest = Math.max(...e.sets.map((s) => s.weight));
        loads[e.exerciseId] = heaviest;
      }
      const current = d.daily[date] ?? { tasks: {} };
      return {
        ...d,
        loads,
        workouts: [{ id: uid(), date, sessionId: session.id, exercises }, ...d.workouts],
        daily: { ...d.daily, [date]: { ...current, tasks: { ...current.tasks, seance: true } } },
      };
    });
    setSaved(true);
  }

  const history = [...data.workouts].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 12);

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Séances</h1>
          <p className="sub">Rotation sur 5 séances · suggérée : {PROGRAM.find((s) => s.id === suggested)?.name}</p>
        </div>
      </header>

      <div className="session-pill">
        {PROGRAM.map((s) => (
          <button
            key={s.id}
            className="pill"
            data-on={s.id === sessionId}
            onClick={() => setSessionId(s.id)}
          >
            {s.name}
          </button>
        ))}
      </div>

      <section className="section">
        <h2 className="section-title">{session.focus}</h2>
        {session.exercises.map((ex) => {
          const sets = draft[ex.id] ?? [];
          const tip = advice[ex.id];
          const unitLabel = ex.unit === 'sec' ? 's' : 'kg';
          return (
            <div key={ex.id} className="ex">
              <div className="ex-head">
                <div>
                  <div className="ex-name">{ex.name}</div>
                  <div className="ex-meta">
                    {ex.sets} × {ex.repMin}–{ex.repMax}
                    {ex.unit === 'sec' ? ' s' : ' reps'} · repos {ex.restSec}s · RPE {ex.rpe}
                    {ex.note ? ` · ${ex.note}` : ''}
                  </div>
                </div>
                <div className="xp-chip mono">
                  {ex.unit === 'sec' ? '—' : `${data.loads[ex.id] ?? ex.defaultWeight} kg`}
                </div>
              </div>

              <div className="sets">
                <div className="lbl" />
                <div className="lbl">{ex.unit === 'sec' ? 'Lest (kg)' : 'Charge (kg)'}</div>
                <div className="lbl">{ex.unit === 'sec' ? 'Durée (s)' : 'Reps'}</div>
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

              {tip ? (
                <div className="hint">
                  {tip.reason}
                  {tip.raise ? ` · charge proposée ${tip.weight} ${unitLabel}` : ''}
                </div>
              ) : null}
            </div>
          );
        })}
      </section>

      <div className="section">
        <button className="btn btn-accent" onClick={saveSession} disabled={filledCount === 0}>
          {saved ? 'Séance enregistrée' : `Enregistrer la séance (${filledCount} séries)`}
        </button>
      </div>

      <section className="section">
        <h2 className="section-title">Historique</h2>
        {history.length === 0 ? (
          <div className="card empty">Aucune séance enregistrée pour le moment.</div>
        ) : (
          <div className="card">
            {history.map((w) => {
              const name = PROGRAM.find((s) => s.id === w.sessionId)?.name ?? w.sessionId;
              const volume = w.exercises.reduce(
                (a, e) => a + e.sets.reduce((b, s) => b + s.weight * s.reps, 0),
                0,
              );
              const top = w.exercises
                .map((e) => findExercise(e.exerciseId)?.name)
                .filter(Boolean)
                .slice(0, 2)
                .join(', ');
              return (
                <div key={w.id} className="rec">
                  <div>
                    <div className="ex-name">{name}</div>
                    <div className="ex-meta">
                      {formatDate(w.date)} · {w.exercises.length} exercices
                      {top ? ` · ${top}…` : ''}
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
