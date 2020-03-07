export const REGION_REQUEST = "europe-west1";

type StatusCode = number;
export const STATUS_CREATED: StatusCode = 201;
export const STATUS_CLIENT_ERROR: StatusCode = 400;
export const STATUS_NOT_FOUND_ERROR: StatusCode = 404;
export const STATUS_SERVER_ERROR: StatusCode = 500;
export const STATUS_UNAUTHORIZED_ERROR: StatusCode = 403;

export const POSTS_COLLECTION = "posts";
export const COMMENTS_COLLECTION = "comments";
export const USERS_COLLECTION = "users";
export const LIKES_COLLECTION = "likes";
export const NOTIFICATIONS_COLLECTION = "notifications";

export interface UserInfo {
    readonly email: string;
    readonly password: string;
    confirmPassword?: string;
    handle?: string;
}

export interface UserDetails {
    bio?: string;
    website?: string;
    location?: string;
}

export interface UploadImage {
    readonly fileName: string;
    readonly filePath: string;
    readonly mimetype: string;
}

export type Credentials = UserInfo & UserDetails;

export interface UserLike {
    readonly userHandle: string;
    readonly postId: string;
}

export interface UserFullInfo {
    credentials?: Credentials;
    likes?: UserLike[];
    notifications?: Notification[];
}

export interface PostData {
    postId?: string,
    readonly userName: string,
    readonly userImage: string,
    readonly message: string,
    readonly creationTime: string,
    likeCount: number,
    commentCount: number,
    readonly comments: CommentData[]
}

export interface CommentData {
    readonly postId: string,
    readonly userName: string,
    readonly userImage: string,
    readonly message: string,
    readonly creationTime: string
}

export const NOTIFICATION_LIKE = "like";
export const NOTIFICATION_COMMENT = "comment";
export type NotificationType = typeof NOTIFICATION_LIKE | typeof NOTIFICATION_COMMENT

export interface Notification {
    notificationId?: string,
    readonly creationTime: string,
    readonly recipient: string,
    readonly sender: string,
    readonly type: NotificationType,
    readonly read: boolean,
    readonly postId: string
}

export const USER_EMPTY_IMAGE = "no-image.png";

export const JPG_MIME_TYPE = "image/jpeg";
export const PNG_MIME_TYPE = "image/png";