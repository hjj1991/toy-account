import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../../recoil/recoil";

export function SocialMapping() {

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const setLoading = useSetRecoilState<boolean>(loadingState);

    useEffect( () => {
        setLoading(true);
        window.opener.postMessage({returnData: params.get('provider') }, '*')
        window.close();
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    },[])

    return <></>
}