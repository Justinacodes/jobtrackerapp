"use client";

import React, { useState } from 'react';
import Button from '@/components/Button';
import { motion, AnimatePresence } from 'framer-motion';
import GoogleIcon from '@/components/icons/GoogleIcon';
import { useAuth } from '@/hooks/useAuth';
import { useToasts } from '@/hooks/useToasts';
import { AppwriteException } from 'appwrite';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onClose: () => void;
  onSwitchMode: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onClose, onSwitchMode }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authProvider, setAuthProvider] = useState<'email' | 'google' | null>(null);
  
  const auth = useAuth();
  const { addToast } = useToasts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthProvider('email');
    setIsLoading(true);
    try {
        if (mode === 'signup') {
            await auth.signup(email, password, name);
        } else {
            await auth.login(email, password);
        }
        addToast({ message: 'Successfully authenticated!', type: 'success' });
        onClose(); // Close modal on success
    } catch (error) {
        console.error("Authentication error:", error);
        const errorMessage = error instanceof AppwriteException ? error.message : "An unexpected error occurred.";
        addToast({ message: errorMessage, type: 'error' });
    } finally {
        setIsLoading(false);
        setAuthProvider(null);
    }
  };

  const handleGoogleSignIn = () => {
    setAuthProvider('google');
    setIsLoading(true);
    try {
        auth.googleLogin();
    } catch (error) {
        console.error("Google sign-in error:", error);
        const errorMessage = error instanceof AppwriteException ? error.message : "Could not initiate Google Sign-In.";
        addToast({ message: errorMessage, type: 'error' });
        setIsLoading(false);
        setAuthProvider(null);
    }
  };

  const title = mode === 'login' ? 'Welcome Back!' : 'Create an Account';
  const buttonText = mode === 'login' ? 'Log In' : 'Sign Up';
  const switchText = mode === 'login' ? "Don't have an account?" : 'Already have an account?';
  const switchLinkText = mode === 'login' ? 'Sign Up' : 'Log In';

  return (
     <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md border border-slate-200 relative"
          >
          <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">{title}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-600">Full Name</label>
                <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full bg-slate-100 border border-slate-300 rounded-md shadow-sm py-2 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-600">Email Address</label>
              <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full bg-slate-100 border border-slate-300 rounded-md shadow-sm py-2 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-600">Password</label>
              <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full bg-slate-100 border border-slate-300 rounded-md shadow-sm py-2 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div className="pt-2">
              <Button type="submit" isLoading={isLoading && authProvider === 'email'} disabled={isLoading} className="w-full">
                {isLoading && authProvider === 'email' ? 'Processing...' : buttonText}
              </Button>
            </div>
          </form>

            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-slate-500">OR</span>
                </div>
            </div>

            <div>
                 <Button
                    type="button"
                    variant="secondary"
                    onClick={handleGoogleSignIn}
                    isLoading={isLoading && authProvider === 'google'}
                    disabled={isLoading}
                    className="w-full"
                >
                    <GoogleIcon className="mr-3 h-5 w-5" />
                    {mode === 'login' ? 'Log in with Google' : 'Sign up with Google'}
                </Button>
            </div>

           <p className="mt-6 text-center text-sm text-slate-500">
            {switchText}{' '}
            <button onClick={onSwitchMode} className="font-medium text-indigo-600 hover:text-indigo-500">
              {switchLinkText}
            </button>
          </p>
          <div className="absolute top-4 right-4">
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthForm;
