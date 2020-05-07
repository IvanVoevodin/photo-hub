import { Dispatch } from "redux";
import axios from "axios";
import {
    CLEAR_ERRORS,
    CREATE_POST,
    DataActionType,
    DELETE_POST,
    LIKE_POST,
    LOAD_POSTS,
    LOADING_DATA,
    LOADING_UI,
    POST_ERRORS,
    SET_POST,
    STOP_LOADING_UI,
    UiActionType,
    UNLIKE_POST,
    UPDATE_LIKE,
    UPDATE_UNLIKE,
    UpdateLikeAction,
    UpdateUnlikeAction
} from "../redux.constant";
import { likePostRout, POSTS_ROUT, unlikePostRout } from "../../constant/rest-api.constant";

export const loadPosts = (dispatch: Dispatch<DataActionType>) => {
    dispatch({type: LOADING_DATA});
    axios.get(POSTS_ROUT)
        .then(response => dispatch({type: LOAD_POSTS, posts: response.data}))
        .catch(error => {
            dispatch({type: LOAD_POSTS, posts: []});
            throw new Error(error)
        })
};

export const deletePost = (postId: string, dispatch: Dispatch<DataActionType>) => {
    axios.delete(`${POSTS_ROUT}/${postId}`)
        .then(() => dispatch({type: DELETE_POST, postId}))
        .catch(error => new Error(error))
};

export const createPost = (message: string, dispatch: Dispatch<DataActionType | UiActionType>) => {
    dispatch({type: CLEAR_ERRORS});
    dispatch({type: LOADING_UI});
    axios.post(POSTS_ROUT, {message})
        .then(response => {
            dispatch({type: CREATE_POST, post: response.data});
            dispatch({type: STOP_LOADING_UI});
        })
        .catch(error => dispatch({type: POST_ERRORS, errors: error.response.data}))
};

export const getPost = (postId: string, dispatch: Dispatch<DataActionType | UiActionType>) => {
    dispatch({type: LOADING_UI});
    axios.get(`${POSTS_ROUT}/${postId}`)
        .then(response => {
            dispatch({type: SET_POST, post: response.data});
            dispatch({type: STOP_LOADING_UI});
        })
        .catch(error => {
            dispatch({type: STOP_LOADING_UI});
            throw new Error(error)
        })
};

export const likePost = (postId: string, dispatch: Dispatch<DataActionType | UpdateLikeAction>) => {
    axios.post(likePostRout(postId))
        .then(response => {
            dispatch({type: LIKE_POST, post: response.data});
            dispatch({type: UPDATE_LIKE, post: response.data});
        })
        .catch(error => new Error(error))
};

export const unlikePost = (postId: string, dispatch: Dispatch<DataActionType | UpdateUnlikeAction>) => {
    axios.post(unlikePostRout(postId))
        .then(response => {
            dispatch({type: UNLIKE_POST, post: response.data});
            dispatch({type: UPDATE_UNLIKE, post: response.data});
        })
        .catch(error => new Error(error))
};
