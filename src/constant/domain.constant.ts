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

const FB_TOKEN_KEY = "fbTokenId";

export default FB_TOKEN_KEY