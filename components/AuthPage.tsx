"use client";

import React, { useState } from 'react';
import AuthForm from '@/components/AuthForm';
import SparklesIcon from '@/components/icons/SparklesIcon';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AuthPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);

  const handleSwitchMode = () => {
    setAuthMode(prev => prev === 'login' ? 'signup' : 'login');
  };

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex flex-col"
    >
       <Header 
            onLoginClick={() => setAuthMode('login')}
            onSignupClick={() => setAuthMode('signup')}
        />
        
        <main className="flex-grow flex flex-col items-center justify-center p-4 pt-24">
           <div className="text-center mb-10">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
                AI Job Tracker
              </h1>
              <p className="mt-2 text-lg text-slate-600 max-w-2xl mx-auto">
                Your intelligent assistant for the job hunt. Track applications, analyze resumes, generate cover letters, and prepare for interviews—all in one place.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-lg max-w-4xl w-full">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Key Features</h2>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div className="flex flex-col items-center p-4">
                        <SparklesIcon className="h-8 w-8 text-indigo-500 mb-2"/>
                        <h3 className="font-semibold text-slate-900">AI-Powered Insights</h3>
                        <p className="text-sm text-slate-500">Get instant resume feedback and generate tailored cover letters.</p>
                    </div>
                    <div className="flex flex-col items-center p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                        <h3 className="font-semibold text-slate-900">Centralized Tracking</h3>
                        <p className="text-sm text-slate-500">Manage all your job applications from a single, intuitive dashboard.</p>
                    </div>
                     <div className="flex flex-col items-center p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        <h3 className="font-semibold text-slate-900">Interview Prep</h3>
                        <p className="text-sm text-slate-500">Generate potential interview questions based on the job description.</p>
                    </div>
                </div>
            </div>
        </main>

      <Footer />

      {authMode && (
        <AuthForm
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSwitchMode={handleSwitchMode}
        />
      )}
    </motion.div>
  );
};

export default AuthPage;
