import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import * as service from '../services/axiosList';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import SignUpImg from '../assets/img/signup.png'
import { Redirect } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { loadingState } from '../recoil/recoil';

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const getCheckExistsUserId = (userId: string) => {
    return service.getCheckUserIdDuplicate(userId)
        .then((res) => {
            return res.data.success;
        }).catch((error) => {
            return false;
        });
}

export interface signUpValidationForm {
    userIdCheckMessage: string,
    userIdCheck: boolean,
    userIdFontColor: string,
    userPwCheckMessage: string,
    userPwCheck: boolean,
    userPwFontColor: string,
    userPw2Check: boolean,
    userPw2CheckMessage?: string,
    userPw2FontColor?: string,
    nameCheck: boolean,
    nameCheckMessage: string,
    nameFontColor: string,
    nickNameCheck: boolean,
    nickNameCheckMessage: string,
    nickNameFontColor: string
}




export default function SignUp() {
    const [signUpValidationForm, setSignUpValidationForm] = React.useState<signUpValidationForm>({
        userIdCheckMessage: "※ 5~20자의 영문 소문자, 숫자만 사용 가능합니다.",
        userIdCheck: false,
        userIdFontColor: "red",
        userPwCheckMessage: "※ 비밀번호는 영문 숫자 조합 7 ~ 14자리 이상입니다.",
        userPwCheck: false,
        userPwFontColor: "red",
        userPw2Check: false,
        nameCheck: false,
        nameCheckMessage: "※ 공백제외 한글, 영문, 숫자 2 ~ 10자로 입력해주세요.",
        nameFontColor: "red",
        nickNameCheck: false,
        nickNameCheckMessage: "※ 공백제외 한글, 영문, 숫자 2 ~ 10자로 입력해주세요.",
        nickNameFontColor: "red"
    });
    const [signUpForm, setSignUpForm] = React.useState<service.SignUpForm>({
        userId: "",
        userPw: "",
        userEmail: "",
        name: "",
        nickName: ""
    });
    const setLoading = useSetRecoilState<boolean>(loadingState);
    const [userPw2, setUserPw2] = React.useState<string>("");
    const [signUpOk, setSignUpOk] = React.useState<boolean>(false);
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const {nickNameCheck, nameCheck, userPwCheck, userPw2Check, userIdCheck} = signUpValidationForm;
        if(nickNameCheck && nameCheck && userPwCheck && userPw2Check && userIdCheck){
            try{
                setLoading(true);
                const res = await service.postSignUp(signUpForm);

                if(res.data.success){
                    alert("회원가입이 완료되었습니다. \n 환영합니다.");
                    setSignUpOk(true);
                }
            }catch{
                alert("서버 오류입니다.");
            }finally{
                setLoading(false);
            }
        }
    };

    const handleChangeCheckValue = async (event: any) => {
        let targetId = event.currentTarget.id;
        let re = /^[a-zA-Z0-9]{5,20}$/     // 아이디와 패스워드가 적합한지 검사할 정규식

        if (targetId === "userId") {
            if (re.test(event.currentTarget.value) && event.type === "blur") {
                if (await getCheckExistsUserId(event.currentTarget.value) === true) {
                    setSignUpValidationForm({
                        ...signUpValidationForm,
                        userIdCheckMessage: "사용가능한 아이디입니다.",
                        userIdFontColor: "green",
                        userIdCheck: true
                    });
                } else {
                    setSignUpValidationForm({
                        ...signUpValidationForm,
                        userIdCheckMessage: "※ 해당 ID가 존재합니다.",
                        userIdFontColor: "red",
                        userIdCheck: false
                    });
                }
            } else {
                setSignUpValidationForm({
                    ...signUpValidationForm,
                    userIdCheckMessage: "※ 5~20자의 영문 소문자, 숫자만 사용 가능합니다.",
                    userIdFontColor: "red",
                    userIdCheck: false
                })
            }
            setSignUpForm({
                ...signUpForm,
                userId: event.currentTarget.value
            })
        }
        if(targetId === "userEmail"){
            setSignUpForm({
                ...signUpForm,
                userEmail: event.currentTarget.value
            })
        }

        if (targetId === "userPw") {
            let reg1 = /^[a-zA-Z0-9]{7,14}$/;    // a-z 0-9 중에 7자리 부터 14자리만 허용 한다는 뜻이구요
            let reg2 = /[a-z]/g;
            let reg3 = /[0-9]/g;


            if (reg1.test(event.currentTarget.value) && reg2.test(event.currentTarget.value) && reg3.test(event.currentTarget.value)) {
                setSignUpValidationForm({
                    ...signUpValidationForm,
                    userPwCheckMessage: "사용가능한 비밀번호입니다.",
                    userPwFontColor: "green",
                    userPwCheck: true
                });
            } else {
                setSignUpValidationForm({
                    ...signUpValidationForm,
                    userPwCheckMessage: "※ 비밀번호는 영문 숫자 조합 7 ~ 14자리 이상입니다.",
                    userPwFontColor: "red",
                    userPwCheck: false
                });
            }
            setSignUpForm({
                ...signUpForm,
                userPw: event.currentTarget.value
            })
        }
        if (targetId === "userPw2") {
            setUserPw2(event.currentTarget.value);
            if (signUpForm.userPw === event.currentTarget.value) {
                setSignUpValidationForm({
                    ...signUpValidationForm,
                    userPw2CheckMessage: "비밀번호가 일치합니다.",
                    userPw2FontColor: "green",
                    userPw2Check: true
                });
            } else {
                setSignUpValidationForm({
                    ...signUpValidationForm,
                    userPw2CheckMessage: "※ 비밀번호가 일치하지 않습니다.",
                    userPw2FontColor: "red",
                    userPw2Check: false
                });
            }
        }

        if (targetId === "name") {
            let pattern = /([^가-힣\x20^a-z^A-Z^0-9])/i;
            let blank_pattern = /[\s]/g;
            let name = event.currentTarget.value;

            if ((!pattern.test(name)) && name.length >= 2 && name.length <= 10 && (!blank_pattern.test(name))) {
                setSignUpValidationForm({
                    ...signUpValidationForm,
                    nameCheck: true,
                    nameFontColor: "green",
                    nameCheckMessage: "사용가능합니다.",
                });
            } else {
                setSignUpValidationForm({
                    ...signUpValidationForm,
                    nameCheck: false,
                    nameFontColor: "red",
                    nameCheckMessage: "※ 공백제외 한글, 영문, 숫자 2 ~ 10자로 입력해주세요.",
                });
            }
            setSignUpForm({
                ...signUpForm,
                name: event.currentTarget.value
            })
        }

        if (targetId === "nickName") {
            let pattern = /([^가-힣\x20^a-z^A-Z^0-9])/i;
            let blank_pattern = /[\s]/g;
            let name = event.currentTarget.value;

            if ((!pattern.test(name)) && name.length >= 2 && name.length <= 10 && (!blank_pattern.test(name))) {
                setSignUpValidationForm({
                    ...signUpValidationForm,
                    nickNameCheck: true,
                    nickNameFontColor: "green",
                    nickNameCheckMessage: "사용가능합니다.",
                });
            } else {
                setSignUpValidationForm({
                    ...signUpValidationForm,
                    nickNameCheck: false,
                    nickNameFontColor: "red",
                    nickNameCheckMessage: "※ 공백제외 한글, 영문, 숫자 2 ~ 10자로 입력해주세요.",
                });
            }
            setSignUpForm({
                ...signUpForm,
                nickName: event.currentTarget.value
            })
        }


    }

    return signUpOk?
        (
            <Redirect to={{ pathname: '/' }} />
        ):(
            <Container component="main" maxWidth="xs">
            <div style={{ textAlign: 'center' }}>
                <img src={SignUpImg} alt="회원가입" />
            </div>
            <Divider sx={{ my: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    OR
                </Typography>
            </Divider>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box component="form" noValidate={false} onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name="userId"
                                required
                                fullWidth
                                id="userId"
                                label="아이디"
                                autoFocus
                                onBlur={handleChangeCheckValue}
                                onChange={handleChangeCheckValue}
                                value={signUpForm.userId}
                            />
                            <div style={{ "color": signUpValidationForm.userIdFontColor }}>
                                {signUpValidationForm.userIdCheckMessage}
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="name"
                                required
                                fullWidth
                                id="name"
                                label="이름"
                                autoFocus
                                onChange={handleChangeCheckValue}
                                value={signUpForm.name}
                            />
                            <div style={{ "color": signUpValidationForm.nameFontColor }}>
                                {signUpValidationForm.nameCheckMessage}
                            </div>
                        </Grid>
                        <Grid item xs={12} >
                            <TextField
                                required
                                fullWidth
                                id="nickName"
                                label="닉네임"
                                name="nickName"
                                onChange={handleChangeCheckValue}
                                value={signUpForm.nickName}
                            />
                            <div style={{ "color": signUpValidationForm.nickNameFontColor }}>
                                {signUpValidationForm.nickNameCheckMessage}
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="userEmail"
                                label="이메일 주소"
                                name="userEmail"
                                type={'email'}
                                onChange={handleChangeCheckValue}
                                value={signUpForm.userEmail}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="userPw"
                                label="암호"
                                type="password"
                                id="userPw"
                                autoComplete="new-password"
                                onChange={handleChangeCheckValue}
                                value={signUpForm.userPw}
                            />
                            <div style={{ "color": signUpValidationForm.userPwFontColor }}>
                                {signUpValidationForm.userPwCheckMessage}
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="userPw2"
                                label="암호확인"
                                type="password"
                                id="userPw2"
                                autoComplete="new-password"
                                onChange={handleChangeCheckValue}
                                value={userPw2}
                            />
                            <div style={{ "color": signUpValidationForm.userPw2FontColor }}>
                                {signUpValidationForm.userPw2CheckMessage}
                            </div>
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/" variant="body2">
                                이미 회원이신가요? 로그인하러가기
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 5 }} />
        </Container>
        )
}