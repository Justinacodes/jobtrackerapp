import { Models } from 'appwrite';

export enum ApplicationStatus {
  Applied = 'Applied',
  Interviewing = 'Interviewing',
  Offer = 'Offer',
  Rejected = 'Rejected',
}

// Represents the data structure for a job application in the Appwrite database.
// It extends Appwrite's Document model to include system properties like $id.
export interface JobApplication extends Models.Document {
  id: string; // Mapped from Appwrite's $id
  company: string;
  role: string;
  status: ApplicationStatus;
  dateApplied: string;
  link: string;
  notes?: string;
  jobDescription?: string;
  followUpDismissed?: boolean;
  userId: string;
}

// Represents the currently logged-in user's data from Appwrite.
export type User = Models.User<Models.Preferences> | null;


export enum AIFeature {
  ResumeAnalysis = 'analyze-resume',
  CoverLetter = 'generate-cover-letter',
  InterviewPrep = 'generate-interview-questions',
}
