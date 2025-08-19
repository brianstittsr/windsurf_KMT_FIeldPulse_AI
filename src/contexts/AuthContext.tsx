'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fieldPulseAPI } from '@/lib/fieldpulse-api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (apiKey: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  demoMode: boolean;
  enableDemoMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    // Check for demo mode or stored API key on mount
    const isDemoMode = localStorage.getItem('fieldpulse_demo_mode') === 'true';
    if (isDemoMode) {
      enableDemoMode();
    } else {
      const storedApiKey = localStorage.getItem('fieldpulse_api_key');
      if (storedApiKey) {
        validateApiKey(storedApiKey);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  const enableDemoMode = () => {
    setDemoMode(true);
    setUser({
      id: 'demo',
      name: 'Demo User',
      email: 'demo@fieldpulse.com'
    });
    setError(null);
    setIsLoading(false);
    localStorage.setItem('fieldpulse_demo_mode', 'true');
  };

  const validateApiKey = async (apiKey: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // For demo purposes, we'll skip actual API validation
      // In a real implementation, you would validate against the FieldPulse API
      setUser({
        id: '1',
        name: 'API User',
        email: 'user@company.com'
      });
      localStorage.setItem('fieldpulse_api_key', apiKey);
      localStorage.removeItem('fieldpulse_demo_mode');
      setDemoMode(false);
    } catch (err) {
      setError('Invalid API key or unable to connect to FieldPulse API');
      setUser(null);
      localStorage.removeItem('fieldpulse_api_key');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (apiKey: string) => {
    await validateApiKey(apiKey);
  };

  const logout = () => {
    setUser(null);
    setError(null);
    setDemoMode(false);
    localStorage.removeItem('fieldpulse_api_key');
    localStorage.removeItem('fieldpulse_demo_mode');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    error,
    demoMode,
    enableDemoMode
  };

  return (
    <AuthContext.Provider value={value}>
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
