'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Lang = 'fa' | 'en';
const STORAGE_KEY = 'sam_ai_settings';

interface SettingsValue {
  lang: Lang;
  isDark: boolean;
  loaded: boolean;
  toggleLang: () => void;
  toggleTheme: () => void;
  t: (fa: string, en: string) => string;
}

const SettingsContext = createContext<SettingsValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('fa');
  const [isDark, setIsDark] = useState(true);
  const [loaded, setLoaded] = useState(false);

  // Restore saved theme/language once on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lang === 'fa' || parsed.lang === 'en') setLang(parsed.lang);
        if (typeof parsed.isDark === 'boolean') setIsDark(parsed.isDark);
      }
    } catch {
      // ignore corrupt storage
    }
    setLoaded(true);
  }, []);

  // Persist on every change (but not before the initial restore finishes,
  // otherwise this would overwrite a saved preference with the defaults)
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ lang, isDark }));
    } catch {
      // ignore write failures
    }
  }, [lang, isDark, loaded]);

  useEffect(() => {
    document.body.classList.toggle('light', !isDark);
  }, [isDark]);

  useEffect(() => {
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = () => setLang((prev) => (prev === 'fa' ? 'en' : 'fa'));
  const toggleTheme = () => setIsDark((prev) => !prev);
  const t = (fa: string, en: string) => (lang === 'fa' ? fa : en);

  return (
    <SettingsContext.Provider value={{ lang, isDark, loaded, toggleLang, toggleTheme, t }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider');
  return ctx;
}
