import Body from '../components/Card/Body';
import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { menuState } from '../recoil/recoil';
import Header from '../components/layout/Header';

function Card ( props:any){
    const setMenuState = useSetRecoilState(menuState);

    useEffect(() =>{
            setMenuState({activeNav:props.match.path});
    });


    return (
        <>
        <Header headerTitle='카드목록'  />
        <Body />
        </>
    )
}

export default Card;