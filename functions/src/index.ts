import { region } from "firebase-functions";
import * as express from "express";
import { REGION_REQUEST } from "./domain.constants";
import { COMMENTS_ROUTE, LOGIN_ROUTE, SIGN_UP_ROUTE, USER_IMAGE_ROUTE, USER_ROUTE } from "./rounting.constants";
import { getComments, postComment } from "./handlers/comments";
import { addUserDetails, getAuthUser, login, signup, uploadImage } from "./handlers/users";
import { fbAuth } from "./validation/token-validation";

const app = express();

app.get(COMMENTS_ROUTE, getComments);
app.post(COMMENTS_ROUTE, fbAuth, postComment);

app.post(SIGN_UP_ROUTE, signup);
app.post(LOGIN_ROUTE, login);
app.get(USER_ROUTE, fbAuth, getAuthUser);
app.post(USER_ROUTE, fbAuth, addUserDetails);
app.post(USER_IMAGE_ROUTE, fbAuth, uploadImage);

// eslint-disable-next-line import/prefer-default-export
export const api = region(REGION_REQUEST).https.onRequest(app);