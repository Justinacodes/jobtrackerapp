"use client";

import React from 'react';
import AuthPage from '@/components/AuthPage';
import MainApp from '@/components/MainApp';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { user } = useAuth();
  
  return (
    <AnimatePresence mode="wait">
      {!user ? (
        <AuthPage key="auth-page" />
      ) : (
        <MainApp key="main-app" />
      )}
    </AnimatePresence>
  );
};
