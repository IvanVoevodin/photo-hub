import { Dispatch } from "redux";
import axios from "axios";
import { DataActionType, LIKE_POST, LOADING_DATA, UNLIKE_POST, UPDATE_LIKE, UPDATE_POSTS, UPDATE_UNLIKE, UserActionType } from "../redux.constant";
import { likePostRout, POSTS_ROUT, unlikePostRout } from "../../constant/rest-api.constant";

export const updatePosts = (dispatch: Dispatch<DataActionType>) => {
    dispatch({type: LOADING_DATA});
    axios.get(POSTS_ROUT)
        .then(response => dispatch({type: UPDATE_POSTS, posts: response.data}))
        .catch(error => {
            dispatch({type: UPDATE_POSTS, posts: []});
            throw new Error(error)
        })
};

export const likePost = (postId: string, dispatch: Dispatch<DataActionType | UserActionType>) => {
    axios.post(likePostRout(postId))
        .then(response => {
            dispatch({type: LIKE_POST, post: response.data});
            dispatch({type: UPDATE_LIKE, post: response.data});
        })
        .catch(error => new Error(error))
};

export const unlikePost = (postId: string, dispatch: Dispatch<DataActionType | UserActionType>) => {
    axios.post(unlikePostRout(postId))
        .then(response => {
            dispatch({type: UNLIKE_POST, post: response.data});
            dispatch({type: UPDATE_UNLIKE, post: response.data});
        })
        .catch(error => new Error(error))
};
