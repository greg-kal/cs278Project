'use client';
import { getUser, EVENTS } from '../../lib/data';
import { useApp } from '../../lib/AppContext';
import { StatusBar } from '../ui/StatusBar';
import { Avatar } from '../ui/Avatar';
import { Icon } from '../ui/Icon';

export function ProfileScreen({ params }) {
  const { goBack, favorites, toggleFavorite, navigate } = useApp();
  const user = getUser(params.userId);
  if (!user) return null;

  const isFav = favorites.has(user.id);

  const userEvents = EVENTS.filter(e =>
    e.goingIds.includes(user.id) || e.hostId === user.id
  );

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--paper)', display: 'flex', flexDirection: 'column' }}>
      <StatusBar />
      <div style={{ padding: '4px 18px 0', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
        <button onClick={goBack} style={ghostBtn}>
          <Icon name="back" size={20} />
        </button>
        <button style={ghostBtn}>
          <Icon name="more" size={20} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '12px 22px 100px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar ch={user.ch} tone={user.tone} size={72} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
              {user.name}
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>{user.handle} · 12 mutual</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button
                onClick={() => toggleFavorite(user.id)}
                style={{
                  height: 36, fontSize: 13, padding: '0 14px', borderRadius: 999,
                  border: isFav ? '1px solid var(--ink)' : '1px solid var(--hair-2)',
                  background: isFav ? 'var(--ink)' : 'var(--card)',
                  color: isFav ? 'var(--paper)' : 'var(--ink)',
                  fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                {isFav ? '★ Favorited' : '☆ Favorite'}
              </button>
              <button style={{
                height: 36, fontSize: 13, padding: '0 14px', borderRadius: 999,
                border: '1px solid var(--hair-2)', background: 'var(--card)',
                color: 'var(--ink)', fontWeight: 600, cursor: 'pointer',
              }}>
                Message
              </button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            going to · in your feed
          </div>
          {userEvents.length > 0 ? (
            userEvents.map(event => {
              const isHost = event.hostId === user.id;
              return (
                <button
                  key={event.id}
                  onClick={() => navigate('eventDetail', { eventId: event.id })}
                  style={{
                    width: '100%', background: 'var(--card)',
                    border: '1px solid var(--hair)', borderRadius: 18,
                    boxShadow: 'var(--e-1)', padding: 14, marginTop: 8,
                    textAlign: 'left', cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>{event.title}</div>
                    {isHost && (
                      <span style={{
                        padding: '2px 8px', borderRadius: 999,
                        background: 'var(--accent-soft)', color: 'var(--accent-ink)',
                        border: '1px solid color-mix(in oklab, var(--accent) 25%, transparent)',
                        fontSize: 10, fontWeight: 600,
                      }}>
                        hosting
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{event.time}</span>
                    {!isHost && <span> · by {getUser(event.hostId).name}</span>}
                  </div>
                </button>
              );
            })
          ) : (
            <div style={{ padding: '16px 0', fontSize: 13, color: 'var(--muted)' }}>
              No upcoming events in your feed.
            </div>
          )}

          <div style={{ marginTop: 18 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              1 hidden
            </div>
            <div style={{
              padding: '12px 14px', borderRadius: 14,
              border: '1px dashed var(--hair-2)', color: 'var(--muted)',
              fontSize: 13, marginTop: 6, lineHeight: 1.4,
            }}>
              {user.name.split(' ')[0]} is going to 1 event posted by people you don&apos;t follow. Follow them to see it.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ghostBtn = {
  width: 40, height: 40, padding: 0, borderRadius: 999,
  border: 0, background: 'transparent',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: 'var(--ink)',
};
