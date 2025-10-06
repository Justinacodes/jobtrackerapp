import { Client, Account, Databases, ID, Query, Permission, Role, Models } from 'appwrite';
import { JobApplication } from '@/types';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
  throw new Error("Appwrite endpoint or project ID is not configured in environment variables.");
}

const client = new Client();
client.setEndpoint(endpoint).setProject(projectId);

export const account = new Account(client);
export const databases = new Databases(client);

// --- App Constants ---
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const APPLICATIONS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID;

if (!DATABASE_ID || !APPLICATIONS_COLLECTION_ID) {
  throw new Error("Database ID or Collection ID is not configured in environment variables.");
}

// --- Authentication ---

export const login = (email: any, password: any) => account.createEmailPasswordSession(email, password);
export const signup = (email: any, password: any, name: any) => account.create(ID.unique(), email, password, name);
export const logout = () => account.deleteSession('current');
export const getAccount = () => account.get();
export const createGoogleSession = () => {
    // Construct the success URL. Ensure it matches what's in your Appwrite console.
    const successUrl = `${window.location.origin}/`; 
    // The failure URL can redirect back to the home page as well.
    const failureUrl = `${window.location.origin}/`;
    account.createOAuth2Session('google', successUrl, failureUrl);
};


// --- Database ---

type ApplicationData = Omit<JobApplication, keyof Models.Document | 'id' | 'userId'>;

export const getApplications = async (userId: string): Promise<JobApplication[]> => {
    const response = await databases.listDocuments(
        DATABASE_ID,
        APPLICATIONS_COLLECTION_ID,
        [Query.equal('userId', userId), Query.orderDesc('dateApplied')]
    );
    // Map Appwrite's $id to our 'id' field for consistency.
    return response.documents.map((doc: { $id: any; }) => ({ ...doc, id: doc.$id })) as JobApplication[];
};

export const addApplication = async (userId: string, data: ApplicationData): Promise<JobApplication> => {
    const doc = await databases.createDocument(
        DATABASE_ID,
        APPLICATIONS_COLLECTION_ID,
        ID.unique(),
        { ...data, userId },
        [
            Permission.read(Role.user(userId)),
            Permission.update(Role.user(userId)),
            Permission.delete(Role.user(userId)),
        ]
    );
    return { ...doc, id: doc.$id } as JobApplication;
};

export const updateApplication = async (documentId: string, data: ApplicationData): Promise<JobApplication> => {
    const doc = await databases.updateDocument(
        DATABASE_ID,
        APPLICATIONS_COLLECTION_ID,
        documentId,
        data
    );
    return { ...doc, id: doc.$id } as JobApplication;
};

export const deleteApplication = (documentId: string): Promise<{}> => {
    return databases.deleteDocument(DATABASE_ID, APPLICATIONS_COLLECTION_ID, documentId);
};