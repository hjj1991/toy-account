import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import Header from "../components/layout/Header";
import { Body } from "../components/MyInfo/Body";
import { menuState } from "../recoil/recoil";

export function MyInfo(){
    const setMenuState = useSetRecoilState(menuState);

    const location = useLocation();
    useEffect(() =>{
            setMenuState({activeNav:location.pathname});
    });


    return (
        <>
        <Header headerTitle="내정보" />
        <Body />
        </>
    )
}