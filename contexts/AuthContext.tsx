"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as appwrite from '@/services/appwrite';
import { User } from '@/types';
import Spinner from '@/components/Spinner';

interface AuthContextType {
  user: User;
  isLoading: boolean;
  login: (email, password) => Promise<void>;
  signup: (email, password, name) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await appwrite.getAccount();
        setUser(currentUser);
      } catch (error) {
        // Not logged in
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email, password) => {
    await appwrite.login(email, password);
    const currentUser = await appwrite.getAccount();
    setUser(currentUser);
  };

  const signup = async (email, password, name) => {
    await appwrite.signup(email, password, name);
    await login(email, password);
  };
  
  const googleLogin = () => {
    appwrite.createGoogleSession();
  };

  const logout = async () => {
    await appwrite.logout();
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
