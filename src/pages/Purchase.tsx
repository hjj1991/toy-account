import Body from '../components/Purchase/Body';
import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { menuState } from '../recoil/recoil';
import CommonHeader from '../components/common/CommonHeader';

function Purchase ( props:any){
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
        <CommonHeader headerTitle='소비생활' onDrawerToggle={handleDrawerToggle} />
        <Body />
        </>
    )
}

export default Purchase;