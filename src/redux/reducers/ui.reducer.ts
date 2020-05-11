import { Reducer } from "redux";
import { CLEAR_ERRORS, COMMON_ERRORS, LOADING_UI, LOGIN_ERRORS, SIGNUP_ERRORS, STOP_LOADING_UI, UiActionType, UiGeneralState } from "../redux.constant";

const initialState: UiGeneralState = {
    loading: false,
    loginErrors: {},
    signupErrors: {},
    commonErrors: {}
};

const uiReducer: Reducer<UiGeneralState, UiActionType> = (state = initialState, action) => {
    switch (action.type) {
        case LOADING_UI:
            return {...state, loading: true};
        case STOP_LOADING_UI:
            return {...state, loading: false};
        case LOGIN_ERRORS:
            return {...state, loginErrors: action.errors, loading: false};
        case SIGNUP_ERRORS:
            return {...state, signupErrors: action.errors, loading: false};
        case COMMON_ERRORS:
            return {...state, commonErrors: action.errors, loading: false};
        case CLEAR_ERRORS:
            return {...state, loginErrors: {}, signupErrors: {}, commonErrors: {}};
        default:
            return state
    }
};

export default uiReducer
