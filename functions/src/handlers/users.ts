import {
    STATUS_CLIENT_ERROR,
    STATUS_CREATED,
    STATUS_SERVER_ERROR,
    STATUS_UNAUTHORIZED_ERROR,
    UserInfo,
    USERS_COLLECTION
} from "../domain.constants";
import {db} from "../utils/admin-fb.utils";
import * as firebase from "firebase";
import {Request, Response} from "express";
import {UserValidator} from "../validation/user.validator";
import {WRONG_CREDENTIALS_ERROR, WRONG_PASSWORD_ERROR} from "../errors.constants";
import {FIREBASE_CONFIG} from "../firebase-config.constants";

firebase.initializeApp(FIREBASE_CONFIG);

const userValidator = new UserValidator();

// @ts-ignore
export const signup = (request: Request, response: Response) => {
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
};

// @ts-ignore
export const login = (request: Request, response: Response) => {
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
};