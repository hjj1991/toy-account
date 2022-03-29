import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { Body } from "../components/AccountBook/Body";
import Header from "../components/layout/Header";
import { menuState } from "../recoil/recoil";

export function AccountBook( props:any){
    const setMenuState = useSetRecoilState(menuState);

    useEffect(() =>{
            setMenuState({activeNav:props.match.path});
    });


    return <>
    <Header headerTitle='가계부 목록' />
    <Body />
    </>
}