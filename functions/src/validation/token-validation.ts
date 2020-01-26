import * as express from "express";
import {STATUS_UNAUTHORIZED_ERROR, USERS_COLLECTION} from "../domain.constants";
import {admin, db} from "../utils/admin-fb.utils";

export const fbAuth = (request: any, response: express.Response, next: any) => {
    let idToken;
    const auth = request.headers.authorization;
    if (auth && auth.startsWith("Bearer ")) {
        idToken = auth.split("Bearer ")[1];
    } else {
        response.status(STATUS_UNAUTHORIZED_ERROR).json({error: "Unauthorized"});
        throw new Error("No token found");
    }

    admin.auth().verifyIdToken(idToken)
        .then(decodedToken => {
            request.user = decodedToken;
            return db.collection(USERS_COLLECTION)
                .where("uid", "==", request.user.uid)
                .limit(1)
                .get()
        })
        .then(query => {
            request.user.handle = query.docs[0].data().handle;
            next();
        })
        .catch(error => {
            response.status(STATUS_UNAUTHORIZED_ERROR).json({error: "Verifying token error"});
            throw new Error(error);
        })
};