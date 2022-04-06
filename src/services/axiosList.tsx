import axios, { AxiosRequestConfig } from 'axios';
import moment from 'moment';
import storage from '../lib/storage';

const siteUrl = process.env.REACT_APP_API_HOST;


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
            if (config.headers === undefined) {
                config.headers = {};
              }
            config.headers['access_token'] = res.data.response.accessToken;
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

/* 회원 가입 interface */
export interface SignUpForm {
    userId: string,
    nickName: string,
    userEmail: string,
    userPw: string
}

/* 회원 정보 수정 interface */ 
export interface UserModifyForm {
    nickName: string | null,
    userEmail: string | null,
    userPw: string | null
}

/* 가계부 추가 API */
export interface AccountBookAddForm {
    accountBookName: string,
    accountBookDesc: string,
    backGroundColor: string,
    color: string
}

/* 카테고리 추가 API */
export interface CategoryAddForm {
    accountBookNo: number,
    categoryName: string,
    categoryDesc: string,
    categoryIcon: string
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
    accountBookNo: number,
    cardNo?: number,
    price: string,
    purchaseDate: string,
    purchaseType: string,
    reason: string,
    storeName?: string,
    categoryNo: number
}



/* 중복 ID check API */
export function getCheckUserIdDuplicate(userId: string) {
    return axios.get(`/user/${userId}/exists-id`);
}

/* 중복 닉네임 check API */
export function getCheckNickNameDuplicate(nickName: string, auth:boolean) {
    if(auth){
        return authAxios().get(`/user/${nickName}/exists-nickname`);
    }else{
        return axios.get(`/user/${nickName}/exists-nickname`);
    }
    
}

/* 회원 가입 API */
export function postSignUp(data: SignInForm) {
    return axios.post('/user/signup',
        data);
}

/* 소셜 로그인 API */
export function postSocialSignIn(data: URLSearchParams) {
    return axios.post('/user/social/signin',
        {
            provider: data.get("provider"),
            code: data.get("code"),
            state: data.get("state")
        });
}

/* 소셜 회원가입 API */
export function putSocialSignUp(data: URLSearchParams) {
    return axios.put('/user/social/signup',
        {
            provider: data.get("provider"),
            code: data.get("code"),
            state: data.get("state")
        });
}


/* 소셜 계정 연동 */
export function postSocialMapping(data: URLSearchParams) {
    return authAxios().patch('/user/social/mapping',
    {
        provider: data.get("provider"),
        code: data.get("code"),
        state: data.get("state") 
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

/* 유저프로필사진 수정 API */
export function patchUserProfileModify(data: FormData) {
    return authAxios().patch('/user/profile',
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
}

/* 유저정보 수정 API */
export function patchUserModify(data: UserModifyForm){
    return authAxios().patch('/user',
    {
        nickName: data.nickName,
        userEmail: data.userEmail,
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

/* 가계부 생성 API */
export function postAccountBookAdd(accountBookAddForm: AccountBookAddForm){
    return authAxios().post('/account-book', accountBookAddForm);
}

/* 가계부목록 불러오기 API */
export function getAccountBookList(startDate:any, endDate:any) {
    return authAxios().get('/account-book',{
        params:{
            startDate: startDate,
            endDate: endDate
        }
    });
}

/* 카테고리 생성 API */
export function postCategoryAdd(categoryAddForm: CategoryAddForm){
    return authAxios().post('/category', categoryAddForm);
}

/* 카테고리 목록 불러오기 API */
export function getCategoryList(accountBookNo:number){
    return authAxios().get('/category',{
        params:{
            accountBookNo:accountBookNo
        }
    });
}

/* 카테고리 상세 조회 API */
export function getCategoryDetail(categoryNo:number){
    return authAxios().get(`/category/${categoryNo}`);
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
export function getPurchaseList(startDate: any, endDate: any, accountBookNo?: number) {
    return authAxios().get('/purchase',{
        params:{
            startDate: startDate,
            endDate: endDate,
            accountBookNo: accountBookNo
        }
    });
}

/* 지출 추가 API */
export function postPurchaseAdd(purchaseAddForm: PurchaseAddForm) {
    return authAxios().post('/purchase',{
        accountBookNo: purchaseAddForm.accountBookNo,
        cardNo: purchaseAddForm.cardNo === 0? null : purchaseAddForm.cardNo,
        price: purchaseAddForm.price.replace(/,/gi, ""),
        purchaseDate: purchaseAddForm.purchaseDate,
        purchaseType: purchaseAddForm.purchaseType,
        reason: purchaseAddForm.reason,
        categoryNo: purchaseAddForm.categoryNo === 0? null: purchaseAddForm.categoryNo
    });

}

/* 지출 삭제 API */
export function postPurchaseDelete(purchaseNo: number) {
    return authAxios().delete(`/purchase/${purchaseNo}`);
}


