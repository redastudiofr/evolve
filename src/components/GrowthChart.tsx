'use client';

import { useEffect, useRef, useState } from 'react';

// Illustrative, fictional series — deliberately unitless (no currency, no dates).
// Crosses zero on purpose to show that progress isn't a straight line.
const DATA = [-8, -22, -6, 10, -12, 18, 42, 30, 58, 48, 78, 65, 96, 120];

const WIDTH = 640;
const HEIGHT = 260;
const PAD_X = 16;
const PAD_Y = 24;

export default function GrowthChart() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const min = Math.min(...DATA, 0);
  const max = Math.max(...DATA, 0);
  const range = max - min || 1;
  const stepX = (WIDTH - PAD_X * 2) / (DATA.length - 1);
  const yFor = (v: number) => HEIGHT - PAD_Y - ((v - min) / range) * (HEIGHT - PAD_Y * 2);
  const points = DATA.map((v, i) => [PAD_X + i * stepX, yFor(v)] as const);
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const zeroY = yFor(0);
  const last = points[points.length - 1];

  return (
    <div className="growth-chart" ref={ref} data-visible={visible}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="growth-chart__svg" preserveAspectRatio="none" aria-hidden="true">
        <line x1={PAD_X} y1={zeroY} x2={WIDTH - PAD_X} y2={zeroY} className="growth-chart__zero" />
        <path d={path} className="growth-chart__path" pathLength={1} />
        <circle cx={last[0]} cy={last[1]} r="5" className="growth-chart__dot" style={{ offsetPath: `path('${path}')` } as React.CSSProperties} />
      </svg>
      <div className="growth-chart__axis">
        <span>+</span>
        <span className="growth-chart__axis-zero">0</span>
        <span>&minus;</span>
      </div>
    </div>
  );
}
