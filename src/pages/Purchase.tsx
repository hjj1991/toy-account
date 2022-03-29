import Body from '../components/Purchase/Body';
import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { menuState } from '../recoil/recoil';
import Header from '../components/layout/Header';

function Purchase ( props:any){
    const setMenuState = useSetRecoilState(menuState);

    useEffect(() => {
        setMenuState({activeNav:props.match.path});
    })

    return (
        <>
        <Header headerTitle='소비생활' />
        <Body />
        </>
    )
}

export default Purchase;