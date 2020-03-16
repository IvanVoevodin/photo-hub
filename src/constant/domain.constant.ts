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