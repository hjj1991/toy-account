import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { useRecoilValue } from 'recoil';
import { authenticatedState } from '../../recoil/recoil';
import { AppBar, Avatar, Grid, IconButton, Toolbar } from '@mui/material';
import { HeaderMenu } from '../common/HeaderMenu';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';

interface HeaderProps {
    onDrawerToggle: () => void;
}


function Header(props: HeaderProps) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const authenticated = useRecoilValue(authenticatedState);
    const handleClickOpenMenu = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const { onDrawerToggle } = props;
    // let profileUrl = process.env.REACT_APP_API_HOST + "/user/profile?picture=" + authenticated.data?.picture + "&access_token=" + storage.get('accessToken');
    let profileUrl = authenticated.data?.picture;

    return (
        <React.Fragment>
            <AppBar position="sticky" elevation={0}>
                <Toolbar>
                    <Grid container spacing={1} alignItems="center">
                        <Grid sx={{ display: { sm: 'none', xs: 'block' } }} item>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={onDrawerToggle}
                                edge="start"
                            >
                                <MenuIcon />
                            </IconButton>
                        </Grid>
                        <Grid item xs />
                        {/* <Grid item>
                            <Tooltip title="Alerts • No alerts">
                                <IconButton color="inherit">
                                    <NotificationsIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid> */}
                        {authenticated.isAuthenticated ?
                            (
                                <Grid item>
                                    <IconButton onClick={handleClickOpenMenu} color="inherit" sx={{ p: 0.5 }}>
                                        <Avatar src={profileUrl} alt="My Avatar" />
                                    </IconButton>
                                </Grid>
                            ) : (
                                <>
                                    <Grid item>
                                        <Link component={RouterLink} to="/signup" sx={{color: 'rgba(255, 255, 255, 0.87)'}}>회원가입</Link>
                                    </Grid>
                                    <Grid item>
                                        <Link component={RouterLink} to="/signin" sx={{color: 'rgba(255, 255, 255, 0.87)'}}>로그인</Link>
                                    </Grid>
                                </>
                            )}
                    </Grid>
                </Toolbar>
            </AppBar>
            <HeaderMenu
                anchorEl={anchorEl}
                handleClickOpenMenu={handleClickOpenMenu}
                handleClose={handleClose}
            />
        </React.Fragment>
    );
}

export default Header;