'use client';
import { useState } from 'react';
import { useApp } from '../../lib/AppContext';
import { useAuth } from '../../lib/AuthContext';
import { StatusBar } from '../ui/StatusBar';
import { Avatar } from '../ui/Avatar';
import { Icon } from '../ui/Icon';

export function CommentsScreen({ params }) {
  const { goBack, commentLikes, toggleCommentLike, getEventById, findUser, profile, addComment } = useApp();
  const { session } = useAuth();
  const [draftText, setDraftText] = useState('');
  const [posting, setPosting] = useState(false);

  const event = getEventById(params.eventId);
  if (!event) return null;

  const totalGoing = event.goingIds.length;
  const me = profile || { ch: '?', tone: 'b1' };

  const handleSend = async () => {
    if (!draftText.trim() || posting) return;
    setPosting(true);
    const result = await addComment(event.id, draftText, session?.user?.id);
    setPosting(false);
    if (!result?.error) setDraftText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--paper)', display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      {/* Header */}
      <div style={{ padding: '4px 18px 0', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <button onClick={goBack} style={ghostBtn}>
          <Icon name="back" size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{event.title}</div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)',
          }}>
            {(event.comments || []).length} comments · {totalGoing} going
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--hair)', marginTop: 10, flexShrink: 0 }} />

      {/* Comments list */}
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '14px 18px 100px' }}>
        {(event.comments || []).length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
            No comments yet. Be the first!
          </div>
        ) : (
          (event.comments || []).map((c) => {
            const user = findUser(c.userId);
            const liked = commentLikes[c.id];
            return (
              <div key={c.id} style={{ display: 'flex', gap: 10, paddingBottom: 14 }}>
                <Avatar ch={user.ch} tone={user.tone} size={32} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'var(--ink)' }}>
                    <b>{user.name}</b>{' '}
                    <span style={{ color: 'var(--muted)' }}>· {c.timeLabel}</span>
                  </div>
                  <div style={{ fontSize: 15, marginTop: 2, lineHeight: 1.4, color: 'var(--ink)' }}>
                    {c.text}
                  </div>
                  <div style={{ display: 'flex', gap: 14, marginTop: 6, color: 'var(--muted)', fontSize: 12 }}>
                    <span style={{ cursor: 'pointer' }}>Reply</span>
                    <button
                      onClick={() => toggleCommentLike(c.id)}
                      style={{ background: 'transparent', border: 0, cursor: 'pointer', color: liked ? 'var(--accent)' : 'var(--muted)', fontSize: 12, padding: 0 }}
                    >
                      {liked ? '♥' : '♡'} {(c.likes || 0) + (liked ? 1 : 0) || ''}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Composer */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '10px 14px 26px',
        background: 'var(--paper)',
        borderTop: '1px solid var(--hair)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar ch={me.ch} tone={me.tone} size={32} />
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              value={draftText}
              onChange={e => setDraftText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write something…"
              style={{
                background: 'var(--card)', border: '1px solid var(--hair-2)',
                borderRadius: 12, padding: '12px 44px 12px 14px',
                fontSize: 15, color: 'var(--ink)', width: '100%',
                fontFamily: 'var(--font-ui)',
                outline: 'none',
              }}
            />
            <button
              onClick={handleSend}
              disabled={!draftText.trim() || posting}
              style={{
                position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
                width: 36, height: 36, borderRadius: 999,
                background: draftText.trim() ? 'var(--ink)' : 'var(--soft)',
                color: draftText.trim() ? 'var(--paper)' : 'var(--muted)',
                border: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: draftText.trim() ? 'pointer' : 'default',
                transition: 'background var(--m-base), color var(--m-base)',
              }}
            >
              <Icon name="send" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ghostBtn = {
  width: 40, height: 40, padding: 0, borderRadius: 999,
  border: 0, background: 'transparent',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: 'var(--ink)',
};
