import { UserDetails, UserInfo } from "../domain.constants";
import { EMPTY_ERROR, NOT_MATCHING_PASSWORDS, NOT_VALID_EMAIL, UserErrors } from "../errors.constants";

export class UserValidator {
    private _validationErrors: UserErrors;

    constructor() {
        this._validationErrors = {}
    }

    public validateRequiredProps(user: UserInfo): boolean {
        this._validationErrors = {};

        if (this.isEmpty(user.email)) {
            this._validationErrors.email = EMPTY_ERROR
        } else if (!this.isEmail(user.email)) {
            this._validationErrors.email = NOT_VALID_EMAIL
        }

        if (this.isEmpty(user.password)) this._validationErrors.password = EMPTY_ERROR;

        return Object.keys(this._validationErrors).length !== 0;
    }

    public validateAllProps(user: UserInfo): boolean {
        this.validateRequiredProps(user);
        if (user.password !== user.confirmPassword) this._validationErrors.confirmPassword = NOT_MATCHING_PASSWORDS;
        if (this.isEmpty(user.handle)) this._validationErrors.handle = EMPTY_ERROR;
        return Object.keys(this._validationErrors).length !== 0;
    }

    public reduceUserDetails(user: UserDetails): UserDetails {
        const userDetails: UserDetails = {};

        if (!this.isEmpty(user.bio)) {
            userDetails.bio = user.bio;
        }
        if (!this.isEmpty(user.location)) {
            userDetails.location = user.location;
        }
        if (!this.isEmpty(user.website)) {
            const userWeb = user.website!.trim();
            if (userWeb.substring(0, 4) !== "http") {
                userDetails.website = `http://${userWeb}`;
            } else {
                userDetails.website = user.website;
            }
        }

        return userDetails;
    }

    public get validationErrors(): UserErrors {
        return this._validationErrors;
    }

    private isEmpty(value: string | undefined): boolean {
        return !value || value.trim() === ""
    }

    private isEmail(email: string): boolean {
        const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegEx.test(email);
    }
}