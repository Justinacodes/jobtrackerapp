"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { JobApplication, ApplicationStatus, AIFeature, ApplicationFormData } from '@/types';
import ApplicationList from '@/components/ApplicationList';
import ApplicationForm from '@/components/ApplicationForm';
import JobPrepToolkitModal from '@/components/JobPrepToolkitModal';
import Dashboard from '@/components/Dashboard';
import PlusIcon from '@/components/icons/PlusIcon';
import LogoutIcon from '@/components/icons/LogoutIcon';
import Button from '@/components/Button';
import { motion } from 'framer-motion';
import { useToasts } from '@/hooks/useToasts';
import ConfirmationModal from '@/components/ConfirmationModal';
import SuggestionModal from '@/components/SuggestionModal';
import BriefcaseIcon from '@/components/icons/BriefcaseIcon';
import ActionItems from '@/components/ActionItems';
import { useAuth } from '@/hooks/useAuth';
import * as appwrite from '@/services/appwrite';
import Spinner from './Spinner';

const MainApp: React.FC = () => {
  const { addToast } = useToasts();
  const { user, logout } = useAuth();
  
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApplications = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const userApplications = await appwrite.getApplications(user.$id);
      setApplications(userApplications);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      addToast({ message: "Could not load your applications.", type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [user, addToast]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [applicationToEdit, setApplicationToEdit] = useState<JobApplication | null>(null);
  
  const [isPrepToolkitOpen, setIsPrepToolkitOpen] = useState(false);
  const [initialToolkitState, setInitialToolkitState] = useState<{ tool: AIFeature, jobDescription: string, role: string } | null>(null);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [applicationToDeleteId, setApplicationToDeleteId] = useState<string | null>(null);
  
  const [prepSuggestion, setPrepSuggestion] = useState<{ isOpen: boolean; application: JobApplication | null }>({ isOpen: false, application: null });

  const handleOpenForm = (app: JobApplication | null = null) => {
    setApplicationToEdit(app);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setApplicationToEdit(null);
  };

  const handleSaveApplication = async (appData: ApplicationFormData) => {
    if (!user) return;

    try {
        let savedApp: JobApplication;
        const isEditing = applicationToEdit !== null;

        if (isEditing && applicationToEdit) {
            savedApp = await appwrite.updateApplication(applicationToEdit.id, appData);
            setApplications(prev => prev.map(a => a.id === savedApp.id ? savedApp : a));
        } else {
            savedApp = await appwrite.addApplication(user.$id, appData);
            setApplications(prev => [savedApp, ...prev].sort((a, b) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime()));
        }

        addToast({ message: `Application ${isEditing ? 'updated' : 'added'}!`, type: 'success' });

        if (!isEditing && savedApp.status === ApplicationStatus.Applied) {
            setPrepSuggestion({ isOpen: true, application: savedApp });
        }
    } catch (error) {
        console.error("Failed to save application", error);
        addToast({ message: 'Could not save application. Please try again.', type: 'error' });
    }
  };

  const handleDeleteRequest = (id: string) => {
    setApplicationToDeleteId(id);
    setIsDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (applicationToDeleteId) {
      try {
        await appwrite.deleteApplication(applicationToDeleteId);
        setApplications(prev => prev.filter(a => a.id !== applicationToDeleteId));
        addToast({ message: 'Application deleted.', type: 'success' });
      } catch (error) {
        console.error("Failed to delete application", error);
        addToast({ message: 'Could not delete application.', type: 'error' });
      }
    }
    handleCancelDelete();
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setApplicationToDeleteId(null);
  };

  const handleAcceptPrepSuggestion = () => {
    if (prepSuggestion.application) {
      handleStartInterviewPrep(prepSuggestion.application);
    }
    setPrepSuggestion({ isOpen: false, application: null });
  };
  
  const handleDeclinePrepSuggestion = () => {
    setPrepSuggestion({ isOpen: false, application: null });
  };
  
  const handleStartInterviewPrep = (application: JobApplication) => {
    if (!application.jobDescription?.trim()) {
      addToast({
        type: 'error',
        message: 'Add a job description to generate interview questions.'
      });
      handleOpenForm(application);
      return;
    }
    setInitialToolkitState({
      tool: AIFeature.InterviewPrep,
      role: application.role,
      jobDescription: application.jobDescription,
    });
    setIsPrepToolkitOpen(true);
  };
  
  const handleDismissFollowUp = async (id: string) => {
     const appToUpdate = applications.find(app => app.id === id);
     if (!appToUpdate) return;
     
     const { id: docId, userId, $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions, ...appData } = appToUpdate;
     
     try {
        const updatedApp = await appwrite.updateApplication(docId, { ...appData, followUpDismissed: true });
        setApplications(prev => prev.map(app => app.id === id ? updatedApp : app));
        addToast({ message: 'Reminder dismissed.', type: 'success' });
     } catch(error) {
        console.error("Failed to dismiss reminder", error);
        addToast({ message: 'Could not dismiss reminder.', type: 'error'});
     }
  };
  
  const handleLogout = async () => {
    try {
        await logout();
        addToast({ message: "You've been logged out.", type: 'success' });
    } catch(error) {
        console.error("Logout failed", error);
        addToast({ message: 'Logout failed. Please try again.', type: 'error' });
    }
  }

  const handleCloseToolkit = () => {
    setIsPrepToolkitOpen(false);
    setInitialToolkitState(null);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-4 sm:p-6 lg:p-8"
    >
      <div className="max-w-4xl mx-auto">
        <header className="relative flex flex-col items-center text-center mb-10">
          <button 
            onClick={() => setIsLogoutModalOpen(true)}
            className="absolute top-0 right-0 flex items-center gap-2 px-3 py-2 bg-white text-slate-600 rounded-lg hover:bg-slate-100 border border-slate-300 transition-colors text-sm"
            aria-label="Logout"
          >
            <LogoutIcon className="h-4 w-4" />
            <span>Logout</span>
          </button>
          <h1 className="text-2xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
            AI Job Tracker
          </h1>
          <p className="mt-2 text-lg text-slate-600">Welcome, {user?.name}! Streamline your job hunt.</p>
        </header>

        <main>
          <Dashboard applications={applications} />
          
          <ActionItems applications={applications} onDismiss={handleDismissFollowUp} />

          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-slate-800">My Applications</h2>
            <div className="flex gap-3">
              <Button onClick={() => setIsPrepToolkitOpen(true)} variant="secondary">
                <BriefcaseIcon className="h-5 w-5 mr-2" />
                Job Prep Toolkit
              </Button>
              <Button onClick={() => handleOpenForm()}>
                <PlusIcon className="h-5 w-5 mr-1" />
                Add Application
              </Button>
            </div>
          </div>
          
           {isLoading ? (
             <div className="flex justify-center items-center py-16"><Spinner className="h-8 w-8"/></div>
           ) : (
             <ApplicationList
                applications={applications}
                onEdit={handleOpenForm}
                onDelete={handleDeleteRequest}
                onStartInterviewPrep={handleStartInterviewPrep}
             />
           )}
        </main>
      </div>

      <ApplicationForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveApplication}
        applicationToEdit={applicationToEdit}
      />
      
      <JobPrepToolkitModal 
        isOpen={isPrepToolkitOpen}
        onClose={handleCloseToolkit}
        initialState={initialToolkitState}
      />

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmText="Logout"
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to permanently delete this application? This action cannot be undone."
        confirmText="Delete"
      />

      <SuggestionModal
        isOpen={prepSuggestion.isOpen}
        onClose={handleDeclinePrepSuggestion}
        onConfirm={handleAcceptPrepSuggestion}
        title="Get Prepared!"
        message="Application added! A great next step is preparing for the interview. Would you like to generate potential questions now?"
        confirmText="Prepare Now"
        cancelText="Maybe Later"
      />
    </motion.div>
  );
};

export default MainApp;