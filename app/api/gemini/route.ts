import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    // This will be caught by Next.js and result in a 500 error page.
    // It's logged on the server, not exposed to the client.
    console.error("API_KEY environment variable not set.");
    throw new Error("Server configuration error: Missing API Key.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = 'gemini-2.5-flash';

// Re-implementing the core logic from the original service on the server.
const analyzeResume = async (resumeText: string, jobDescription: string): Promise<string> => {
  const prompt = `
    Analyze the following resume in the context of this job description. 
    Provide a detailed analysis covering:
    1.  **Strengths & Alignment:** Highlight key skills, experiences, and qualifications that strongly align with the job requirements.
    2.  **Areas for Improvement:** Suggest specific areas where the resume could be tailored to better match the job description.
    3.  **Keyword Optimization:** List relevant keywords from the job description that are missing or could be emphasized more in the resume.
    
    Format the output using markdown for clarity and readability.

    ---
    **Resume:**
    ${resumeText}
    ---
    **Job Description:**
    ${jobDescription}
    ---
  `;
  const response = await ai.models.generateContent({ model, contents: prompt });
  return response.text;
};

const generateCoverLetter = async (resumeText: string, jobDescription: string, company: string, role: string): Promise<string> => {
  const prompt = `
    Generate a professional and compelling cover letter for the role of '${role}' at '${company}'. 
    Use the provided resume to highlight relevant experience and skills. The tone should be enthusiastic but professional.
    The generated cover letter should be well-structured and ready to use.

    ---
    **Job Description:**
    ${jobDescription}
    ---
    **Applicant's Resume for Context:**
    ${resumeText}
    ---
  `;
  const response = await ai.models.generateContent({ model, contents: prompt });
  return response.text;
};

const generateInterviewQuestions = async (jobDescription: string, role: string): Promise<string> => {
  const prompt = `
    Generate a list of 10 potential interview questions for the role of '${role}'. 
    Base the questions on the provided job description. 
    Include a mix of behavioral, technical, and situational questions. 
    For each question, provide a brief hint on what the interviewer is likely looking for. 
    Format the output using markdown.

    ---
    **Job Description:**
    ${jobDescription}
    ---
  `;
  const response = await ai.models.generateContent({ model, contents: prompt });
  return response.text;
};


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { feature, ...payload } = body;

        let resultText = '';

        switch (feature) {
            case 'analyze-resume':
                if (!payload.resumeText || !payload.jobDescription) {
                    return NextResponse.json({ error: 'Missing resumeText or jobDescription' }, { status: 400 });
                }
                resultText = await analyzeResume(payload.resumeText, payload.jobDescription);
                break;
            
            case 'generate-cover-letter':
                 if (!payload.resumeText || !payload.jobDescription || !payload.company || !payload.role) {
                    return NextResponse.json({ error: 'Missing required fields for cover letter' }, { status: 400 });
                }
                resultText = await generateCoverLetter(payload.resumeText, payload.jobDescription, payload.company, payload.role);
                break;

            case 'generate-interview-questions':
                if (!payload.jobDescription || !payload.role) {
                    return NextResponse.json({ error: 'Missing jobDescription or role' }, { status: 400 });
                }
                resultText = await generateInterviewQuestions(payload.jobDescription, payload.role);
                break;

            default:
                return NextResponse.json({ error: 'Invalid feature' }, { status: 400 });
        }
        
        return NextResponse.json({ result: resultText });

    } catch (error) {
        console.error('Error processing Gemini request:', error);
        const errorMessage = error instanceof Error ? error.message : "An unknown internal error occurred.";
        return NextResponse.json({ error: 'An error occurred during AI generation.', details: errorMessage }, { status: 500 });
    }
}
