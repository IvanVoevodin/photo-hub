export const REGION_REQUEST = "europe-west1";

type StatusCode = number;
export const STATUS_CREATED: StatusCode = 201;
export const STATUS_CLIENT_ERROR: StatusCode = 400;
export const STATUS_SERVER_ERROR: StatusCode = 500;
export const STATUS_UNAUTHORIZED_ERROR: StatusCode = 403;

export const COMMENTS_COLLECTION = "comments";
export const USERS_COLLECTION = "users";
export const LIKES_COLLECTION = "likes";

export type UserInfo = {
    email: string;
    password: string;
    confirmPassword?: string;
    handle?: string;
}

export type UserDetails = {
    bio?: string;
    website?: string;
    location?: string;
}

export type Credentials = UserInfo & UserDetails;
export type UserLike = {
    userHandle: string;
    commentId: string;
}

export type UserFullInfo = {
    credentials?: Credentials;
    likes?: UserLike[];
}

export const USER_EMPTY_IMAGE = "no-image.png";

export const JPG_MIME_TYPE = "image/jpeg";
export const PNG_MIME_TYPE = "image/png";