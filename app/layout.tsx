import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/contexts/ToastContext';
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'AI Job Tracker',
  description: 'An intuitive platform to streamline the job search process by organizing applications and providing AI-driven insights for resume analysis, cover letter generation, and interview preparation.',
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%234f46e5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3L9.5 8.5L4 10L9.5 11.5L12 17L14.5 11.5L20 10L14.5 8.5L12 3z'/%3E%3Cpath d='M5 21L6 17'/%3E%3Cpath d='M19 21L18 17'/%3E%3C/svg%3E",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
