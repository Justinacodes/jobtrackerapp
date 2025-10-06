// This service now runs on the client and calls our own secure API routes.
import { AIFeature } from "@/types";

const callAIFeature = async (feature: string, body: object): Promise<string> => {
    try {
        const response = await fetch(`/api/gemini`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ feature, ...body }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error Response:", errorData);
            throw new Error(errorData.error || `API request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error(`Error calling feature '${feature}':`, error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return `An error occurred while processing your request. Please try again. Details: ${errorMessage}`;
    }
};

export const analyzeResume = async (resumeText: string, jobDescription: string): Promise<string> => {
    return callAIFeature(AIFeature.ResumeAnalysis, { resumeText, jobDescription });
};

export const generateCoverLetter = async (resumeText: string, jobDescription: string, company: string, role: string): Promise<string> => {
    return callAIFeature(AIFeature.CoverLetter, { resumeText, jobDescription, company, role });
};

export const generateInterviewQuestions = async (jobDescription: string, role: string): Promise<string> => {
    return callAIFeature(AIFeature.InterviewPrep, { jobDescription, role });
};
