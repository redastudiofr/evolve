'use client';

import { useMemo, useState } from 'react';
import { useData } from '@/components/DataProvider';
import { todayKey, uid } from '@/lib/logic';
import { CATEGORIES, DIFFICULTIES, categoryLabel, defaultXp } from '@/lib/xp';
import type { Category, Difficulty, Objective, Recurrence } from '@/lib/types';

const DAYS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

type Draft = {
  title: string;
  category: Category;
  difficulty: Difficulty;
  xp: string;
  time: string;
  recurrence: Recurrence;
  days: number[];
};

function emptyDraft(): Draft {
  return {
    title: '',
    category: 'personnel',
    difficulty: 'moyen',
    xp: String(defaultXp('moyen')),
    time: '',
    recurrence: 'daily',
    days: [1, 2, 3, 4, 5],
  };
}

export default function ObjectivesPage() {
  const { data, update } = useData();
  const tz = data.settings.timezone;
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | Category>('all');

  const active = useMemo(
    () => data.objectives.filter((o) => !o.archived),
    [data.objectives],
  );
  const visible = filter === 'all' ? active : active.filter((o) => o.category === filter);
  const archived = data.objectives.filter((o) => o.archived);

  function startCreate() {
    setDraft(emptyDraft());
    setEditing(null);
    setOpen(true);
  }

  function startEdit(o: Objective) {
    setDraft({
      title: o.title,
      category: o.category,
      difficulty: o.difficulty,
      xp: String(o.xp),
      time: o.time ?? '',
      recurrence: o.recurrence,
      days: o.days ?? [1, 2, 3, 4, 5],
    });
    setEditing(o.id);
    setOpen(true);
  }

  function save() {
    if (draft.title.trim() === '') return;
    const parsed = Number(draft.xp);
    const xp = Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : defaultXp(draft.difficulty);
    const base = {
      title: draft.title.trim(),
      category: draft.category,
      difficulty: draft.difficulty,
      xp,
      time: draft.time || undefined,
      recurrence: draft.recurrence,
      days: draft.recurrence === 'weekdays' ? draft.days : undefined,
      date: draft.recurrence === 'once' ? todayKey(tz) : undefined,
    };

    update((d) => {
      if (editing) {
        return {
          ...d,
          objectives: d.objectives.map((o) => (o.id === editing ? { ...o, ...base } : o)),
        };
      }
      const created: Objective = {
        id: uid(),
        createdAt: todayKey(tz),
        archived: false,
        ...base,
      };
      return { ...d, objectives: [created, ...d.objectives] };
    });

    setOpen(false);
    setEditing(null);
    setDraft(emptyDraft());
  }

  function archive(id: string, value: boolean) {
    update((d) => ({
      ...d,
      objectives: d.objectives.map((o) => (o.id === id ? { ...o, archived: value } : o)),
    }));
  }

  function remove(id: string) {
    update((d) => ({ ...d, objectives: d.objectives.filter((o) => o.id !== id) }));
  }

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Objectifs</h1>
          <p className="sub">
            {active.length} actif{active.length > 1 ? 's' : ''}
            {archived.length > 0 ? ` · ${archived.length} archivé${archived.length > 1 ? 's' : ''}` : ''}
          </p>
        </div>
      </header>

      {open ? (
        <section className="section">
          <div className="card">
            <label className="field">
              <span>Objectif</span>
              <input
                className="input"
                placeholder="Ex. Travailler 2 h sur mon entreprise"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </label>

            <div className="field">
              <span>Catégorie</span>
              <div className="chip-grid">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    className="chip"
                    data-on={draft.category === c.id}
                    onClick={() => setDraft({ ...draft, category: c.id })}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <span>Difficulté</span>
              <div className="segmented">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.id}
                    data-on={draft.difficulty === d.id}
                    onClick={() =>
                      setDraft({ ...draft, difficulty: d.id, xp: String(d.xp) })
                    }
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid-2">
              <label className="field">
                <span>Récompense XP</span>
                <input
                  className="input"
                  type="number"
                  inputMode="numeric"
                  value={draft.xp}
                  onChange={(e) => setDraft({ ...draft, xp: e.target.value })}
                />
              </label>
              <label className="field">
                <span>Heure (facultatif)</span>
                <input
                  className="input"
                  type="time"
                  value={draft.time}
                  onChange={(e) => setDraft({ ...draft, time: e.target.value })}
                />
              </label>
            </div>

            <div className="field">
              <span>Récurrence</span>
              <div className="segmented">
                <button
                  data-on={draft.recurrence === 'daily'}
                  onClick={() => setDraft({ ...draft, recurrence: 'daily' })}
                >
                  Chaque jour
                </button>
                <button
                  data-on={draft.recurrence === 'weekdays'}
                  onClick={() => setDraft({ ...draft, recurrence: 'weekdays' })}
                >
                  Certains jours
                </button>
                <button
                  data-on={draft.recurrence === 'once'}
                  onClick={() => setDraft({ ...draft, recurrence: 'once' })}
                >
                  Une fois
                </button>
              </div>
            </div>

            {draft.recurrence === 'weekdays' ? (
              <div className="field">
                <span>Jours</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {DAYS.map((label, i) => {
                    const on = draft.days.includes(i);
                    return (
                      <button
                        key={i}
                        className="pill"
                        data-on={on}
                        style={{ flex: 1, textAlign: 'center', padding: '9px 0' }}
                        onClick={() =>
                          setDraft({
                            ...draft,
                            days: on
                              ? draft.days.filter((x) => x !== i)
                              : [...draft.days, i].sort(),
                          })
                        }
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="grid-2" style={{ marginTop: 14 }}>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setOpen(false);
                  setEditing(null);
                }}
              >
                Annuler
              </button>
              <button className="btn btn-accent" onClick={save} disabled={draft.title.trim() === ''}>
                {editing ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="section">
          <button className="btn btn-accent" onClick={startCreate}>
            Nouvel objectif
          </button>
        </section>
      )}

      <div className="pill-row">
        <button className="pill" data-on={filter === 'all'} onClick={() => setFilter('all')}>
          Tous
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className="pill"
            data-on={filter === c.id}
            onClick={() => setFilter(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <section className="section">
        {visible.length === 0 ? (
          <div className="card empty">
            Aucun objectif ici. Crée ce que tu veux accomplir — sport, travail, études, ou autre.
          </div>
        ) : (
          visible.map((o) => (
            <div key={o.id} className="goal">
              <div className="row">
                <div style={{ minWidth: 0 }}>
                  <div className="goal-title">{o.title}</div>
                  <div className="goal-detail">
                    {categoryLabel(o.category)} · {o.xp} XP ·{' '}
                    {o.recurrence === 'daily'
                      ? 'chaque jour'
                      : o.recurrence === 'weekdays'
                        ? (o.days ?? []).map((d) => DAYS[d]).join(' ')
                        : 'une fois'}
                    {o.time ? ` · ${o.time}` : ''}
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => startEdit(o)}>
                  Modifier
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => archive(o.id, true)}>
                  Archiver
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => remove(o.id)}>
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {archived.length > 0 ? (
        <section className="section">
          <h2 className="section-title">Archivés</h2>
          {archived.map((o) => (
            <div key={o.id} className="goal" data-done="true">
              <div className="row">
                <div style={{ minWidth: 0 }}>
                  <div className="goal-title">{o.title}</div>
                  <div className="goal-detail">{categoryLabel(o.category)}</div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => archive(o.id, false)}>
                  Réactiver
                </button>
              </div>
            </div>
          ))}
        </section>
      ) : null}
    </>
  );
}
