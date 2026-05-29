'use client';
import { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from './supabase';
import { EVENTS, buildDateLabel } from './data';

const AppContext = createContext(null);

const INITIAL_STACKS = {
  feed:     [{ screen: 'feed',     params: {} }],
  friends:  [{ screen: 'friends',  params: {} }],
  activity: [{ screen: 'activity', params: {} }],
  you:      [{ screen: 'you',      params: {} }],
};

export function AppProvider({ children }) {
  const [tab, setTabState] = useState('feed');
  const [stacks, setStacks] = useState(INITIAL_STACKS);
  const [modal, setModal] = useState(null);

  const [events, setEvents] = useState(EVENTS);
  const [favorites, setFavorites] = useState(new Set(['maya', 'greg', 'sam', 'jess']));
  const [joined, setJoined] = useState(new Set(['dinner']));
  const [promptDismissed, setPromptDismissed] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [commentLikes, setCommentLikes] = useState({});

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

  const toggleFavorite = useCallback((userId) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(userId) ? next.delete(userId) : next.add(userId);
      return next;
    });
  }, []);

  const joinEvent = useCallback((eventId) => {
    setJoined(prev => {
      const next = new Set(prev);
      next.add(eventId);
      return next;
    });
  }, []);

  const leaveEvent = useCallback((eventId) => {
    setJoined(prev => {
      const next = new Set(prev);
      next.delete(eventId);
      return next;
    });
  }, []);

  const toggleCommentLike = useCallback((commentId) => {
    setCommentLikes(prev => ({ ...prev, [commentId]: !prev[commentId] }));
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
      favorites, toggleFavorite,
      joined, joinEvent, leaveEvent,
      events, addEvent,
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
