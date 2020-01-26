import {db, DocumentData} from "../utils/admin-fb.utils";
import {COMMENTS_COLLECTION, STATUS_SERVER_ERROR} from "../domain.constants";
import {Request, Response} from "express";

export const getComments = (request: Request, response: Response) => {
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
};

export const postComment = (request: any, response: Response) => {
    const comment = {
        userName: request.user.handle,
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
};