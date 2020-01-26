import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

type DocumentData = admin.firestore.DocumentData;

export {admin, db, DocumentData};