'use client';
import ChatInterface from './components/ChatInterface';

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#f5f5f5',
      padding: '20px',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px',
        background: '#141414',
        borderRadius: '16px',
        border: '1px solid rgba(255,107,0,0.1)',
        marginBottom: '24px',
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #ff6b00, #ff8c38)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          🎭 SAM AI
        </h1>
        <span style={{ fontSize: '14px', opacity: 0.5 }}>دستیار شخصی هنری</span>
      </header>

      <ChatInterface />
    </div>
  );
}