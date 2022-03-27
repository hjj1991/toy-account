import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { Body } from "../components/AccountBook/Body";
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
    <Body />
    </>
}