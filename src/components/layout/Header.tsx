import { Fragment, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { useRecoilState, useRecoilValue } from 'recoil';
import { authenticatedState, leftNavState } from '../../recoil/recoil';
import { AppBar, Avatar, Grid, IconButton, Toolbar, Typography } from '@mui/material';
import { HeaderMenu } from '../common/HeaderMenu';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
interface HeaderProps {
    headerTitle?: string,
    headerTab?: () => void;
}


function Header(props: HeaderProps) {
    const [anchorEl, setAnchorEl] = useState(null);
    const authenticated = useRecoilValue(authenticatedState);
    const [leftNavOpen, setLeftNavOpen] = useRecoilState<boolean>(leftNavState);
    const handleClickOpenMenu = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // let profileUrl = process.env.REACT_APP_API_HOST + "/user/profile?picture=" + authenticated.data?.picture + "&access_token=" + storage.get('accessToken');
    let profileUrl = authenticated.data?.picture;

    return (
        <Fragment>
            <AppBar position="sticky" elevation={0}>
                <Toolbar>
                    <Grid container spacing={1} alignItems="center" sx={{alignItems: 'baseline'}}>
                        <Grid sx={{ display: { sm: 'none', xs: 'block' } }} item>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={()=> {setLeftNavOpen(!leftNavOpen);}}
                                edge="start"
                            >
                                <MenuIcon />
                            </IconButton>
                        </Grid>
                        <Grid item >
                            <Typography color="inherit" variant="h5" component="h1">
                                {props.headerTitle}  {props.headerTab !== undefined ? props.headerTab() : null}
                            </Typography>
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
                                        <Link component={RouterLink} to="/signup" sx={{ color: 'rgba(255, 255, 255, 0.87)' }}>회원가입</Link>
                                    </Grid>
                                    <Grid item>
                                        <Link component={RouterLink} to="/signin" sx={{ color: 'rgba(255, 255, 255, 0.87)' }}>로그인</Link>
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
        </Fragment>
    );
}

export default Header;