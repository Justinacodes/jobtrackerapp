"use client";

import React from 'react';
import { JobApplication, ApplicationStatus } from '@/types';
import BellIcon from '@/components/icons/BellIcon';
import XIcon from '@/components/icons/XIcon';
import CheckCircleIcon from '@/components/icons/CheckCircleIcon';
import { motion, AnimatePresence } from 'framer-motion';

interface ActionItemsProps {
  applications: JobApplication[];
  onDismiss: (id: string) => void;
}

const getDaysSince = (dateString: string): number => {
  const date = new Date(dateString);
  const today = new Date();
  // Reset time part to compare dates only
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffTime = today.getTime() - date.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

const ActionItems: React.FC<ActionItemsProps> = ({ applications, onDismiss }) => {
  const followUpReminders = applications.filter(app => {
    const daysSinceApplied = getDaysSince(app.dateApplied);
    return (
      app.status === ApplicationStatus.Applied &&
      daysSinceApplied >= 7 && // Reverted back to 7 days for production
      !app.followUpDismissed
    );
  });

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Action Items</h2>
      <div className="space-y-3">
        <AnimatePresence>
          {followUpReminders.length > 0 ? (
            followUpReminders.map(app => {
              const daysSinceApplied = getDaysSince(app.dateApplied);
              const reminderMessage = `It's been ${daysSinceApplied} day${daysSinceApplied !== 1 ? 's' : ''}. Time to send a follow-up for the`;

              return (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                  className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center">
                    <BellIcon className="h-6 w-6 text-amber-500 mr-4 flex-shrink-0" />
                    <p className="text-sm text-amber-800">
                      {reminderMessage}{' '}
                      <span className="font-bold">{app.role}</span> role at{' '}
                      <span className="font-bold">{app.company}</span>.
                    </p>
                  </div>
                  <button
                    onClick={() => onDismiss(app.id)}
                    className="p-1.5 text-amber-500 hover:text-amber-700 hover:bg-amber-100 rounded-full transition-colors ml-4 flex-shrink-0"
                    aria-label={`Dismiss follow-up for ${app.role} at ${app.company}`}
                  >
                    <XIcon className="h-5 w-5" />
                  </button>
                </motion.div>
              );
            })
          ) : (
             <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-slate-500 py-10 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50"
             >
              <CheckCircleIcon className="h-10 w-10 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold">No Reminders Right Now</h3>
              <p>You're all caught up!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ActionItems;