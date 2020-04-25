import { Action } from "redux";
import { LoginError, SignupError, UserCredentials, UserData } from "../constant/domain.constant";

// User reducer types
export const AUTHENTICATED = "AUTHENTICATED";
export const UNAUTHENTICATED = "UNAUTHENTICATED";
export const SET_USER = "SET_USER";
export const LOADING_USER = "LOADING_USER";

// UI reducer types
export const LOGIN_ERRORS = "LOGIN_ERRORS";
export const SIGNUP_ERRORS = "SIGNUP_ERRORS";
export const LOADING_UI = "LOADING_UI";
export const CLEAR_ERRORS = "CLEAR_ERRORS";

export interface BaseAction<T> extends Action {
    readonly type: T
}

// User actions
export interface SetUserDataAction extends BaseAction<typeof SET_USER> {
    readonly userData: UserData
}

export interface SetUserAuthAction extends BaseAction<typeof AUTHENTICATED> {
}

export interface SetUserUnauthAction extends BaseAction<typeof UNAUTHENTICATED> {
}

// UI actions
export interface LoadingUiAction extends BaseAction<typeof LOADING_UI> {
    readonly loading: boolean
}

export interface LoginErrorsAction extends BaseAction<typeof LOGIN_ERRORS> {
    readonly errors: LoginError
}

export interface SignupErrorsAction extends BaseAction<typeof SIGNUP_ERRORS> {
    readonly errors: SignupError
}

export interface ClearErrorsAction extends BaseAction<typeof CLEAR_ERRORS> {
}

export type UiActionType = LoadingUiAction | LoginErrorsAction | SignupErrorsAction | ClearErrorsAction
export type UserActionType = SetUserDataAction | SetUserAuthAction | SetUserUnauthAction

export interface UserSate {
    readonly authenticated: boolean
    readonly credentials: UserCredentials
    readonly likes: []
    readonly notifications: []
}

export interface UiState {
    readonly loading: boolean
}

export interface UiLoginState extends UiState {
    readonly loginErrors: LoginError
}

export interface UiSignupState extends UiState {
    readonly signupErrors: SignupError
}

export interface UiGeneralState extends UiLoginState, UiSignupState {}

export interface ReducerStateProp {
    user: UserSate
    ui: UiGeneralState
}
