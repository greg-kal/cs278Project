'use client';
import { cloneElement } from 'react';

const base = {
  width: 24,
  height: 24,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '1.75',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const Icons = {
  feed:    <svg {...base} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="5" rx="1.5"/><rect x="3" y="11" width="18" height="9" rx="1.5"/></svg>,
  people:  <svg {...base} viewBox="0 0 24 24"><circle cx="9" cy="9" r="3.5"/><path d="M2.5 20c1-3.5 3.5-5 6.5-5s5.5 1.5 6.5 5"/><circle cx="17" cy="8" r="2.5"/><path d="M16 13.5c2.5 0 4.5 1.5 5.5 4"/></svg>,
  bell:    <svg {...base} viewBox="0 0 24 24"><path d="M6 9a6 6 0 1112 0c0 5 2 7 2 7H4s2-2 2-7z"/><path d="M10 20a2 2 0 004 0"/></svg>,
  me:      <svg {...base} viewBox="0 0 24 24"><circle cx="12" cy="9" r="3.5"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>,
  plus:    <svg {...base} viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>,
  back:    <svg {...base} viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>,
  more:    <svg {...base} viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/></svg>,
  filter:  <svg {...base} viewBox="0 0 24 24"><path d="M3 5h18M6 12h12M10 19h4"/></svg>,
  search:  <svg {...base} viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/></svg>,
  pin:     <svg {...base} viewBox="0 0 24 24"><path d="M12 22s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>,
  clock:   <svg {...base} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  comment: <svg {...base} viewBox="0 0 24 24"><path d="M21 12a8 8 0 11-3.2-6.4L21 5l-1 3.4A7.96 7.96 0 0121 12z"/></svg>,
  send:    <svg {...base} viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>,
  check:   <svg {...base} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L20 7"/></svg>,
  close:   <svg {...base} viewBox="0 0 24 24"><path d="M6 6l12 12M18 6l-12 12"/></svg>,
  star: (filled = false) => (
    <svg {...base} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}>
      <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8-4.3-4.1 5.9-.9L12 3.5z"/>
    </svg>
  ),
};

export function Icon({ name, size = 24, color, filled }) {
  const icon = name === 'star' ? Icons.star(filled) : Icons[name];
  if (!icon) return null;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      color: color || 'currentColor',
      flexShrink: 0,
      lineHeight: 0,
    }}>
      {cloneElement(icon, { width: size, height: size, 'aria-hidden': true, focusable: 'false' })}
    </span>
  );
}
