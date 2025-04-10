import { Client } from 'appwrite';

// Initialize the Appwrite client
const client = new Client();

// Your Appwrite endpoint and project ID
// You'll need to replace these values with your actual Appwrite endpoint and project ID
const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = 'YOUR_APPWRITE_PROJECT_ID';

// Configure the client
client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

export default client;