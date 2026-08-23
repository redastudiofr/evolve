'use client';

import { formatShort } from '@/lib/logic';
import type { Point } from '@/lib/xp';

/** Area + line chart used for every progression metric. */
export default function Curve({ points, suffix = '' }: { points: Point[]; suffix?: string }) {
  if (points.length < 2) {
    return (
      <div className="empty">
        Encore un peu de données et la courbe apparaît. Valide des objectifs aujourd&apos;hui.
      </div>
    );
  }

  const W = 320;
  const H = 160;
  const padX = 6;
  const padTop = 20;
  const padBottom = 20;

  const values = points.map((p) => p.value);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const min = rawMin === rawMax ? Math.max(0, rawMin - 1) : rawMin;
  const max = rawMin === rawMax ? rawMax + 1 : rawMax;
  const span = max - min || 1;

  const x = (i: number) => padX + (i * (W - padX * 2)) / (points.length - 1);
  const y = (v: number) => padTop + (1 - (v - min) / span) * (H - padTop - padBottom);

  const line = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`)
    .join(' ');
  const area = `${line} L${x(points.length - 1).toFixed(1)} ${H - padBottom} L${x(0).toFixed(1)} ${H - padBottom} Z`;
  const last = points[points.length - 1];

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img">
      <defs>
        <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3874dc" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#3874dc" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path d={area} fill="url(#curveFill)" />
      <path
        className="curve-line"
        d={line}
        fill="none"
        stroke="#3874dc"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={x(points.length - 1)} cy={y(last.value)} r="3.4" fill="#4d86ea" />

      <text x={padX} y={13} fill="#5b626d" fontSize="9">
        {Math.round(max)}
        {suffix}
      </text>
      <text x={padX} y={H - 5} fill="#5b626d" fontSize="9">
        {formatShort(points[0].date)}
      </text>
      <text x={W - padX} y={H - 5} fill="#5b626d" fontSize="9" textAnchor="end">
        {formatShort(last.date)}
      </text>
    </svg>
  );
}
