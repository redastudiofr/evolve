'use client';

import { useMemo, useState } from 'react';
import { useData } from '@/components/DataProvider';
import { formatDate, formatShort, todayKey, uid } from '@/lib/logic';
import type { Measurement } from '@/lib/types';

const METRICS = [
  { id: 'weightKg', label: 'Poids', unit: 'kg' },
  { id: 'armCm', label: 'Bras', unit: 'cm' },
  { id: 'chestCm', label: 'Poitrine', unit: 'cm' },
  { id: 'waistCm', label: 'Taille', unit: 'cm' },
  { id: 'thighCm', label: 'Cuisse', unit: 'cm' },
] as const;

type MetricId = (typeof METRICS)[number]['id'];

export default function ProgressionPage() {
  const { data, update } = useData();
  const tz = data.settings.timezone;
  const [metric, setMetric] = useState<MetricId>('weightKg');
  const [form, setForm] = useState<Record<string, string>>({ date: todayKey(tz) });

  const sorted = useMemo(
    () => [...data.measurements].sort((a, b) => (a.date < b.date ? -1 : 1)),
    [data.measurements],
  );

  const points = useMemo(
    () =>
      sorted
        .map((m) => ({ date: m.date, value: m[metric] }))
        .filter((p): p is { date: string; value: number } => typeof p.value === 'number'),
    [sorted, metric],
  );

  const current = METRICS.find((m) => m.id === metric)!;
  const first = points[0]?.value;
  const last = points[points.length - 1]?.value;
  const delta = first !== undefined && last !== undefined ? last - first : null;

  function addEntry() {
    const entry: Measurement = { id: uid(), date: form.date || todayKey(tz) };
    let any = false;
    for (const m of METRICS) {
      const raw = form[m.id];
      if (raw && raw.trim() !== '') {
        const num = Number(raw.replace(',', '.'));
        if (Number.isFinite(num)) {
          entry[m.id] = num;
          any = true;
        }
      }
    }
    if (!any) return;
    update((d) => ({
      ...d,
      measurements: [...d.measurements.filter((x) => x.date !== entry.date), entry],
      settings: entry.weightKg
        ? { ...d.settings, profile: { ...d.settings.profile, weightKg: entry.weightKg } }
        : d.settings,
    }));
    setForm({ date: todayKey(tz) });
  }

  function remove(id: string) {
    update((d) => ({ ...d, measurements: d.measurements.filter((m) => m.id !== id) }));
  }

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Progression</h1>
          <p className="sub">Poids et mensurations dans le temps</p>
        </div>
      </header>

      <div className="session-pill">
        {METRICS.map((m) => (
          <button key={m.id} className="pill" data-on={m.id === metric} onClick={() => setMetric(m.id)}>
            {m.label}
          </button>
        ))}
      </div>

      <section className="section">
        <div className="card">
          <div className="row">
            <div>
              <div className="level-name mono">
                {last !== undefined ? `${last} ${current.unit}` : '—'}
              </div>
              <div className="ex-meta">
                {points.length} relevé{points.length > 1 ? 's' : ''} · {current.label.toLowerCase()}
              </div>
            </div>
            {delta !== null ? (
              <div className="rec-val">
                <b className="mono" style={{ color: 'var(--accent)' }}>
                  {delta > 0 ? '+' : ''}
                  {Math.round(delta * 10) / 10} {current.unit}
                </b>
                <div className="ex-meta">depuis le début</div>
              </div>
            ) : null}
          </div>
          <Chart points={points} unit={current.unit} />
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Nouveau relevé</h2>
        <div className="card">
          <label className="field">
            <span>Date</span>
            <input
              className="input"
              type="date"
              value={form.date ?? ''}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </label>
          <div className="grid-2">
            {METRICS.map((m) => (
              <label key={m.id} className="field">
                <span>
                  {m.label} ({m.unit})
                </span>
                <input
                  className="input"
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  placeholder="—"
                  value={form[m.id] ?? ''}
                  onChange={(e) => setForm({ ...form, [m.id]: e.target.value })}
                />
              </label>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <button className="btn btn-accent" onClick={addEntry}>
              Enregistrer le relevé
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Historique</h2>
        {sorted.length === 0 ? (
          <div className="card empty">Aucun relevé enregistré.</div>
        ) : (
          <div className="card">
            {[...sorted].reverse().map((m) => (
              <div key={m.id} className="rec">
                <div>
                  <div className="ex-name">{formatDate(m.date)}</div>
                  <div className="ex-meta">
                    {METRICS.filter((x) => typeof m[x.id] === 'number')
                      .map((x) => `${x.label} ${m[x.id]} ${x.unit}`)
                      .join(' · ') || 'Aucune valeur'}
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => remove(m.id)}>
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function Chart({ points, unit }: { points: { date: string; value: number }[]; unit: string }) {
  if (points.length < 2) {
    return <div className="empty">Au moins deux relevés sont nécessaires pour tracer la courbe.</div>;
  }
  const W = 320;
  const H = 150;
  const padX = 6;
  const padY = 18;
  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const x = (i: number) => padX + (i * (W - padX * 2)) / (points.length - 1);
  const y = (v: number) => padY + (1 - (v - min) / span) * (H - padY * 2);

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`).join(' ');
  const area = `${line} L${x(points.length - 1).toFixed(1)} ${H - padY} L${x(0).toFixed(1)} ${H - padY} Z`;

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img">
      <defs>
        <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2f6bff" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#2f6bff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#fill)" />
      <path d={line} fill="none" stroke="#2f6bff" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      {points.map((p, i) => (
        <circle key={p.date + i} cx={x(i)} cy={y(p.value)} r="2.6" fill="#2f6bff" />
      ))}
      <text x={padX} y={12} fill="#5d646f" fontSize="9">
        {max} {unit}
      </text>
      <text x={padX} y={H - 4} fill="#5d646f" fontSize="9">
        {min} {unit}
      </text>
      <text x={W - padX} y={H - 4} fill="#5d646f" fontSize="9" textAnchor="end">
        {formatShort(points[points.length - 1].date)}
      </text>
    </svg>
  );
}
