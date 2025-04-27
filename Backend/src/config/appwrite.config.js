// Backend/src/config/appwrite.config.js
const { Client, Databases, ID, Query, Storage } = require('node-appwrite');
require('dotenv').config();

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

// Initialize Appwrite services
const databases = new Databases(client);
const storage = new Storage(client);

module.exports = {
  client,
  databases,
  storage,
  ID,
  Query
};