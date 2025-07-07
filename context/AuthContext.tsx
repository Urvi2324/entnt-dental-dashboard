
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';
import { storageService } from '../services/storageService';
import { MOCK_USERS } from '../constants';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize users in local storage if not present
    if (!storageService.getItem('users')) {
      storageService.setItem('users', MOCK_USERS);
    }

    // Check for persisted user session
    const sessionUser = storageService.getItem<User>('sessionUser');
    if (sessionUser) {
      setUser(sessionUser);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    const users = storageService.getItem<User[]>('users') || [];
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      const { password: _, ...userToStore } = foundUser;
      setUser(userToStore);
      storageService.setItem('sessionUser', userToStore);
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    storageService.removeItem('sessionUser');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
