import { https } from "firebase-functions";
import * as admin from "firebase-admin";

type DocumentData = admin.firestore.DocumentData;

admin.initializeApp();

export const getComments = https.onRequest((request, response) => {
    admin.firestore().collection("comments").get()
        .then(data => {
            const comments: DocumentData[] = [];
            data.forEach(document => comments.push(document.data()));
            return response.json(comments);
        })
        .catch(error => console.error(error))
});

export const createComment = https.onRequest((request, response) => {
    if (request.method !== "POST") {
        response.status(400).json({error: "Method not allowed"});
    } else {
        const comment = {
            userName: request.body.userName,
            comment: request.body.comment,
            commentTime: admin.firestore.Timestamp.fromDate(new Date())
        };

        admin.firestore().collection("comments").add(comment)
            .then(document => response.json({message: `Document ${document.id} created successfully`}))
            .catch(error => {
                response.status(500).json({error: "Error when try to create comment"});
                console.error(error);
            })
    }
});