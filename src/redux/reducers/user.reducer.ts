import { Reducer } from "redux";
import { AUTHENTICATED, SET_USER, UNAUTHENTICATED, UserActionType, UserSate } from "../redux.constant";

const initialState: UserSate = {
    authenticated: false,
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
            return {...state, userData: action.userData};
        case AUTHENTICATED:
            return {...state, authenticated: true};
        case UNAUTHENTICATED:
            return {...state, authenticated: false};
        default:
            return state
    }
};

export default userReducer
