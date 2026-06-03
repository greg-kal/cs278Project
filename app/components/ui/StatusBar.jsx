'use client';

export function StatusBar({ light = false }) {
  return (
    <div style={{
      height: 50,
      padding: '16px 28px 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: '-apple-system, SF Pro Text, system-ui, sans-serif',
      fontWeight: 600,
      fontSize: 15,
      color: light ? '#fff' : 'var(--ink)',
      flexShrink: 0,
    }}>
      <span>9:41</span>
      <span style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 13 }}>
        <svg width="18" height="11" viewBox="0 0 18 11" fill="none">
          <path d="M1 6 L4 9 L17 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
          <rect x="0" y="7" width="3" height="4" rx="1"/>
          <rect x="4" y="5" width="3" height="6" rx="1"/>
          <rect x="8" y="3" width="3" height="8" rx="1"/>
          <rect x="12" y="0" width="3" height="11" rx="1"/>
        </svg>
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="currentColor"/>
          <rect x="2" y="2" width="17" height="8" rx="1.5" fill="currentColor"/>
          <rect x="23" y="3.5" width="2" height="5" rx="1" fill="currentColor"/>
        </svg>
      </span>
    </div>
  );
}
