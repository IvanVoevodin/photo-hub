export const POSTS_ROUT = "/posts";
export const LOGIN_ROUT = "/login";
export const SIGNUP_ROUT = "/signup";
export const USER_DATA_ROUT = "/user";
export const USER_IMAGE_ROUT = `${USER_DATA_ROUT}/image`;
export const likePostRout = (postId: string): string => `${POSTS_ROUT}/${postId}/like`;
export const unlikePostRout = (postId: string): string => `${POSTS_ROUT}/${postId}/unlike`;
export const COMMENT_ROUT = "comment";
