import React from 'react';
import Header from '../components/layout/Header';


function Home ( props:any){
    // const setMenuState = useSetRecoilState(menuState);

    // useEffect(() =>{
    //         setMenuState({activeNav:props.match.path});
    // });

    console.log("Gdgd");
    return (
        <Header headerTitle='홈'  />
    )
}

export default Home;