import React, { useEffect } from 'react';
import Navigator from './components/layout/Navigator';
import { Switch } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/layout/Header';
import SignIn from './pages/SignIn';
import PrivateRoute from './components/common/PrivateRoute';
import Card from './pages/Card';
import { useRecoilState } from 'recoil';
import { AuthenticatedInfo, authenticatedState } from './recoil/recoil';
import storage from './lib/storage';
import Purchase from './pages/Purchase';
import { Box } from '@mui/system';
import { createTheme, CssBaseline, Link, ThemeProvider, Typography, useMediaQuery } from '@mui/material';
import { UpButton } from './components/common/UpButton';
import './App.scss'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
let theme = createTheme({
  palette: {
    primary: {
      light: '#63ccff',
      main: '#009be5',
      dark: '#006db3',
    },
  },
  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
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
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#081627',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
        contained: {
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
          marginLeft: theme.spacing(1),
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
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#4fc3f7',
          },
        },
      },
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
          width: 32,
          height: 32,
        },
      },
    },
  },
};

const drawerWidth = 256;

function App() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  const [authenticated, setAuthenticated] = useRecoilState<AuthenticatedInfo>(authenticatedState);


  /* 세션에서 로그인정보가 있을 경우 Recoil State에 넣어준다. */
  useEffect(() => {
    const loginInfo = storage.get('loginInfo'); // 로그인 정보를 로컬스토리지에서 가져옵니다.

    if(loginInfo && authenticated.isAuthenticated === false){
      setAuthenticated(loginInfo);
    }
  });


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };


  return (
    authenticated.isAuthenticated ?
      (
        <ThemeProvider theme={theme}>
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
            <Header onDrawerToggle={handleDrawerToggle} />
            <Box sx={{ flex: 1, py: 6, px: 4, bgcolor: '#eaeff1', padding: 0 }}>
                <Switch>
                  <PrivateRoute isAuthenticated={authenticated.isAuthenticated} authenticationPath="/" exact path="/" component={Home} />
                  <PrivateRoute isAuthenticated={authenticated.isAuthenticated} authenticationPath="/" path="/card" component={Card} />
                  <PrivateRoute isAuthenticated={authenticated.isAuthenticated} authenticationPath="/" exact path="/purchase" component={Purchase} />
                </Switch>
                </Box>
          <Box component="footer" sx={{ p: 2, bgcolor: '#eaeff1' }}>
            <Copyright />
          </Box>
        </Box>
      </Box>
      <UpButton />
    </ThemeProvider>
      ) :
      (
        <SignIn />
    )
  );
}

export default App;