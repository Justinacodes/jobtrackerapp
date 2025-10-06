import { ApplicationStatus, JobApplication } from './types';

export const STATUS_COLORS: { [key in ApplicationStatus]: string } = {
  [ApplicationStatus.Applied]: 'bg-blue-100 text-blue-800 border border-blue-200',
  [ApplicationStatus.Interviewing]: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  [ApplicationStatus.Offer]: 'bg-green-100 text-green-800 border border-green-200',
  [ApplicationStatus.Rejected]: 'bg-red-100 text-red-800 border border-red-200',
};

// Start with an empty array for a clean state. Data will be loaded from localStorage in MainApp.
export const INITIAL_APPLICATIONS: JobApplication[] = [];
