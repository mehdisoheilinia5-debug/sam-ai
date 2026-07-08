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

      {/* هدر (فقط دکمه سه خط + اسم برنامه) */}
      <header className="header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        padding: '12px 20px',
      }}>
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
          fontSize: 'clamp(26px, 5vw, 36px)',
          fontWeight: '700',
          color: 'var(--red)',
          letterSpacing: '-0.5px',
        }}>
          SAM AI
        </h1>
        <div style={{ width: '32px' }} /> {/* فضای خالی برای تراز */}
      </header>

      {/* چت */}
      <ChatInterface />
    </div>
  );
}