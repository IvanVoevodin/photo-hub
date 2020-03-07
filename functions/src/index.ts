import { CloudFunction, region } from "firebase-functions";
import * as express from "express";
import {
    COMMENTS_COLLECTION,
    LIKES_COLLECTION,
    Notification,
    NOTIFICATION_COMMENT,
    NOTIFICATION_LIKE,
    NOTIFICATIONS_COLLECTION,
    NotificationType,
    POSTS_COLLECTION,
    REGION_REQUEST,
    USERS_COLLECTION
} from "./domain.constants";
import { LOGIN_ROUTE, NOTIFICATIONS_ROUTE, POST_BY_ID_ROUTE, POST_ROUTE, SIGN_UP_ROUTE, USER_IMAGE_ROUTE, USER_ROUTE } from "./rounting.constants";
import { commentOnPost, deletePost, doPost, getPost, getPosts, likePost, unlikePost } from "./handlers/post";
import { addUserDetails, getAuthUser, getUserDetails, login, markNotificationsRead, signup, uploadImage } from "./handlers/users";
import { fbAuth } from "./validation/token-validation";
import { db } from "./utils/admin-fb.utils";
import { DocumentSnapshot } from "firebase-functions/lib/providers/firestore";

const app = express();

// posts routes
app.get(POST_ROUTE, getPosts);
app.get(POST_BY_ID_ROUTE, getPost);
app.post(POST_ROUTE, fbAuth, doPost);
app.delete(POST_BY_ID_ROUTE, fbAuth, deletePost);
app.post(`${POST_BY_ID_ROUTE}/comment`, fbAuth, commentOnPost);
app.post(`${POST_BY_ID_ROUTE}/like`, fbAuth, likePost);
app.post(`${POST_BY_ID_ROUTE}/unlike`, fbAuth, unlikePost);

// users routes
app.post(SIGN_UP_ROUTE, signup);
app.post(LOGIN_ROUTE, login);
app.get(USER_ROUTE, fbAuth, getAuthUser);
app.post(USER_ROUTE, fbAuth, addUserDetails);
app.post(USER_IMAGE_ROUTE, fbAuth, uploadImage);
app.get(`${USER_ROUTE}/:handle`, getUserDetails);
app.post(NOTIFICATIONS_ROUTE, fbAuth, markNotificationsRead);

const api = region(REGION_REQUEST).https.onRequest(app);

const createNotification = (collection: string, notificationType: NotificationType): CloudFunction<DocumentSnapshot> => {
    return region(REGION_REQUEST)
        .firestore.document(`${collection}/{id}`)
        .onCreate(snapshot => {
            const snapshotData = snapshot.data();
            if (!snapshotData) {
                return
            }

            return db.doc(`/${POSTS_COLLECTION}/${snapshotData.postId}`).get()
                .then(doc => {
                    const postData = doc.data();
                    if (doc.exists && postData && postData.userName !== snapshotData.userName) {
                        const notification: Notification = {
                            creationTime: new Date().toISOString(),
                            recipient: postData.userName,
                            sender: snapshotData.userName,
                            type: notificationType,
                            read: false,
                            postId: doc.id
                        };

                        db.doc(`/${NOTIFICATIONS_COLLECTION}/${snapshot.id}`).set(notification)
                    }
                })
                .catch(error => new Error(error))
        });
};

const createNotificationOnComment = createNotification(COMMENTS_COLLECTION, NOTIFICATION_COMMENT);
const createNotificationOnLike = createNotification(LIKES_COLLECTION, NOTIFICATION_LIKE);

const deleteNotificationsOnUnlike = region(REGION_REQUEST)
    .firestore.document(`${LIKES_COLLECTION}/{id}`)
    .onDelete(snapshot => {
        return db.doc(`/${NOTIFICATIONS_COLLECTION}/${snapshot.id}`)
            .delete()
            .catch(error => new Error(error))
    });

const onUserImageChange = region(REGION_REQUEST)
    .firestore.document(`/${USERS_COLLECTION}/{uid}`)
    .onUpdate(change => {
        const batch = db.batch();
        const dataBefore = change.before.data();
        const dataAfter = change.after.data();

        if (!dataBefore || !dataAfter) {
            return
        }
        if (dataBefore.imageUrl === dataAfter.imageUrl) {
            return true
        }

        return db.collection(POSTS_COLLECTION)
            .where("userName", "==", dataBefore.handle).get()
            .then(data => {
                data.forEach(doc => {
                    const post = db.doc(`/${POSTS_COLLECTION}/${doc.id}`);
                    batch.update(post, {userImage: dataAfter.imageUrl})
                });
                return db.collection(COMMENTS_COLLECTION).where("userName", "==", dataBefore.handle).get()
            })
            .then(data => {
                data.forEach(doc => {
                    const comment = db.doc(`/${COMMENTS_COLLECTION}/${doc.id}`);
                    batch.update(comment, {userImage: dataAfter.imageUrl})
                });
                return batch.commit();
            })
    });

const onPostDelete = region(REGION_REQUEST)
    .firestore.document(`/${POSTS_COLLECTION}/{postId}`)
    .onDelete((snapshot, context) => {
        const postId = context.params.postId;
        const batch = db.batch();
        return db.collection(COMMENTS_COLLECTION)
            .where("postId", "==", postId).get()
            .then(data => {
                data.forEach(doc => batch.delete(db.doc(`/${COMMENTS_COLLECTION}/${doc.id}`)));
                return db.collection(LIKES_COLLECTION).where("postId", "==", postId).get()
            })
            .then(data => {
                data.forEach(doc => batch.delete(db.doc(`/${LIKES_COLLECTION}/${doc.id}`)));
                return db.collection(NOTIFICATIONS_COLLECTION).where("postId", "==", postId).get()
            })
            .then(data => {
                data.forEach(doc => batch.delete(db.doc(`/${NOTIFICATIONS_COLLECTION}/${doc.id}`)));
                return batch.commit()
            })
            .catch(error => new Error(error))
    });

export {
    api,
    createNotificationOnComment,
    createNotificationOnLike,
    deleteNotificationsOnUnlike,
    onUserImageChange,
    onPostDelete
}