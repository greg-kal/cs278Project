'use client';
import { getDayStrip } from '../../lib/data';
import { useApp } from '../../lib/AppContext';
import { DayStrip } from '../ui/DayStrip';
import { Icon } from '../ui/Icon';
import { EventRow } from '../EventRow';
import { DailyPromptCard } from '../DailyPromptCard';

// Helper to compute dateKey for a given day offset
function getDateKeyForOffset(offset) {
  if (offset === 0) return 'today';
  if (offset === 1) return 'tomorrow';
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
}

export function FeedScreen() {
  const { activeDayIndex, events } = useApp();
  const days = getDayStrip();
  const activeDay = days[activeDayIndex];

  // Filter events for each day using the correct dateKey
  const visibleToday = events.filter(e => e.dateKey === 'today');
  const visibleTomorrow = events.filter(e => e.dateKey === 'tomorrow');

  // Get events for the active day (works for any day index including future days)
  const activeDateKey = getDateKeyForOffset(activeDayIndex);
  const visibleActiveDay = events.filter(e => e.dateKey === activeDateKey);

  // Date header: if activeDay is today (index 0), show "Today."
  const dateTag = activeDayIndex === 0
    ? 'Today.'
    : activeDayIndex === 1
    ? 'Tomorrow.'
    : `${activeDay.dayName.charAt(0) + activeDay.dayName.slice(1).toLowerCase()} ${activeDay.dayNum}.`;

  const subTag = activeDayIndex === 0
    ? visibleToday[0]?.dateLabel
    : activeDay.dayName.toLowerCase() + ' ' + activeDay.dayNum;

  const totalVisible = visibleActiveDay.length;

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: 'var(--paper)' }}>
      {/* Header */}
      <div style={{ padding: '16px 18px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10, letterSpacing: '.08em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
          }}>
            {subTag}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 34, lineHeight: 1, fontWeight: 700, marginTop: 2,
            color: 'var(--ink)',
          }}>
            {dateTag}
          </div>
        </div>
      </div>

      {/* Day strip */}
      <div style={{ flexShrink: 0, marginTop: 2 }}>
        <DayStrip />
      </div>

      {/* Event count */}
      <div style={{ padding: '10px 16px 0', flexShrink: 0 }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          letterSpacing: '.08em', textTransform: 'uppercase',
          color: 'var(--muted)',
        }}>
          {totalVisible} event{totalVisible !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Scrollable content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0 16px 180px',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
      }}>
        {/* Daily prompt (only on today) */}
        {activeDayIndex === 0 && <DailyPromptCard />}

        {/* Today events */}
        {activeDayIndex === 0 && (
          visibleToday.length > 0 ? (
            visibleToday.map(event => <EventRow key={event.id} event={event} />)
          ) : (
            <EmptyState />
          )
        )}

        {/* Tomorrow section */}
        {activeDayIndex === 0 && visibleTomorrow.length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '18px 0 4px' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 24, fontWeight: 700,
                color: 'var(--ink)',
              }}>Tomorrow</div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10,
                letterSpacing: '.08em', textTransform: 'uppercase',
                color: 'var(--muted)',
              }}>
                {visibleTomorrow[0]?.dateLabel}
              </div>
            </div>
            {visibleTomorrow.map(event => <EventRow key={event.id} event={event} />)}
          </>
        )}

        {/* Other day view (tomorrow and beyond) */}
        {activeDayIndex >= 1 && (
          visibleActiveDay.length > 0 ? (
            visibleActiveDay.map(event => <EventRow key={event.id} event={event} />)
          ) : (
            <EmptyState />
          )
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ padding: '80px 16px', textAlign: 'center' }}>
      <div style={{
        width: 88, height: 88, margin: '0 auto',
        borderRadius: 999, background: 'var(--soft)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 42,
      }}>🌤️</div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 26, fontWeight: 700, marginTop: 14,
        color: 'var(--ink)',
      }}>No plans yet.</div>
      <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 6, lineHeight: 1.5 }}>
        Be the first to post. Or wait — someone probably has something cooking.
      </div>
    </div>
  );
}
