import Body from '../components/Saving/Body';
import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { menuState } from '../recoil/recoil';
import Header from '../components/layout/Header';
import { useLocation } from 'react-router-dom';

function Saving (){
    const setMenuState = useSetRecoilState(menuState);
    const location = useLocation();
    useEffect(() =>setMenuState({activeNav:location.pathname}));

    return (
        <>
        <Header headerTitle='적금' />
        <Body />
        </>
    )
}

export default Saving;