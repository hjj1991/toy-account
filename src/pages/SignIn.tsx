import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as service from '../services/axiosList';
import { RecoilRootProps, useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { AuthenticatedInfo, authenticatedState } from '../recoil/recoil';
import { Redirect } from 'react-router';
import storage from '../lib/storage';

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


  const [authenticated, setAuthenticated] = useRecoilState<AuthenticatedInfo>(authenticatedState);
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<any>(null);



  const HandleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console

    const newSignInForm: service.SignInForm = { userId: data.get('userId'), userPw: data.get('userPw') };


    setLoading(false);

    const res = await service.postSignIn(newSignInForm);

    // async (newSignInForm:service.SignInForm) => {
    //   .then(res => {
    //     if(res.data.success){
    //       const authInfo:AuthenticatedInfo = { isAuthenticated: true, data: res.data.response};
    //       setAuthenticated(authInfo);
    //     }
    //   })
    // }
    if (res.data.success) {
      setAuthenticated({ isAuthenticated: true, data: res.data.response });
      storage.set('loginInfo', { isAuthenticated: true, data: res.data.response });
      storage.set('accessToken', res.data.response.accessToken);
      storage.set('refreshToken', res.data.response.refreshToken);
      storage.set('expireTime', res.data.response.expireTime);
    }

    setLoading(true);



  }

  if (loading && authenticated.isAuthenticated) {
    return <Redirect to={{pathname: '/'}} />
  }

  return (
    loading ?
      (
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
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
                <Box component="form" noValidate onSubmit={HandleSubmit} sx={{ mt: 1 }}>
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
                    Sign In
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link href="#" variant="body2">
                        패스워드를 잊으셨나요?
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link href="#" variant="body2">
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Grid>
                  </Grid>
                  <Copyright sx={{ mt: 5 }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </ThemeProvider>
      ) : (
        <div>로딩중..</div>
      )
  );
}