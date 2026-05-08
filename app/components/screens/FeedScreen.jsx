'use client';
import { EVENTS, getDayStrip } from '../../lib/data';
import { useApp } from '../../lib/AppContext';
import { StatusBar } from '../ui/StatusBar';
import { DayStrip } from '../ui/DayStrip';
import { Icon } from '../ui/Icon';
import { EventRow } from '../EventRow';
import { DailyPromptCard } from '../DailyPromptCard';

export function FeedScreen() {
  const { activeDayIndex } = useApp();
  const days = getDayStrip();
  const activeDay = days[activeDayIndex];

  const visibleToday = EVENTS.filter(e => e.dateKey === 'today');
  const visibleTomorrow = EVENTS.filter(e => e.dateKey === 'tomorrow');

  // Date header: if activeDay is today (index 0), show "Today."
  const dateTag = activeDayIndex === 0
    ? 'Today.'
    : activeDayIndex === 1
    ? 'Tomorrow.'
    : `${activeDay.dayName.charAt(0) + activeDay.dayName.slice(1).toLowerCase()} ${activeDay.dayNum}.`;

  const subTag = activeDayIndex === 0
    ? EVENTS[0]?.dateLabel
    : activeDay.dayName.toLowerCase() + ' ' + activeDay.dayNum;

  const totalVisible = activeDayIndex === 0 ? visibleToday.length : activeDayIndex === 1 ? visibleTomorrow.length : 0;

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: 'var(--paper)' }}>
      <StatusBar />

      {/* Header */}
      <div style={{ padding: '4px 18px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
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
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{
            width: 40, height: 40, padding: 0, borderRadius: 999,
            border: '1px solid var(--hair-2)', background: 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--ink)',
          }}>
            <Icon name="search" size={20} />
          </button>
          <button style={{
            width: 40, height: 40, padding: 0, borderRadius: 999,
            border: '1px solid var(--hair-2)', background: 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--ink)',
          }}>
            <Icon name="bell" size={20} />
          </button>
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

        {/* Other day view */}
        {activeDayIndex === 1 && (
          visibleTomorrow.length > 0 ? (
            visibleTomorrow.map(event => <EventRow key={event.id} event={event} />)
          ) : (
            <EmptyState />
          )
        )}

        {activeDayIndex > 1 && <EmptyState />}
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
