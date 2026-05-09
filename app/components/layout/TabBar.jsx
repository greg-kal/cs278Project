'use client';
import { useApp } from '../../lib/AppContext';
import { Icon } from '../ui/Icon';

const TABS = [
  { id: 'feed',     label: 'Feed',     icon: 'feed' },
  { id: 'friends',  label: 'Friends',  icon: 'people' },
  { id: 'activity', label: 'Activity', icon: 'bell' },
  { id: 'you',      label: 'You',      icon: 'me' },
];

export function TabBar() {
  const { tab, setTab } = useApp();

  return (
    <div style={{
      position: 'absolute',
      left: 0, right: 0, bottom: 0,
      height: 84,
      background: 'color-mix(in oklab, var(--paper) 92%, transparent)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--hair)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-around',
      padding: '10px 18px 0',
      zIndex: 20,
    }}>
      {TABS.map((t) => {
        const active = t.id === tab;
        return (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              paddingTop: 4,
              background: 'transparent',
              border: 0,
              cursor: 'pointer',
              color: active ? 'var(--ink)' : 'var(--muted)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 24 }}>
              <Icon name={t.icon} size={24} />
            </span>
            <span style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 10,
              letterSpacing: '.02em',
              color: active ? 'var(--ink)' : 'var(--muted)',
            }}>
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
