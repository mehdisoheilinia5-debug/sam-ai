'use client';
import { useState, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';

export default function AuthScreen() {
  const { status, signUp, logIn, error, requestPasswordReset, clearError } = useAuth();
  const { t } = useSettings();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (status === 'confirm-email') {
    return (
      <div
        style={{
          height: 'var(--app-height, 100dvh)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          background: 'var(--bg-primary)',
        }}
      >
        <div style={{ maxWidth: 340, textAlign: 'center' }}>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 700,
              fontSize: 24,
              background: 'linear-gradient(135deg, var(--red-light), var(--red-dark))',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: 12,
            }}
          >
            SAM AI
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            {t(
              'یه لینک تأیید به ایمیلت فرستادیم. روش کلیک کن، بعد برگرد همینجا و وارد شو.',
              'We sent a confirmation link to your email. Click it, then come back here and log in.'
            )}
          </p>
        </div>
      </div>
    );
  }

  const isSignup = mode === 'signup';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    if (isSignup) {
      await signUp(email, displayName, password);
    } else {
      await logIn(email, password);
    }
    setSubmitting(false);
  };

  const handleForgot = async () => {
    if (!email.trim()) return;
    await requestPasswordReset(email);
    setResetSent(true);
  };

  return (
    <div
      style={{
        height: 'var(--app-height, 100dvh)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        background: 'var(--bg-primary)',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: 340,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 16,
          padding: 26,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 700,
            textAlign: 'center',
            fontSize: 26,
            background: 'linear-gradient(135deg, var(--red-light), var(--red-dark))',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: 2,
          }}
        >
          SAM AI
        </h2>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>
          {isSignup ? t('یک حساب کاربری بساز', 'Create your account') : t('وارد حساب کاربری‌ات شو', 'Log in to your account')}
        </p>

        {isSignup && (
          <input
            className="input-field"
            placeholder={t('نام نمایشی', 'Display name')}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        )}
        <input
          className="input-field"
          type="email"
          placeholder={t('ایمیل', 'Email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input-field"
          type="password"
          placeholder={t('رمز عبور', 'Password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        {error && (
          <p style={{ color: '#ef4444', fontSize: 12, textAlign: 'center', margin: 0 }}>
            {error === 'mismatch'
              ? t('ایمیل یا رمز عبور اشتباهه', 'Incorrect email or password')
              : error === 'invalid'
              ? t('لطفاً همه‌ی فیلدها رو درست پر کن (رمز حداقل ۶ کاراکتر)', 'Please fill in every field correctly (password min. 6 characters)')
              : error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            marginTop: 4,
            padding: '11px 16px',
            borderRadius: 24,
            border: 'none',
            background: 'var(--red-gradient)',
            color: '#fff',
            fontWeight: 600,
            fontSize: 14,
            cursor: submitting ? 'default' : 'pointer',
            opacity: submitting ? 0.6 : 1,
          }}
        >
          {isSignup ? t('ساخت حساب', 'Create account') : t('ورود', 'Log in')}
        </button>

        <button
          type="button"
          onClick={() => {
            setMode(isSignup ? 'login' : 'signup');
            clearError();
          }}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer' }}
        >
          {isSignup ? t('حساب داری؟ وارد شو', 'Already have an account? Log in') : t('حساب نداری؟ بساز', "Don't have an account? Sign up")}
        </button>

        {!isSignup && (
          <button
            type="button"
            onClick={handleForgot}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 11, cursor: 'pointer', opacity: 0.8 }}
          >
            {resetSent ? t('لینک بازیابی ارسال شد ✓', 'Reset link sent ✓') : t('رمز رو فراموش کردم', 'Forgot password')}
          </button>
        )}
      </form>
    </div>
  );
}
