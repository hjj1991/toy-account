import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import * as service from '../services/axiosList';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { AuthenticatedInfo, authenticatedState, loadingState, SnackBarInfo, snackBarState } from '../recoil/recoil';
import storage from '../lib/storage';
import SignInImg from '../assets/img/signin.png'
import kakaoLogin from '../assets/img/kakao_login.png'
import naverLogin from '../assets/img/naver_login.png'
import { Divider } from '@mui/material';
import { Navigate } from 'react-router-dom';
import jwtDecode from "jwt-decode";

export default function SignIn() {


    React.useEffect(() =>{
        const receiveMessage = (e:any) =>{
            if(e.data.hasOwnProperty('isAuthenticated') && e.data.isAuthenticated){
                const data = e.data;
                data.data.accessToken = storage.get("accessToken");
                data.data.refreshToken = storage.get("refreshToken");
                const parsingToken:any = jwtDecode(data.data.accessToken)
                storage.set('loginInfo', data);
                storage.set('isAuthenticated', true);
                storage.set('expireTime', parsingToken.exp);
                setAuthenticated({isLoading: true, isAuthenticated: true, data: data });
            }
        }
        
        window.addEventListener("message", receiveMessage, false);
        return () => window.removeEventListener("message", receiveMessage);
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    })


    const [authenticated, setAuthenticated] = useRecoilState<AuthenticatedInfo>(authenticatedState);
    const [snackBarInfo, setSnackBarInfo] = useRecoilState<SnackBarInfo>(snackBarState);
    const setLoading = useSetRecoilState<boolean>(loadingState);
    const handleSocialLogin = (e:any) => {
         // 랜덤이기 때문에 결과값이 다를 수 있음.
        const hostUrl = process.env.REACT_APP_API_HOST;
        window.name = 'parentForm'; 
        if(e.currentTarget.id === "socialNaver"){
            window.open(`${hostUrl}/oauth2/authorization/naver`, "popup", "location=no,resizable=no");
        }
        if(e.currentTarget.id === "socialKakao"){
            window.open(`${hostUrl}/oauth2/authorization/kakao`, "popup", "location=no,resizable=no");
        }
        
    }


    const HandleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // eslint-disable-next-line no-console

        const newSignInForm: service.SignInForm = { userId: data.get('userId'), userPw: data.get('userPw') };
        setLoading(true);

        await service.postSignIn(newSignInForm)
            .then((res) => {
                if (res.data.success) {
                    const parsingToken:any = jwtDecode(res.data.response.accessToken)
                    setAuthenticated({isLoading: true, isAuthenticated: true, data: res.data.response });
                    storage.set('loginInfo', { isAuthenticated: true, data: res.data.response });
                    storage.set('isAuthenticated', true);
                    storage.set('accessToken', res.data.response.accessToken);
                    storage.set('refreshToken', res.data.response.refreshToken);
                    storage.set('expireTime', parsingToken.exp);
                }else{
                    setSnackBarInfo({
                        ...snackBarInfo,
                        message: res.data.apiError.message,
                        severity:'error',
                        title: "실패",
                        open: true
                    })
                }
            }).catch((error) => {
                setSnackBarInfo({
                    ...snackBarInfo,
                    message: error.data,
                    severity:'error',
                    title: "실패",
                    open: true
                })
            }).finally(() => {
                setLoading(false);
            });

    }

    if (authenticated.isAuthenticated) {
        return <Navigate replace to='/' />
    }

    return (
            <Grid container component="main" justifyContent={'center'} >
                <CssBaseline />
                <Grid item xs={12} sm={8} md={5} >
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <div>
                            <img src={SignInImg} alt="로그인" />
                        </div>
                        <Box component="form" noValidate={false} onSubmit={HandleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="userId"
                                label="사용자 ID"
                                name="userId"
                                autoComplete="username"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="userPw"
                                label="사용자 Password"
                                type="password"
                                id="userPw"
                                autoComplete="current-password"
                            />
                            {/* <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="아이디 저장"
                            /> */}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                로그인
                            </Button>
                            <Divider sx={{ my: 3 }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    간편 로그인
                                </Typography>
                            </Divider>
                            <Grid container spacing={2} justifyContent="center">
                                <Grid item>
                                    <img src={naverLogin} id="socialNaver" style={{cursor: 'pointer'}} onClick={handleSocialLogin} width={50} alt="네이버 로그인" />
                                </Grid>
                                <Grid item>
                                    <img src={kakaoLogin} id="socialKakao" style={{cursor: 'pointer'}} onClick={handleSocialLogin} width={50} alt="카카오 로그인" />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                        패스워드를 잊으셨나요?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link component={RouterLink} to="/signup" variant="body2">
                                        {"회원가입"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
    );
}