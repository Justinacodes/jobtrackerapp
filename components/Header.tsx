"use client";

import React from 'react';
import SparklesIcon from '@/components/icons/SparklesIcon';
import Button from '@/components/Button';

interface HeaderProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onSignupClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white backdrop-blur-sm border-b border-slate-200 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <SparklesIcon className="h-8 w-8 text-indigo-600" />
            <span className="ml-3 text-xl font-bold text-slate-800">AI Job Tracker</span>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={onLoginClick} variant="secondary">Log In</Button>
            <Button onClick={onSignupClick}>Sign Up</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
