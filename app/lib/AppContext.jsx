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
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) return;
      supabase.from('profiles').select().eq('id', data.user.id).single()
        .then(({ data: p }) => { if (p) setProfile(p); });
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

    const d = new Date();
    if (formData.when === 'tomorrow') d.setDate(d.getDate() + 1);
    const m = formData.startTime.match(/(\d+):(\d+)\s*(am|pm)/i);
    if (m) {
      let h = parseInt(m[1]);
      const min = parseInt(m[2]);
      if (m[3].toLowerCase() === 'pm' && h !== 12) h += 12;
      if (m[3].toLowerCase() === 'am' && h === 12) h = 0;
      d.setHours(h, min, 0, 0);
    }

    const { data, error } = await supabase.from('events').insert({
      host_id: userId,
      title: formData.title.trim(),
      starts_at: d.toISOString(),
      visibility: formData.visibility,
      place: formData.place.trim() || null,
      description: formData.note.trim() || null,
      duration_label: formData.duration || null,
    }).select().single();

    if (error) return { error };

    const offset = formData.when === 'tomorrow' ? 1 : 0;
    setEvents(prev => [{
      id: data.id,
      title: formData.title.trim(),
      time: formData.startTime,
      dateKey: formData.when === 'today' ? 'today' : 'tomorrow',
      dateLabel: buildDateLabel(offset),
      hostId: userId,
      place: formData.place.trim() || '',
      duration: formData.duration || '',
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
