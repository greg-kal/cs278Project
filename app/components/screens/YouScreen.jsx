'use client';
import { useState, useRef } from 'react';
import { useApp } from '../../lib/AppContext';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';
import { Avatar } from '../ui/Avatar';

const TONES = ['b1', 'b2', 'b3', 'b4', 'b5'];

export function YouScreen() {
  const { joined, favorites, profile, events, updateProfile, navigate } = useApp();
  const { signOut } = useAuth();
  const me = profile || { name: '…', handle: '', ch: '?', tone: 'b1', id: null, avatar_url: null };
  const myEvents = events.filter(e => joined.has(e.id) || (me.id && e.hostId === me.id));

  const [editModal, setEditModal] = useState(null); // 'name' | 'handle' | 'avatar' | null

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--paper)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '16px 18px 100px' }}>
        {/* Profile header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, color: 'var(--ink)' }}>
              {me.name}
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              letterSpacing: '.08em', textTransform: 'uppercase',
              color: 'var(--muted)', marginTop: 2,
            }}>
              {me.handle}
            </div>
          </div>
          <Avatar ch={me.ch} tone={me.tone} size={56} avatarUrl={me.avatar_url} />
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 14 }}>
          {[
            { n: 'Posted', v: events.filter(e => me.id && e.hostId === me.id).length },
            { n: 'Joined', v: joined.size },
            { n: '★ Favs', v: favorites.size },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'var(--card)', border: '1px solid var(--hair)',
              borderRadius: 14, boxShadow: 'var(--e-1)',
              padding: '12px 10px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>{s.v}</div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10,
                letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)',
              }}>{s.n}</div>
            </div>
          ))}
        </div>

        {/* Your week */}
        <div style={{ marginTop: 18 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            your week
          </div>
          {myEvents.length > 0 ? (
            myEvents.map(event => (
              <div
                key={event.id}
                onClick={() => navigate('eventDetail', { eventId: event.id })}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && navigate('eventDetail', { eventId: event.id })}
                style={{
                  background: 'var(--card)', border: '1px solid var(--hair)',
                  borderRadius: 14, boxShadow: 'var(--e-1)',
                  padding: 14, marginTop: 6,
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>
                  {event.title} · {event.dateKey}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{event.time}</span>
                  {' · '}{me.id && event.hostId === me.id ? 'hosting' : 'joined'}
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '16px 0', fontSize: 13, color: 'var(--muted)' }}>
              No plans this week. Post something!
            </div>
          )}
        </div>

        {/* Settings */}
        <div style={{ marginTop: 18 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            settings
          </div>
          <div style={{
            background: 'var(--card)', border: '1px solid var(--hair)',
            borderRadius: 18, boxShadow: 'var(--e-1)', marginTop: 6,
          }}>
            <SettingRow label="Change name" value={me.name} onClick={() => setEditModal('name')} />
            <SettingRow label="Change username" value={me.handle} onClick={() => setEditModal('handle')} border />
            <SettingRow label="Change profile image" onClick={() => setEditModal('avatar')} border />
            <SettingRow label="Sign out" onClick={signOut} border accent />
          </div>
        </div>
      </div>

      {/* Edit Modals */}
      {editModal === 'name' && (
        <EditNameModal
          currentName={me.name}
          onSave={async (newName) => {
            await updateProfile({ name: newName });
            setEditModal(null);
          }}
          onClose={() => setEditModal(null)}
        />
      )}
      {editModal === 'handle' && (
        <EditHandleModal
          currentHandle={me.handle}
          onSave={async (newHandle) => {
            await updateProfile({ handle: newHandle });
            setEditModal(null);
          }}
          onClose={() => setEditModal(null)}
        />
      )}
      {editModal === 'avatar' && (
        <EditAvatarModal
          userId={me.id}
          currentCh={me.ch}
          currentTone={me.tone}
          currentAvatarUrl={me.avatar_url}
          onSave={async (updates) => {
            await updateProfile(updates);
            setEditModal(null);
          }}
          onClose={() => setEditModal(null)}
        />
      )}
    </div>
  );
}

function SettingRow({ label, value, onClick, border, accent }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '14px 16px',
        borderTop: border ? '1px solid var(--hair)' : 'none',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      <span style={{ fontSize: 14, color: accent ? 'var(--accent-ink)' : 'var(--ink)' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {value && <span style={{ fontSize: 13, color: 'var(--muted)' }}>{value}</span>}
        <span style={{ color: 'var(--muted)', fontSize: 18 }}>›</span>
      </div>
    </div>
  );
}

function EditNameModal({ currentName, onSave, onClose }) {
  const [name, setName] = useState(currentName);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await onSave(name.trim());
    setSaving(false);
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--ink)' }}>
        Change name
      </div>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Your name"
        autoFocus
        style={inputStyle}
      />
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <button onClick={onClose} style={secondaryBtn}>Cancel</button>
        <button onClick={handleSave} disabled={saving || !name.trim()} style={{ ...primaryBtn, opacity: saving || !name.trim() ? 0.5 : 1 }}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </ModalOverlay>
  );
}

function EditHandleModal({ currentHandle, onSave, onClose }) {
  const [handle, setHandle] = useState(currentHandle.replace('@', ''));
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!handle.trim()) return;
    setSaving(true);
    const formatted = handle.trim().startsWith('@') ? handle.trim() : `@${handle.trim()}`;
    await onSave(formatted);
    setSaving(false);
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--ink)' }}>
        Change username
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 12 }}>
        <span style={{ fontSize: 16, color: 'var(--muted)', marginRight: 2 }}>@</span>
        <input
          value={handle.replace('@', '')}
          onChange={e => setHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
          placeholder="username"
          autoFocus
          style={{ ...inputStyle, marginTop: 0, flex: 1 }}
        />
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <button onClick={onClose} style={secondaryBtn}>Cancel</button>
        <button onClick={handleSave} disabled={saving || !handle.trim()} style={{ ...primaryBtn, opacity: saving || !handle.trim() ? 0.5 : 1 }}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </ModalOverlay>
  );
}

function EditAvatarModal({ userId, currentCh, currentTone, currentAvatarUrl, onSave, onClose }) {
  const [mode, setMode] = useState(currentAvatarUrl ? 'photo' : 'letter'); // 'photo' | 'letter'
  const [ch, setCh] = useState(currentCh);
  const [tone, setTone] = useState(currentTone);
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !supabase || !userId) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Create unique filename
      const ext = file.name.split('.').pop();
      const fileName = `${userId}/avatar-${Date.now()}.${ext}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setAvatarUrl(publicUrl);
      setMode('photo');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setAvatarUrl(null);
    setMode('letter');
  };

  const handleSave = async () => {
    setSaving(true);
    if (mode === 'photo' && avatarUrl) {
      await onSave({ avatar_url: avatarUrl });
    } else {
      await onSave({
        ch: ch.trim().toUpperCase().slice(0, 1),
        tone,
        avatar_url: null
      });
    }
    setSaving(false);
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--ink)' }}>
        Change profile image
      </div>

      {/* Preview */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
        <Avatar
          ch={ch || '?'}
          tone={tone}
          size={80}
          avatarUrl={mode === 'photo' ? avatarUrl : null}
        />
      </div>

      {/* Mode tabs */}
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button
          onClick={() => setMode('photo')}
          style={{
            flex: 1, padding: '10px', borderRadius: 12,
            background: mode === 'photo' ? 'var(--ink)' : 'var(--soft)',
            color: mode === 'photo' ? 'var(--paper)' : 'var(--ink)',
            border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer',
          }}
        >
          Upload Photo
        </button>
        <button
          onClick={() => setMode('letter')}
          style={{
            flex: 1, padding: '10px', borderRadius: 12,
            background: mode === 'letter' ? 'var(--ink)' : 'var(--soft)',
            color: mode === 'letter' ? 'var(--paper)' : 'var(--ink)',
            border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer',
          }}
        >
          Use Letter
        </button>
      </div>

      {mode === 'photo' ? (
        <div style={{ marginTop: 16 }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          {avatarUrl ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  width: '100%', padding: '12px', borderRadius: 12,
                  background: 'var(--soft)', border: '1px solid var(--hair)',
                  fontWeight: 600, fontSize: 14, color: 'var(--ink)', cursor: 'pointer',
                }}
              >
                {uploading ? 'Uploading…' : 'Change Photo'}
              </button>
              <button
                onClick={handleRemovePhoto}
                style={{
                  width: '100%', padding: '12px', borderRadius: 12,
                  background: 'transparent', border: '1px solid var(--accent)',
                  fontWeight: 600, fontSize: 14, color: 'var(--accent-ink)', cursor: 'pointer',
                }}
              >
                Remove Photo
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{
                width: '100%', padding: '16px', borderRadius: 12,
                background: 'var(--soft)', border: '2px dashed var(--hair)',
                fontWeight: 600, fontSize: 14, color: 'var(--muted)', cursor: 'pointer',
              }}
            >
              {uploading ? 'Uploading…' : 'Choose a photo'}
            </button>
          )}
        </div>
      ) : (
        <>
          <div style={{ marginTop: 16 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              Letter
            </div>
            <input
              value={ch}
              onChange={e => setCh(e.target.value.toUpperCase().slice(0, 1))}
              placeholder="A"
              maxLength={1}
              style={{ ...inputStyle, textAlign: 'center', fontSize: 24, fontWeight: 700 }}
            />
          </div>

          <div style={{ marginTop: 16 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              Color
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8, justifyContent: 'center' }}>
              {TONES.map(t => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  style={{
                    width: 44, height: 44, borderRadius: 999,
                    background: `var(--t-${t}-bg)`,
                    border: tone === t ? '3px solid var(--ink)' : '2px solid var(--hair)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, fontWeight: 700, color: `var(--t-${t}-fg)`,
                  }}
                >
                  {ch || '?'}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button onClick={onClose} style={secondaryBtn}>Cancel</button>
        <button
          onClick={handleSave}
          disabled={saving || uploading || (mode === 'letter' && !ch.trim())}
          style={{ ...primaryBtn, opacity: saving || uploading || (mode === 'letter' && !ch.trim()) ? 0.5 : 1 }}
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </ModalOverlay>
  );
}

function ModalOverlay({ children, onClose }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--card)',
          borderRadius: 24,
          padding: 24,
          width: '100%',
          maxWidth: 340,
          boxShadow: 'var(--e-2)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {children}
      </div>
    </div>
  );
}

const inputStyle = {
  background: 'var(--soft)', border: '1px solid var(--hair)',
  borderRadius: 12, padding: '12px 14px',
  fontSize: 16, color: 'var(--ink)', width: '100%',
  fontFamily: 'var(--font-ui)', outline: 'none', marginTop: 12,
  boxSizing: 'border-box',
};

const primaryBtn = {
  flex: 1, height: 44, borderRadius: 999,
  background: 'var(--ink)', color: 'var(--paper)',
  border: 0, fontWeight: 600, fontSize: 15, cursor: 'pointer',
};

const secondaryBtn = {
  flex: 1, height: 44, borderRadius: 999,
  background: 'var(--soft)', color: 'var(--ink)',
  border: '1px solid var(--hair)', fontWeight: 600, fontSize: 15, cursor: 'pointer',
};
