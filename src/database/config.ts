import 'dotenv/config';
import admin, { ServiceAccount } from 'firebase-admin';
import { getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { Agent } from 'https';
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
  console.log('port:', PORT);

  if (NODE_ENV === 'dev') {
    admin.firestore().settings({
      host: 'localhost:8080',
      ssl: false,
    });
  }

  if (NODE_ENV === 'prod') {
    // workaround for render.com ssl terminating proxy
    app.options.httpAgent = new Agent({
      keepAlive: true,
      rejectUnauthorized: true,
    });

    admin.firestore().settings({
      ssl: true,
    });
  }

  const fs = getFirestore();
  console.log('database', fs.databaseId);
  // console.log(fs);

  return fs;
}
