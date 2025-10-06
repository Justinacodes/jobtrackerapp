import React from 'react';
import AuthPage from './components/AuthPage';
import MainApp from './components/MainApp';
import { AnimatePresence } from 'framer-motion';
// FIX: Import useAuth hook to consume the authentication context.
import { useAuth } from './hooks/useAuth';
//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

const App: React.FC = () => {
  // FIX: Use the user object from the authentication context as the source of truth.
  const { user } = useAuth();

  // This component no longer needs to manage its own auth state or pass callbacks.
  // The context handles state changes automatically.

  return (
    <AnimatePresence mode="wait">
      {!user ? (
        // FIX: Removed unnecessary onLoginSuccess prop. Auth is handled by context.
        <AuthPage key="auth-page" />
      ) : (
        // FIX: Removed unnecessary onLogout prop. MainApp handles its own logout logic.
        <MainApp key="main-app" />
      )}
    </AnimatePresence>
  );
};

export default App;
