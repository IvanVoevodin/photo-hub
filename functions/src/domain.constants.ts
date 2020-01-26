export const REGION_REQUEST = "europe-west1";

type StatusCode = number;
export const STATUS_CREATED: StatusCode = 201;
export const STATUS_CLIENT_ERROR: StatusCode = 400;
export const STATUS_SERVER_ERROR: StatusCode = 500;
export const STATUS_UNAUTHORIZED_ERROR: StatusCode = 403;

export const COMMENTS_COLLECTION = "comments";
export const USERS_COLLECTION = "users";

export type UserInfo = {
    email: string;
    password: string;
    confirmPassword?: string;
    handle?: string;
}