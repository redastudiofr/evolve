'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useData } from '@/components/DataProvider';
import {
  MAX_DAY_XP,
  TASKS,
  currentStreak,
  dayXp,
  last7Rate,
  levelInfo,
  todayKey,
  todayPlan,
  totalXp,
  workoutOn,
} from '@/lib/logic';

function Check() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />
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

  const stats = useMemo(() => {
    const total = totalXp(data.daily);
    return {
      total,
      level: levelInfo(total),
      streak: currentStreak(data.daily, tz),
      today: dayXp(entry),
      week: last7Rate(data.daily, tz),
    };
  }, [data.daily, entry, tz]);

  const donePercent = Math.round((stats.today / MAX_DAY_XP) * 100);
  const openGoals = data.goals.filter((g) => !g.done).length;

  function toggle(taskId: string) {
    update((d) => {
      const current = d.daily[key] ?? { tasks: {} };
      const tasks = { ...current.tasks, [taskId]: !current.tasks[taskId] };
      return { ...d, daily: { ...d.daily, [key]: { ...current, tasks } } };
    });
  }

  const dateLabel = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: tz,
  }).format(new Date());

  return (
    <>
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
            <div className="level-name">{stats.level.current.name}</div>
            <div className="level-xp mono">{stats.total} XP au total</div>
          </div>
          <div className="level-xp mono">
            {stats.level.next ? `${stats.level.remaining} XP restants` : 'Niveau maximum'}
          </div>
        </div>
        <div className="bar">
          <i style={{ width: `${Math.round(stats.level.progress * 100)}%` }} />
        </div>
        {stats.level.next ? (
          <div className="level-xp mono" style={{ marginTop: 8 }}>
            Prochain niveau · {stats.level.next.name}
          </div>
        ) : null}
      </div>

      <div className="stat-row">
        <div className="stat">
          <b className="mono">{stats.streak}</b>
          <span>Jours d&apos;affilée</span>
        </div>
        <div className="stat">
          <b className="mono">{donePercent}%</b>
          <span>Réussite du jour</span>
        </div>
        <div className="stat">
          <b className="mono">{stats.week}%</b>
          <span>Sur 7 jours</span>
        </div>
      </div>

      {status === 'local' && pending ? (
        <div className="banner warn">
          Hors-ligne. Tout est enregistré sur l&apos;appareil et synchronisé au retour du réseau.
        </div>
      ) : null}
      {status === 'ready' && !durable ? (
        <div className="banner warn">
          Aucune base de données connectée : les données ne survivront pas à une réinstallation.
        </div>
      ) : null}

      <section className="section">
        <h2 className="section-title">Séance du jour</h2>
        <Link href="/semaine" className="card row">
          <div>
            <div className="ex-name">
              {plan.title}
              {logged ? ' · terminée' : ''}
            </div>
            <div className="ex-meta">
              {plan.rest
                ? plan.focus
                : `${plan.exercises.length} exercices · ${plan.focus}`}
            </div>
          </div>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5.5 15.5 12 9 18.5" />
          </svg>
        </Link>
      </section>

      {openGoals > 0 ? (
        <section className="section">
          <h2 className="section-title">Objectifs</h2>
          <Link href="/objectifs" className="card row">
            <div>
              <div className="ex-name">
                {openGoals} objectif{openGoals > 1 ? 's' : ''} en cours
              </div>
              <div className="ex-meta">Voir et mettre à jour</div>
            </div>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5.5 15.5 12 9 18.5" />
            </svg>
          </Link>
        </section>
      ) : null}

      <section className="section">
        <h2 className="section-title">
          Checklist · {stats.today} / {MAX_DAY_XP} XP
        </h2>
        {TASKS.map((task) => {
          const on = Boolean(entry?.tasks?.[task.id]);
          return (
            <button key={task.id} className="check" data-on={on} onClick={() => toggle(task.id)}>
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
    </>
  );
}
