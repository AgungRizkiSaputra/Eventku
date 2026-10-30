'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { MOCK_USERS } from '@/lib/mock-data';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  loginAsRole: (role: UserRole) => void;
  register: (data: { email: string; password: string; full_name: string; role?: UserRole }) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'eventku_auth_user_v2';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Restore session from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Default to demo user Andi Pratama (Peserta) for smooth first impression
        const defaultUser = MOCK_USERS.find((u) => u.role === 'user') || MOCK_USERS[0];
        setUser(defaultUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultUser));
      }
    } catch {
      // ignore
    }
  }, []);

  const login = useCallback(async (email: string, _password?: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));

    const found = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    let activeUser: User;

    if (found) {
      activeUser = found;
    } else {
      activeUser = {
        id: `user-${Date.now()}`,
        email,
        full_name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        role: 'user',
        created_at: new Date().toISOString(),
      };
    }

    setUser(activeUser);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(activeUser));
    } catch {}
    setIsLoading(false);
    return true;
  }, []);

  const loginAsRole = useCallback((role: UserRole) => {
    const preset = MOCK_USERS.find((u) => u.role === role);
    if (preset) {
      setUser(preset);
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(preset));
      } catch {}
    }
  }, []);

  const register = useCallback(async (data: { email: string; password: string; full_name: string; role?: UserRole }): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      full_name: data.full_name,
      role: data.role || 'user',
      created_at: new Date().toISOString(),
    };

    setUser(newUser);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    } catch {}
    setIsLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {}
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, role };
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginAsRole, register, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
