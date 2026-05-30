'use client';

export function Avatar({ ch, size = 32, tone = 'b1' }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 999,
      background: `var(--t-${tone}-bg)`,
      color: `var(--t-${tone}-fg)`,
      fontWeight: 600,
      border: '1px solid var(--hair)',
      width: size,
      height: size,
      fontSize: Math.round(size * 0.42),
      flexShrink: 0,
      fontFamily: 'var(--font-ui)',
      userSelect: 'none',
    }}>
      {ch}
    </span>
  );
}

export function AvatarStack({ items = [], size = 24, more = 0 }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      {items.map((it, i) => (
        <span key={i} style={{ marginLeft: i === 0 ? 0 : -8 }}>
          <Avatar ch={it.ch} tone={it.tone} size={size} />
        </span>
      ))}
      {more > 0 && (
        <span style={{ marginLeft: -8 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 999, background: 'var(--soft)', color: 'var(--ink-2)',
            border: '1px solid var(--hair)',
            width: size, height: size,
            fontSize: Math.round(size * 0.36),
            fontWeight: 600,
            fontFamily: 'var(--font-ui)',
          }}>+{more}</span>
        </span>
      )}
    </span>
  );
}
