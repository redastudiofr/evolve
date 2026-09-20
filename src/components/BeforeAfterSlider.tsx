'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';

const DIRECTION_THRESHOLD = 6; // px of movement before we commit to a gesture direction

export default function BeforeAfterSlider({
  before,
  after,
  beforeLabel = 'Avant',
  afterLabel = 'Après',
}: {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [hinted, setHinted] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  // Gesture-direction lock: a touch/pointer down only starts a drag once we've
  // confirmed the movement is more horizontal than vertical, so a vertical swipe
  // that happens to start on the frame scrolls the page instead of being hijacked.
  const pointerIdRef = useRef<number | null>(null);
  const startRef = useRef({ x: 0, y: 0 });
  const lockedRef = useRef<'horizontal' | 'vertical' | null>(null);

  const updateFromClientX = useCallback((clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const ratio = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, ratio)));
  }, []);

  function onPointerDown(e: React.PointerEvent) {
    pointerIdRef.current = e.pointerId;
    startRef.current = { x: e.clientX, y: e.clientY };
    lockedRef.current = null;
    // Mouse/pen input has no ambiguous scroll direction — commit immediately.
    if (e.pointerType !== 'touch') {
      lockedRef.current = 'horizontal';
      setDragging(true);
      setHinted(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      updateFromClientX(e.clientX);
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    if (pointerIdRef.current !== e.pointerId) return;

    if (lockedRef.current === null) {
      const dx = e.clientX - startRef.current.x;
      const dy = e.clientY - startRef.current.y;
      if (Math.abs(dx) < DIRECTION_THRESHOLD && Math.abs(dy) < DIRECTION_THRESHOLD) {
        return; // not enough movement yet to know the intent
      }
      if (Math.abs(dx) > Math.abs(dy)) {
        lockedRef.current = 'horizontal';
        setDragging(true);
        setHinted(true);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      } else {
        // Vertical intent: let the browser handle page scroll, take ourselves out of the gesture.
        lockedRef.current = 'vertical';
        pointerIdRef.current = null;
        return;
      }
    }

    if (lockedRef.current === 'horizontal') {
      updateFromClientX(e.clientX);
    }
  }

  function onPointerUp() {
    pointerIdRef.current = null;
    lockedRef.current = null;
    setDragging(false);
  }

  return (
    <div
      className="ba-frame"
      ref={frameRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      data-hinted={hinted}
      data-dragging={dragging}
    >
      <div className="ba-layer">
        <Image src={after} alt={afterLabel} fill sizes="(max-width: 700px) 90vw, 480px" style={{ objectFit: 'cover' }} />
        <span className="ba-tag ba-tag--after">{afterLabel}</span>
      </div>

      <div className="ba-layer ba-layer--clip" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <Image src={before} alt={beforeLabel} fill sizes="(max-width: 700px) 90vw, 480px" style={{ objectFit: 'cover' }} />
        <span className="ba-tag ba-tag--before">{beforeLabel}</span>
      </div>

      <div className="ba-seam" style={{ left: `${position}%` }} aria-hidden="true" />

      <div
        className="ba-handle"
        style={{ left: `${position}%` }}
        role="slider"
        aria-label={`Comparer ${beforeLabel} et ${afterLabel}`}
        aria-valuenow={Math.round(position)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') setPosition((p) => Math.max(0, p - 5));
          if (e.key === 'ArrowRight') setPosition((p) => Math.min(100, p + 5));
        }}
      >
        <span className="ba-handle__grip">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M8 6 3 12l5 6M16 6l5 6-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      {!hinted ? (
        <div className="ba-hint">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M8 6 3 12l5 6M16 6l5 6-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Glisse pour comparer</span>
        </div>
      ) : null}
    </div>
  );
}
