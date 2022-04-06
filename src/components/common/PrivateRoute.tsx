import React, { useEffect } from "react";
import { Navigate, Outlet, RouteProps } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { authenticatedState, SnackBarInfo, snackBarState } from "../../recoil/recoil";

export type ProtectedRouteProps = {
    isAuthenticated: boolean;
    // authenticationPath: string;
} & RouteProps;

function PrivateRoute() {
    const [snackBarInfo, setSnackBarInfo] = useRecoilState<SnackBarInfo>(snackBarState);
    const authenticated = useRecoilValue(authenticatedState);

    useEffect( () => {
        if(!authenticated.isAuthenticated){
            setSnackBarInfo({
                ...snackBarInfo,
                message: "로그인후 이용해주세요.",
                severity:'error',
                title: "권한이 없습니다.",
                open: true
            })
        }
    })

    return authenticated.isAuthenticated? <Outlet /> : <Navigate replace to="/signin" />

};

export default PrivateRoute;