import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as service from '../services/axiosList';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { AuthenticatedInfo, authenticatedState, loadingState } from '../recoil/recoil';
import { Redirect } from 'react-router';
import storage from '../lib/storage';
import SignInImg from '../assets/img/signin.png'
import kakaoLogin from '../assets/img/kakao_login.png'
import naverLogin from '../assets/img/naver_login.png'
import { Divider } from '@mui/material';

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}


const theme = createTheme();


export default function SignIn() {


    React.useEffect(() =>{
        
        window.addEventListener("message", (e:any) =>
        {
            if(e.data.hasOwnProperty('isAuthenticated') && e.data.hasOwnProperty('isAuthenticated')){
                const data = e.data.data;
                setAuthenticated({ isAuthenticated: true, data: data });
                storage.set('loginInfo', { isAuthenticated: true, data: data });
                storage.set('accessToken', data.accessToken);
                storage.set('refreshToken', data.refreshToken);
                storage.set('expireTime', data.expireTime);
            }
        }, false);
        return () => {
            window.removeEventListener("message", () =>{
    
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    },[])


    const [authenticated, setAuthenticated] = useRecoilState<AuthenticatedInfo>(authenticatedState);
    
    const setLoading = useSetRecoilState<boolean>(loadingState);
    const handleSocialLogin = (e:any) => {
         // 랜덤이기 때문에 결과값이 다를 수 있음.
        let state = Math.random().toString(36).substr(2,11); // "twozs5xfni"
        const redirectUri = process.env.REACT_APP_SOCIAL_HOST;
        window.name = 'parentForm'; 
        if(e.currentTarget.id === "socialNaver"){
            window.open(`https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=sUyp7Y2KoOfRvdsAEdCc&redirect_uri=${redirectUri}?provider=naver&state=${state}`, "popup", "location=no,resizable=no");
        }
        if(e.currentTarget.id === "socialKakao"){
            window.open(`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=656c5afa5455de8f5ad9eb51e09e3720&redirect_uri=${redirectUri}?provider=kakao`, "popup", "location=no,resizable=no");
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
                    setAuthenticated({ isAuthenticated: true, data: res.data.response });
                    storage.set('loginInfo', { isAuthenticated: true, data: res.data.response });
                    storage.set('accessToken', res.data.response.accessToken);
                    storage.set('refreshToken', res.data.response.refreshToken);
                    storage.set('expireTime', res.data.response.expireTime);
                }
            }).catch((error) => {
                alert("서버 오류입니다.");
            }).finally(() => {
                setLoading(false);
            });

    }

    if (authenticated.isAuthenticated) {
        return <Redirect to={{ pathname: '/' }} />
    }

    return (
        <ThemeProvider theme={theme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(https://source.unsplash.com/random)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <div style={{ textAlign: 'center' }}>
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
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
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
                                    <Link href="/signup" variant="body2">
                                        {"회원가입"}
                                    </Link>
                                </Grid>
                            </Grid>
                            <Copyright sx={{ mt: 5 }} />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}