import React from 'react';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { authenticatedState } from '../../recoil/recoil';
import { AppBar, Avatar, Grid, IconButton, ListItemText, Toolbar, Tooltip } from '@mui/material';
import storage from '../../lib/storage';
import { Link } from 'react-router-dom';

interface HeaderProps {
    onDrawerToggle: () => void;
}


function Header(props: HeaderProps) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const authenticated = useRecoilValue(authenticatedState);
    const resetAuthenticated = useResetRecoilState(authenticatedState);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClickLogout = () => {
        storage.remove('loginInfo');
        resetAuthenticated();
    }

    
    const handleClose = () => {
        setAnchorEl(null);
    };
    const { onDrawerToggle } = props;
    let profileUrl = process.env.REACT_APP_API_HOST + "/user/profile?picture=" + authenticated.data?.picture + "&access_token=" + storage.get('accessToken');

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
                        <Grid item>
                            <Tooltip title="Alerts • No alerts">
                                <IconButton color="inherit">
                                    <NotificationsIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Grid item>
                            <IconButton onClick={handleClick} color="inherit" sx={{ p: 0.5 }}>
                                <Avatar src={profileUrl} alt="My Avatar"
                                   />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Toolbar>

            </AppBar>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem>
                    <ListItemText primary={authenticated.data?.nickName} />
                </MenuItem>
                <Divider />
                <Link to="/myinfo" style={{textDecoration: 'none'}}>
                    <MenuItem>
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        내정보
                    </MenuItem>
                </Link>
                <Link to="/" onClick={handleClickLogout} style={{textDecoration: 'none'}}>
                <MenuItem >
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    로그아웃
                </MenuItem>
                </Link>
            </Menu>
        </React.Fragment>
    );
}

export default Header;