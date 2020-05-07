import { Reducer } from "redux";
import { CREATE_POST, DataActionType, DataState, DELETE_POST, LIKE_POST, LOAD_POSTS, LOADING_DATA, SET_POST, UNLIKE_POST } from "../redux.constant";
import { Post } from "../../constant/domain.constant";

const initialState: DataState = {
    loading: false,
    posts: []
};

const replacePost = (posts: Post[], postToReplace: Post): Post[] => {
    const index = posts.findIndex(post => post.postId === postToReplace.postId);
    posts.splice(index, 1, postToReplace);
    return posts;
};

const removePostById = (posts: Post[], postId: string): Post[] => {
    const index = posts.findIndex(post => post.postId === postId);
    posts.splice(index, 1);
    return posts;
};

const dataReducer: Reducer<DataState, DataActionType> = (state = initialState, action) => {
    switch (action.type) {
        case LOADING_DATA:
            return {...state, loading: true};
        case LOAD_POSTS:
            return {...state, posts: action.posts, loading: false};
        case LIKE_POST:
        case UNLIKE_POST:
            return {...state, posts: replacePost(Array.from(state.posts), action.post)};
        case CREATE_POST:
            return {...state, posts: [action.post, ...state.posts]};
        case DELETE_POST:
            return {...state, posts: removePostById(Array.from(state.posts), action.postId)};
        case SET_POST:
            return {...state, post: action.post};
        default:
            return state
    }
};

export default dataReducer
