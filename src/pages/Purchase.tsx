import Header from '../components/Purchase/Header';
import Body from '../components/Purchase/Body';
import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { menuState } from '../recoil/recoil';

function Purchase ( props:any){
    const { classes } = props;
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
        <Header onDrawerToggle={handleDrawerToggle} />
        <Body />
        </>
    )
}

export default Purchase;