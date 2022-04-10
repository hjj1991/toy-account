import Body from '../components/Purchase/Body';
import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { menuState } from '../recoil/recoil';
import Header from '../components/layout/Header';
import { useLocation } from 'react-router-dom';

function Purchase (){
    const setMenuState = useSetRecoilState(menuState);
    const location = useLocation();
    useEffect(() =>{
            setMenuState({activeNav:location.pathname});
    });

    return (
        <>
        <Header headerTitle='소비생활' />
        <Body />
        </>
    )
}

export default Purchase;