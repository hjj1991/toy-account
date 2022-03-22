import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../../recoil/recoil";
import * as service from '../../services/axiosList';

export function SocialSignIn() {

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const setLoading = useSetRecoilState<boolean>(loadingState);

    useEffect( ()=>{
        setLoading(true);
        service.postSocialSignIn(params)
        .then((res:any) => {
            if (res.data.success) {
                window.opener.postMessage({isAuthenticated: true, data: res.data.response }, '*')
            }else{
                alert(res.data.apiError.message);
            }
        }).catch((error:any) => {
            alert("서버 오류입니다.");
        }).finally(() => {
            setLoading(false);
            window.close();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    },[])

    return <></>
}