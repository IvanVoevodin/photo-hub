import { Reducer } from "redux";
import { CREATE_POST, DataActionType, DataState, LIKE_POST, LOADING_DATA, UNLIKE_POST, UPDATE_POSTS } from "../redux.constant";
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

const dataReducer: Reducer<DataState, DataActionType> = (state = initialState, action) => {
    switch (action.type) {
        case LOADING_DATA:
            return {...state, loading: true};
        case UPDATE_POSTS:
            return {...state, posts: action.posts, loading: false};
        case LIKE_POST:
        case UNLIKE_POST:
            return {...state, posts: replacePost(Array.from(state.posts), action.post)};
        case CREATE_POST:
            return state;
        default:
            return state
    }
};

export default dataReducer
