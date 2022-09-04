import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, TextField } from '@mui/material';
import * as service from '../../services/axiosList';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { AuthenticatedInfo, authenticatedState, loadingState, SnackBarInfo, snackBarState } from '../../recoil/recoil';
import storage from '../../lib/storage';
import jwtDecode from "jwt-decode";

export interface updateValidationForm {
    userPwCheckMessage: string,
    userPwCheck: boolean,
    userPwFontColor: string,
    nickNameCheck: boolean,
    nickNameCheckMessage: string,
    nickNameFontColor: string
}




export function MyInfoDetail(props:any) {
    const [updateValidationForm, setUpdateValidationForm] = useState<updateValidationForm>({
        userPwCheckMessage: "※ 비밀번호는 영문 숫자 조합 7 ~ 14자리 이상입니다.",
        userPwCheck: false,
        userPwFontColor: "red",
        nickNameCheck: true,
        nickNameCheckMessage: "사용가능합니다.",
        nickNameFontColor: "green"
    });
    const [snackBarInfo, setSnackBarInfo] = useRecoilState<SnackBarInfo>(snackBarState);
    const [authenticated, setAuthenticated] = useRecoilState<AuthenticatedInfo>(authenticatedState);
    const setLoading = useSetRecoilState<boolean>(loadingState);
    const [updateUserForm, setUpdateUserForm] = useState<service.UserModifyForm>({
        nickName: authenticated.data!.nickName,
        userEmail: authenticated.data!.userEmail,
        userPw: ""
    });

    useEffect(() =>{
        const receiveMessage = (e:any) =>
        {
            if(e.data.hasOwnProperty('isAuthenticated')){
                patchUserModify();
            }
        }
        
        window.addEventListener("message", receiveMessage, false);
        return () => window.removeEventListener("message", receiveMessage);
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    });

    const handleSubmitUserUpdate = async (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(!updateValidationForm.nickNameCheck || updateUserForm.userEmail!.trim() === ""){
            return;
        } 
        // 랜덤이기 때문에 결과값이 다를 수 있음.
        let state = Math.random().toString(36).substr(2,11); // "twozs5xfni"
        const redirectUri = process.env.REACT_APP_SOCIAL_HOST;
        window.name = 'parentForm'; 
        switch(authenticated.data?.provider){
            case "NAVER":
                window.open(`https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=sUyp7Y2KoOfRvdsAEdCc&redirect_uri=${redirectUri}?provider=NAVER&state=${state}`, "popup", "location=no,resizable=no");
                break;
            case "KAKAO":
                window.open(`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=656c5afa5455de8f5ad9eb51e09e3720&redirect_uri=${redirectUri}?provider=KAKAO&state=${state}`, "popup", "location=no,resizable=no");
                break;
            default:
                if(!updateValidationForm.userPwCheck){
                    return;
                }
                await patchUserModify();
                break;
        }
       



    }
    const patchUserModify = async () =>{
        try{    
            setLoading(true);
            const res = await service.patchUserModify(updateUserForm);

            if(res.data.success){
                setAuthenticated({isLoading: true, isAuthenticated: true, data: {...res.data.response, lastLoginDateTime: authenticated.data!.lastLoginDateTime }});
                setUpdateUserForm({
                    ...updateUserForm,
                    userPw: ""
                });
                const parsingToken:any = jwtDecode(res.data.response.accessToken)
                storage.set('loginInfo', { isAuthenticated: true, data: { ...res.data.response, lastLoginDateTime: authenticated.data!.lastLoginDateTime }});
                storage.set('accessToken', res.data.response.accessToken);
                storage.set('refreshToken', res.data.response.refreshToken);
                storage.set('expireTime', parsingToken.exp);
                setSnackBarInfo({
                    ...snackBarInfo,
                    message: "수정 완료되었습니다.",
                    severity:'success',
                    title: "성공",
                    open: true
                })
            }else{
                setSnackBarInfo({
                    ...snackBarInfo,
                    message: res.data.apiError.message,
                    severity:'error',
                    title: "실패",
                    open: true
                })
            }

        }catch{
            setSnackBarInfo({
                ...snackBarInfo,
                message: "서버 오류입니다.",
                severity:'error',
                title: "실패",
                open: true
            })
        }finally{
            setLoading(false);
        }
    }

    const getCheckExistsNickName = (nickName: string) => {
        return service.getCheckNickNameDuplicate(nickName, true)
            .then((res) => {
                return res.data.success;
            }).catch((error) => {
                return false;
            });
    }

    const handleChangeCheckValue = async (event: any) => {
        let targetId = event.currentTarget.id;

        if(targetId === "userEmail"){
            setUpdateUserForm({
                ...updateUserForm,
                userEmail: event.currentTarget.value
            })
        }

        if (targetId === "userPw") {
            let reg1 = /^[a-zA-Z0-9]{7,14}$/;    // a-z 0-9 중에 7자리 부터 14자리만 허용 한다는 뜻이구요
            let reg2 = /[a-z]/g;
            let reg3 = /[0-9]/g;


            if (reg1.test(event.currentTarget.value) && reg2.test(event.currentTarget.value) && reg3.test(event.currentTarget.value)) {
                setUpdateValidationForm({
                    ...updateValidationForm,
                    userPwCheckMessage: "",
                    userPwFontColor: "green",
                    userPwCheck: true
                });
            } else {
                setUpdateValidationForm({
                    ...updateValidationForm,
                    userPwCheckMessage: "※ 비밀번호는 영문 숫자 조합 7 ~ 14자리 이상입니다.",
                    userPwFontColor: "red",
                    userPwCheck: false
                });
            }
            setUpdateUserForm({
                ...updateUserForm,
                userPw: event.currentTarget.value
            })
        }

        if (targetId === "nickName") {
            let pattern = /([^가-힣\x20^a-z^A-Z^0-9])/i;
            let blank_pattern = /[\s]/g;
            let name = event.currentTarget.value;

            if ((!pattern.test(name)) && name.length >= 2 && name.length <= 10 && !blank_pattern.test(name) && event.type === "blur"){
                if (await getCheckExistsNickName(event.currentTarget.value)) {
                    setUpdateValidationForm({
                        ...updateValidationForm,
                        nickNameCheck: true,
                        nickNameFontColor: "green",
                        nickNameCheckMessage: "사용가능합니다.",
                    });
                } else {
                    setUpdateValidationForm({
                        ...updateValidationForm,
                        nickNameCheckMessage: "※ 해당 닉네임이 존재합니다.",
                        nickNameFontColor: "red",
                        nickNameCheck: false
                    });
                }
            } else {
                setUpdateValidationForm({
                    ...updateValidationForm,
                    nickNameCheck: false,
                    nickNameFontColor: "red",
                    nickNameCheckMessage: "※ 공백제외 한글, 영문, 숫자 2 ~ 10자로 입력해주세요.",
                });
            }
            if(event.type !== "blur"){
                setUpdateUserForm({
                    ...updateUserForm,
                    nickName: event.currentTarget.value
                })
            }

        }


    }

    return (
        <Box component="form" noValidate={false} onSubmit={handleSubmitUserUpdate} >
            <Card>
                <CardHeader
                    title="회원정보"
                />
                <Divider />
                <CardContent>
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                            item
                            xs={12}
                        >
                            <TextField
                                fullWidth
                                helperText={updateValidationForm.nickNameCheckMessage}
                                label="닉네임"
                                name="nickName"
                                id="nickName"
                                onChange={handleChangeCheckValue}
                                onBlur={handleChangeCheckValue}
                                required
                                value={updateUserForm.nickName}
                                variant="outlined"
                                sx={{
                                    '& p': {
                                        color: updateValidationForm.nickNameFontColor
                                    }
                                }}
                            />
                        </Grid>
                        {authenticated.data?.provider === null? (
                            <Grid
                                item
                                xs={12}
                            >
                            <TextField
                                fullWidth
                                helperText={updateValidationForm.userPwCheckMessage}
                                label="현재 비밀번호"
                                name="userPw"
                                id="userPw"
                                type={'password'}
                                onChange={handleChangeCheckValue}
                                required
                                value={updateUserForm.userPw}
                                variant="outlined"
                                sx={{
                                    '& p': {
                                        color: updateValidationForm.userPwFontColor
                                    }
                                }}
                            />
                            </Grid>
                        ):(
                            null
                        )}

                        <Grid
                            item
                            xs={12}
                        >
                            <TextField
                                fullWidth
                                label="이메일 주소"
                                type={'email'}
                                name="userEmail"
                                id="userEmail"
                                onChange={handleChangeCheckValue}
                                required
                                value={updateUserForm.userEmail}
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        p: 2
                    }}
                >
                    <Button
                        fullWidth
                        variant="contained"
                        type='submit'
                    >
                        변경
                    </Button>
                </Box>
            </Card>
        </Box>
    );
};