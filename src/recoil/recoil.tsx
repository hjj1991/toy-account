import { AlertColor, SnackbarOrigin } from '@mui/material';
import { atom } from 'recoil';

export interface AuthenticatedInfo {
    isAuthenticated: boolean
    data?:{
            accessToken: string;
            refreshToken: string;
            createdDate: string;
            expireTime: number;
            lastLoginDateTime: string;
            nickName: string | null;
            picture: string;
            provider: string | null;
            userEmail: string | null;
            userId: string | null;
        }
}

export interface SnackBarInfo extends SnackbarOrigin {
    open: boolean,
    message: string,
    severity: AlertColor | undefined,
    title: string
}


/* 로그인 정보 Recoil */
export const authenticatedState = atom<AuthenticatedInfo>({
    key: 'authenticatedState',
    default: {
        isAuthenticated: false,
        data: {
            accessToken: "",
            refreshToken: "",
            createdDate: "",
            expireTime: 0,
            lastLoginDateTime: "",
            nickName: "",
            picture: "",
            provider: null,
            userEmail: "",
            userId: ""
        }

    }
})

/* 로딩 스피너 OPEN 여부 true: 노출 false: 미노출 */
export const loadingState = atom<boolean>({
    key: 'loadingState',
    default: false
})
/* 공통 snackBar 리코일 */
export const snackBarState = atom<SnackBarInfo>({
    key: 'snackBarState',
    default: {
        open: false,
        message: "",
        vertical: 'top',
        horizontal: 'center',
        severity: 'success',
        title: ""
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
