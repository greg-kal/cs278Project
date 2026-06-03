'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useApp } from '../../lib/AppContext';
import { Avatar } from '../ui/Avatar';

const FILTERS = ['All', 'Favorites', 'Mentions'];

export function ActivityScreen() {
  const { navigate, favorites, findUser, getEventById } = useApp();
  const [filter, setFilter] = useState('All');
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data?.user) return;
      const { data: rows } = await supabase
        .from('activity')
        .select('*, actor:actor_id(id, name, handle, ch, tone)')
        .eq('target_user_id', data.user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      if (rows && rows.length > 0) {
        setActivity(rows.map(r => ({
          id: r.id,
          userId: r.actor?.id || r.actor_id,
          eventId: r.event_id,
          message: r.message,
          subtext: r.subtext,
          timeLabel: formatTimeAgo(r.created_at),
          _actor: r.actor,
        })));
      }
    });
  }, []);

  const filtered = activity.filter(item => {
    if (filter === 'Favorites') return favorites.has(item.userId);
    if (filter === 'Mentions') return item.type === 'mention';
    return true;
  });

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--paper)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 18px 0', flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, color: 'var(--ink)' }}>
          Activity.
        </div>
        <div style={{ marginTop: 10 }}>
          <div style={{
            display: 'inline-flex', padding: 3, borderRadius: 999,
            background: 'var(--soft)', border: '1px solid var(--hair)',
          }}>
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '6px 12px', borderRadius: 999,
                  fontSize: 13, fontWeight: 600,
                  background: filter === f ? 'var(--card)' : 'transparent',
                  color: filter === f ? 'var(--ink)' : 'var(--muted)',
                  border: 0, cursor: 'pointer',
                  boxShadow: filter === f ? '0 1px 2px rgba(0,0,0,.06)' : 'none',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '14px 18px 100px' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
            No activity yet.
          </div>
        ) : (
          filtered.map(item => {
            const user = item._actor || findUser(item.userId);
            const event = item.eventId ? getEventById(item.eventId) : null;
            return (
              <button
                key={item.id}
                onClick={() => event && navigate('eventDetail', { eventId: event.id })}
                style={{
                  display: 'flex', gap: 12, padding: '10px 0',
                  background: 'transparent', border: 0,
                  borderBottom: '1px solid var(--hair)',
                  width: '100%', textAlign: 'left', cursor: event ? 'pointer' : 'default',
                }}
              >
                <Avatar ch={user.ch || '?'} tone={user.tone || 'b1'} size={36} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: 'var(--ink)' }}>
                    <b>{user.name || 'Someone'}</b>{' '}
                    <span style={{ color: 'var(--muted)', fontWeight: 400 }}>{item.message}</span>
                  </div>
                  {item.subtext && (
                    <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 2, fontStyle: 'italic' }}>
                      {item.subtext}
                    </div>
                  )}
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10,
                    letterSpacing: '.08em', textTransform: 'uppercase',
                    color: 'var(--muted)', marginTop: 4,
                  }}>
                    {item.timeLabel}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function formatTimeAgo(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}
