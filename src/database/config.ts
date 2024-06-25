import 'dotenv/config';
import admin, { ServiceAccount } from 'firebase-admin';
import { getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccountCredentials from '~/serviceAccountKey.json';

// environment

export const { NODE_ENV = 'dev', PORT = '3001' } = process.env;

// init admin-sdk firestore

export const db = getInitializedFirestore();

// -----

function getInitializedFirestore() {
  const app = admin.initializeApp({
    credential: admin.credential.cert(
      serviceAccountCredentials as ServiceAccount
    ),
  });

  console.info('Firebase Admin App:', getApp().name);
  console.log('environment:', NODE_ENV);

  admin.firestore().settings({
    host: getHost(),
    ssl: false,
  });

  return getFirestore();
}

function getHost() {
  if (NODE_ENV === 'dev') {
    return 'localhost:8080';
  } else {
    return 'idkyet.com';
  }
}
