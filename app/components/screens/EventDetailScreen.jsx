'use client';
import { getEvent, getUser } from '../../lib/data';
import { useApp } from '../../lib/AppContext';
import { StatusBar } from '../ui/StatusBar';
import { Avatar, AvatarStack } from '../ui/Avatar';
import { Icon } from '../ui/Icon';

const photoStyle = {
  warm: 'repeating-linear-gradient(135deg, oklch(83% 0.06 40) 0 8px, oklch(78% 0.08 40) 8px 16px)',
  green: 'repeating-linear-gradient(135deg, oklch(82% 0.05 150) 0 8px, oklch(78% 0.06 150) 8px 16px)',
  blue: 'repeating-linear-gradient(135deg, oklch(82% 0.05 230) 0 8px, oklch(78% 0.06 230) 8px 16px)',
};

export function EventDetailScreen({ params }) {
  const { goBack, navigate, joined, joinEvent, leaveEvent, openModal } = useApp();
  const event = getEvent(params.eventId);
  if (!event) return null;

  const host = getUser(event.hostId);
  const isJoined = joined.has(event.id);
  const goingUsers = event.goingIds.map(getUser);
  const displayUsers = goingUsers.slice(0, 6);
  const extraCount = Math.max(0, goingUsers.length - 6);
  const totalGoing = event.goingIds.length + (isJoined && !event.goingIds.includes('alex') ? 1 : 0);

  const dateStr = event.endTime
    ? `${event.dateLabel?.toUpperCase()} · ${event.time} – ${event.endTime}`
    : `${event.dateLabel?.toUpperCase()} · ${event.time}`;

  const handleJoin = () => {
    joinEvent(event.id);
    openModal('rsvpConfirm', { eventId: event.id });
  };

  const handleLeave = () => leaveEvent(event.id);

  if (event.photo) {
    return <DetailWithPhoto event={event} host={host} isJoined={isJoined} displayUsers={displayUsers}
      extraCount={extraCount} totalGoing={totalGoing} dateStr={dateStr}
      onBack={goBack} onJoin={handleJoin} onLeave={handleLeave}
      onComments={() => navigate('comments', { eventId: event.id })} />;
  }

  return <DetailNoPhoto event={event} host={host} isJoined={isJoined} displayUsers={displayUsers}
    extraCount={extraCount} totalGoing={totalGoing} dateStr={dateStr}
    onBack={goBack} onJoin={handleJoin} onLeave={handleLeave}
    onComments={() => navigate('comments', { eventId: event.id })} />;
}

function DetailWithPhoto({ event, host, isJoined, displayUsers, extraCount, totalGoing, dateStr, onBack, onJoin, onLeave, onComments }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--paper)', overflow: 'hidden' }}>
      {/* Photo hero */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 340,
        background: photoStyle[event.photo],
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, transparent 50%, var(--paper) 100%)',
        }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
          <StatusBar light />
        </div>
        <div style={{ position: 'absolute', top: 50, left: 18, right: 18, display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={onBack} style={ghostBtnStyle}>
            <Icon name="back" size={20} />
          </button>
          <button style={ghostBtnStyle}>
            <Icon name="more" size={20} />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{
        position: 'absolute', top: 260, left: 0, right: 0, bottom: 0,
        overflowY: 'auto', scrollbarWidth: 'none',
        padding: '0 20px 120px',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11,
          color: 'var(--accent-ink)', fontWeight: 600, letterSpacing: '.06em',
        }}>
          {dateStr}
        </div>
        <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.1, marginTop: 6, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
          {event.title}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
          <Avatar ch={host.ch} tone={host.tone} size={36} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{host.name} posted</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Open invite · 2h ago</div>
          </div>
          <button style={{
            marginLeft: 'auto', height: 32, fontSize: 13, padding: '0 12px',
            borderRadius: 999, border: '1px solid var(--hair-2)', background: 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink)',
          }}>
            <Icon name="star" size={16} />
            Favorite
          </button>
        </div>

        <LocationDurationCard event={event} />

        {/* Attendees */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            {totalGoing} going
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {displayUsers.map((u, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <Avatar ch={u.ch} tone={u.tone} size={36} />
              <span style={{ fontSize: 10, color: 'var(--muted)' }}>{u.name.split(' ')[0]}</span>
            </div>
          ))}
          {extraCount > 0 && (
            <div style={{
              width: 36, height: 36, borderRadius: 999,
              background: 'var(--soft)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, color: 'var(--muted)', fontWeight: 600,
            }}>+{extraCount}</div>
          )}
        </div>

        {event.description && (
          <div style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5, marginTop: 16 }}>
            {event.description}
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '12px 16px 28px',
        background: 'linear-gradient(180deg, transparent 0%, var(--paper) 30%)',
      }}>
        <div style={{ display: 'flex', gap: 10 }}>
          {isJoined ? (
            <button onClick={onLeave} style={{ ...primaryBtnStyle, flex: 1, height: 52, fontSize: 16, background: 'var(--soft)', color: 'var(--ink)', border: '1px solid var(--hair-2)' }}>
              ✓ You're in · Leave
            </button>
          ) : (
            <button onClick={onJoin} style={{ ...primaryBtnStyle, flex: 1, height: 52, fontSize: 16 }}>
              I'm in
            </button>
          )}
          <button style={{ ...secondaryBtnStyle, height: 52, padding: '0 18px' }}>Maybe</button>
          <button onClick={onComments} style={{ ...ghostBtnSquareStyle, width: 52, height: 52 }}>
            <Icon name="comment" size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailNoPhoto({ event, host, isJoined, displayUsers, extraCount, totalGoing, dateStr, onBack, onJoin, onLeave, onComments }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--paper)', display: 'flex', flexDirection: 'column' }}>
      <StatusBar />
      <div style={{ padding: '4px 18px 0', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
        <button onClick={onBack} style={{ ...ghostBtnStyle, border: 'none' }}>
          <Icon name="back" size={20} />
        </button>
        <button style={{ ...ghostBtnStyle, border: 'none' }}>
          <Icon name="more" size={20} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '10px 22px 120px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-ink)', fontWeight: 600, letterSpacing: '.06em' }}>
          {dateStr}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 46, lineHeight: 0.95, fontWeight: 700, marginTop: 8, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
          {event.title}.
        </div>
        {event.description && (
          <div style={{ fontSize: 16, color: 'var(--muted)', marginTop: 10, lineHeight: 1.45 }}>
            {event.description}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 18 }}>
          <Avatar ch={host.ch} tone={host.tone} size={32} />
          <span style={{ fontSize: 14, color: 'var(--ink)' }}><b>{host.name}</b> · 2h ago</span>
        </div>

        <div style={{ height: 1, background: 'var(--hair)', margin: '18px 0' }} />

        <LocationDurationCard event={event} />

        <div style={{ height: 1, background: 'var(--hair)', margin: '14px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            {totalGoing} going
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
          <AvatarStack items={displayUsers} size={32} more={extraCount} />
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '12px 16px 28px',
        background: 'var(--paper)',
        borderTop: '1px solid var(--hair)',
      }}>
        <div style={{ display: 'flex', gap: 10 }}>
          {isJoined ? (
            <button onClick={onLeave} style={{ ...primaryBtnStyle, flex: 1, height: 52, fontSize: 16, background: 'var(--soft)', color: 'var(--ink)', border: '1px solid var(--hair-2)' }}>
              ✓ You're in · Leave
            </button>
          ) : (
            <button onClick={onJoin} style={{ ...primaryBtnStyle, flex: 1, height: 52, fontSize: 16 }}>
              I'm in
            </button>
          )}
          <button style={{ ...secondaryBtnStyle, height: 52, padding: '0 18px' }}>Maybe</button>
          <button onClick={onComments} style={{ ...ghostBtnSquareStyle, width: 52, height: 52 }}>
            <Icon name="comment" size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}

function LocationDurationCard({ event }) {
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--hair)',
      borderRadius: 18, boxShadow: 'var(--e-1)',
      padding: '14px 16px', marginTop: 14, display: 'flex', gap: 12,
    }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Icon name="pin" size={20} color="var(--muted)" />
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{event.place}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{event.placeAddress}</div>
        </div>
      </div>
      {event.duration && (
        <>
          <div style={{ width: 1, background: 'var(--hair)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="clock" size={20} color="var(--muted)" />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{event.duration}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{event.durationNote}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const primaryBtnStyle = {
  height: 44, padding: '0 18px', borderRadius: 999,
  border: '1px solid var(--ink)', background: 'var(--ink)',
  fontWeight: 600, color: 'var(--paper)',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
};
const secondaryBtnStyle = {
  height: 44, padding: '0 18px', borderRadius: 999,
  border: '1px solid var(--hair-2)', background: 'var(--card)',
  fontWeight: 600, fontSize: 15, color: 'var(--ink)',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
};
const ghostBtnStyle = {
  width: 40, height: 40, padding: 0, borderRadius: 999,
  border: '1px solid rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.85)',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: 'var(--ink)',
};
const ghostBtnSquareStyle = {
  height: 44, padding: 0, borderRadius: 999,
  border: '1px solid var(--hair-2)', background: 'transparent',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: 'var(--ink)',
};
