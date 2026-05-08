'use client';
import { getEvent, getUser, EVENTS } from '../../lib/data';
import { useApp } from '../../lib/AppContext';
import { Avatar } from '../ui/Avatar';
import { Icon } from '../ui/Icon';

export function RsvpConfirmSheet({ params, onClose }) {
  const { navigate, joinEvent } = useApp();
  const event = getEvent(params.eventId);
  if (!event) return null;

  const host = getUser(event.hostId);
  const totalGoing = event.goingIds.length + 1;

  // Suggest the next event on the same day
  const suggestion = EVENTS.find(e => e.id !== event.id && e.dateKey === event.dateKey);

  const handleDone = () => {
    onClose();
  };

  const handleJoinSuggestion = () => {
    if (suggestion) {
      joinEvent(suggestion.id);
    }
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(20,16,12,.30)', zIndex: 40 }}
      />

      {/* Sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: 'var(--paper)',
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        boxShadow: 'var(--e-sheet)',
        padding: '8px 0 30px',
        zIndex: 50,
        animation: 'slideUp var(--m-sheet) cubic-bezier(.2,.8,.2,1)',
      }}>
        <div style={{ width: 36, height: 5, borderRadius: 3, background: 'var(--hair-2)', margin: '6px auto 12px' }} />

        {/* Confirmation */}
        <div style={{ padding: '4px 22px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: 60, height: 60, borderRadius: 999,
            background: 'var(--accent-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent-ink)',
          }}>
            <Icon name="check" size={28} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 12, color: 'var(--ink)' }}>
            You're in.
          </div>
          <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 2, textAlign: 'center' }}>
            {host.name} and {totalGoing - 1} others will see you joined.
          </div>
        </div>

        {/* Event summary */}
        <div style={{ padding: '18px 18px 0' }}>
          <div style={{
            background: 'var(--card)', border: '1px solid var(--hair)',
            borderRadius: 18, boxShadow: 'var(--e-1)', padding: 14,
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>
              {event.dateLabel?.toUpperCase()} · {event.time}{event.endTime ? ` – ${event.endTime}` : ''}
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, marginTop: 2, color: 'var(--ink)' }}>
              {event.title}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <Avatar ch={host.ch} tone={host.tone} size={22} />
              <span style={{ fontSize: 13, color: 'var(--ink)' }}>{host.name} + {totalGoing - 1}</span>
            </div>
          </div>
        </div>

        {/* Suggestion */}
        {suggestion && (
          <div style={{ padding: '14px 18px 0' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              also doing
            </div>
            <button
              onClick={handleJoinSuggestion}
              style={{
                width: '100%', background: 'var(--card)',
                border: '1px solid var(--hair)', borderRadius: 18,
                boxShadow: 'var(--e-1)', padding: '12px 14px',
                marginTop: 8, display: 'flex', alignItems: 'center', gap: 10,
                textAlign: 'left', cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 18 }}>
                {suggestion.photo === 'blue' ? '🎬' : suggestion.photo === 'green' ? '🏃' : '🍽'}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{suggestion.title}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{suggestion.time}</span>
                  {' · '}{getUser(suggestion.hostId).name} is hosting
                </div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent-ink)', fontWeight: 600 }}>+ join</span>
            </button>
          </div>
        )}

        {/* Actions */}
        <div style={{ padding: '14px 18px 0', display: 'flex', gap: 10 }}>
          <button style={{
            flex: 1, height: 48, borderRadius: 999,
            border: '1px solid var(--hair-2)', background: 'transparent',
            fontWeight: 600, fontSize: 15, color: 'var(--ink)', cursor: 'pointer',
          }}>
            Add comment
          </button>
          <button
            onClick={handleDone}
            style={{
              flex: 1, height: 48, borderRadius: 999,
              border: '1px solid var(--ink)', background: 'var(--ink)',
              fontWeight: 600, fontSize: 15, color: 'var(--paper)', cursor: 'pointer',
            }}
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
}
