import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import Header from '../components/layout/Header';
import { menuState } from '../recoil/recoil';

function Home ( props:any){
    const setMenuState = useSetRecoilState(menuState);

    useEffect(() =>{
            setMenuState({activeNav:props.match.path});
    });
    return (
        <Header headerTitle='홈'  />
    )
}

export default Home;