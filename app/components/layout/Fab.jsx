'use client';
import { useApp } from '../../lib/AppContext';
import { Icon } from '../ui/Icon';

export function Fab() {
  const { openModal } = useApp();

  return (
    <button
      onClick={() => openModal('addEvent')}
      aria-label="Add event"
      style={{
        position: 'absolute',
        right: 18,
        bottom: 100,
        width: 56,
        height: 56,
        borderRadius: 999,
        background: 'var(--ink)',
        color: 'var(--paper)',
        border: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 24px rgba(20,16,12,0.22), 0 1px 0 rgba(255,255,255,0.05) inset',
        cursor: 'pointer',
        zIndex: 25,
      }}
    >
      <Icon name="plus" size={28} />
    </button>
  );
}
