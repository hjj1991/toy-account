import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../../recoil/recoil";
import * as service from '../../services/axiosList';

export function SocialSignUp() {

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const setLoading = useSetRecoilState<boolean>(loadingState);

    useEffect( () => {
        setLoading(true);
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
            setLoading(false);
            window.close();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    },[])

    return <></>
}