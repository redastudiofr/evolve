'use client';

import { useMemo, useState } from 'react';
import { useData } from '@/components/DataProvider';
import { computeRecords, formatDate } from '@/lib/logic';
import { PROGRAM } from '@/lib/program';

export default function RecordsPage() {
  const { data } = useData();
  const [filter, setFilter] = useState<string>('all');

  const records = useMemo(() => computeRecords(data.workouts), [data.workouts]);
  const visible = useMemo(
    () =>
      filter === 'all'
        ? records
        : records.filter((r) => r.sessionName === PROGRAM.find((s) => s.id === filter)?.name),
    [records, filter],
  );

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Records</h1>
          <p className="sub">
            {records.length} exercice{records.length > 1 ? 's' : ''} suivi
            {records.length > 1 ? 's' : ''}
          </p>
        </div>
      </header>

      <div className="session-pill">
        <button className="pill" data-on={filter === 'all'} onClick={() => setFilter('all')}>
          Tous
        </button>
        {PROGRAM.map((s) => (
          <button key={s.id} className="pill" data-on={filter === s.id} onClick={() => setFilter(s.id)}>
            {s.name}
          </button>
        ))}
      </div>

      <section className="section">
        {visible.length === 0 ? (
          <div className="card empty">
            Aucun record pour l&apos;instant. Enregistre une séance pour commencer à les construire.
          </div>
        ) : (
          <div className="card">
            {visible.map((r) => {
              const gain = r.previous ? r.weight - r.previous.weight : null;
              return (
                <div key={r.exerciseId} className="rec">
                  <div style={{ minWidth: 0 }}>
                    <div className="ex-name">{r.name}</div>
                    <div className="ex-meta">
                      {r.sessionName} · {formatDate(r.date)}
                    </div>
                    {r.previous ? (
                      <div className="delta">
                        Précédent : {r.previous.weight} kg × {r.previous.reps} (
                        {formatDate(r.previous.date)})
                      </div>
                    ) : null}
                  </div>
                  <div className="rec-val">
                    <b className="mono">
                      {r.unit === 'sec' ? `${r.reps} s` : `${r.weight} kg`}
                    </b>
                    <div className="ex-meta mono">
                      {r.unit === 'sec' ? `${r.count} paliers` : `× ${r.reps} reps`}
                    </div>
                    {gain !== null && gain > 0 ? (
                      <div className="delta mono">+{Math.round(gain * 10) / 10} kg</div>
                    ) : null}
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
