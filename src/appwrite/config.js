import { Client, Account, Databases, ID, Query } from 'appwrite';

// Initialize the Appwrite client
const client = new Client();

// Appwrite configuration 
// Replace YOUR_APPWRITE_PROJECT_ID with your actual project ID
const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '67f7e292003cf5bb6c83';

// Configure the client
client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export { ID, Query };
export default client;