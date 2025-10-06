"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { AIFeature } from '@/types';
import { analyzeResume, generateCoverLetter, generateInterviewQuestions } from '@/services/geminiService';
import Button from '@/components/Button';
import SparklesIcon from '@/components/icons/SparklesIcon';
import UploadIcon from '@/components/icons/UploadIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { useToasts } from '@/hooks/useToasts';
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon';

interface JobPrepToolkitModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialState?: { tool: AIFeature; jobDescription: string; role: string } | null;
}

type ActiveTool = AIFeature | 'hub';

const ToolCard: React.FC<{ title: string; description: string; onClick: () => void }> = ({ title, description, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
    onClick={onClick}
    className="bg-slate-50 p-6 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-colors"
  >
    <div className="flex items-center mb-2">
      <SparklesIcon className="h-6 w-6 text-indigo-500 mr-3" />
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
    </div>
    <p className="text-sm text-slate-600">{description}</p>
  </motion.div>
);

const JobPrepToolkitModal: React.FC<JobPrepToolkitModalProps> = ({ isOpen, onClose, initialState }) => {
  const [activeTool, setActiveTool] = useState<ActiveTool>('hub');
  
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [roleName, setRoleName] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const { addToast } = useToasts();
  
  const [inputMode, setInputMode] = useState<'paste' | 'upload'>('paste');
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && initialState) {
      setActiveTool(initialState.tool);
      setJobDescription(initialState.jobDescription);
      setRoleName(initialState.role);
    }
  }, [isOpen, initialState]);


  const resetState = () => {
    setResult('');
    setResumeText('');
    setJobDescription('');
    setCompanyName('');
    setRoleName('');
    setInputMode('paste');
    setFileName(null);
    setIsLoading(false);
  };
  
  const handleClose = () => {
    resetState();
    setActiveTool('hub');
    onClose();
  }
  
  const handleBackToHub = () => {
    resetState();
    setActiveTool('hub');
  };

  const handleGenerate = useCallback(async () => {
    if (!activeTool || activeTool === 'hub') return;
    setIsLoading(true);
    setResult('');
    try {
      let response = '';
      switch (activeTool) {
        case AIFeature.ResumeAnalysis:
          if(!resumeText || !jobDescription) {
             addToast({ message: 'Please provide both resume and job description.', type: 'error' });
             setIsLoading(false); return;
          }
          response = await analyzeResume(resumeText, jobDescription);
          break;
        case AIFeature.CoverLetter:
          if(!resumeText || !jobDescription || !companyName || !roleName) {
             addToast({ message: 'Please fill all fields: resume, job description, company, and role.', type: 'error' });
             setIsLoading(false); return;
          }
          response = await generateCoverLetter(resumeText, jobDescription, companyName, roleName);
          break;
        case AIFeature.InterviewPrep:
          if(!jobDescription || !roleName) {
             addToast({ message: 'Please provide the job description and role.', type: 'error' });
             setIsLoading(false); return;
          }
           response = await generateInterviewQuestions(jobDescription, roleName);
          break;
      }
      setResult(response);
      addToast({ message: 'AI generation complete!', type: 'success' });
    } catch (error) {
      console.error('AI generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setResult(`An error occurred: ${errorMessage}`);
      addToast({ message: 'AI generation failed. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [activeTool, resumeText, jobDescription, companyName, roleName, addToast]);
  
  const handleFileChange = (file: File | null) => {
    if (file) {
      if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFileName(file.name);
        setResumeText(`--- SIMULATED CONTENT FROM ${file.name} ---\n\nThis is a placeholder for the content extracted from your resume file. The AI will use this text for its analysis. You can edit this text directly if needed.\n\n--- END OF SIMULATED CONTENT ---`);
        addToast({ message: `${file.name} loaded successfully.`, type: 'success' });
      } else {
        addToast({ message: 'Invalid file type. Please upload a PDF or DOCX file.', type: 'error' });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); handleFileChange(e.dataTransfer.files[0] || null); };
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e.target.files?.[0] || null);
  const openFilePicker = () => fileInputRef.current?.click();

  const renderResumeInput = () => (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-2">Resume</label>
      <div className="flex border-b border-slate-200 mb-2">
        <button onClick={() => setInputMode('paste')} className={`px-4 py-2 text-sm font-medium ${inputMode === 'paste' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>Paste Text</button>
        <button onClick={() => setInputMode('upload')} className={`px-4 py-2 text-sm font-medium ${inputMode === 'upload' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>Upload File</button>
      </div>
      {inputMode === 'paste' ? (
        <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Paste your resume here..." className="w-full h-32 p-3 bg-slate-100 border border-slate-300 rounded-md text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      ) : (
        <div>
          <div onDragOver={handleDragOver} onDrop={handleDrop} onClick={openFilePicker} className="flex flex-col items-center justify-center w-full h-32 p-3 bg-slate-50 border-2 border-dashed border-slate-300 rounded-md cursor-pointer hover:bg-slate-100 transition-colors">
            <UploadIcon className="h-8 w-8 text-slate-400 mb-2" />
            <p className="text-sm text-slate-500"><span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-slate-400">PDF or DOCX</p>
            <input type="file" ref={fileInputRef} onChange={handleFileInputChange} accept=".pdf,.docx" className="hidden" />
          </div>
          {fileName && <p className="text-sm text-slate-600 mt-2">Loaded file: <span className="font-medium">{fileName}</span></p>}
        </div>
      )}
    </div>
  );
  
  const renderJobDescriptionInput = (height = 'h-32') => (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-2">Job Description</label>
      <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the job description here..." className={`w-full ${height} p-3 bg-slate-100 border border-slate-300 rounded-md text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500`} />
    </div>
  )

  const renderToolUI = () => {
    switch (activeTool) {
      case 'hub':
        return (
          <div className="space-y-4">
            <ToolCard title={AIFeature.ResumeAnalysis} description="Get instant feedback on your resume against a specific job description." onClick={() => setActiveTool(AIFeature.ResumeAnalysis)} />
            <ToolCard title={AIFeature.CoverLetter} description="Generate a professional, tailored cover letter from scratch." onClick={() => setActiveTool(AIFeature.CoverLetter)} />
            <ToolCard title={AIFeature.InterviewPrep} description="Generate potential interview questions for any role." onClick={() => setActiveTool(AIFeature.InterviewPrep)} />
          </div>
        );
      case AIFeature.ResumeAnalysis:
        return <div className="space-y-4">{renderResumeInput()}{renderJobDescriptionInput()}</div>;
      case AIFeature.CoverLetter:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Company Name</label>
                  <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Google" className="w-full p-2 bg-slate-100 border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Role / Job Title</label>
                  <input type="text" value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="e.g. Software Engineer" className="w-full p-2 bg-slate-100 border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
            </div>
            {renderResumeInput()}
            {renderJobDescriptionInput()}
          </div>
        );
      case AIFeature.InterviewPrep:
        return (
          <div className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Role / Job Title</label>
                <input type="text" value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="e.g. Product Manager" className="w-full p-2 bg-slate-100 border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            {renderJobDescriptionInput('h-48')}
          </div>
        );
      default: return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.2 }} className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="flex items-center mb-4">
              {activeTool !== 'hub' && (
                <button onClick={handleBackToHub} className="p-2 mr-3 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition"><ArrowLeftIcon className="h-5 w-5"/></button>
              )}
              <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                <SparklesIcon className="mr-2 text-indigo-500"/> 
                {activeTool === 'hub' ? 'Job Prep Toolkit' : activeTool}
              </h2>
            </div>
            {activeTool === 'hub' && <p className="text-slate-600 mb-6 -mt-2">Your intelligent assistant for prepping application materials.</p>}
            
            <div className="flex-grow overflow-y-auto pr-2">
              <div className="mb-4">
                {renderToolUI()}
              </div>
              
              {activeTool !== 'hub' && (
                <div className="bg-slate-50 p-4 rounded-md border border-slate-200 min-h-[200px]">
                  {isLoading && <div className="flex justify-center items-center h-full"><p className="text-slate-500">AI is thinking...</p></div>}
                  {result && <pre className="text-slate-700 whitespace-pre-wrap font-sans text-sm">{result}</pre>}
                  {!isLoading && !result && <div className="flex justify-center items-center h-full"><p className="text-slate-400">AI-generated content will appear here.</p></div>}
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <Button variant="secondary" onClick={handleClose}>Close</Button>
              {activeTool !== 'hub' && (
                <Button onClick={handleGenerate} isLoading={isLoading}>
                  <SparklesIcon className="mr-2 h-5 w-5"/>
                  {isLoading ? 'Generating...' : 'Generate'}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default JobPrepToolkitModal;
