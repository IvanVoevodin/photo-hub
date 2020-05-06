export interface Post {
    readonly postId: string,
    readonly likeCount: number,
    readonly userName: string,
    readonly comments: [], // todo make type
    readonly commentCount: number,
    readonly userImage: string,
    readonly creationTime: string,
    readonly message: string
}

export interface TokenDto {
    readonly iss: string
    readonly aud: string
    readonly sub: string
    readonly iat: number
    readonly exp: number
    readonly email: string
}

export interface UserCredentials {
    readonly handle: string
    readonly email: string
    readonly imageUrl: string
    readonly uid: string
    readonly creationTime: string
    readonly bio?: string
    readonly location?: string
    readonly website?: string
}

export interface UserLike {
    readonly userName: string
    readonly postId: string
}

export interface UserData {
    readonly credentials: UserCredentials,
    readonly likes: UserLike[],
    readonly notifications: []
}

export interface LoginData {
    readonly email: string
    readonly password: string
}

export interface SignupData {
    readonly email: string
    readonly password: string
    readonly confirmPassword: string
    readonly handle: string
}

export interface LoginError {
    readonly email?: string;
    readonly password?: string;
    readonly general?: string;
}

export interface SignupError {
    readonly email?: string;
    readonly password?: string;
    readonly confirmPassword?: string;
    readonly error?: string;
    readonly handle?: string;
}

export interface PostError {
    readonly error?: string
}

export const AUTH_HEADER = "Authorization";
export const FB_TOKEN_KEY = "fbTokenId";
