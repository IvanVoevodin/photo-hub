import { Response } from "express";
import { STATUS_UNAUTHORIZED_ERROR, USERS_COLLECTION } from "../domain.constants";
import { admin, db } from "../utils/admin-fb.utils";
import { UNAUTHORIZED_ERROR } from "../errors.constants";

export const fbAuth = (request: any, response: Response, next: any) => {
    let idToken;
    const auth = request.headers.authorization;
    if (auth && auth.startsWith("Bearer ")) {
        idToken = auth.split("Bearer ")[1];
    } else {
        response.status(STATUS_UNAUTHORIZED_ERROR).json({error: UNAUTHORIZED_ERROR});
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
            const data = query.docs[0].data();
            request.user.handle = data.handle;
            request.user.imageUrl = data.imageUrl;
            next();
        })
        .catch(error => {
            response.status(STATUS_UNAUTHORIZED_ERROR).json({error: "Verifying token error"});
            throw new Error(error);
        })
};