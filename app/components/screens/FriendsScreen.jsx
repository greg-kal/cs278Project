'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useApp } from '../../lib/AppContext';
import { StatusBar } from '../ui/StatusBar';
import { Avatar } from '../ui/Avatar';
import { Icon } from '../ui/Icon';

export function FriendsScreen() {
  const { favorites, toggleFavorite, navigate, events, profile, cacheProfiles } = useApp();
  const [search, setSearch] = useState('');
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    if (!supabase || !profile) return;
    supabase
      .from('profiles')
      .select('*')
      .neq('id', profile.id)
      .then(({ data }) => {
        if (data) {
          setProfiles(data);
          cacheProfiles(data);
        }
      });
  }, [profile, cacheProfiles]);

  const filtered = search
    ? profiles.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.handle.toLowerCase().includes(search.toLowerCase())
      )
    : profiles;

  const favUsers = filtered.filter(u => favorites.has(u.id));
  const restUsers = filtered.filter(u => !favorites.has(u.id));

  const getUserStatus = (userId) => {
    const userEvent = events.find(e => e.goingIds.includes(userId) || e.hostId === userId);
    if (!userEvent) return 'no plans posted today';
    const isHost = userEvent.hostId === userId;
    return `${isHost ? 'hosting' : 'going to'} ${userEvent.title.toLowerCase()} · ${userEvent.time.toLowerCase()}`;
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--paper)', display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      <div style={{ padding: '4px 18px 0', flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, color: 'var(--ink)' }}>
          Friends.
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          letterSpacing: '.08em', textTransform: 'uppercase',
          color: 'var(--muted)', marginTop: 2,
        }}>
          ★ pin people to filter your feed
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '12px 18px 0', position: 'relative', flexShrink: 0 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search friends"
          style={{
            background: 'var(--card)', border: '1px solid var(--hair-2)',
            borderRadius: 12, padding: '12px 14px 12px 38px',
            fontSize: 15, color: 'var(--ink)', width: '100%',
            fontFamily: 'var(--font-ui)', outline: 'none', boxSizing: 'border-box',
          }}
        />
        <span style={{ position: 'absolute', left: 30, top: 24, color: 'var(--muted)', pointerEvents: 'none' }}>
          <Icon name="search" size={18} />
        </span>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '0 18px 100px' }}>
        {favUsers.length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0 8px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                favorites · {favUsers.length}
              </div>
              <button style={{ background: 'transparent', border: 0, fontSize: 12, fontWeight: 600, color: 'var(--muted)', cursor: 'pointer', padding: '0 8px', height: 28, borderRadius: 999 }}>
                Reorder
              </button>
            </div>
            {favUsers.map(u => (
              <FriendRow key={u.id} user={u} status={getUserStatus(u.id)} isFav={true}
                onToggle={() => toggleFavorite(u.id)}
                onTap={() => navigate('profile', { userId: u.id })} />
            ))}
          </>
        )}

        {restUsers.length > 0 && (
          <>
            <div style={{ padding: '14px 0 8px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                everyone else
              </div>
            </div>
            {restUsers.map(u => (
              <FriendRow key={u.id} user={u} isFav={false}
                onToggle={() => toggleFavorite(u.id)}
                onTap={() => navigate('profile', { userId: u.id })} />
            ))}
          </>
        )}

        {profiles.length === 0 && (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
            No other users yet.
          </div>
        )}
      </div>
    </div>
  );
}

function FriendRow({ user, status, isFav, onToggle, onTap }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--hair)' }}>
      <button onClick={onTap} style={{ background: 'transparent', border: 0, padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, flex: 1, textAlign: 'left' }}>
        <Avatar ch={user.ch} tone={user.tone} size={isFav ? 42 : 36} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{user.name}</div>
          {status ? (
            <div style={{ fontSize: 12, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{status}</div>
          ) : (
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{user.handle}</div>
          )}
        </div>
      </button>
      <button
        onClick={onToggle}
        style={{
          background: 'transparent', border: 0,
          color: isFav ? 'var(--accent)' : 'var(--muted)',
          cursor: 'pointer', padding: 8,
          fontSize: 20,
        }}
      >
        {isFav ? '★' : '☆'}
      </button>
    </div>
  );
}
