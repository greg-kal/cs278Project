'use client';
import { AppProvider } from '../lib/AppContext';
import { AppShell } from './AppShell';

export default function TimelineApp() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
