import { Client, Account, Databases } from 'appwrite';

export const APPWRITE_CONFIG = {
  endpoint: 'https://nyc.cloud.appwrite.io/v1',
  projectId: '6ae8f88c0038a40c7030',
  databaseId: '6ae8fb0c002bf0f1ecad',
  ordersCollectionId: '6ae8fb730032f96ea4a5',
  complaintsCollectionId: '6ae8fb830003050e3979',
  visitsCollectionId: '6ae8fb8a0009d7451a9d',
};

export const client = new Client()
  .setEndpoint(APPWRITE_CONFIG.endpoint)
  .setProject(APPWRITE_CONFIG.projectId);

export const account = new Account(client);
export const databases = new Databases(client);

export const APPWRITE_ENDPOINT = APPWRITE_CONFIG.endpoint;
export const APPWRITE_PROJECT_ID = APPWRITE_CONFIG.projectId;
export const APPWRITE_DATABASE_ID = APPWRITE_CONFIG.databaseId;
export const ORDERS_TABLE_ID = APPWRITE_CONFIG.ordersCollectionId;
export const COMPLAINTS_TABLE_ID = APPWRITE_CONFIG.complaintsCollectionId;
export const VISITS_TABLE_ID = APPWRITE_CONFIG.visitsCollectionId;
