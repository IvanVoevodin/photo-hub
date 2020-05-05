import { Reducer } from "redux";
import { AUTHENTICATED, LOADING_USER, SET_USER, UNAUTHENTICATED, UPDATE_LIKE, UPDATE_UNLIKE, UserActionType, UserSate } from "../redux.constant";

const initialState: UserSate = {
    authenticated: false,
    loading: false,
    credentials: {
        uid: "",
        email: "",
        handle: "",
        creationTime: "",
        imageUrl: ""
    },
    likes: [],
    notifications: []
};

const userReducer: Reducer<UserSate, UserActionType> = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                credentials: action.userData.credentials,
                likes: action.userData.likes,
                notifications: action.userData.notifications,
                loading: false
            };
        case AUTHENTICATED:
            return {...state, authenticated: true};
        case UNAUTHENTICATED:
            return {...state, authenticated: false};
        case LOADING_USER:
            return {...state, loading: true};
        case UPDATE_LIKE:
            return {
                ...state,
                likes: [
                    ...state.likes,
                    {
                        userName: state.credentials.handle,
                        postId: action.post.postId
                    }
                ]
            };
        case UPDATE_UNLIKE:
            return {
                ...state,
                likes: state.likes.filter(like => like.postId !== action.post.postId)
            };
        default:
            return state
    }
};

export default userReducer
