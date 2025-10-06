"use client";

import React, { useState, useEffect } from 'react';
import { JobApplication, ApplicationStatus } from '@/types';
import Button from '@/components/Button';
import { motion, AnimatePresence } from 'framer-motion';

type ApplicationFormData = Omit<JobApplication, 'id' | '$id' | '$collectionId' | '$databaseId' | '$createdAt' | '$updatedAt' | '$permissions' | 'userId'>

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (application: ApplicationFormData) => Promise<void>;
  applicationToEdit: JobApplication | null;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ isOpen, onClose, onSave, applicationToEdit }) => {
  const [formData, setFormData] = useState<ApplicationFormData>({
    company: '',
    role: '',
    status: ApplicationStatus.Applied,
    dateApplied: new Date().toISOString().split('T')[0],
    link: '',
    notes: '',
    jobDescription: '',
    followUpDismissed: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (applicationToEdit) {
      // FIX: Manually constructing form data from applicationToEdit.
      // This avoids destructuring properties that cause type errors and ensures
      // that the form state matches the ApplicationFormData type. It also correctly
      // formats the date and handles potentially undefined optional fields.
      setFormData({
        company: applicationToEdit.company,
        role: applicationToEdit.role,
        status: applicationToEdit.status,
        dateApplied: applicationToEdit.dateApplied.split('T')[0],
        link: applicationToEdit.link,
        notes: applicationToEdit.notes || '',
        jobDescription: applicationToEdit.jobDescription || '',
        followUpDismissed: applicationToEdit.followUpDismissed || false,
      });
    } else {
      setFormData({
        company: '',
        role: '',
        status: ApplicationStatus.Applied,
        dateApplied: new Date().toISOString().split('T')[0],
        link: '',
        notes: '',
        jobDescription: '',
        followUpDismissed: false,
      });
    }
  }, [applicationToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
    onClose();
  };

  return (
     <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg border border-slate-200"
          >
            <h2 className="text-2xl font-bold mb-6 text-slate-800">{applicationToEdit ? 'Edit Application' : 'Add New Application'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-slate-600">Company</label>
                <input type="text" name="company" id="company" value={formData.company} onChange={handleChange} required className="mt-1 block w-full bg-slate-100 border border-slate-300 rounded-md shadow-sm py-2 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-600">Role / Job Title</label>
                <input type="text" name="role" id="role" value={formData.role} onChange={handleChange} required className="mt-1 block w-full bg-slate-100 border border-slate-300 rounded-md shadow-sm py-2 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dateApplied" className="block text-sm font-medium text-slate-600">Date Applied</label>
                  <input type="date" name="dateApplied" id="dateApplied" value={formData.dateApplied} onChange={handleChange} required className="mt-1 block w-full bg-slate-100 border border-slate-300 rounded-md shadow-sm py-2 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-slate-600">Status</label>
                  <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full bg-slate-100 border border-slate-300 rounded-md shadow-sm py-2 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    {Object.values(ApplicationStatus).map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="link" className="block text-sm font-medium text-slate-600">Job Posting Link</label>
                <input type="url" name="link" id="link" value={formData.link} onChange={handleChange} className="mt-1 block w-full bg-slate-100 border border-slate-300 rounded-md shadow-sm py-2 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
              <div>
                <label htmlFor="jobDescription" className="block text-sm font-medium text-slate-600">Job Description</label>
                <textarea name="jobDescription" id="jobDescription" value={formData.jobDescription || ''} onChange={handleChange} rows={4} className="mt-1 block w-full bg-slate-100 border border-slate-300 rounded-md shadow-sm py-2 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Paste the job description here for better AI analysis."></textarea>
              </div>
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-slate-600">Personal Notes</label>
                <textarea name="notes" id="notes" value={formData.notes || ''} onChange={handleChange} rows={3} className="mt-1 block w-full bg-slate-100 border border-slate-300 rounded-md shadow-sm py-2 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Contacts, thoughts, or reminders..."></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit" isLoading={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Application'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ApplicationForm;