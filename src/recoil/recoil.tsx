import { atom } from 'recoil';

export interface AuthenticatedInfo {
    isAuthenticated: boolean
    data?:{
            accessToken: string;
            createDate: string;
            expireTime: number;
            loginDateTime: string;
            name: string;
            nickName: string;
            picture: string;
            provider: string;
            userEmail: string;
            userId: string;
        }
}


/* 로그인 정보 Recoil */
export const authenticatedState = atom<AuthenticatedInfo>({
    key: 'authenticatedState',
    default: {
        isAuthenticated: false,
        data: {
            accessToken: "",
            createDate: "",
            expireTime: 0,
            loginDateTime: "",
            name: "",
            nickName: "",
            picture: "",
            provider: "",
            userEmail: "",
            userId: ""
        }

    }
})

/* 좌측 메뉴 Active 정보 Recoil */
export const menuState = atom<any>({
    key: 'menuState',
    default: {
        activeNav: ""
    }
})

/* 카드 추가 Open/Close */
export const isAddCardState = atom<boolean>({
    key: 'isAddCardState',
    default: false
})

/* 카드 목록 Reload */
export const isCardListReloadState = atom<boolean>({
    key: 'isCardListReloadState',
    default: false
})

/* 카드 수정 Modal Open 여부 */
export const isModifyModalShowState = atom<boolean>({
    key: 'isModifyModalShowState',
    default: false
})
