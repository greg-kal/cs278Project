'use client';
import { useApp } from '../lib/AppContext';
import { Avatar, AvatarStack } from './ui/Avatar';
import { Icon } from './ui/Icon';

const photoStyle = {
  warm: 'repeating-linear-gradient(135deg, oklch(83% 0.06 40) 0 8px, oklch(78% 0.08 40) 8px 16px)',
  green: 'repeating-linear-gradient(135deg, oklch(82% 0.05 150) 0 8px, oklch(78% 0.06 150) 8px 16px)',
  blue: 'repeating-linear-gradient(135deg, oklch(82% 0.05 230) 0 8px, oklch(78% 0.06 230) 8px 16px)',
};

export function EventRow({ event }) {
  const { navigate, joined, joinEvent, openModal, findUser, profile } = useApp();
  const host = findUser(event.hostId);
  const isJoined = joined.has(event.id);
  const goingUsers = event.goingIds.slice(0, 3).map(id => findUser(id));
  const moreCount = Math.max(0, event.goingIds.length - 3);
  const myId = profile?.id || 'alex';
  const totalGoing = event.goingIds.length + (isJoined && !event.goingIds.includes(myId) ? 1 : 0);

  const handleJoin = (e) => {
    e.stopPropagation();
    joinEvent(event.id);
    openModal('rsvpConfirm', { eventId: event.id });
  };

  return (
    <div
      onClick={() => navigate('eventDetail', { eventId: event.id })}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate('eventDetail', { eventId: event.id })}
      style={{
        width: '100%',
        background: 'var(--card)',
        border: '1px solid var(--hair)',
        borderRadius: 18,
        boxShadow: 'var(--e-1)',
        padding: 14,
        marginTop: 10,
        textAlign: 'left',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--ink-2)',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>
              {event.time}
            </span>
            {event.accent && (
              <span style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '2px 8px', borderRadius: 999,
                background: 'var(--accent-soft)',
                color: 'var(--accent-ink)',
                border: '1px solid color-mix(in oklab, var(--accent) 25%, transparent)',
                fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0,
              }}>
                {event.accent}
              </span>
            )}
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.2, marginTop: 4, color: 'var(--ink)' }}>
            {event.title}
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
            {host.name} · {event.place}
          </div>
          {event.description && (
            <div style={{
              fontSize: 13, color: 'var(--ink-2)', marginTop: 4, lineHeight: 1.4,
              overflow: 'hidden', display: '-webkit-box',
              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            }}>
              {event.description}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AvatarStack items={goingUsers} size={22} more={moreCount} />
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>{totalGoing} going</span>
            </div>
            {isJoined ? (
              <span style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '4px 12px', borderRadius: 999,
                background: 'var(--ink)', color: 'var(--paper)',
                border: '1px solid var(--ink)',
                fontSize: 12, fontWeight: 600,
              }}>✓ in</span>
            ) : (
              <button
                onClick={handleJoin}
                style={{
                  height: 32, padding: '0 14px', borderRadius: 999,
                  border: '1px solid var(--hair-2)', background: 'var(--card)',
                  fontWeight: 600, fontSize: 13, color: 'var(--ink)',
                  cursor: 'pointer',
                }}
              >
                Attend
              </button>
            )}
          </div>
        </div>
        {event.photo && (
          <div style={{
            width: 64, height: 64, flex: '0 0 64px',
            borderRadius: 14, overflow: 'hidden',
            background: photoStyle[event.photo],
          }} />
        )}
      </div>
    </div>
  );
}
