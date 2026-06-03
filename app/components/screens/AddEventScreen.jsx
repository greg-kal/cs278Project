'use client';
import { useState, useEffect, useRef } from 'react';
import { useApp } from '../../lib/AppContext';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';
import { Icon } from '../ui/Icon';

const DEFAULT_USUALS = [
  { icon: '🍽', name: 'Dinner',     startTime: '18:00', place: '', visibility: 'open', duration: '', note: '' },
  { icon: '🏋', name: 'Gym',        startTime: '19:00', place: 'arc', visibility: 'open', duration: '', note: '' },
  { icon: '📚', name: 'Study sesh', startTime: '14:00', place: 'green library', visibility: 'open', duration: '2h', note: '' },
  { icon: '🌅', name: 'Brunch',     startTime: '11:00', place: 'coupa', visibility: 'open', duration: '', note: '' },
];

// Helper to format time for display (24h -> 12h format)
function formatTimeDisplay(time24) {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const suffix = h >= 12 ? 'p' : 'a';
  const hour12 = h % 12 || 12;
  return m === 0 ? `${hour12}${suffix}` : `${hour12}:${String(m).padStart(2, '0')}${suffix}`;
}

// Helper to build sub display string from usual fields
function buildUsualSub(usual) {
  const parts = [];
  if (usual.place) parts.push(usual.place);
  if (usual.startTime) parts.push(`~${formatTimeDisplay(usual.startTime)}`);
  else if (usual.duration) parts.push(usual.duration);
  return parts.join(' · ') || '';
}

const EMOJI_OPTIONS = ['🍽', '🏋', '📚', '🌅', '🎬', '☕', '🏃', '🎮', '🎵', '🍕', '🍻', '🎉', '💼', '✈️', '🏖️'];

// Helper to convert 12h time (e.g., "6:30 PM") to 24h format (e.g., "18:30")
function convertTo24Hour(time12) {
  if (!time12) return '18:30';
  // Already in 24h format
  if (/^\d{1,2}:\d{2}$/.test(time12)) return time12;
  const match = time12.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return '18:30';
  let h = parseInt(match[1]);
  const m = match[2];
  const period = match[3].toUpperCase();
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${m}`;
}

// Helper to determine 'when' value and customDate from startsAt or dateKey
function getWhenAndCustomDate(prefill) {
  // If we have startsAt (ISO datetime), use that as the source of truth
  if (prefill?.startsAt) {
    const eventDate = new Date(prefill.startsAt);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDay = new Date(eventDate);
    eventDay.setHours(0, 0, 0, 0);
    const dayDiff = Math.round((eventDay - today) / 86400000);

    if (dayDiff === 0) return { when: 'today', customDate: '' };
    if (dayDiff === 1) return { when: 'tomorrow', customDate: '' };
    // For other dates, extract YYYY-MM-DD from the event date
    const dateStr = eventDate.toISOString().split('T')[0];
    return { when: 'pick…', customDate: dateStr };
  }

  // Fallback to dateKey if no startsAt
  const dateKey = prefill?.dateKey;
  if (dateKey === 'today') return { when: 'today', customDate: '' };
  if (dateKey === 'tomorrow') return { when: 'tomorrow', customDate: '' };
  if (dateKey) return { when: 'pick…', customDate: dateKey };
  return { when: 'today', customDate: '' };
}

export function AddEventScreen({ onClose, prefill, editMode, eventId }) {
  // If prefill is provided or in edit mode, go directly to form view with prefilled data
  const [view, setView] = useState(prefill || editMode ? 'form' : 'usuals'); // 'usuals' | 'form' | 'editUsuals'
  const { when: initialWhen, customDate: initialCustomDate } = getWhenAndCustomDate(prefill);
  const [formData, setFormData] = useState({
    title: prefill?.name || prefill?.title || '',
    when: initialWhen,
    startTime: convertTo24Hour(prefill?.time) || prefill?.startTime || '18:30',
    duration: prefill?.duration || '',
    place: prefill?.place || '',
    visibility: prefill?.visibility || 'open',
    note: prefill?.description || prefill?.note || '',
    customDate: initialCustomDate,
    photoUrl: prefill?.photoUrl || null,
  });
  const [usuals, setUsuals] = useState([]);
  const [loadingUsuals, setLoadingUsuals] = useState(true);
  const { session } = useAuth();

  // Load usuals from database
  useEffect(() => {
    if (!supabase || !session?.user?.id) {
      setUsuals(DEFAULT_USUALS);
      setLoadingUsuals(false);
      return;
    }
    supabase
      .from('usuals')
      .select('*')
      .eq('user_id', session.user.id)
      .order('sort_order')
      .then(({ data }) => {
        if (data && data.length > 0) {
          // Map database fields to component format
          setUsuals(data.map(u => ({
            id: u.id,
            icon: u.icon,
            name: u.name,
            startTime: u.start_time || '',
            place: u.place || '',
            visibility: u.visibility || 'open',
            duration: u.duration || '',
            note: u.note || '',
            sub: u.sub || buildUsualSub({ startTime: u.start_time, place: u.place, duration: u.duration }),
          })));
        } else {
          setUsuals(DEFAULT_USUALS);
        }
        setLoadingUsuals(false);
      });
  }, [session?.user?.id]);

  const handleSaveUsuals = async (newUsuals) => {
    if (!supabase || !session?.user?.id) return;

    // Delete existing usuals
    await supabase.from('usuals').delete().eq('user_id', session.user.id);

    // Insert new usuals with structured fields
    if (newUsuals.length > 0) {
      await supabase.from('usuals').insert(
        newUsuals.map((u, i) => ({
          user_id: session.user.id,
          icon: u.icon,
          name: u.name,
          sub: buildUsualSub(u), // Computed for display
          start_time: u.startTime || null,
          place: u.place || null,
          visibility: u.visibility || 'open',
          duration: u.duration || null,
          note: u.note || null,
          sort_order: i,
        }))
      );
    }

    setUsuals(newUsuals);
    setView('usuals');
  };

  if (view === 'editUsuals') {
    return <EditUsualsScreen usuals={usuals} onSave={handleSaveUsuals} onClose={() => setView('usuals')} />;
  }

  if (view === 'form') {
    return <AddForm formData={formData} setFormData={setFormData} onClose={onClose} onBack={() => setView('usuals')} editMode={editMode} eventId={eventId} />;
  }

  const handleSelectUsual = (u) => {
    setFormData(f => ({
      ...f,
      title: u.name,
      startTime: u.startTime || '18:30',
      place: u.place || '',
      visibility: u.visibility || 'open',
      duration: u.duration || '',
      note: u.note || '',
      when: 'today', // Default to today
    }));
    setView('form');
  };

  return (
    <UsualsScreen
      usuals={usuals}
      loading={loadingUsuals}
      onClose={onClose}
      onSelectUsual={handleSelectUsual}
      onScratch={() => setView('form')}
      onEditUsuals={() => setView('editUsuals')}
    />
  );
}

function UsualsScreen({ usuals, loading, onClose, onSelectUsual, onScratch, onEditUsuals }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--paper)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <button onClick={onClose} style={ghostTextBtn}>Cancel</button>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>Add event</div>
        <span style={{ width: 60 }} />
      </div>

      <div style={{ padding: '14px 18px 0', flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, lineHeight: 1.05, color: 'var(--ink)' }}>
          What&apos;s the move?
        </div>
        <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 4 }}>
          Pick something you usually do, or start fresh.
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '14px 18px 100px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)',
          }}>
            your usuals
          </div>
          <button onClick={onEditUsuals} style={{ ...ghostTextBtn, fontSize: 12, color: 'var(--accent-ink)' }}>
            Edit
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '20px 0', fontSize: 14, color: 'var(--muted)', textAlign: 'center' }}>
            Loading...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {usuals.map((u, i) => (
              <button
                key={u.id || i}
                onClick={() => onSelectUsual(u)}
                style={{
                  background: 'var(--card)', border: '1px solid var(--hair)',
                  borderRadius: 18, boxShadow: 'var(--e-1)',
                  padding: '12px 14px',
                  display: 'flex', alignItems: 'center', gap: 12,
                  textAlign: 'left', cursor: 'pointer', width: '100%',
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'var(--soft)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                }}>
                  {u.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{u.sub || buildUsualSub(u)}</div>
                </div>
                <span style={{ color: 'var(--muted)', fontSize: 18 }}>›</span>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={onScratch}
          style={{
            width: '100%', marginTop: 14, height: 48,
            borderRadius: 999, border: '1px solid var(--hair-2)',
            background: 'var(--card)', fontWeight: 600, fontSize: 15,
            color: 'var(--ink)', cursor: 'pointer',
          }}
        >
          + Start from scratch
        </button>
      </div>
    </div>
  );
}

function EditUsualsScreen({ usuals, onSave, onClose }) {
  const [items, setItems] = useState(usuals.map(u => ({ ...u })));
  const [editingIndex, setEditingIndex] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleAdd = () => {
    setItems([...items, { icon: '🎉', name: '', startTime: '18:00', place: '', visibility: 'open', duration: '', note: '' }]);
    setEditingIndex(items.length);
  };

  const handleDelete = (index) => {
    setItems(items.filter((_, i) => i !== index));
    setEditingIndex(null);
  };

  const handleUpdate = (index, field, value) => {
    setItems(items.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const handleSave = async () => {
    const validItems = items.filter(i => i.name.trim());
    setSaving(true);
    await onSave(validItems);
    setSaving(false);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--paper)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <button onClick={onClose} style={ghostTextBtn}>Cancel</button>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>Edit usuals</div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ background: 'var(--ink)', color: 'var(--paper)', border: 0, padding: '0 16px', borderRadius: 999, height: 36, fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.5 : 1 }}
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '14px 18px 100px' }}>
        <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 14 }}>
          Add quick templates for events you do often.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((item, index) => (
            <div key={index} style={{
              background: 'var(--card)', border: '1px solid var(--hair)',
              borderRadius: 18, boxShadow: 'var(--e-1)', padding: 14,
            }}>
              {editingIndex === index ? (
                <div>
                  {/* Icon selector */}
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10,
                    letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)',
                    marginBottom: 8,
                  }}>
                    Icon
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                    {EMOJI_OPTIONS.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => handleUpdate(index, 'icon', emoji)}
                        style={{
                          width: 36, height: 36, borderRadius: 10,
                          background: item.icon === emoji ? 'var(--ink)' : 'var(--soft)',
                          border: 'none',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 18, cursor: 'pointer',
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  {/* Name */}
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10,
                    letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)',
                    marginBottom: 4,
                  }}>
                    Name
                  </div>
                  <input
                    value={item.name}
                    onChange={e => handleUpdate(index, 'name', e.target.value)}
                    placeholder="Dinner, Gym, Study..."
                    style={inputStyle}
                    autoFocus
                  />

                  {/* Time */}
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10,
                    letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)',
                    marginTop: 14, marginBottom: 4,
                  }}>
                    Default time
                  </div>
                  <input
                    type="time"
                    value={item.startTime || ''}
                    onChange={e => handleUpdate(index, 'startTime', e.target.value)}
                    style={{ ...inputStyle, fontFamily: 'var(--font-mono)', fontSize: 15 }}
                  />

                  {/* Place */}
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10,
                    letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)',
                    marginTop: 14, marginBottom: 4,
                  }}>
                    Default place <span style={{ textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                  </div>
                  <input
                    value={item.place || ''}
                    onChange={e => handleUpdate(index, 'place', e.target.value)}
                    placeholder="e.g. arc, green library, coupa"
                    style={inputStyle}
                  />

                  {/* Duration */}
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10,
                    letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)',
                    marginTop: 14, marginBottom: 4,
                  }}>
                    Duration <span style={{ textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                  </div>
                  <input
                    value={item.duration || ''}
                    onChange={e => handleUpdate(index, 'duration', e.target.value)}
                    placeholder="e.g. 1h, 2h 30m"
                    style={inputStyle}
                  />

                  {/* Visibility */}
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10,
                    letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)',
                    marginTop: 14, marginBottom: 8,
                  }}>
                    Who can join
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {[
                      { value: 'open', label: 'Open' },
                      { value: 'favorites', label: 'Favorites' },
                      { value: 'pick', label: 'Pick people' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => handleUpdate(index, 'visibility', opt.value)}
                        style={{
                          ...pillBtn,
                          background: item.visibility === opt.value ? 'var(--ink)' : 'var(--card)',
                          color: item.visibility === opt.value ? 'var(--paper)' : 'var(--ink)',
                          border: `1px solid ${item.visibility === opt.value ? 'var(--ink)' : 'var(--hair-2)'}`,
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {/* Note */}
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10,
                    letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)',
                    marginTop: 14, marginBottom: 4,
                  }}>
                    Default note <span style={{ textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                  </div>
                  <textarea
                    value={item.note || ''}
                    onChange={e => handleUpdate(index, 'note', e.target.value)}
                    placeholder="Any details to include by default..."
                    rows={2}
                    style={{ ...inputStyle, resize: 'none' }}
                  />

                  <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                    <button
                      onClick={() => handleDelete(index)}
                      style={{ ...pillBtn, color: 'var(--accent-ink)', borderColor: 'var(--accent)' }}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setEditingIndex(null)}
                      style={{ ...pillBtn, background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setEditingIndex(index)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'var(--soft)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18,
                  }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>
                      {item.name || <span style={{ color: 'var(--muted)' }}>Untitled</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{buildUsualSub(item)}</div>
                  </div>
                  <span style={{ color: 'var(--muted)', fontSize: 13 }}>Edit</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleAdd}
          style={{
            width: '100%', marginTop: 14, height: 48,
            borderRadius: 999, border: '1px dashed var(--hair-2)',
            background: 'transparent', fontWeight: 600, fontSize: 15,
            color: 'var(--muted)', cursor: 'pointer',
          }}
        >
          + Add usual
        </button>
      </div>
    </div>
  );
}

function AddForm({ formData, setFormData, onClose, onBack, editMode, eventId }) {
  const { addEvent, updateEvent, setActiveDayIndex } = useApp();
  const { session } = useAuth();
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const formDataRef = useRef(formData);
  formDataRef.current = formData; // Always keep ref in sync
  const set = (k, v) => setFormData(f => ({ ...f, [k]: v }));

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !supabase || !session?.user?.id) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setPostError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setPostError('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    setPostError(null);

    try {
      // Create unique filename (simple path, no nested folders)
      const ext = file.name.split('.').pop();
      const fileName = `${session.user.id}-${Date.now()}.${ext}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('event-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('event-photos')
        .getPublicUrl(fileName);

      set('photoUrl', publicUrl);
    } catch (error) {
      console.error('Upload error:', error);
      setPostError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    set('photoUrl', null);
  };

  const handlePost = async () => {
    setPosting(true);
    setPostError(null);
    // Use ref to ensure we get the latest formData (handles async state updates)
    const currentFormData = formDataRef.current;
    const result = editMode
      ? await updateEvent(eventId, currentFormData, session?.user?.id)
      : await addEvent(currentFormData, session?.user?.id);
    setPosting(false);
    if (result?.error) {
      setPostError(result.error.message || 'Failed to save');
    } else {
      // Navigate feed back to the day the event was posted on
      if (formData.when === 'today') setActiveDayIndex(0);
      else if (formData.when === 'tomorrow') setActiveDayIndex(1);
      onClose();
    }
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--paper)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <button onClick={onBack} style={ghostTextBtn}>Cancel</button>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{editMode ? 'Edit event' : 'New event'}</div>
        <button
          onClick={handlePost}
          disabled={posting || !formData.title.trim() || (formData.when === 'pick…' && !formData.customDate)}
          style={{ background: 'var(--ink)', color: 'var(--paper)', border: 0, padding: '0 16px', borderRadius: 999, height: 36, fontSize: 14, fontWeight: 600, cursor: posting ? 'default' : 'pointer', opacity: (!formData.title.trim() || posting || (formData.when === 'pick…' && !formData.customDate)) ? 0.5 : 1 }}
        >
          {posting ? (editMode ? 'Saving…' : 'Posting…') : (editMode ? 'Save' : 'Post')}
        </button>
      </div>
      {postError && (
        <div style={{ padding: '6px 16px', fontSize: 13, color: 'red' }}>{postError}</div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '14px 18px 40px' }}>
        <Label>what</Label>
        <input
          value={formData.title}
          onChange={e => set('title', e.target.value)}
          placeholder="Dinner, gym, study sesh…"
          style={inputStyle}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          {['🍽 Dinner','🏋 Gym','📚 Study','🌅 Brunch','🎬 Movie'].map((t, i) => (
            <button
              key={i}
              onClick={() => set('title', t.split(' ')[1])}
              style={pillBtn}
            >
              {t}
            </button>
          ))}
        </div>

        <Label style={{ marginTop: 18 }}>when</Label>
        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          {['Today','Tomorrow','Pick…'].map((w, i) => {
            const val = w.toLowerCase();
            const active = formData.when === val;
            return (
              <button
                key={i}
                onClick={() => set('when', val)}
                style={{
                  ...pillBtn,
                  background: active ? 'var(--ink)' : 'var(--card)',
                  color: active ? 'var(--paper)' : 'var(--ink)',
                  border: `1px solid ${active ? 'var(--ink)' : 'var(--hair-2)'}`,
                }}
              >
                {w}
              </button>
            );
          })}
        </div>
        {formData.when === 'pick…' && (
          <input
            type="date"
            value={formData.customDate}
            onChange={e => set('customDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            style={{ ...inputStyle, marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 15 }}
          />
        )}
        <div style={{
          background: 'var(--card)', border: '1px solid var(--hair)',
          borderRadius: 18, boxShadow: 'var(--e-1)',
          padding: '14px 16px', marginTop: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>Starts</div>
            <input
              type="time"
              value={formData.startTime}
              onChange={e => set('startTime', e.target.value)}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 600, color: 'var(--ink)',
                background: 'transparent', border: 0, outline: 'none', padding: 0,
                cursor: 'pointer', marginTop: 2,
              }}
            />
          </div>
          <div style={{ width: 1, height: 40, background: 'var(--hair)' }} />
          <div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>Duration <span style={{ fontSize: 11 }}>(opt)</span></div>
            <input
              type="text"
              value={formData.duration}
              onChange={e => set('duration', e.target.value)}
              placeholder="e.g. 1h 30m"
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 600, color: 'var(--ink)',
                background: 'transparent', border: 0, outline: 'none', padding: 0,
                cursor: 'text', marginTop: 2, width: 100,
              }}
            />
          </div>
        </div>

        <Label style={{ marginTop: 18 }}>where <span style={{ textTransform: 'none', letterSpacing: 0, fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 400 }}>(optional)</span></Label>
        <div style={{
          background: 'var(--card)', border: '1px solid var(--hair)',
          borderRadius: 18, boxShadow: 'var(--e-1)',
          padding: '12px 14px', marginTop: 6,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Icon name="pin" size={20} color="var(--muted)" />
          <input
            value={formData.place}
            onChange={e => set('place', e.target.value)}
            placeholder="Add a place…"
            style={{ background: 'transparent', border: 0, fontSize: 15, color: 'var(--ink)', flex: 1, outline: 'none', fontFamily: 'var(--font-ui)' }}
          />
        </div>

        <Label style={{ marginTop: 18 }}>who can join</Label>
        <div style={{
          background: 'var(--card)', border: '1px solid var(--hair)',
          borderRadius: 18, boxShadow: 'var(--e-1)',
          padding: 4, marginTop: 6,
        }}>
          {[
            { value: 'open', label: 'Open · everyone', sub: 'Anyone in your network can see + join' },
            { value: 'favorites', label: 'Favorites only', sub: 'Just people you ★' },
            { value: 'pick', label: 'Pick people', sub: 'Specific friends' },
          ].map((o, i) => (
            <button
              key={o.value}
              onClick={() => set('visibility', o.value)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 12px',
                background: 'transparent', border: 0,
                borderTop: i ? '1px solid var(--hair)' : 'none',
                width: '100%', textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: 999,
                border: '1.5px solid var(--hair-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {formData.visibility === o.value && (
                  <div style={{ width: 10, height: 10, borderRadius: 999, background: 'var(--ink)' }} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{o.label}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{o.sub}</div>
              </div>
            </button>
          ))}
        </div>

        <Label style={{ marginTop: 18 }}>say more <span style={{ textTransform: 'none', letterSpacing: 0, fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 400 }}>(optional)</span></Label>
        <textarea
          value={formData.note}
          onChange={e => set('note', e.target.value)}
          rows={3}
          placeholder="Long table by the window. Bringing cards."
          style={{ ...inputStyle, resize: 'none', marginTop: 6 }}
        />

        <Label style={{ marginTop: 18 }}>add photo <span style={{ textTransform: 'none', letterSpacing: 0, fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 400 }}>(optional)</span></Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          style={{ display: 'none' }}
        />
        {formData.photoUrl ? (
          <div style={{ marginTop: 6 }}>
            <div style={{
              width: '100%',
              height: 160,
              borderRadius: 14,
              overflow: 'hidden',
              background: `url(${formData.photoUrl}) center/cover`,
              border: '1px solid var(--hair)',
            }} />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  flex: 1, padding: '10px', borderRadius: 12,
                  background: 'var(--soft)', border: '1px solid var(--hair)',
                  fontWeight: 600, fontSize: 13, color: 'var(--ink)', cursor: 'pointer',
                }}
              >
                {uploading ? 'Uploading…' : 'Change'}
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                style={{
                  flex: 1, padding: '10px', borderRadius: 12,
                  background: 'transparent', border: '1px solid var(--accent)',
                  fontWeight: 600, fontSize: 13, color: 'var(--accent-ink)', cursor: 'pointer',
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{
              width: '100%', padding: '24px 16px', marginTop: 6,
              borderRadius: 14, border: '2px dashed var(--hair-2)',
              background: 'var(--soft)',
              fontWeight: 600, fontSize: 14, color: 'var(--muted)',
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            }}
          >
            <Icon name="plus" size={24} />
            {uploading ? 'Uploading…' : 'Add a cover photo'}
          </button>
        )}
      </div>
    </div>
  );
}

function Label({ children, style }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)', fontSize: 10,
      letterSpacing: '.08em', textTransform: 'uppercase',
      color: 'var(--muted)', ...style,
    }}>
      {children}
    </div>
  );
}

const ghostTextBtn = {
  background: 'transparent', border: 0,
  fontSize: 14, fontWeight: 600, color: 'var(--muted)',
  cursor: 'pointer', padding: '6px 0',
};
const inputStyle = {
  background: 'var(--card)', border: '1px solid var(--hair-2)',
  borderRadius: 12, padding: '12px 14px',
  fontSize: 15, color: 'var(--ink)', width: '100%',
  fontFamily: 'var(--font-ui)', outline: 'none', marginTop: 6,
  boxSizing: 'border-box',
};
const pillBtn = {
  padding: '6px 12px', borderRadius: 999,
  border: '1px solid var(--hair-2)', background: 'var(--card)',
  fontSize: 13, color: 'var(--ink)', cursor: 'pointer',
};
