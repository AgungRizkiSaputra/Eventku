'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { MOCK_USERS } from '@/lib/mock-data';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { email: string; password: string; full_name: string }) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 800));

    const found = MOCK_USERS.find(u => u.email === email);
    if (found) {
      setUser(found);
      setIsLoading(false);
      return true;
    }

    // For demo: any email works, creates a user account
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      full_name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      role: 'user',
      created_at: new Date().toISOString(),
    };
    setUser(newUser);
    setIsLoading(false);
    return true;
  }, []);

  const register = useCallback(async (data: { email: string; password: string; full_name: string }): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      full_name: data.full_name,
      role: 'user',
      created_at: new Date().toISOString(),
    };
    setUser(newUser);
    setIsLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, switchRole }}>
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

