'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  name: string;
  email: string;
  role: 'super_admin';
  initials: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'cody_master_auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.isLoggedIn) {
          setUser(parsed.user);
          setIsLoggedIn(true);
        }
      }
    } catch {
      // Ignore JSON parse errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const isMasterRoute = pathname?.startsWith('/master');
    const isLoginRoute = pathname === '/login';

    if (isMasterRoute && !isLoggedIn) {
      router.push('/login');
    } else if (isLoginRoute && isLoggedIn) {
      router.push('/master/dashboard');
    }
  }, [isLoading, isLoggedIn, pathname, router]);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    // Simulated network delay for realistic experience
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (email.trim().toLowerCase() === 'admin@codymaster.com' && pass === 'Admin@2026') {
      const superAdminUser: User = {
        name: 'Super Admin',
        email: 'admin@codymaster.com',
        role: 'super_admin',
        initials: 'SA'
      };
      setUser(superAdminUser);
      setIsLoggedIn(true);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ isLoggedIn: true, user: superAdminUser }));
      } catch {
        // Ignore localStorage quota
      }
      return { success: true };
    }

    return { success: false, error: 'Invalid credentials. Use demo: admin@codymaster.com / Admin@2026' };
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
