'use client';
import { useApp } from '../../lib/AppContext';
import { useAuth } from '../../lib/AuthContext';
import { StatusBar } from '../ui/StatusBar';
import { Avatar } from '../ui/Avatar';

const SETTINGS = [
  'Who can see your events',
  'Daily prompt time',
  'Notifications',
  'Sign out',
];

export function YouScreen() {
  const { joined, favorites, profile, events } = useApp();
  const { signOut } = useAuth();
  const me = profile || { name: '…', handle: '', ch: '?', tone: 'b1', id: null };
  const myEvents = events.filter(e => joined.has(e.id) || (me.id && e.hostId === me.id));

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--paper)', display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '4px 18px 100px' }}>
        {/* Profile header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, color: 'var(--ink)' }}>
              {me.name}
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              letterSpacing: '.08em', textTransform: 'uppercase',
              color: 'var(--muted)', marginTop: 2,
            }}>
              {me.handle}
            </div>
          </div>
          <Avatar ch={me.ch} tone={me.tone} size={56} />
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 14 }}>
          {[
            { n: 'Posted', v: events.filter(e => me.id && e.hostId === me.id).length },
            { n: 'Joined', v: joined.size },
            { n: '★ Favs', v: favorites.size },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'var(--card)', border: '1px solid var(--hair)',
              borderRadius: 14, boxShadow: 'var(--e-1)',
              padding: '12px 10px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>{s.v}</div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10,
                letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)',
              }}>{s.n}</div>
            </div>
          ))}
        </div>

        {/* Your week */}
        <div style={{ marginTop: 18 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            your week
          </div>
          {myEvents.length > 0 ? (
            myEvents.map(event => (
              <div key={event.id} style={{
                background: 'var(--card)', border: '1px solid var(--hair)',
                borderRadius: 14, boxShadow: 'var(--e-1)',
                padding: 14, marginTop: 6,
              }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>
                  {event.title} · {event.dateKey}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{event.time}</span>
                  {' · '}{joined.has(event.id) ? 'joined' : 'hosting'}
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '16px 0', fontSize: 13, color: 'var(--muted)' }}>
              No plans this week. Post something!
            </div>
          )}
        </div>

        {/* Settings */}
        <div style={{ marginTop: 18 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            settings
          </div>
          <div style={{
            background: 'var(--card)', border: '1px solid var(--hair)',
            borderRadius: 18, boxShadow: 'var(--e-1)', marginTop: 6,
          }}>
            {SETTINGS.map((r, i) => (
              <div
                key={i}
                onClick={r === 'Sign out' ? signOut : undefined}
                style={{
                  padding: '14px 16px',
                  borderTop: i ? '1px solid var(--hair)' : 'none',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  cursor: r === 'Sign out' ? 'pointer' : 'default',
                }}
              >
                <span style={{ fontSize: 14, color: r === 'Sign out' ? 'var(--accent-ink)' : 'var(--ink)' }}>{r}</span>
                <span style={{ color: 'var(--muted)', fontSize: 18 }}>›</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
