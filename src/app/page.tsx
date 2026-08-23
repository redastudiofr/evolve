'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useData } from '@/components/DataProvider';
import Curve from '@/components/Curve';
import XpBurst from '@/components/XpBurst';
import { MAX_DAY_XP, TASKS, dayXp, todayKey, todayPlan, workoutOn } from '@/lib/logic';
import {
  METRICS,
  RANGES,
  categoryLabel,
  isDone,
  levelFromXp,
  objectivesForDate,
  series,
  streakOf,
  totalXpOf,
  xpOnDate,
  type MetricId,
  type RangeId,
} from '@/lib/xp';
import type { DailyEntry, Objective } from '@/lib/types';

function Check() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />
    </svg>
  );
}

function Flame() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round">
      <path d="M12 3s4.5 3.8 4.5 8a4.5 4.5 0 0 1-9 0c0-1.3.5-2.4 1.2-3.3.2 1.3.9 2.1 1.8 2.1 1.1 0 1.7-.9 1.5-2.3-.2-1.6-.6-3-1-4.5Z" />
      <path d="M6.5 13.6A6 6 0 0 0 12 21a6 6 0 0 0 5.5-7.4" />
    </svg>
  );
}

export default function TodayPage() {
  const { data, update, status, durable, pending } = useData();
  const tz = data.settings.timezone;
  const key = todayKey(tz);
  const entry = data.daily[key];
  const plan = todayPlan(tz);
  const logged = workoutOn(data.workouts, key);

  const [metric, setMetric] = useState<MetricId>('xpCumule');
  const [range, setRange] = useState<RangeId>('30j');
  const [burst, setBurst] = useState<{ id: number; amount: number; title: string } | null>(null);

  useEffect(() => {
    if (!burst) return;
    const t = setTimeout(() => setBurst(null), 1500);
    return () => clearTimeout(t);
  }, [burst]);

  const todays = useMemo(() => objectivesForDate(data.objectives, key), [data.objectives, key]);
  const doneCount = todays.filter((o) => isDone(entry, o.id)).length;

  const stats = useMemo(() => {
    const total = totalXpOf(data, dayXp);
    return {
      level: levelFromXp(total),
      streak: streakOf(data, tz, dayXp),
      today: xpOnDate(data, key, dayXp),
    };
  }, [data, tz, key]);

  const points = useMemo(
    () => series(data, tz, metric, range, dayXp),
    [data, tz, metric, range],
  );

  const suffix = metric === 'niveau' ? '' : metric === 'objectifs' ? '' : ' XP';

  function toggleObjective(o: Objective) {
    const current: DailyEntry = data.daily[key] ?? { tasks: {} };
    const done = current.objectives ?? [];
    const has = done.includes(o.id);
    update((d) => {
      const e: DailyEntry = d.daily[key] ?? { tasks: {} };
      const list = e.objectives ?? [];
      return {
        ...d,
        daily: {
          ...d.daily,
          [key]: {
            ...e,
            objectives: has ? list.filter((x) => x !== o.id) : [...list, o.id],
          },
        },
      };
    });
    if (!has) setBurst({ id: Date.now(), amount: o.xp, title: o.title });
  }

  function toggleTask(taskId: string) {
    update((d) => {
      const e: DailyEntry = d.daily[key] ?? { tasks: {} };
      const tasks: Record<string, boolean> = { ...e.tasks, [taskId]: !e.tasks[taskId] };
      return { ...d, daily: { ...d.daily, [key]: { ...e, tasks } } };
    });
  }

  function closeDay() {
    update((d) => {
      const e: DailyEntry = d.daily[key] ?? { tasks: {} };
      return { ...d, daily: { ...d.daily, [key]: { ...e, closed: !e.closed } } };
    });
  }

  const dateLabel = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: tz,
  }).format(new Date());

  const checklistXp = dayXp(entry);
  const dayRatio = Math.round((stats.today / (MAX_DAY_XP + todays.reduce((a, o) => a + o.xp, 0) || 1)) * 100);
  const unfinished = todays.filter((o) => !isDone(entry, o.id));

  return (
    <>
      {burst ? <XpBurst key={burst.id} amount={burst.amount} title={burst.title} /> : null}

      <header className="topbar">
        <div>
          <h1>Aujourd&apos;hui</h1>
          <p className="sub">{dateLabel}</p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="brand-mark" src="/icons/icon-192.png" alt="" width={34} height={34} />
      </header>

      <div className="level-card">
        <div className="row">
          <div>
            <div className="level-tag">Niveau</div>
            <div className="level-number mono">{stats.level.level}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="level-xp mono">
              {stats.level.intoLevel} / {stats.level.needed} XP
            </div>
            <div className="level-xp mono" style={{ opacity: 0.65 }}>
              {stats.level.total} XP au total
            </div>
          </div>
        </div>
        <div className="bar">
          <i style={{ width: `${Math.round(stats.level.progress * 100)}%` }} />
        </div>
      </div>

      <div className="stat-row">
        <div className="stat">
          <b className="mono streak-value">
            <Flame />
            {stats.streak}
          </b>
          <span>Jours d&apos;affilée</span>
        </div>
        <div className="stat">
          <b className="mono">
            {doneCount}/{todays.length}
          </b>
          <span>Objectifs du jour</span>
        </div>
        <div className="stat">
          <b className="mono">+{stats.today}</b>
          <span>XP aujourd&apos;hui</span>
        </div>
      </div>

      {status === 'local' && pending ? (
        <div className="banner warn">
          Hors-ligne. Tout est enregistré sur l&apos;appareil et synchronisé au retour du réseau.
        </div>
      ) : null}
      {status === 'ready' && !durable ? (
        <div className="banner warn">Aucune base de données connectée.</div>
      ) : null}

      <section className="section">
        <h2 className="section-title">Progression</h2>
        <div className="card">
          <div className="segmented">
            {METRICS.map((m) => (
              <button key={m.id} data-on={m.id === metric} onClick={() => setMetric(m.id)}>
                {m.label}
              </button>
            ))}
          </div>
          <Curve points={points} suffix={suffix} />
          <div className="pill-row" style={{ marginTop: 10 }}>
            {RANGES.map((r) => (
              <button
                key={r.id}
                className="pill"
                data-on={r.id === range}
                onClick={() => setRange(r.id)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="row" style={{ marginBottom: 10 }}>
          <h2 className="section-title" style={{ margin: 0 }}>
            Objectifs du jour
          </h2>
          <Link href="/objectifs" className="link-sm">
            Gérer
          </Link>
        </div>

        {todays.length === 0 ? (
          <div className="card empty">
            Aucun objectif prévu aujourd&apos;hui.{' '}
            <Link href="/objectifs" style={{ color: 'var(--accent-strong)' }}>
              En créer un
            </Link>
          </div>
        ) : (
          todays.map((o) => {
            const on = isDone(entry, o.id);
            return (
              <button key={o.id} className="check" data-on={on} onClick={() => toggleObjective(o)}>
                <span className="box">{on ? <Check /> : null}</span>
                <span className="check-main">
                  <span className="check-label">{o.title}</span>
                  <span className="check-hint">
                    {categoryLabel(o.category)}
                    {o.time ? ` · ${o.time}` : ''}
                  </span>
                </span>
                <span className="xp-chip">+{o.xp}</span>
              </button>
            );
          })
        )}
      </section>

      <section className="section">
        <h2 className="section-title">Séance du jour</h2>
        <Link href="/semaine" className="card row">
          <div>
            <div className="ex-name">
              {plan.title}
              {logged ? ' · terminée' : ''}
            </div>
            <div className="ex-meta">
              {plan.rest ? plan.focus : `${plan.exercises.length} exercices · ${plan.focus}`}
            </div>
          </div>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5.5 15.5 12 9 18.5" />
          </svg>
        </Link>
      </section>

      <section className="section">
        <h2 className="section-title">
          Discipline · {checklistXp} / {MAX_DAY_XP} XP
        </h2>
        {TASKS.map((task) => {
          const on = Boolean(entry?.tasks?.[task.id]);
          return (
            <button key={task.id} className="check" data-on={on} onClick={() => toggleTask(task.id)}>
              <span className="box">{on ? <Check /> : null}</span>
              <span className="check-main">
                <span className="check-label">{task.label}</span>
                <span className="check-hint">{task.hint}</span>
              </span>
              <span className="xp-chip">+{task.xp}</span>
            </button>
          );
        })}
      </section>

      <section className="section">
        <h2 className="section-title">Bilan du jour</h2>
        <div className="card">
          <div className="review-grid">
            <div>
              <b className="mono">
                {doneCount} / {todays.length}
              </b>
              <span>Objectifs</span>
            </div>
            <div>
              <b className="mono">+{stats.today}</b>
              <span>XP gagné</span>
            </div>
            <div>
              <b className="mono">{dayRatio}%</b>
              <span>Journée</span>
            </div>
          </div>

          {unfinished.length > 0 ? (
            <div className="hint" style={{ marginTop: 14 }}>
              Reste à faire : {unfinished.map((o) => o.title).join(', ')}
            </div>
          ) : (
            <div className="hint" style={{ marginTop: 14 }}>
              Tout est terminé pour aujourd&apos;hui.
            </div>
          )}

          <div style={{ marginTop: 14 }}>
            <button className={entry?.closed ? 'btn' : 'btn btn-accent'} onClick={closeDay}>
              {entry?.closed ? 'Journée terminée — rouvrir' : 'Terminer ma journée'}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
