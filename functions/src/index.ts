import { region } from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";

type DocumentData = admin.firestore.DocumentData;

const app = express();
admin.initializeApp();

app.get("/comments", (request, response) => {
    admin.firestore()
        .collection("comments")
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
        .catch(error => console.error(error))
});

app.post("/comments", (request, response) => {
    const comment = {
        userName: request.body.userName,
        comment: request.body.comment,
        commentTime: new Date().toISOString()
    };

    admin.firestore().collection("comments").add(comment)
        .then(document => response.json({message: `Document ${document.id} created successfully`}))
        .catch(error => {
            response.status(500).json({error: "Error when try to create comment"});
            console.error(error);
        })
});

// eslint-disable-next-line import/prefer-default-export
export const api = region("europe-west1").https.onRequest(app);