import React from "react";
import { Redirect, Route } from "react-router-dom";
import { HOME_ROUTE } from "../constant/app-route.constant";

interface AuthRouteProps {
    readonly component: React.FC
    readonly path: string
    readonly authenticated: boolean
}

const AuthRoute: React.FC<AuthRouteProps> = (authProps: AuthRouteProps) => {
    return authProps.authenticated ?
        <Redirect to={HOME_ROUTE}/> :
        <Route path={authProps.path} component={authProps.component}/>
};

export default AuthRoute