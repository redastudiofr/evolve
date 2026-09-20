export default function AppPreview() {
  return (
    <div className="app-preview" data-reveal>
      <div className="app-preview__phones">
        <div className="phone phone--back" aria-hidden="true">
          <div className="phone__screen">
            <span className="phone__label">Progression</span>
            <div className="phone__bars">
              {[30, 45, 40, 60, 55, 72, 68, 84].map((h, i) => (
                <span key={i} className="phone__bar" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>

        <div className="phone phone--front">
          <div className="phone__screen">
            <span className="phone__label">Aujourd&rsquo;hui</span>

            <div className="phone__ring">
              <svg viewBox="0 0 64 64" width="64" height="64">
                <circle cx="32" cy="32" r="27" fill="none" stroke="var(--border)" strokeWidth="6" />
                <circle
                  cx="32"
                  cy="32"
                  r="27"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="170"
                  strokeDashoffset="40"
                  transform="rotate(-90 32 32)"
                />
              </svg>
              <span className="phone__ring-value">78%</span>
            </div>

            <div className="phone__row">
              <span>Séance — Haut du corps</span>
              <span className="phone__check">✓</span>
            </div>
            <div className="phone__row">
              <span>Objectifs du jour</span>
              <span className="phone__muted">3/4</span>
            </div>
            <div className="phone__streak">12 jours consécutifs</div>
          </div>
        </div>
      </div>

      <p className="app-preview__note">Aperçu illustratif de l&rsquo;application — interface en cours de finalisation.</p>
    </div>
  );
}
