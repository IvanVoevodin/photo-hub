import * as firebase from "firebase";
import * as admin from "firebase-admin";
import {region} from "firebase-functions";
import * as express from "express";
import {
    COMMENTS_COLLECTION,
    FIREBASE_CONFIG,
    REGION_REQUEST,
    STATUS_CLIENT_ERROR,
    STATUS_CREATED,
    STATUS_SERVER_ERROR,
    STATUS_UNAUTHORIZED_ERROR,
    UserInfo,
    USERS_COLLECTION
} from "./default.constants";
import {COMMENTS_ROUTE, LOGIN_ROUTE, SIGN_UP_ROUTE} from "./rounting.constants";
import {UserValidator} from "./user.validator";
import {WRONG_CREDENTIALS_ERROR, WRONG_PASSWORD_ERROR} from "./errors.constants";

type DocumentData = admin.firestore.DocumentData;

admin.initializeApp();
firebase.initializeApp(FIREBASE_CONFIG);

const app = express();
const db = admin.firestore();

const userValidator = new UserValidator();

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

// @ts-ignore
app.post(SIGN_UP_ROUTE, (request, response) => {
    const newUser: UserInfo = {
        email: request.body.email,
        password: request.body.password,
        confirmPassword: request.body.confirmPassword,
        handle: request.body.handle
    };

    if (userValidator.validateAllProps(newUser))
        return response.status(STATUS_CLIENT_ERROR).json(userValidator.validationErrors);

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

// @ts-ignore
app.post(LOGIN_ROUTE, (request, response) => {
    const user: UserInfo = {
        email: request.body.email,
        password: request.body.password,
    };

    if (userValidator.validateRequiredProps(user))
        return response.status(STATUS_CLIENT_ERROR).json(userValidator.validationErrors);

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(credential => credential.user ? credential.user.getIdToken() : null)
        .then(token => response.json({token}))
        .catch(error => {
            if (error.code === WRONG_PASSWORD_ERROR) {
                return response.status(STATUS_UNAUTHORIZED_ERROR).json({general: WRONG_CREDENTIALS_ERROR});
            } 
                response.status(STATUS_SERVER_ERROR).json({error: error.code});
            
            throw new Error(error);
        })
});

// eslint-disable-next-line import/prefer-default-export
export const api = region(REGION_REQUEST).https.onRequest(app);