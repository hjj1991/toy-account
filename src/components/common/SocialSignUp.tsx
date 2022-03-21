import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import * as service from '../../services/axiosList';

export function SocialSignUp() {

    const location = useLocation();
    const params = new URLSearchParams(location.search);

    useEffect( () => {
        service.putSocialSignUp(params)
        .then((res:any) => {
            if (res.data.success) {
                window.opener.postMessage({success: true }, '*')
            }else{
                window.opener.postMessage({success: false, message: res.data.apiError.message }, '*')
            }
        }).catch((error:any) => {
            window.opener.postMessage({success: false }, '*');
        }).finally(() => {
            window.close();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    },[])

    return <></>
}