'use client';
import { useApp } from '../lib/AppContext';
import { Icon } from './ui/Icon';

const SUGGESTIONS = [
  { icon: '🏋', name: 'Gym',       time: '7p' },
  { icon: '🍽', name: 'Dinner',    time: '6:30p' },
  { icon: '📚', name: 'Study',     time: '2–4p' },
  { icon: '🌅', name: 'Other…',   time: '' },
];

export function DailyPromptCard() {
  const { promptDismissed, setPromptDismissed } = useApp();
  if (promptDismissed) return null;

  return (
    <div style={{ padding: '12px 16px 0' }}>
      <div style={{
        background: 'var(--ink)',
        color: 'var(--paper)',
        border: '1px solid var(--ink)',
        borderRadius: 18,
        boxShadow: 'var(--e-1)',
        padding: 16,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10, letterSpacing: '.08em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,.6)',
          }}>
            your turn
          </div>
          <button
            onClick={() => setPromptDismissed(true)}
            style={{
              width: 28, height: 28, padding: 0,
              borderRadius: 999, border: 0,
              background: 'transparent',
              color: 'rgba(255,255,255,.7)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <div style={{ fontSize: 18, fontWeight: 600, marginTop: 6, lineHeight: 1.3 }}>
          Doing any of these? Tap to post.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => setPromptDismissed(true)}
              style={{
                background: 'rgba(255,255,255,.08)',
                border: '1px solid rgba(255,255,255,.18)',
                borderRadius: 14,
                padding: 12,
                textAlign: 'left',
                color: 'var(--paper)',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: 18 }}>{s.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{s.name}</div>
              {s.time && (
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  opacity: 0.7,
                  marginTop: 2,
                }}>
                  {s.time}
                </div>
              )}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 12 }}>
          <span style={{ opacity: 0.6 }}>Once a day · dismiss to hide</span>
          <button
            onClick={() => setPromptDismissed(true)}
            style={{ background: 'transparent', border: 0, color: 'var(--paper)', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
