'use client';
import { useApp } from '../lib/AppContext';
import { TabBar } from './layout/TabBar';
import { Fab } from './layout/Fab';
import { FeedScreen } from './screens/FeedScreen';
import { EventDetailScreen } from './screens/EventDetailScreen';
import { CommentsScreen } from './screens/CommentsScreen';
import { AddEventScreen } from './screens/AddEventScreen';
import { FriendsScreen } from './screens/FriendsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ActivityScreen } from './screens/ActivityScreen';
import { YouScreen } from './screens/YouScreen';
import { RsvpConfirmSheet } from './screens/RsvpConfirmSheet';

function renderScreen(screen, params) {
  switch (screen) {
    case 'feed':        return <FeedScreen />;
    case 'eventDetail': return <EventDetailScreen params={params} />;
    case 'comments':    return <CommentsScreen params={params} />;
    case 'friends':     return <FriendsScreen />;
    case 'profile':     return <ProfileScreen params={params} />;
    case 'activity':    return <ActivityScreen />;
    case 'you':         return <YouScreen />;
    default:            return null;
  }
}

// Screens that should hide the tab bar and FAB (full-screen navigation)
const FULLSCREEN = ['eventDetail', 'comments', 'profile'];

export function AppShell() {
  const { current, modal, closeModal } = useApp();
  const isFullscreen = FULLSCREEN.includes(current.screen);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: 390,
      margin: '0 auto',
      height: '100dvh',
      overflow: 'hidden',
      background: 'var(--paper)',
      boxShadow: '0 0 0 1px var(--hair), 0 24px 80px rgba(0,0,0,.12)',
    }}>
      {/* Main screen */}
      <div key={`${current.screen}-${JSON.stringify(current.params)}`} style={{
        position: 'absolute', inset: 0,
        animation: 'fadeIn var(--m-page)',
      }}>
        {renderScreen(current.screen, current.params)}
      </div>

      {/* Tab bar + FAB (hidden on fullscreen detail views) */}
      {!isFullscreen && (
        <>
          <TabBar />
          <Fab />
        </>
      )}

      {/* Modal overlays */}
      {modal?.type === 'rsvpConfirm' && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 40, pointerEvents: 'all' }}>
          <RsvpConfirmSheet params={modal.params} onClose={closeModal} />
        </div>
      )}

      {modal?.type === 'addEvent' && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 40,
          animation: 'slideUp var(--m-sheet)',
        }}>
          <AddEventScreen
            onClose={closeModal}
            prefill={modal.params?.prefill}
            editMode={modal.params?.editMode}
            eventId={modal.params?.eventId}
          />
        </div>
      )}
    </div>
  );
}
