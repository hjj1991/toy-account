import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import Header from "../components/layout/Header";
import { Body } from "../components/MyInfo/Body";
import { menuState } from "../recoil/recoil";

export function MyInfo( props:any){
    const setMenuState = useSetRecoilState(menuState);

    useEffect(() => {
        setMenuState({activeNav:props.match.path});
    })

    return (
        <>
        <Header headerTitle="내정보" />
        <Body />
        </>
    )
}