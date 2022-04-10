import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { Body } from "../components/AccountBook/Body";
import Header from "../components/layout/Header";
import { menuState } from "../recoil/recoil";

export function AccountBook(){
    const setMenuState = useSetRecoilState(menuState);
    const location = useLocation();
    useEffect(() =>{
            setMenuState({activeNav:location.pathname});
    });

    return <>
    <Header headerTitle='가계부 목록' />
    <Body />
    </>
}