import axios from 'axios';

const siteUrl = "http://localhost:8080";
// const siteUrl = "http://dognas.ipdisk.co.kr:8080";

axios.defaults.baseURL = siteUrl;


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
    return axios.get(`/user/${userId}/exists`);
}




/* 로그인 API */
export function postSignIn(data: SignInForm) {
    return axios.post('/user/signin',
        {
            userId: data.userId,
            userPw: data.userPw
        });
}

/* 카드목록 불러오기 API */
export function getCardList(accessToken: string) {
    return axios.get('/card',
        {
            headers: { 'access_token': accessToken }
        })
}

/* 카드상세 불러오기 API */
export function getCardDetail(accessToken: string, cardNo: number) {
    return axios.get(`/card/${cardNo}`,
        {
            headers: { 'access_token': accessToken }
        })
}

/* 카드 추가 API */
export function postCardAdd(accessToken: string, cardAddForm: CardAddForm) {
    return axios(
        {
            url: '/card',
            method: 'post',
            headers: { 'access_token': accessToken },
            data: {
                cardName: cardAddForm.cardName,
                cardType: cardAddForm.cardType,
                cardDesc: cardAddForm.cardDesc,
            }
        }
    )
}

/* 카드 수정 API */
export function updateCardModify(accessToken: string, cardUpdateForm: CardUpdateForm) {
    return axios(
        {
            url: `/card/${cardUpdateForm.cardNo}`,
            method: 'put',
            headers: { 'access_token': accessToken },
            data: {
                cardName: cardUpdateForm.cardName,
                cardType: cardUpdateForm.cardType,
                cardDesc: cardUpdateForm.cardDesc,
            }
        }
    )
}

/* 카드 삭제 API */
export function deleteCardDelete(accessToken: string, cardNo: number) {
    return axios(
        {
            url: `/card/${cardNo}`,
            method: 'DELETE',
            headers: { 'access_token': accessToken }
        }
    )
}

/* 지출 내역 불러오기 */
export function getPurchaseList(accessToken: string, starDate: any, endDate: any) {
    return axios(
        {
            url: `/purchase`,
            method: 'GET',
            headers: { 'access_token': accessToken },
            params: {
                startDate: starDate,
                endDate: endDate
            }
        }
    )
}

/* 지출 추가 API */
export function postPurchaseAdd(accessToken: string, purchaseAddForm: PurchaseAddForm) {
    return axios(
        {
            url: '/purchase',
            method: 'post',
            headers: { 'access_token': accessToken },
            data: {
                cardNo: purchaseAddForm.cardNo === 0? null : purchaseAddForm.cardNo,
                price: purchaseAddForm.price.replace(/,/gi, ""),
                purchaseDate: purchaseAddForm.purchaseDate,
                purchaseType: purchaseAddForm.purchaseType,
                reason: purchaseAddForm.reason,
                storeNo: purchaseAddForm.storeNo === 0? null: purchaseAddForm.storeNo
            }
        }
    )
}

/* 지출 삭제 API */
export function postPurchaseDelete(accessToken: string, purchaseNo: number) {
    return axios(
        {
            url: `/purchase/${purchaseNo}`,
            method: 'DELETE',
            headers: { 'access_token': accessToken }
        }
    )
}