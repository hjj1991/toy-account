import React from 'react';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import StoreIcon from '@mui/icons-material/Store';
import HomeIcon from '@mui/icons-material/Home';
import { useRecoilValue } from 'recoil';
import { menuState } from '../../recoil/recoil';
import { NavLink } from 'react-router-dom';
import { Divider, Drawer, DrawerProps, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Box } from '@mui/system';


const categories = [
  {
    id: '가계부',
    children: [
      { id: '카드목록', icon: <PeopleIcon />, uri: "/card" },
      { id: '소비목록', icon: <ShoppingBasketIcon />, uri: "/purchase" },
      { id: '가게목록', icon: <StoreIcon />, uri: "/store" }
    ],
  },
  {
    id: '예/적금',
    children: [
      { id: '예금', icon: <StoreIcon />, uri: "" },
      { id: '적금', icon: <StoreIcon />, uri: "" }
    ],
  },
];
const item = {
  py: '2px',
  px: 3,
  color: 'rgba(255, 255, 255, 0.7)',
  '&:hover, &:focus': {
    bgcolor: 'rgba(255, 255, 255, 0.08)',
  },
};

const itemCategory = {
  boxShadow: '0 -1px 0 rgb(255,255,255,0.1) inset',
  py: 1.5,
  px: 3,
};

function Navigator(props: DrawerProps) {
  const { ...other } = props;
  const activeMenuValue = useRecoilValue(menuState);

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
      <ListItem sx={{ ...item, ...itemCategory, fontSize: 22, color: '#fff' }}>
          뜨끔한 가계부
        </ListItem>
        <ListItem sx={{ ...item, ...itemCategory }}>
        <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText>홈</ListItemText>
        </ListItem>
        {categories.map(({ id, children }) => (
          <Box key={id} sx={{ bgcolor: '#101F33' }}>
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemText sx={{ color: '#fff' }}>{id}</ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, uri }) => {
              let isActive = false;
              if (activeMenuValue.activeNav === uri){
                isActive = true;
              }
                
              return (
                <NavLink key={childId} to={uri} style={{textDecoration: "none"}}>
                   <ListItem disablePadding >
                  <ListItemButton selected={isActive} sx={item}>
                     <ListItemIcon>{icon}</ListItemIcon>
                     <ListItemText>{childId}</ListItemText>
                     </ListItemButton>
                     </ListItem>
                </NavLink>
              )
            }
            )}
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </List>
    </Drawer>
  );
}

export default Navigator;