'use client';
import { ReactNode } from 'react';
import { SettingsProvider, useSettings } from './SettingsContext';
import { AuthProvider } from './AuthContext';
import { ChatHistoryProvider } from './ChatHistoryContext';

function InnerProviders({ children }: { children: ReactNode }) {
  const { lang, loaded } = useSettings();
  return (
    <AuthProvider>
      <ChatHistoryProvider lang={lang} settingsLoaded={loaded}>
        {children}
      </ChatHistoryProvider>
    </AuthProvider>
  );
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <InnerProviders>{children}</InnerProviders>
    </SettingsProvider>
  );
}
