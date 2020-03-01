import {
    Credentials,
    JPG_MIME_TYPE,
    LIKES_COLLECTION,
    PNG_MIME_TYPE,
    STATUS_CLIENT_ERROR,
    STATUS_CREATED,
    STATUS_SERVER_ERROR,
    STATUS_UNAUTHORIZED_ERROR,
    UploadImage,
    USER_EMPTY_IMAGE,
    UserFullInfo,
    UserInfo,
    UserLike,
    USERS_COLLECTION
} from "../domain.constants";
import { admin, db } from "../utils/admin-fb.utils";
import * as firebase from "firebase";
import { Request, Response } from "express";
import { UserValidator } from "../validation/user.validator";
import { WRONG_CREDENTIALS_ERROR, WRONG_PASSWORD_ERROR } from "../errors.constants";
import { FIREBASE_CONFIG } from "../firebase-config.constants";
import * as Busboy from "busboy";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";

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

    if (userValidator.validateAllProps(newUser)) {
        return response.status(STATUS_CLIENT_ERROR).json(userValidator.validationErrors);
    }

    let userToken: string;
    let userId: string;
    db.doc(`/${USERS_COLLECTION}/${newUser.handle}`).get()
        .then(doc => {
            if (doc.exists) {
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
                imageUrl: generateImageUrl(USER_EMPTY_IMAGE),
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

    if (userValidator.validateRequiredProps(user)) {
        return response.status(STATUS_CLIENT_ERROR).json(userValidator.validationErrors);
    }

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

export const addUserDetails = (request: any, response: Response) => {
    const userDetails = userValidator.reduceUserDetails(request.body);

    db.doc(`/${USERS_COLLECTION}/${request.user.handle}`)
        .update(userDetails)
        .then(() => response.json({message: "Details added successfully"}))
        .catch(error => {
            response.status(STATUS_SERVER_ERROR).json({error: error.code});
            throw new Error(error);
        })
};

export const getAuthUser = (request: any, response: Response) => {
    const userData: UserFullInfo = {};
    db.doc(`/${USERS_COLLECTION}/${request.user.handle}`).get()
        .then(doc => {
            if (!doc.exists) {
                throw new Error("Error when trying get user data");
            }

            userData.credentials = doc.data() as Credentials;
            return db.collection(LIKES_COLLECTION).where("userHandle", "==", request.user.handle).get();
        })
        .then(data => {
            userData.likes = [];
            data.forEach(doc => userData.likes!.push(doc.data() as UserLike));
            return response.json(userData);
        })
        .catch(error => {
            response.status(STATUS_SERVER_ERROR).json({error: error.code});
            throw new Error(error);
        })
};

export const uploadImage = (request: any & {rawBody: any}, response: Response) => {
    const busBoy = new Busboy({headers: request.headers});

    let imageToUpload: UploadImage;

    busBoy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype !== JPG_MIME_TYPE && mimetype !== PNG_MIME_TYPE) {
            const error = "Wrong file type submitted";
            response.status(STATUS_CLIENT_ERROR).json({error});
            throw new Error(error);
        }

        const splittedName = filename.split(".");
        const imageExtension = splittedName[splittedName.length - 1];
        const fileName = `${Math.round(Math.random() * 1000000000)}.${imageExtension}`;
        const filePath = path.join(os.tmpdir(), fileName);
        imageToUpload = {fileName, filePath, mimetype};
        file.pipe(fs.createWriteStream(filePath));
    });

    busBoy.on("finish", () => {
        admin.storage().bucket().upload(imageToUpload.filePath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToUpload.mimetype
                }
            }
        }).then(() => {
            return db.doc(`/${USERS_COLLECTION}/${request.user.handle}`).update({imageUrl: generateImageUrl(imageToUpload.fileName)});
        }).then(() => {
            response.json({message: "Image uploaded successfully"})
        }).catch(error => {
            response.status(STATUS_SERVER_ERROR).json({error: error.code});
            throw new Error(error);
        })
    });

    busBoy.end(request.rawBody);
};

const generateImageUrl = (imageName: string): string => {
    return `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_CONFIG.storageBucket}/o/${imageName}?alt=media`;
};