import axios, { AxiosRequestConfig } from 'axios';
import moment from 'moment';
import storage from '../lib/storage';

// const siteUrl = "http://localhost:8080";
const siteUrl = "http://dognas.ipdisk.co.kr:8080";


axios.defaults.baseURL = siteUrl;

export const authAxios = () => {
    const tempAxios = axios.create({
        headers:  { 'access_token': storage.get('accessToken') }
    });

    tempAxios.interceptors.request.use(refreshConfig);
    return tempAxios;
}

export const refreshConfig = async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
    let expireTime = storage.get('expireTime');
    if(expireTime < moment().valueOf()){
        const res = await postReIssueeToken();
        if(res.status === 200 && res.data.success){
            config.headers['access_token'] = res.data.response.accessToken;
            storage.set('loginInfo', { isAuthenticated: true, data: res.data.response });
            storage.set('accessToken', res.data.response.accessToken);
            storage.set('refreshToken', res.data.response.refreshToken);
            storage.set('expireTime', res.data.response.expireTime);
        }else{
            sessionStorage.clear();
            alert("세션이 만료되었습니다. \n 다시 로그인해주세요.");
            window.location.href = '/';
        }
    }

    return config;
  };

/* 로그인 요청 interface */
export interface SignInForm {
    userId: FormDataEntryValue | null;
    userPw: FormDataEntryValue | null;
}

/* 카드 추가 API */
export interface CardAddForm {
    cardName: string,
    cardType: string,
    cardDesc: string
}

/* 카드 수정 API */
export interface CardUpdateForm {
    cardNo: number,
    cardName: string,
    cardType: string,
    cardDesc: string
}

/* 소득,지출 추가 API */
export interface PurchaseAddForm {
    cardNo?: number,
    price: string,
    purchaseDate: string,
    purchaseType: string,
    reason: string,
    storeName?: string,
    storeNo: number
}



/* 중복 ID check API */
export function getCheckUserIdDuplicate(userId: string) {
    return axios.get(`/user/${userId}/exists`,
    {
        headers: {}
    });
}




/* 로그인 API */
export function postSignIn(data: SignInForm) {
    return axios.post('/user/signin',
        {
            userId: data.userId,
            userPw: data.userPw
        });
}

/* 액세스 토큰 재발급 API */
export function postReIssueeToken() {
    return axios.post('/user/oauth/token',
        {
            refreshToken: storage.get('refreshToken') 
        });
}

/* 카드목록 불러오기 API */
export function getCardList() {

    return authAxios().get('/card');
}

/* 카드상세 불러오기 API */
export function getCardDetail(cardNo: number) {
    return authAxios().get(`/card/${cardNo}`);
}

/* 카드 추가 API */
export function postCardAdd(cardAddForm: CardAddForm) {
    return authAxios().post('/card',{
        cardName: cardAddForm.cardName,
        cardType: cardAddForm.cardType,
        cardDesc: cardAddForm.cardDesc,
    });
}

/* 카드 수정 API */
export function updateCardModify(cardUpdateForm: CardUpdateForm) {
    return authAxios().put( `/card/${cardUpdateForm.cardNo}`,{
        cardName: cardUpdateForm.cardName,
        cardType: cardUpdateForm.cardType,
        cardDesc: cardUpdateForm.cardDesc,
    });
}

/* 카드 삭제 API */
export function deleteCardDelete( cardNo: number) {
    return authAxios().delete(`/card/${cardNo}`);
}

/* 지출 내역 불러오기 */
export function getPurchaseList(starDate: any, endDate: any) {
    return authAxios().get('/purchase',{
        params:{
            startDate: starDate,
            endDate: endDate
        }
    });
}

/* 지출 추가 API */
export function postPurchaseAdd(purchaseAddForm: PurchaseAddForm) {
    return authAxios().post('/purchase',{
        cardNo: purchaseAddForm.cardNo === 0? null : purchaseAddForm.cardNo,
        price: purchaseAddForm.price.replace(/,/gi, ""),
        purchaseDate: purchaseAddForm.purchaseDate,
        purchaseType: purchaseAddForm.purchaseType,
        reason: purchaseAddForm.reason,
        storeNo: purchaseAddForm.storeNo === 0? null: purchaseAddForm.storeNo
    });

}

/* 지출 삭제 API */
export function postPurchaseDelete(purchaseNo: number) {
    return authAxios().delete(`/purchase/${purchaseNo}`);
}
