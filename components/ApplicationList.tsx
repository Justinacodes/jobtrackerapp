"use client";

import React from 'react';
import { JobApplication } from '@/types';
import { STATUS_COLORS } from '@/constants';
import EditIcon from '@/components/icons/EditIcon';
import TrashIcon from '@/components/icons/TrashIcon';
import { motion, Variants } from 'framer-motion';
import InterviewPrepIcon from '@/components/icons/InterviewPrepIcon';

interface ApplicationListProps {
  applications: JobApplication[];
  onEdit: (application: JobApplication) => void;
  onDelete: (id: string) => void;
  onStartInterviewPrep: (application: JobApplication) => void;
}

const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const ApplicationList: React.FC<ApplicationListProps> = ({ applications, onEdit, onDelete, onStartInterviewPrep }) => {
  if (applications.length === 0) {
    return (
      <div className="text-center text-slate-500 py-16 border-2 border-dashed border-slate-300 rounded-xl">
        <h3 className="text-lg font-semibold">No Applications Found</h3>
        <p>Click "Add Application" to get started!</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={listVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {applications.map((app) => (
        <motion.div
          key={app.id}
          variants={itemVariants}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
        >
          <div className="flex flex-col md:flex-row justify-between md:items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                 <h3 className="text-xl font-bold text-slate-800">{app.role}</h3>
                 <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[app.status]}`}>
                  {app.status}
                </span>
              </div>
              <p className="text-slate-600">{app.company}</p>
              {app.link && (
                <a href={app.link} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline break-all">
                  View Job Posting
                </a>
              )}
            </div>
            <div className="flex-shrink-0 mt-4 md:mt-0 md:ml-6 flex items-center gap-2">
                <button
                  onClick={() => onStartInterviewPrep(app)}
                  className="group relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition"
                  aria-label="Interview Prep"
                >
                  <InterviewPrepIcon className="h-5 w-5" />
                  <span className="absolute bottom-full mb-2 w-max px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none left-1/2 -translate-x-1/2 z-10">
                    Interview Prep
                  </span>
                </button>
                <button 
                  onClick={() => onEdit(app)} 
                  className="group relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition" 
                  aria-label="Edit Application"
                >
                  <EditIcon className="h-5 w-5"/>
                  <span className="absolute bottom-full mb-2 w-max px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none left-1/2 -translate-x-1/2 z-10">
                    Edit Application
                  </span>
                </button>
                <button
                  onClick={() => onDelete(app.id)}
                  className="group relative p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                  aria-label="Delete Application"
                >
                  <TrashIcon className="h-5 w-5"/>
                   <span className="absolute bottom-full mb-2 w-max px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none left-1/2 -translate-x-1/2 z-10">
                    Delete Application
                  </span>
                </button>
            </div>
          </div>
          {app.notes && (
            <p className="text-sm text-slate-500 mt-3 pt-3 border-t border-slate-200">{app.notes}</p>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ApplicationList;
