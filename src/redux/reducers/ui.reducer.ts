import { Reducer } from "redux";
import { CLEAR_ERRORS, LOADING_UI, LOGIN_ERRORS, SIGNUP_ERRORS, UiActionType, UiGeneralState } from "../redux.constant";

const initialState: UiGeneralState = {
    loading: false,
    loginErrors: {},
    signupErrors: {}
};

const uiReducer: Reducer<UiGeneralState, UiActionType> = (state = initialState, action) => {
    switch (action.type) {
        case LOADING_UI:
            return {...state, loading: action.loading};
        case LOGIN_ERRORS:
            return {...state, loginErrors: action.errors};
        case SIGNUP_ERRORS:
            return {...state, signupErrors: action.errors};
        case CLEAR_ERRORS:
            return {...state, loginErrors: {}, signupErrors: {}};
        default:
            return state
    }
};

export default uiReducer
