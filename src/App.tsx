import Navigator from './components/layout/Navigator';
import { Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import PrivateRoute from './components/common/PrivateRoute';
import Card from './pages/Card';
import { useRecoilState, useRecoilValue } from 'recoil';
import { AuthenticatedInfo, authenticatedState, leftNavState, loadingState } from './recoil/recoil';
import storage from './lib/storage';
import Purchase from './pages/Purchase';
import { Box } from '@mui/system';
import { createTheme, CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { UpButton } from './components/common/UpButton';
import './App.scss'
import SignUp from './pages/Signup';
import { LoadingModal } from './components/common/LoadingModal';
import { SocialSignIn } from './components/common/SocialSignIn';
import { MyInfo } from './pages/MyInfo';
import { SocialMapping } from './components/common/SocialMapping';
import { SocialSignUp } from './components/common/SocialSignUp';
import CommonSnackBar from './components/common/CommonSnackBar';
import { Privacy } from './pages/Privacy';
import { Policy } from './pages/Policy';
import { Footer } from './components/layout/Footer';
import {  useEffect } from 'react';
import { AccountBook } from './pages/AccountBook';
import { AccountBookDetail } from './pages/AccountBookDetail';

const BASIC_BACKGROUND_COLOR = '#a3cca3';

let theme = createTheme({
    palette: {
        primary: {
            light: '#63ccff',
            main: '#009be5',
            dark: '#006db3',
        },
    },
    typography: {
        fontFamily: '원모바일POP',
        h5: {
            fontWeight: 500,
            fontSize: 26,
            letterSpacing: 0.5,
        }
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiTab: {
            defaultProps: {
                disableRipple: true,
            },
        },
    },
    mixins: {
        toolbar: {
            minHeight: 48,
        },
    },
});

theme = {
    ...theme,

    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: BASIC_BACKGROUND_COLOR
                }
            }
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#7A997A',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',

                },
                contained: {
                    backgroundColor: BASIC_BACKGROUND_COLOR,
                    "&:hover": {
                        backgroundColor: '#AAE3BA'
                    },
                    boxShadow: 'none',
                    '&:active': {
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                root: {
                    backgroundColor: BASIC_BACKGROUND_COLOR
                },
                indicator: {
                    height: 3,
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
                    backgroundColor: theme.palette.common.white,
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    margin: '0 16px',
                    minWidth: 0,
                    padding: 0,
                    [theme.breakpoints.up('md')]: {
                        padding: 0,
                        minWidth: 0,
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    padding: theme.spacing(1),
                },
            },
        },

        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    borderRadius: 4,
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgb(255,255,255,0.15)',
                },
            },
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    paddingBottom: '0px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover, &:focus': {
                        bgcolor: 'rgba(255, 255, 255, 0.08)',
                    }
                }
            }
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    py: 2,
                    px: 3,
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover, &:focus': {
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                    '&.Mui-selected, &.Mui-selected:hover': {
                        color: '#CCBC99',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: 'black',
                    textDecoration: 'none'
                }
            }
        },
        MuiListItemText: {
            styleOverrides: {
                primary: {
                    fontSize: 14,
                    fontWeight: theme.typography.fontWeightMedium,

                },
            },
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    color: 'inherit',
                    minWidth: 'auto',
                    marginRight: theme.spacing(2),
                    '& svg': {
                        fontSize: 20,
                    },
                },
            },
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    width: 40,
                    height: 40,
                },
            },
        },
    },
};

const drawerWidth = 256;



function App() {
    const [mobileOpen, setMobileOpen] = useRecoilState<boolean>(leftNavState);
    const isSmUp = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true });
    const [authenticated, setAuthenticated] = useRecoilState<AuthenticatedInfo>(authenticatedState);
    const loading = useRecoilValue<boolean>(loadingState);
    const loginInfo = storage.get('loginInfo');
    const isAuthenticated = storage.get('isAuthenticated');


    useEffect(() => {
        console.log(loginInfo);
        /* 세션에서 로그인정보가 있을 경우 Recoil State에 넣어준다. */
        if (loginInfo !== null) {
            console.log("SFghfsgh");
            setAuthenticated({
                ...loginInfo,
                isAuthenticated: true,
                isLoading: true
                });
        }else{
            setAuthenticated({
                isAuthenticated: false,
                isLoading: true
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [isAuthenticated]);




    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };


    return authenticated.isLoading?(<ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                <CssBaseline />
                <Box
                    component="nav"
                    sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                >
                    {isSmUp ? null : (
                        <Navigator
                            PaperProps={{ style: { width: drawerWidth } }}
                            variant="temporary"
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                        />
                    )}
                    <Navigator
                        PaperProps={{ style: { width: drawerWidth } }}
                        sx={{ display: { sm: 'block', xs: 'none' } }}
                    />
                </Box>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* <Header onDrawerToggle={handleDrawerToggle} /> */}
                    <Box sx={{ flex: 1, py: 6, px: 4, bgcolor: '#eaeff1', padding: 0 }}>
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route exact path={"/signin"} component={SignIn} />
                            <Route path={"/social/signin"} component={SocialSignIn} />
                            <Route path={"/social/signup"} component={SocialSignUp} />
                            <Route path={"/privacy"} component={Privacy} />
                            <Route path={"/policy"} component={Policy} />
                            <Route path={"/social/signup"} component={SocialSignUp} />
                            <Route path={"/signup"} component={SignUp} />
                            <PrivateRoute isAuthenticated={authenticated.isAuthenticated} exact path="/account/account-book" component={AccountBook} />
                            <PrivateRoute isAuthenticated={authenticated.isAuthenticated} exact path="/account/account-book/:accountBookNo" component={AccountBookDetail} />
                            <PrivateRoute isAuthenticated={authenticated.isAuthenticated} path="/account/account-book/:accountBookNo/:type" component={AccountBookDetail} />
                            <PrivateRoute isAuthenticated={authenticated.isAuthenticated} path="/account/card" component={Card} />
                            <PrivateRoute isAuthenticated={authenticated.isAuthenticated} exact path="/account/purchase" component={Purchase} />
                            <PrivateRoute isAuthenticated={authenticated.isAuthenticated} exact path="/myinfo" component={MyInfo} />
                            <PrivateRoute isAuthenticated={authenticated.isAuthenticated} path="/social/mapping" component={SocialMapping} />
                            <PrivateRoute isAuthenticated={authenticated.isAuthenticated} path="/privacy" component={Privacy} />
                            <PrivateRoute isAuthenticated={authenticated.isAuthenticated} path="/policy" component={Policy} />
                        </Switch>
                    </Box>
                    <Box component="footer" sx={{ p: 2, bgcolor: '#eaeff1' }}>
                        <Footer />
                    </Box>
                </Box>
            </Box>
            <UpButton />
            {loading && <LoadingModal />}
            <CommonSnackBar />
        </ThemeProvider>
    ):null
}

export default App;