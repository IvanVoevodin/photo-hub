import * as firebase from "firebase";
import * as admin from "firebase-admin";
import { region } from "firebase-functions";
import * as express from "express";
import { COMMENTS_COLLECTION, FIREBASE_CONFIG, REGION_REQUEST, STATUS_CLIENT_ERROR, STATUS_CREATED, STATUS_SERVER_ERROR, USERS_COLLECTION } from "./default.constants";
import { COMMENTS_ROUTE, SIGN_UP_ROUTE } from "./rounting.constants";

type DocumentData = admin.firestore.DocumentData;

admin.initializeApp();
firebase.initializeApp(FIREBASE_CONFIG);

const app = express();
const db = admin.firestore();

app.get(COMMENTS_ROUTE, (request, response) => {
    db.collection(COMMENTS_COLLECTION)
        .orderBy("commentTime", "desc")
        .get()
        .then(data => {
            const comments: DocumentData[] = [];
            data.forEach(document => comments.push({
                commentId: document.id,
                userName: document.data().userName,
                comment: document.data().comment,
                commentTime: document.data().commentTime
            }));
            return response.json(comments);
        })
        .catch(error => new Error(error))
});

app.post(COMMENTS_ROUTE, (request, response) => {
    const comment = {
        userName: request.body.userName,
        comment: request.body.comment,
        commentTime: new Date().toISOString()
    };

    db.collection(COMMENTS_COLLECTION)
        .add(comment)
        .then(document => response.json({message: `Document ${document.id} created successfully`}))
        .catch(error => {
            response.status(STATUS_SERVER_ERROR).json({error: "Error when try to create comment"});
            throw new Error(error);
        })
});

app.post(SIGN_UP_ROUTE, (request, response) => {
    const newUser = {
        email: request.body.email,
        password: request.body.password,
        confirmPassword: request.body.confirmPassword,
        handle: request.body.handle
    };

    let userToken: string;
    let userId: string;
    db.doc(`/${USERS_COLLECTION}/${newUser.handle}`).get()
        .then(snapshot => {
            if (snapshot.exists) {
                response.status(STATUS_CLIENT_ERROR).json({error: "This handle is already taken"});
                return null;
            }
            return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
        })
        .then(credential => {
            if (credential && credential.user) {
                userId = credential.user.uid;
                return credential.user.getIdToken();
            }
            return null;
        })
        .then(token => {
            if (!token) {
                return null;
            }
            userToken = token;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                creationTime: new Date().toISOString(),
                uid: userId
            };
            return db.doc(`/${USERS_COLLECTION}/${newUser.handle}`).set(userCredentials);
        })
        .then(() => response.status(STATUS_CREATED).json({token: userToken}))
        .catch(error => {
            response.status(STATUS_SERVER_ERROR).json({error: error.code});
            throw new Error(error);
        })
});

// eslint-disable-next-line import/prefer-default-export
export const api = region(REGION_REQUEST).https.onRequest(app);