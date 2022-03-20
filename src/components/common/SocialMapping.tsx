import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import * as service from '../../services/axiosList';

export function SocialMapping() {

    const location = useLocation();
    const params = new URLSearchParams(location.search);

    useEffect( () => {
        service.postSocialMapping(params)
        .then((res:any) => {
            if (res.data.success) {
                window.opener.postMessage({returnData: params.get('provider') }, '*')
            }
            
        }).catch((error:any) => {
            alert("서버 오류입니다.");
        }).finally(() => {
            window.close();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    },[])

    return <></>
}