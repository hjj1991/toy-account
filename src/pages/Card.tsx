import Body from '../components/Card/Body';
import Header from '../components/Card/Header';
import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { menuState } from '../recoil/recoil';

function Card ( props:any){
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const setMenuState = useSetRecoilState(menuState);

    useEffect(() =>{
            setMenuState({activeNav:props.match.path});
    });


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

export default Card;