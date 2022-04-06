import Body from '../components/Card/Body';
import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { menuState } from '../recoil/recoil';
import Header from '../components/layout/Header';
import { useLocation } from 'react-router-dom';

function Card (){
    const setMenuState = useSetRecoilState(menuState);
    const location = useLocation();
    useEffect(() =>{
            setMenuState({activeNav:location.pathname});
    });


    return (
        <>
        <Header headerTitle='카드목록'  />
        <Body />
        </>
    )
}

export default Card;