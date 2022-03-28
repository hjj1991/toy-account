import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import CommonHeader from "../components/common/CommonHeader";
import Body from "../components/Purchase/Body";
import { menuState } from "../recoil/recoil";

export function AccountBookDetail( props:any){
    const [mobileOpen, setMobileOpen] = useState(false);
    const setMenuState = useSetRecoilState(menuState);

    const params:any = useParams();
    const accountBookNo = params.accountBookNo;

    useEffect(() =>{
            setMenuState({activeNav:props.match.path});
    });


    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
      };


    return <>
    <CommonHeader headerTitle='가계부 상세' onDrawerToggle={handleDrawerToggle} />
    <Body
        accountBookNo={Number(accountBookNo)}
        />
    </>
}