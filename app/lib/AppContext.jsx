'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';

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

  return (
    <AppContext.Provider value={{
      tab, setTab,
      stacks, current, canGoBack,
      navigate, goBack,
      modal, openModal, closeModal,
      favorites, toggleFavorite,
      joined, joinEvent, leaveEvent,
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
