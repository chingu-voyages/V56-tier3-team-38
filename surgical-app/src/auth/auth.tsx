'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from './roles';
import { DEFAULT_GUEST_SESSION, findUserByCredentials } from './roles';
import { useRouter } from 'next/navigation';

type AuthContextValue = {
  session: Session;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const LS_KEY = 'app_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session>(null);
  const router = useRouter();

  // Load session from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        setSession(JSON.parse(raw));
      } else {
        setSession(DEFAULT_GUEST_SESSION);
      }
    } catch {
      setSession(DEFAULT_GUEST_SESSION);
    }
  }, []);

  // Persist session
  useEffect(() => {
    if (!session || session.role === 'guest') {
      localStorage.removeItem(LS_KEY);
      return;
    }
    localStorage.setItem(LS_KEY, JSON.stringify(session));
  }, [session]);

  async function login(email: string, password: string) {
    const user = findUserByCredentials(email, password);
    if (!user) throw new Error('Invalid credentials.');
    setSession({ role: user.role, email: user.email, name: user.name });
  }

  function logout() {
    setSession(DEFAULT_GUEST_SESSION);
    router.push('/');
  }

  return <AuthContext.Provider value={{ session, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
