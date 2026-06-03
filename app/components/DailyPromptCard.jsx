'use client';
import { useState, useEffect } from 'react';
import { useApp } from '../lib/AppContext';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { Icon } from './ui/Icon';

const DEFAULT_SUGGESTIONS = [
  { icon: '🍽', name: 'Dinner', startTime: '18:00' },
  { icon: '🏋', name: 'Gym', startTime: '19:00' },
  { icon: '📚', name: 'Study', startTime: '14:00' },
  { icon: '🌅', name: 'Other…', startTime: '' },
];

// Helper to format time for display (24h -> 12h format)
function formatTimeDisplay(time24) {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const suffix = h >= 12 ? 'p' : 'a';
  const hour12 = h % 12 || 12;
  return m === 0 ? `${hour12}${suffix}` : `${hour12}:${String(m).padStart(2, '0')}${suffix}`;
}

export function DailyPromptCard() {
  const { promptDismissed, setPromptDismissed, openModal } = useApp();
  const { session } = useAuth();
  const [usuals, setUsuals] = useState(DEFAULT_SUGGESTIONS);

  // Load usuals from database
  useEffect(() => {
    if (!supabase || !session?.user?.id) return;
    supabase
      .from('usuals')
      .select('*')
      .eq('user_id', session.user.id)
      .order('sort_order')
      .limit(4)
      .then(({ data }) => {
        if (data && data.length > 0) {
          // Map database fields to display format
          const mapped = data.map(u => ({
            icon: u.icon,
            name: u.name,
            startTime: u.start_time || '',
            place: u.place || '',
            visibility: u.visibility || 'open',
            duration: u.duration || '',
            note: u.note || '',
          }));
          // Add "Other..." option if we have less than 4
          if (mapped.length < 4) {
            mapped.push({ icon: '🌅', name: 'Other…', startTime: '' });
          }
          setUsuals(mapped.slice(0, 4));
        }
      });
  }, [session?.user?.id]);

  if (promptDismissed) return null;

  const handleUsualClick = (usual) => {
    if (usual.name === 'Other…') {
      openModal('addEvent');
    } else {
      openModal('addEvent', { prefill: usual });
    }
    setPromptDismissed(true);
  };

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
          {usuals.map((s, i) => (
            <button
              key={i}
              onClick={() => handleUsualClick(s)}
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
              {s.startTime && (
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  opacity: 0.7,
                  marginTop: 2,
                }}>
                  {formatTimeDisplay(s.startTime)}
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
