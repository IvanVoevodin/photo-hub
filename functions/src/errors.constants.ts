export type UserErrors = {
    email?: string;
    password?: string;
    confirmPassword?: string;
    handle?: string;
}

export const EMPTY_ERROR = "Must not be empty";
export const NOT_VALID_EMAIL = "Must be a valid email address";
export const NOT_MATCHING_PASSWORDS = "Passwords must match";
export const WRONG_CREDENTIALS_ERROR = "Wrong credentials, please try again";
export const EMAIL_ALREADY_IN_USE_ERROR = "auth/email-already-in-use";
export const POST_NOT_FOUND = "Post not found";
export const UNAUTHORIZED_ERROR = "Unauthorized";
export const UNKNOWN_ERROR = "Something went wrong, please try again";