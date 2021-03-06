import axios from "axios";
import { History } from "history";
import { Dispatch } from "redux";
import { AUTH_HEADER, FB_TOKEN_KEY, LoginData, SignupData, UserCredentials } from "../../constant/domain.constant";
import { AUTHENTICATED, CLEAR_ERRORS, LOADING_UI, LOADING_USER, LOGIN_ERRORS, SET_USER, SIGNUP_ERRORS, STOP_LOADING_UI, UiActionType, UNAUTHENTICATED, UserActionType } from "../redux.constant";
import { LOGIN_ROUT, SIGNUP_ROUT, USER_DATA_ROUT, USER_IMAGE_ROUT } from "../../constant/rest-api.constant";
import { HOME_ROUTE } from "../../constant/app-route.constant";

const updateUserData = (dispatch: Dispatch<UserActionType>) => {
    dispatch({type: LOADING_USER});
    axios.get(USER_DATA_ROUT)
        .then(response => {
            dispatch({
                type: SET_USER,
                userData: response.data
            })
        })
        .catch(error => new Error(error))
};

const storeAuthorizationToken = (token: string) => {
    const fbIdToken = `Bearer ${token}`;
    localStorage.setItem(FB_TOKEN_KEY, fbIdToken);
    axios.defaults.headers.common[AUTH_HEADER] = fbIdToken;
};

export const loginUser = (loginData: LoginData, history: History, dispatch: Dispatch<UserActionType | UiActionType>) => {
    dispatch({type: CLEAR_ERRORS});
    dispatch({type: LOADING_UI});
    axios.post(LOGIN_ROUT, loginData)
        .then(response => {
            dispatch({type: AUTHENTICATED});
            storeAuthorizationToken(response.data.token);
            updateUserData(dispatch);
            dispatch({type: STOP_LOADING_UI});
            history.push(HOME_ROUTE);
        })
        .catch(error => dispatch({type: LOGIN_ERRORS, errors: error.response.data}))
};

export const signupUser = (signupData: SignupData, history: History, dispatch: Dispatch<UserActionType | UiActionType>) => {
    dispatch({type: CLEAR_ERRORS});
    dispatch({type: LOADING_UI});
    axios.post(SIGNUP_ROUT, signupData)
        .then(response => {
            dispatch({type: AUTHENTICATED});
            storeAuthorizationToken(response.data.token);
            updateUserData(dispatch);
            dispatch({type: STOP_LOADING_UI});
            history.push(HOME_ROUTE);
        })
        .catch(error => dispatch({type: SIGNUP_ERRORS, errors: error.response.data}))
};

export const authUser = (token: string, dispatch: Dispatch<UserActionType>) => {
    dispatch({type: AUTHENTICATED});
    axios.defaults.headers.common[AUTH_HEADER] = token;
    updateUserData(dispatch);
};

export const logoutUser = (dispatch: Dispatch<UserActionType>) => {
    localStorage.removeItem(FB_TOKEN_KEY);
    delete axios.defaults.headers.common[AUTH_HEADER];
    dispatch({type: UNAUTHENTICATED})
};

export const uploadImage = (formData: FormData, dispatch: Dispatch<UserActionType>) => {
    dispatch({type: LOADING_USER});
    axios.post(USER_IMAGE_ROUT, formData)
        .then(() => updateUserData(dispatch))
        .catch(error => new Error(error))
};

export const editUserDetails = (userDetails: UserCredentials, dispatch: Dispatch<UserActionType>) => {
    dispatch({type: LOADING_USER});
    axios.post(USER_DATA_ROUT, userDetails)
        .then(() => updateUserData(dispatch))
        .catch(error => new Error(error))
};
