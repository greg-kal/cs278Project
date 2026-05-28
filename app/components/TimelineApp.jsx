'use client';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '../lib/AuthContext';
import { AppProvider } from '../lib/AppContext';
import { AppShell } from './AppShell';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { AuthScreen } from './screens/AuthScreen';

function AuthGate() {
  const { session } = useAuth();
  const [authMode, setAuthMode] = useState(null); // null | 'signup' | 'login'

  // Reset to WelcomeScreen whenever the user is signed out
  useEffect(() => {
    if (session === null) setAuthMode(null);
  }, [session]);

  // Still resolving session
  if (session === undefined) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--paper)',
      }} />
    );
  }

  // Authenticated — show the app
  if (session) {
    return (
      <AppProvider>
        <AppShell />
      </AppProvider>
    );
  }

  // Unauthenticated — show auth flow
  if (authMode) {
    return (
      <AuthScreen mode={authMode} onBack={() => setAuthMode(null)} />
    );
  }

  return (
    <WelcomeScreen
      onSignUp={() => setAuthMode('signup')}
      onLogIn={() => setAuthMode('login')}
    />
  );
}

export default function TimelineApp() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}
