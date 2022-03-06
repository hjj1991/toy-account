import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

export type ProtectedRouteProps = {
    isAuthenticated: boolean;
    authenticationPath: string;
} & RouteProps;

function PrivateRoute({ isAuthenticated, authenticationPath, ...routeProps }: ProtectedRouteProps) {
    if (isAuthenticated) {
        return <Route {...routeProps} />;
    } else {
        return <Redirect to="/signin" />;
    }
};

export default PrivateRoute;