'use client';
import { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import SideMenu from './components/SideMenu';

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState('fa');

  useEffect(() => {
    document.body.classList.toggle('light', !isDark);
  }, [isDark]);

  useEffect(() => {
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      padding: '16px',
      fontFamily: 'var(--font-sans)',
      transition: 'all var(--transition)',
    }}>
      {/* منو */}
      <SideMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        isDark={isDark}
        toggleTheme={() => setIsDark(!isDark)}
        lang={lang}
        toggleLang={() => setLang(lang === 'fa' ? 'en' : 'fa')}
      />

      {/* هدر */}
      <header className="header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setMenuOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '24px',
              padding: '4px',
            }}
          >
            ☰
          </button>
          <h1 className="title-font" style={{
            fontSize: 'clamp(22px, 4vw, 30px)',
            fontWeight: '700',
            color: 'var(--red)',
          }}>
            SAM AI
          </h1>
          <span className="header-subtitle">دستیار هنری</span>
        </div>
        <button
          onClick={() => setIsDark(!isDark)}
          style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            borderRadius: '30px',
            padding: '6px 14px',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all var(--transition)',
          }}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </header>

      {/* چت */}
      <ChatInterface />
    </div>
  );
}