'use client';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from './supabase';
import { EVENTS, USERS, buildDateLabel } from './data';

const AppContext = createContext(null);

const INITIAL_STACKS = {
  feed:     [{ screen: 'feed',     params: {} }],
  friends:  [{ screen: 'friends',  params: {} }],
  activity: [{ screen: 'activity', params: {} }],
  you:      [{ screen: 'you',      params: {} }],
};

const isUUID = id => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id));

function supabaseEventToLocal(row) {
  const d = new Date(row.starts_at);
  const todayMid = new Date(); todayMid.setHours(0, 0, 0, 0);
  const dayOffset = Math.round((new Date(d).setHours(0,0,0,0) - todayMid) / 86400000);
  const h = d.getHours(), m = d.getMinutes();
  return {
    id: row.id,
    title: row.title,
    time: `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`,
    dateKey: dayOffset === 0 ? 'today' : dayOffset === 1 ? 'tomorrow' : row.starts_at.split('T')[0],
    dateLabel: buildDateLabel(dayOffset),
    hostId: row.host_id,
    place: row.place || '',
    duration: row.duration_label || '',
    durationNote: '',
    visibility: row.visibility,
    photo: row.photo || 'green',
    goingIds: [],
    description: row.description || '',
    comments: [],
  };
}

export function AppProvider({ children }) {
  const [tab, setTabState] = useState('feed');
  const [stacks, setStacks] = useState(INITIAL_STACKS);
  const [modal, setModal] = useState(null);

  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState(EVENTS);
  const [favorites, setFavorites] = useState(new Set(['maya', 'greg', 'sam', 'jess']));
  const [joined, setJoined] = useState(new Set(['dinner']));
  const [promptDismissed, setPromptDismissed] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [commentLikes, setCommentLikes] = useState({});

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data?.user) return;
      const userId = data.user.id;

      // Load real profile
      const { data: p } = await supabase.from('profiles').select().eq('id', userId).single();
      if (p) setProfile(p);

      // Load events visible to this user (today + next 7 days)
      const from = new Date(); from.setHours(0, 0, 0, 0);
      const to = new Date(from); to.setDate(from.getDate() + 7);
      const { data: rows } = await supabase
        .from('events')
        .select('*')
        .gte('starts_at', from.toISOString())
        .lt('starts_at', to.toISOString())
        .order('starts_at');
      if (rows && rows.length > 0) {
        const real = rows.map(row => supabaseEventToLocal(row));
        setEvents(prev => {
          const existingIds = new Set(prev.map(e => e.id));
          return [...prev, ...real.filter(e => !existingIds.has(e.id))];
        });
      }

      // Restore which events the user has RSVP'd to
      const { data: rsvpRows } = await supabase
        .from('rsvps').select('event_id').eq('user_id', userId);
      if (rsvpRows && rsvpRows.length > 0) {
        setJoined(prev => new Set([...prev, ...rsvpRows.map(r => r.event_id)]));
      }
    });
  }, []);

  // Returns real profile if id matches logged-in user, else looks up mock USERS, else placeholder
  const findUser = useCallback((id) => {
    if (profile && id === profile.id) return profile;
    return USERS.find(u => u.id === id) || { id, name: 'Someone', handle: '@user', ch: '?', tone: 'b1' };
  }, [profile]);

  // Looks up an event from context state (works for both mock string ids and real UUIDs)
  const getEventById = useCallback((id) => events.find(e => e.id === id), [events]);

  const current = stacks[tab][stacks[tab].length - 1];
  const canGoBack = stacks[tab].length > 1;

  const navigate = useCallback((screen, params = {}) => {
    setStacks(prev => ({
      ...prev,
      [tab]: [...prev[tab], { screen, params }],
    }));
  }, [tab]);

  const goBack = useCallback(() => {
    setStacks(prev => {
      const stack = prev[tab];
      if (stack.length <= 1) return prev;
      return { ...prev, [tab]: stack.slice(0, -1) };
    });
  }, [tab]);

  const setTab = useCallback((newTab) => {
    setTabState(newTab);
    setModal(null);
  }, []);

  const openModal = useCallback((type, params = {}) => {
    setModal({ type, params });
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  const toggleFavorite = useCallback(async (userId) => {
    let wasIn = false;
    setFavorites(prev => {
      wasIn = prev.has(userId);
      const next = new Set(prev);
      wasIn ? next.delete(userId) : next.add(userId);
      return next;
    });
    if (supabase && isUUID(userId)) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        if (wasIn) {
          supabase.from('favorites').delete().eq('user_id', user.id).eq('favorite_id', userId);
        } else {
          supabase.from('favorites').upsert({ user_id: user.id, favorite_id: userId });
        }
      }
    }
  }, []);

  const joinEvent = useCallback(async (eventId) => {
    setJoined(prev => new Set([...prev, eventId]));
    if (supabase && isUUID(eventId)) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('rsvps').upsert({ event_id: eventId, user_id: user.id });
        setEvents(prev => prev.map(e =>
          e.id === eventId && !e.goingIds.includes(user.id)
            ? { ...e, goingIds: [...e.goingIds, user.id] }
            : e
        ));
      }
    }
  }, []);

  const leaveEvent = useCallback(async (eventId) => {
    setJoined(prev => {
      const next = new Set(prev);
      next.delete(eventId);
      return next;
    });
    if (supabase && isUUID(eventId)) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('rsvps').delete().eq('event_id', eventId).eq('user_id', user.id);
        setEvents(prev => prev.map(e =>
          e.id === eventId
            ? { ...e, goingIds: e.goingIds.filter(id => id !== user.id) }
            : e
        ));
      }
    }
  }, []);

  const toggleCommentLike = useCallback(async (commentId) => {
    let wasLiked = false;
    setCommentLikes(prev => {
      wasLiked = !!prev[commentId];
      return { ...prev, [commentId]: !prev[commentId] };
    });
    if (supabase && isUUID(commentId)) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        if (wasLiked) {
          supabase.from('comment_likes').delete().eq('comment_id', commentId).eq('user_id', user.id);
        } else {
          supabase.from('comment_likes').insert({ comment_id: commentId, user_id: user.id });
        }
      }
    }
  }, []);

  const addComment = useCallback(async (eventId, text, userId) => {
    if (!supabase || !userId || !text.trim()) return { error: { message: 'Missing required data' } };
    const { data, error } = await supabase.from('comments').insert({
      event_id: eventId,
      user_id: userId,
      text: text.trim(),
    }).select().single();
    if (error) return { error };
    setEvents(prev => prev.map(e =>
      e.id === eventId
        ? { ...e, comments: [...(e.comments || []), { id: data.id, userId, text: text.trim(), timeLabel: 'just now', likes: 0 }] }
        : e
    ));
    return { data };
  }, []);

  const addEvent = useCallback(async (formData, userId) => {
    if (!supabase || !userId) return { error: { message: 'Not configured or not signed in' } };
    if (!formData.title.trim()) return { error: { message: 'Title is required' } };

    // Build starts_at from when + startTime
    const d = new Date();
    if (formData.when === 'tomorrow') {
      d.setDate(d.getDate() + 1);
    } else if (formData.when === 'pick…' && formData.customDate) {
      const [y, mo, day] = formData.customDate.split('-').map(Number);
      d.setFullYear(y, mo - 1, day);
    }
    // Parse time: accept '18:30' (24h) or '6:30 PM' (12h)
    let th, tmin;
    const t24 = formData.startTime.match(/^(\d{1,2}):(\d{2})$/);
    const t12 = formData.startTime.match(/(\d+):(\d+)\s*(am|pm)/i);
    if (t24) {
      th = parseInt(t24[1]); tmin = parseInt(t24[2]);
    } else if (t12) {
      th = parseInt(t12[1]); tmin = parseInt(t12[2]);
      if (t12[3].toLowerCase() === 'pm' && th !== 12) th += 12;
      if (t12[3].toLowerCase() === 'am' && th === 12) th = 0;
    }
    if (th !== undefined) d.setHours(th, tmin, 0, 0);

    const { data, error } = await supabase.from('events').insert({
      host_id: userId,
      title: formData.title.trim(),
      starts_at: d.toISOString(),
      visibility: formData.visibility,
      place: formData.place.trim() || null,
      description: formData.note.trim() || null,
      duration_label: formData.duration.trim() || null,
    }).select().single();

    if (error) return { error };

    // Compute dateKey relative to today
    const todayMid = new Date(); todayMid.setHours(0, 0, 0, 0);
    const eventDay = new Date(d); eventDay.setHours(0, 0, 0, 0);
    const dayOffset = Math.round((eventDay - todayMid) / 86400000);
    const dateKey = dayOffset === 0 ? 'today' : dayOffset === 1 ? 'tomorrow' : d.toISOString().split('T')[0];
    const displayTime = th !== undefined
      ? `${th % 12 || 12}:${String(tmin).padStart(2, '0')} ${th >= 12 ? 'PM' : 'AM'}`
      : formData.startTime;

    setEvents(prev => [{
      id: data.id,
      title: formData.title.trim(),
      time: displayTime,
      dateKey,
      dateLabel: buildDateLabel(dayOffset),
      hostId: userId,
      place: formData.place.trim() || '',
      duration: formData.duration.trim() || '',
      durationNote: '',
      visibility: formData.visibility,
      photo: 'green',
      goingIds: [],
      description: formData.note.trim() || '',
      comments: [],
    }, ...prev]);

    return { data };
  }, []);

  return (
    <AppContext.Provider value={{
      tab, setTab,
      stacks, current, canGoBack,
      navigate, goBack,
      modal, openModal, closeModal,
      profile, findUser,
      favorites, toggleFavorite,
      joined, joinEvent, leaveEvent,
      events, addEvent, getEventById,
      addComment,
      promptDismissed, setPromptDismissed,
      activeDayIndex, setActiveDayIndex,
      commentLikes, toggleCommentLike,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
