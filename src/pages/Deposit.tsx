import Body from '../components/Deposit/Body';
import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { menuState } from '../recoil/recoil';
import Header from '../components/layout/Header';
import { useLocation } from 'react-router-dom';

function Deposit (){
    const setMenuState = useSetRecoilState(menuState);
    const location = useLocation();
    useEffect(() =>setMenuState({activeNav:location.pathname}));

    return (
        <>
        <Header headerTitle='예금' />
        <Body />
        </>
    )
}

export default Deposit;