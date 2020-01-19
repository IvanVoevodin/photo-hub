export const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAA7lX-yg2dHo1QrqQbnEtaqJqHkr3XhgU",
    authDomain: "photo-hub-social.firebaseapp.com",
    databaseURL: "https://photo-hub-social.firebaseio.com",
    projectId: "photo-hub-social",
    storageBucket: "photo-hub-social.appspot.com",
    messagingSenderId: "1083908410784",
    appId: "1:1083908410784:web:470a6095aea6cca21f68c5"
};

export const REGION_REQUEST = "europe-west1";

type StatusCode = number;
export const STATUS_CREATED: StatusCode = 201;
export const STATUS_CLIENT_ERROR: StatusCode = 400;
export const STATUS_SERVER_ERROR: StatusCode = 500;
export const STATUS_UNAUTHORIZED_ERROR: StatusCode = 403;

export const COMMENTS_COLLECTION = "comments";
export const USERS_COLLECTION = "users";

export type UserInfo = {
    email: string;
    password: string;
    confirmPassword?: string;
    handle?: string;
}