'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Account = { username: string; displayName: string; passwordHash: string };

const ACCOUNT_KEY = 'sam_ai_account';
const SESSION_KEY = 'sam_ai_session';

type Status = 'loading' | 'signup' | 'login' | 'authenticated';

interface AuthValue {
  status: Status;
  account: Account | null;
  error: string | null;
  signUp: (username: string, displayName: string, password: string) => Promise<void>;
  logIn: (username: string, password: string) => Promise<void>;
  logOut: () => void;
  updateProfile: (displayName: string, newPassword?: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

async function hash(pw: string): Promise<string> {
  const data = new TextEncoder().encode(pw);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('loading');
  const [account, setAccount] = useState<Account | null>(null);
  const [error, setError] = useState<string | null>(null);

  // On mount: if an account exists and a session flag is set, log straight
  // in (this is what keeps a refresh from asking for the password again).
  // If an account exists but there's no session, the password must be
  // entered again — this only happens after an explicit log-out.
  useEffect(() => {
    try {
      const savedAccount = localStorage.getItem(ACCOUNT_KEY);
      const savedSession = localStorage.getItem(SESSION_KEY);
      if (savedAccount) {
        const parsed: Account = JSON.parse(savedAccount);
        setAccount(parsed);
        setStatus(savedSession === '1' ? 'authenticated' : 'login');
      } else {
        setStatus('signup');
      }
    } catch {
      setStatus('signup');
    }
  }, []);

  const signUp = async (username: string, displayName: string, password: string) => {
    setError(null);
    const trimmedUser = username.trim();
    if (!trimmedUser || !displayName.trim() || password.length < 4) {
      setError('invalid');
      return;
    }
    const passwordHash = await hash(password);
    const newAccount: Account = { username: trimmedUser, displayName: displayName.trim(), passwordHash };
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(newAccount));
    localStorage.setItem(SESSION_KEY, '1');
    setAccount(newAccount);
    setStatus('authenticated');
  };

  const logIn = async (username: string, password: string) => {
    setError(null);
    if (!account) {
      setError('mismatch');
      return;
    }
    const passwordHash = await hash(password);
    if (username.trim() === account.username && passwordHash === account.passwordHash) {
      localStorage.setItem(SESSION_KEY, '1');
      setStatus('authenticated');
    } else {
      setError('mismatch');
    }
  };

  const logOut = () => {
    localStorage.removeItem(SESSION_KEY);
    setStatus('login');
  };

  const updateProfile = async (displayName: string, newPassword?: string) => {
    if (!account) return;
    const passwordHash = newPassword && newPassword.length >= 4 ? await hash(newPassword) : account.passwordHash;
    const updated: Account = {
      ...account,
      displayName: displayName.trim() || account.displayName,
      passwordHash,
    };
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(updated));
    setAccount(updated);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ status, account, error, signUp, logIn, logOut, updateProfile, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
