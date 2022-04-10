import { Logout, Settings } from "@mui/icons-material";
import { Divider, Link, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import { useRecoilValue, useResetRecoilState } from "recoil";
import { authenticatedState } from "../../recoil/recoil";

export function HeaderMenu(props:any){
    const authenticated = useRecoilValue(authenticatedState);
    const resetAuthenticated = useResetRecoilState(authenticatedState);
    const open = Boolean(props.anchorEl);
    const handleClickLogout = () => {
        sessionStorage.clear();
        resetAuthenticated();
    }


    return (
        <Menu
        anchorEl={props.anchorEl}
        open={open}
        onClose={props.handleClose}
        onClick={props.handleClose}
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
        <Link component={RouterLink} to="/myinfo">
            <MenuItem>
                <ListItemIcon>
                    <Settings fontSize="small" />
                </ListItemIcon>
                내정보
            </MenuItem>
        </Link>
        <Link component={RouterLink} to="/" onClick={handleClickLogout}>
        <MenuItem >
            <ListItemIcon>
                <Logout fontSize="small" />
            </ListItemIcon>
            로그아웃
        </MenuItem>
        </Link>
    </Menu>
    )
}