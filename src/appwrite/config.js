import { Client, Account, Databases, ID, Query } from 'appwrite';

// Initialize the Appwrite client
const client = new Client();

// Appwrite configuration using environment variables
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

// Configure the client
client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export { ID, Query };
export default client;