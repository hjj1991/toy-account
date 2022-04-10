import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import Header from '../components/layout/Header';
import { menuState } from '../recoil/recoil';


function Home (){
    const setMenuState = useSetRecoilState(menuState);

    const location = useLocation();
    useEffect(() =>{
            setMenuState({activeNav:location.pathname});
    });

    return (
        <Header headerTitle='홈'  />
    )
}

export default Home;