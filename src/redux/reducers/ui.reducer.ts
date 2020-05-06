import { Reducer } from "redux";
import { CLEAR_ERRORS, LOADING_UI, LOGIN_ERRORS, POST_ERRORS, SIGNUP_ERRORS, UiActionType, UiGeneralState } from "../redux.constant";

const initialState: UiGeneralState = {
    loading: false,
    loginErrors: {},
    signupErrors: {},
    postErrors: {}
};

const uiReducer: Reducer<UiGeneralState, UiActionType> = (state = initialState, action) => {
    switch (action.type) {
        case LOADING_UI:
            return {...state, loading: true};
        case LOGIN_ERRORS:
            return {...state, loginErrors: action.errors, loading: false};
        case SIGNUP_ERRORS:
            return {...state, signupErrors: action.errors, loading: false};
        case POST_ERRORS:
            return {...state, postErrors: action.errors, loading: false};
        case CLEAR_ERRORS:
            return {...state, loginErrors: {}, signupErrors: {}, postErrors: {}, loading: false};
        default:
            return state
    }
};

export default uiReducer
