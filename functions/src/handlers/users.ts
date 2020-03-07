import {
    Credentials,
    JPG_MIME_TYPE,
    LIKES_COLLECTION,
    Notification,
    NOTIFICATIONS_COLLECTION,
    PNG_MIME_TYPE,
    PostData,
    POSTS_COLLECTION,
    STATUS_CLIENT_ERROR,
    STATUS_CREATED,
    STATUS_NOT_FOUND_ERROR,
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
import { EMAIL_ALREADY_IN_USE_ERROR, UNKNOWN_ERROR, WRONG_CREDENTIALS_ERROR } from "../errors.constants";
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
            if (error.code === EMAIL_ALREADY_IN_USE_ERROR) {
                response.status(STATUS_CLIENT_ERROR).json({message: "Email is already in use"})
            } else {
                response.status(STATUS_SERVER_ERROR).json({error: UNKNOWN_ERROR});
            }
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
            response.status(STATUS_UNAUTHORIZED_ERROR).json({general: WRONG_CREDENTIALS_ERROR});
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
            return db.collection(NOTIFICATIONS_COLLECTION)
                .where("recipient", "==", request.user.handle)
                .orderBy("creationTime", "desc")
                .limit(10).get();
        })
        .then(data => {
            const notifications: Notification[] = [];
            data.forEach(doc => {
                const docData = doc.data();
                notifications.push({
                    creationTime: docData.creationTime,
                    recipient: docData.recipient,
                    sender: docData.sender,
                    type: docData.type,
                    read: docData.read,
                    postId: docData.postId,
                    notificationId: doc.id
                })
            });
            userData.notifications = notifications;
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

export const getUserDetails = (request: any, response: Response) => {
    const userData: {user?: any, posts?: PostData[]} = {};
    db.doc(`/${USERS_COLLECTION}/${request.params.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                userData.user = doc.data();
                return db.collection(POSTS_COLLECTION)
                    .where("userName", "==", request.params.handle)
                    .orderBy("creationTime", "desc")
                    .get()
            }
            return null;
        })
        .then(data => {
            if (data) {
                const posts: PostData[] = [];
                data.forEach(doc => {
                    const docData = doc.data();
                    posts.push({
                        postId: doc.id,
                        creationTime: docData.creationTime,
                        userName: docData.userName,
                        userImage: docData.userImage,
                        likeCount: docData.likeCount,
                        commentCount: docData.commentCount,
                        message: docData.message,
                        comments: []
                    })
                });
                userData.posts = posts;
                response.json(userData);
            } else {
                response.status(STATUS_NOT_FOUND_ERROR).json({error: "User not found"})
            }
        })
        .catch(error => {
            response.status(STATUS_SERVER_ERROR).json({error: error.code});
            throw new Error(error);
        })
};

export const markNotificationsRead = (request: Request, response: Response) => {
    const batch = db.batch();
    request.body.forEach((notificationId: string) => {
        const notification = db.doc(`/${NOTIFICATIONS_COLLECTION}/${notificationId}`);
        batch.update(notification, {read: true});
    });
    batch.commit()
        .then(() => response.json({message: "Notification marked read"}))
        .catch(error => {
            response.status(STATUS_SERVER_ERROR).json({error: error.code});
            throw new Error(error);
        })
};

const generateImageUrl = (imageName: string): string => {
    return `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_CONFIG.storageBucket}/o/${imageName}?alt=media`;
};