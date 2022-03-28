import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { Body } from "../components/AccountBook/Body";
import CommonHeader from "../components/common/CommonHeader";
import { menuState } from "../recoil/recoil";

export function AccountBook( props:any){
    const [mobileOpen, setMobileOpen] = useState(false);
    const setMenuState = useSetRecoilState(menuState);

    useEffect(() =>{
            setMenuState({activeNav:props.match.path});
    });


    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
      };


    return <>
    <CommonHeader headerTitle='가계부 목록' onDrawerToggle={handleDrawerToggle} />
    <Body />
    </>
}