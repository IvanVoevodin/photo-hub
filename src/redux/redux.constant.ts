import { Action } from "redux";
import { LoginError, Post, PostError, SignupError, UserCredentials, UserData, UserLike } from "../constant/domain.constant";

// User reducer types
export const AUTHENTICATED = "AUTHENTICATED";
export const UNAUTHENTICATED = "UNAUTHENTICATED";
export const SET_USER = "SET_USER";
export const LOADING_USER = "LOADING_USER";
export const UPDATE_LIKE = "update-like";
export const UPDATE_UNLIKE = "update-unlike";

// UI reducer types
export const LOGIN_ERRORS = "LOGIN_ERRORS";
export const SIGNUP_ERRORS = "SIGNUP_ERRORS";
export const POST_ERRORS = "post-errors";
export const LOADING_UI = "LOADING_UI";
export const CLEAR_ERRORS = "CLEAR_ERRORS";

// Data reducer types
export const LOADING_DATA = "loading-data";
export const UPDATE_POSTS = "update-posts";
export const CREATE_POST = "create-post";
export const DELETE_POST = "delete-post";
export const LIKE_POST = "like-post";
export const UNLIKE_POST = "unlike-post";

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

export interface LoadingUserAction extends BaseAction<typeof LOADING_USER> {
}

interface BaseUpdateLikeAction<T extends typeof UPDATE_LIKE | typeof UPDATE_UNLIKE> extends BaseAction<T> {
    readonly post: Post
}

export interface UpdateLikeAction extends BaseUpdateLikeAction<typeof UPDATE_LIKE> {
}

export interface UpdateUnlikeAction extends BaseUpdateLikeAction<typeof UPDATE_UNLIKE> {
}

// UI actions
export interface LoadingUiAction extends BaseAction<typeof LOADING_UI> {
}

export interface LoginErrorsAction extends BaseAction<typeof LOGIN_ERRORS> {
    readonly errors: LoginError
}

export interface SignupErrorsAction extends BaseAction<typeof SIGNUP_ERRORS> {
    readonly errors: SignupError
}

export interface PostErrorsAction extends BaseAction<typeof POST_ERRORS> {
    readonly errors: PostError
}

export interface ClearErrorsAction extends BaseAction<typeof CLEAR_ERRORS> {
}

// Data actions
export interface LoadingDataAction extends BaseAction<typeof LOADING_DATA> {
}

export interface UpdatePostsAction extends BaseAction<typeof UPDATE_POSTS> {
    readonly posts: Post[]
}

export interface CreatePostAction extends BaseAction<typeof CREATE_POST> {
    readonly post: Post
}

export interface DeletePostAction extends BaseAction<typeof DELETE_POST> {
    readonly postId: string
}

interface BaseLikePostAction<T extends typeof LIKE_POST | typeof UNLIKE_POST> extends BaseAction<T> {
    readonly post: Post
}

export interface LikePostAction extends BaseLikePostAction<typeof LIKE_POST> {
}

export interface UnlikePostAction extends BaseLikePostAction<typeof UNLIKE_POST> {
}

export type UiActionType = LoadingUiAction | LoginErrorsAction | SignupErrorsAction | PostErrorsAction | ClearErrorsAction
export type UserActionType = SetUserDataAction | SetUserAuthAction | SetUserUnauthAction | LoadingUserAction | UpdateLikeAction | UpdateUnlikeAction
export type DataActionType = LoadingDataAction | UpdatePostsAction | CreatePostAction | DeletePostAction | LikePostAction | UnlikePostAction

export interface UserSate {
    readonly authenticated: boolean
    readonly loading: boolean
    readonly credentials: UserCredentials
    readonly likes: UserLike[]
    readonly notifications: []
}

export interface DataState {
    readonly posts: Post[]
    readonly loading: boolean
    readonly post?: Post
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

export interface UiPostState extends UiState {
    readonly postErrors: PostError
}

export interface UiGeneralState extends UiLoginState, UiSignupState, UiPostState {}

export interface ReducerStateProp {
    user: UserSate
    ui: UiGeneralState,
    data: DataState
}
