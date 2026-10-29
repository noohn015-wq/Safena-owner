import { Client, Account, Databases } from 'appwrite';

export const APPWRITE_CONFIG = {
  endpoint: 'https://tor.cloud.appwrite.io/v1',
  projectId: '6a658f7200183d84195b',
  databaseId: '6a65915e00291cf7f54c',
  ordersCollectionId: 'orders',
  complaintsCollectionId: 'complaints',
  visitsCollectionId: 'visits', // <--- إضافة جدول الزوار لموقع العميل
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
