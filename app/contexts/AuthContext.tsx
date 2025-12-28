"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types/workflow';
import usersData from '@/data/users.json';

interface AuthContextType {
  user: User | null;
  login: (email: string) => User | null;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          localStorage.removeItem('currentUser');
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email: string): User | null => {
    const foundUser = usersData.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
      }
      return foundUser;
    }
    return null;
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

