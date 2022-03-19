import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import CommonHeader from "../components/common/CommonHeader";
import { Body } from "../components/MyInfo/Body";
import { menuState } from "../recoil/recoil";

export function MyInfo( props:any){
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const setMenuState = useSetRecoilState(menuState);

    useEffect(() => {
        setMenuState({activeNav:props.match.path});
    })


    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
      };

    return (
        <>
        <CommonHeader headerTitle="내정보" onDrawerToggle={handleDrawerToggle} />
        <Body />
        </>
    )
}