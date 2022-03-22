import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { menuState } from '../recoil/recoil';

function Home ( props:any){
    const setMenuState = useSetRecoilState(menuState);

    useEffect(() =>{
            setMenuState({activeNav:props.match.path});
    });
    return (
        <div>
            HOME입니다.
        </div>
    )
}

export default Home;