'use client';
import { getDayStrip } from '../../lib/data';
import { useApp } from '../../lib/AppContext';

export function DayStrip() {
  const { activeDayIndex, setActiveDayIndex } = useApp();
  const days = getDayStrip();

  return (
    <div style={{ display: 'flex', gap: 6, padding: '4px 16px 0' }}>
      {days.map((day, i) => {
        const on = i === activeDayIndex;
        return (
          <button
            key={i}
            onClick={() => setActiveDayIndex(i)}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '8px 0',
              borderRadius: 12,
              border: on ? '1px solid var(--ink)' : '1px solid transparent',
              background: on ? 'var(--ink)' : 'transparent',
              color: on ? 'var(--paper)' : 'var(--ink-2)',
              cursor: 'pointer',
            }}
          >
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              letterSpacing: '.08em',
              opacity: on ? 0.7 : 0.5,
              fontWeight: 600,
            }}>
              {day.dayName}
            </div>
            <div style={{ fontSize: 17, fontWeight: 600, marginTop: 2 }}>
              {day.dayNum}
            </div>
          </button>
        );
      })}
    </div>
  );
}
