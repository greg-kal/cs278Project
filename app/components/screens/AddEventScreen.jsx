'use client';
import { useState } from 'react';
import { USUALS } from '../../lib/data';
import { useApp } from '../../lib/AppContext';
import { StatusBar } from '../ui/StatusBar';
import { Icon } from '../ui/Icon';

export function AddEventScreen({ onClose }) {
  const [view, setView] = useState('usuals'); // 'usuals' | 'form'
  const [formData, setFormData] = useState({
    title: '', when: 'today', startTime: '6:30 PM', duration: '~ 1h 30m',
    place: '', visibility: 'open', note: '',
  });

  if (view === 'form') {
    return <AddForm formData={formData} setFormData={setFormData} onClose={onClose} onBack={() => setView('usuals')} />;
  }

  return <UsualsScreen onClose={onClose} onSelectUsual={(u) => { setFormData(f => ({ ...f, title: u.name })); setView('form'); }} onScratch={() => setView('form')} />;
}

function UsualsScreen({ onClose, onSelectUsual, onScratch }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--paper)', display: 'flex', flexDirection: 'column' }}>
      <StatusBar />
      <div style={{ padding: '4px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <button onClick={onClose} style={ghostTextBtn}>Cancel</button>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>Add event</div>
        <span style={{ width: 60 }} />
      </div>

      <div style={{ padding: '14px 18px 0', flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, lineHeight: 1.05, color: 'var(--ink)' }}>
          What's the move?
        </div>
        <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 4 }}>
          Pick something you usually do, or start fresh.
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '14px 18px 100px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)',
        }}>
          your usuals
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          {USUALS.map((u, i) => (
            <button
              key={i}
              onClick={() => onSelectUsual(u)}
              style={{
                background: 'var(--card)', border: '1px solid var(--hair)',
                borderRadius: 18, boxShadow: 'var(--e-1)',
                padding: '12px 14px',
                display: 'flex', alignItems: 'center', gap: 12,
                textAlign: 'left', cursor: 'pointer', width: '100%',
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'var(--soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18,
              }}>
                {u.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{u.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{u.sub}</div>
              </div>
              <span style={{ color: 'var(--muted)', fontSize: 18 }}>›</span>
            </button>
          ))}
        </div>
        <button
          onClick={onScratch}
          style={{
            width: '100%', marginTop: 14, height: 48,
            borderRadius: 999, border: '1px solid var(--hair-2)',
            background: 'var(--card)', fontWeight: 600, fontSize: 15,
            color: 'var(--ink)', cursor: 'pointer',
          }}
        >
          + Start from scratch
        </button>
      </div>
    </div>
  );
}

function AddForm({ formData, setFormData, onClose, onBack }) {
  const set = (k, v) => setFormData(f => ({ ...f, [k]: v }));

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--paper)', display: 'flex', flexDirection: 'column' }}>
      <StatusBar />
      <div style={{ padding: '4px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <button onClick={onBack} style={ghostTextBtn}>Cancel</button>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>New event</div>
        <button onClick={onClose} style={{ background: 'var(--ink)', color: 'var(--paper)', border: 0, padding: '0 16px', borderRadius: 999, height: 36, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Post</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '14px 18px 40px' }}>
        <Label>what</Label>
        <input
          value={formData.title}
          onChange={e => set('title', e.target.value)}
          placeholder="Dinner, gym, study sesh…"
          style={inputStyle}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          {['🍽 Dinner','🏋 Gym','📚 Study','🌅 Brunch','🎬 Movie'].map((t, i) => (
            <button
              key={i}
              onClick={() => set('title', t.split(' ')[1])}
              style={pillBtn}
            >
              {t}
            </button>
          ))}
        </div>

        <Label style={{ marginTop: 18 }}>when</Label>
        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          {['Today','Tomorrow','Pick…'].map((w, i) => (
            <button
              key={i}
              onClick={() => set('when', w.toLowerCase())}
              style={{
                ...pillBtn,
                background: formData.when === w.toLowerCase() ? 'var(--ink)' : 'var(--card)',
                color: formData.when === w.toLowerCase() ? 'var(--paper)' : 'var(--ink)',
                border: `1px solid ${formData.when === w.toLowerCase() ? 'var(--ink)' : 'var(--hair-2)'}`,
              }}
            >
              {w}
            </button>
          ))}
        </div>
        <div style={{
          background: 'var(--card)', border: '1px solid var(--hair)',
          borderRadius: 18, boxShadow: 'var(--e-1)',
          padding: '14px 16px', marginTop: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>Starts</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 600, color: 'var(--ink)' }}>
              {formData.startTime}
            </div>
          </div>
          <div style={{ width: 1, height: 40, background: 'var(--hair)' }} />
          <div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>Duration <span style={{ fontSize: 11 }}>(opt)</span></div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 600, color: 'var(--ink)' }}>
              {formData.duration}
            </div>
          </div>
        </div>

        <Label style={{ marginTop: 18 }}>where <span style={{ textTransform: 'none', letterSpacing: 0, fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 400 }}>(optional)</span></Label>
        <div style={{
          background: 'var(--card)', border: '1px solid var(--hair)',
          borderRadius: 18, boxShadow: 'var(--e-1)',
          padding: '12px 14px', marginTop: 6,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Icon name="pin" size={20} color="var(--muted)" />
          <input
            value={formData.place}
            onChange={e => set('place', e.target.value)}
            placeholder="Add a place…"
            style={{ background: 'transparent', border: 0, fontSize: 15, color: 'var(--ink)', flex: 1, outline: 'none', fontFamily: 'var(--font-ui)' }}
          />
        </div>

        <Label style={{ marginTop: 18 }}>who can join</Label>
        <div style={{
          background: 'var(--card)', border: '1px solid var(--hair)',
          borderRadius: 18, boxShadow: 'var(--e-1)',
          padding: 4, marginTop: 6,
        }}>
          {[
            { value: 'open', label: 'Open · everyone', sub: 'Anyone in your network can see + join' },
            { value: 'favorites', label: 'Favorites only', sub: 'Just people you ★' },
            { value: 'pick', label: 'Pick people', sub: 'Specific friends' },
          ].map((o, i) => (
            <button
              key={o.value}
              onClick={() => set('visibility', o.value)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 12px',
                borderTop: i ? '1px solid var(--hair)' : 'none',
                background: 'transparent', border: 0, width: '100%', textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: 999,
                border: '1.5px solid var(--hair-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {formData.visibility === o.value && (
                  <div style={{ width: 10, height: 10, borderRadius: 999, background: 'var(--ink)' }} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{o.label}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{o.sub}</div>
              </div>
            </button>
          ))}
        </div>

        <Label style={{ marginTop: 18 }}>say more <span style={{ textTransform: 'none', letterSpacing: 0, fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 400 }}>(optional)</span></Label>
        <textarea
          value={formData.note}
          onChange={e => set('note', e.target.value)}
          rows={3}
          placeholder="Long table by the window. Bringing cards."
          style={{ ...inputStyle, resize: 'none', marginTop: 6 }}
        />
      </div>
    </div>
  );
}

function Label({ children, style }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)', fontSize: 10,
      letterSpacing: '.08em', textTransform: 'uppercase',
      color: 'var(--muted)', ...style,
    }}>
      {children}
    </div>
  );
}

const ghostTextBtn = {
  background: 'transparent', border: 0,
  fontSize: 14, fontWeight: 600, color: 'var(--muted)',
  cursor: 'pointer', padding: '6px 0',
};
const inputStyle = {
  background: 'var(--card)', border: '1px solid var(--hair-2)',
  borderRadius: 12, padding: '12px 14px',
  fontSize: 15, color: 'var(--ink)', width: '100%',
  fontFamily: 'var(--font-ui)', outline: 'none', marginTop: 6,
  boxSizing: 'border-box',
};
const pillBtn = {
  padding: '6px 12px', borderRadius: 999,
  border: '1px solid var(--hair-2)', background: 'var(--card)',
  fontSize: 13, color: 'var(--ink)', cursor: 'pointer',
};
