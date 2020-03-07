import { db } from "../utils/admin-fb.utils";
import {
    CommentData,
    COMMENTS_COLLECTION,
    LIKES_COLLECTION,
    PostData,
    POSTS_COLLECTION,
    STATUS_CLIENT_ERROR,
    STATUS_NOT_FOUND_ERROR,
    STATUS_SERVER_ERROR,
    STATUS_UNAUTHORIZED_ERROR
} from "../domain.constants";
import { Request, Response } from "express";
import { EMPTY_ERROR, POST_NOT_FOUND, UNAUTHORIZED_ERROR, UNKNOWN_ERROR } from "../errors.constants";
import { DocumentReference, QuerySnapshot } from "@firebase/firestore-types"

export const getPosts = (request: Request, response: Response) => {
    db.collection(POSTS_COLLECTION)
        .orderBy("creationTime", "desc")
        .get()
        .then(data => {
            const posts: PostData[] = [];
            data.forEach(doc => posts.push({
                postId: doc.id,
                ...doc.data() as PostData
            }));
            return response.json(posts);
        })
        .catch(error => new Error(error))
};

export const getPost = (request: Request, response: Response) => {
    let postData: PostData | null = null;
    db.doc(`/${POSTS_COLLECTION}/${request.params.postId}`).get()
        .then(doc => {
            if (!doc.exists) {
                response.status(STATUS_NOT_FOUND_ERROR).json({error: POST_NOT_FOUND});
                return null;
            }

            postData = doc.data() as PostData;
            postData.postId = doc.id;
            return db.collection(COMMENTS_COLLECTION)
                .orderBy("creationTime", "desc")
                .where("postId", "==", request.params.postId)
                .get();
        })
        .then(data => {
            if (data && postData) {
                data.forEach(doc => postData!.comments.push(doc.data() as CommentData));
                response.json(postData);
            }
        })
        .catch(error => {
            response.status(STATUS_SERVER_ERROR).json({error: error.code});
            throw new Error(error);
        })
};

export const doPost = (request: any, response: Response) => {
    const newPost: PostData = {
        userName: request.user.handle,
        userImage: request.user.imageUrl,
        message: request.body.message,
        likeCount: 0,
        commentCount: 0,
        comments: [],
        creationTime: new Date().toISOString()
    };

    db.collection(POSTS_COLLECTION)
        .add(newPost)
        .then(document => response.json({message: `Document ${document.id} created successfully`}))
        .catch(error => {
            response.status(STATUS_SERVER_ERROR).json({error: "Error when try to create post"});
            throw new Error(error);
        })
};

export const deletePost = (request: any, response: Response) => {
    const postDoc = db.doc(`/${POSTS_COLLECTION}/${request.params.postId}`);

    postDoc.get()
        .then(doc => {
            if (!doc.exists) {
                response.status(STATUS_NOT_FOUND_ERROR).json({error: POST_NOT_FOUND});
            }

            const data = doc.data();
            if (data && data.userName !== request.user.handle) {
                response.status(STATUS_UNAUTHORIZED_ERROR).json({error: UNAUTHORIZED_ERROR})
            } else {
                postDoc.delete().then(() => response.json({message: "Post delete successfully"}))
            }
        })
        .catch(error => {
            response.status(STATUS_SERVER_ERROR).json({error: error.code});
            throw new Error(error);
        })
};

export const commentOnPost = (request: any, response: Response) => {
    if ((request.body.message as string).trim() === "") {
        response.status(STATUS_CLIENT_ERROR).json({comment: EMPTY_ERROR})
    } else {
        const newComment: CommentData = {
            message: request.body.message,
            creationTime: new Date().toISOString(),
            postId: request.params.postId,
            userName: request.user.handle,
            userImage: request.user.imageUrl
        };

        db.doc(`/${POSTS_COLLECTION}/${request.params.postId}`).get()
            .then(doc => {
                const data = doc.data();
                if (!doc.exists) {
                    response.status(STATUS_NOT_FOUND_ERROR).json({error: POST_NOT_FOUND});
                } else if (data) {
                    return doc.ref.update({commentCount: data.commentCount + 1});
                }
                return null;
            })
            .then(result => {
                if (result) {
                    db.collection(COMMENTS_COLLECTION)
                        .add(newComment)
                        .then(() => response.json(newComment))
                }
            })
            .catch(error => {
                response.status(STATUS_SERVER_ERROR).json({error: UNKNOWN_ERROR});
                throw new Error(error);
            })
    }
};

export const likePost = (request: any, response: Response) => {
    likeOrUnlikePost(request, response, (postData, data, postDoc) => {
        if (data.empty) {
            db.collection(LIKES_COLLECTION).add({
                postId: request.params.postId,
                userName: request.user.handle
            }).then(() => {
                postData.likeCount++;
                return postDoc.update({likeCount: postData.likeCount})
            }).then(() => {
                response.json(postData);
            })
        } else {
            response.status(STATUS_CLIENT_ERROR).json({error: "Post already liked"});
        }
    })
};

export const unlikePost = (request: any, response: Response) => {
    likeOrUnlikePost(request, response, (postData, data, postDoc) => {
        if (data.empty) {
            response.status(STATUS_CLIENT_ERROR).json({error: "Post not liked"});
        } else {
            db.doc(`/${LIKES_COLLECTION}/${data.docs[0].id}`)
                .delete()
                .then(() => {
                    postData.likeCount--;
                    return postDoc.update({likeCount: postData.likeCount})
                })
                .then(() => {
                    response.json(postData);
                })
        }
    })
};

const likeOrUnlikePost = (request: any, response: Response, context: (postData: PostData, data: QuerySnapshot, postDoc: DocumentReference) => void) => {
    const likeDoc = db.collection(LIKES_COLLECTION)
        .where("userName", "==", request.user.handle)
        .where("postId", "==", request.params.postId)
        .limit(1);
    const postDoc = db.doc(`/${POSTS_COLLECTION}/${request.params.postId}`);
    let postData: PostData;

    postDoc.get()
        .then(doc => {
            if (doc.exists) {
                postData = doc.data() as PostData;
                postData.postId = doc.id;
                return likeDoc.get();
            } else {
                response.status(STATUS_NOT_FOUND_ERROR).json({error: POST_NOT_FOUND});
                return null;
            }
        })
        .then(data => {
            if (!data) {
                return;
            }
            // @ts-ignore
            context(postData, data, postDoc);
        })
        .catch(error => {
            response.status(STATUS_SERVER_ERROR).json({error: error.code});
            throw new Error(error);
        })
};