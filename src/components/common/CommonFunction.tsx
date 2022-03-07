import moment from "moment";
import storage from "../../lib/storage";
import { AuthenticatedInfo } from "../../recoil/recoil";
import * as service from '../../services/axiosList';

/* 로그인 체크 */
export async function loginValidation(authenticated:AuthenticatedInfo) {

    if(authenticated.data?.accessToken !== undefined && authenticated.data?.expireTime < moment().unix()){
        const response = await service.postReIssueeToken();
        if (response.status === 200 && response.data.success) {
            storage.set('loginInfo', { isAuthenticated: true, data: response.data.response });
        }else{
            storage.remove('loginInfo');
        }
    }else{
        storage.remove('loginInfo');
    }
}
