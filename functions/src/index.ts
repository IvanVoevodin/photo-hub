import { region } from "firebase-functions";
import * as express from "express";
import { REGION_REQUEST } from "./domain.constants";
import { LOGIN_ROUTE, POST_BY_ID_ROUTE, POST_ROUTE, SIGN_UP_ROUTE, USER_IMAGE_ROUTE, USER_ROUTE } from "./rounting.constants";
import { commentOnPost, deletePost, doPost, getPost, getPosts, likePost, unlikePost } from "./handlers/post";
import { addUserDetails, getAuthUser, login, signup, uploadImage } from "./handlers/users";
import { fbAuth } from "./validation/token-validation";

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

// eslint-disable-next-line import/prefer-default-export
export const api = region(REGION_REQUEST).https.onRequest(app);