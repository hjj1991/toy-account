import axios, { AxiosRequestConfig } from 'axios';
import moment from 'moment';
import storage from '../lib/storage';
import jwtDecode from "jwt-decode";

const siteUrl = process.env.REACT_APP_API_HOST;


axios.defaults.baseURL = siteUrl;

export const authAxios = () => {
    const tempAxios = axios.create({
        headers:  { 'Authorization': "Bearer " + storage.get('accessToken') }
    });

    tempAxios.interceptors.request.use(refreshConfig);
    return tempAxios;
}

export const refreshConfig = async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
    let expireTime = storage.get('expireTime');
    if(expireTime < moment().unix()){
        const res = await postReIssueeToken();
        if(res.status === 200 && res.data.success){
            if (config.headers === undefined) {
                config.headers = {};
              }
              
            const parsingToken:any = jwtDecode(res.data.response.accessToken)
            config.headers['Authorization'] = "Bearer " + res.data.response.accessToken;
            storage.set('accessToken', res.data.response.accessToken);
            storage.set('refreshToken', res.data.response.refreshToken);
            storage.set('expireTime', parsingToken.exp);
        }else{
            localStorage.clear();
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

/* 가계부 추가 interface */
export interface AccountBookAddForm {
    accountBookName: string,
    accountBookDesc: string,
    backGroundColor: string,
    color: string
}

/* 카테고리 interface */
export interface CategoryForm {
    parentCategoryNo?:number,
    accountBookNo: number,
    categoryName: string,
    categoryDesc: string,
    categoryIcon: string
}


/* 카테고리 삭제 API */
export interface CategoryDeleteForm {
    accountBookNo: number
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
    purchaseNo?: number,
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
    return axios.get('/oauth2/authorization/' + data.get("provider"));
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

/* 유저상세정보 API */
export function getUserDetail(){
    return authAxios().get('/user');
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

/* 가계부 상세조회 API */
export function getAccountBookDetail(accountBookNo:number){
    return authAxios().get(`/account-book/${accountBookNo}`);
}

/* 카테고리 생성 API */
export function postCategoryAdd(categoryAddForm: CategoryForm){
    return authAxios().post('/category', categoryAddForm);
}

/* 카테고리 목록 불러오기 API */
export function getCategories(accountBookNo:number){
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

/* 카테고리 수정 API */
export function patchCategoryModify(categoryNo: number, categoryModifyForm: CategoryForm){
    return authAxios().patch(`/category/${categoryNo}`,
        categoryModifyForm
    );
}

/* 카테고리 삭제 API */
export function deleteCategoryDelete(categoryNo: number, categoryDeleteForm: CategoryDeleteForm){
    return authAxios().delete(`/category/${categoryNo}`, {
        data: categoryDeleteForm
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

/* 지출 내역들 불러오기 */
export function getPurchaseList(startDate: any, endDate: any, accountBookNo?: number, page?: number) {
    return authAxios().get('/purchase',{
        params:{
            startDate: startDate,
            endDate: endDate,
            accountBookNo: accountBookNo,
            page: page
        }
    });
}

/* 지출 내역 불러오기 */
export function getPurchase(purchaseNo: number) {
    return authAxios().get(`/purchase/${purchaseNo}`);
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


/* 지출 수정 API */
export function patchPurchaseModify(purchaseModifyForm: PurchaseAddForm) {
    return authAxios().patch(`/purchase/${purchaseModifyForm.purchaseNo}`,{
        accountBookNo: purchaseModifyForm.accountBookNo,
        cardNo: purchaseModifyForm.cardNo === 0? null : purchaseModifyForm.cardNo,
        price: purchaseModifyForm.price.replace(/,/gi, ""),
        purchaseDate: purchaseModifyForm.purchaseDate,
        purchaseType: purchaseModifyForm.purchaseType,
        reason: purchaseModifyForm.reason,
        categoryNo: purchaseModifyForm.categoryNo === 0? null: purchaseModifyForm.categoryNo
    });
}
/* 지출 삭제 API */
export function postPurchaseDelete(purchaseNo: number) {
    return authAxios().delete(`/purchase/${purchaseNo}`);
}


/* 적금 목록 불러오기 API */
export function getSavings() {
    return axios.get('/saving');
}

/* 예금 목록 불러오기 API */
export function getDeposits() {
    return axios.get('/deposit');
}


/* 메인 화면 API */
export function getHome() {
    return axios.get("/main");
}

