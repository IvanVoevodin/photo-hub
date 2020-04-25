import React from "react";
import { Redirect, Route } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { HOME_ROUTE } from "../constant/app-route.constant";
import { ReducerStateProp, UserSate } from "../redux/redux.constant";

interface AuthRouteProps {
    readonly component: React.FC
    readonly path: string
}

const AuthRoute: React.FC<AuthRouteProps> = (authProps: AuthRouteProps) => {
    const {authenticated} = useSelector<ReducerStateProp, UserSate>((state: ReducerStateProp) => {
        return {
            authenticated: state.user.authenticated,
            ...state.user
        }
    }, shallowEqual);

    return authenticated ?
        <Redirect to={HOME_ROUTE}/> :
        <Route path={authProps.path} component={authProps.component}/>
};

export default AuthRoute
