import React, { useEffect } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { useRecoilState } from "recoil";
import { SnackBarInfo, snackBarState } from "../../recoil/recoil";

export type ProtectedRouteProps = {
    isAuthenticated: boolean;
    // authenticationPath: string;
} & RouteProps;

function PrivateRoute({ isAuthenticated , ...routeProps }: ProtectedRouteProps) {
    const [snackBarInfo, setSnackBarInfo] = useRecoilState<SnackBarInfo>(snackBarState);


    useEffect( () => {
        if(!isAuthenticated){
            setSnackBarInfo({
                ...snackBarInfo,
                message: "로그인후 이용해주세요.",
                severity:'error',
                title: "권한이 없습니다.",
                open: true
            })
        }
    })
    
    if (isAuthenticated) {
        return <Route {...routeProps} />;
    } else {
        return <Redirect to="/signin" />;
    }
};

export default PrivateRoute;