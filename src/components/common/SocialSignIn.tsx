import { useEffect } from "react";
import * as service from '../../services/axiosList';

export function SocialSignIn() {

    console.log("Sssssssssss");


    useEffect( ()=>{
        service.postReIssueeToken()
        .then((res:any) => {
            window.opener.postMessage({code:"gg"}, '*')
        }).catch((error:any) => {
            alert("서버 오류입니다.");
        }).finally(() => {
        });
    },[])

    return <></>
}