import React, { useEffect } from 'react';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EventNoteIcon from '@mui/icons-material/EventNote';
import SavingsIcon from '@mui/icons-material/Savings';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HomeIcon from '@mui/icons-material/Home';
import { useRecoilValue } from 'recoil';
import { menuState } from '../../recoil/recoil';
import { Collapse, Divider, Drawer, DrawerProps, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Box } from '@mui/system';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';


const categories = [
  {
    id: '가계부',
    indx: 0,
    val: false,
    uri: '/account',
    children: [
      { id: '가계부목록', icon: <EventNoteIcon />, uri: "/account/account-book" },
      { id: '카드목록', icon: <CreditCardIcon />, uri: "/account/card" }
    ],
  },
  {
    id: '예/적금',
    indx: 1,
    val: false,
    uri: '/invest',
    children: [
      { id: '예금', icon: <AttachMoneyIcon />, uri: "/deposit" },
      { id: '적금', icon: <SavingsIcon />, uri: "/saving" }
    ],
  },
];
const itemCategory = {
  boxShadow: '0 -2px 0 rgb(255,255,255,0.5) inset',
  py: 1.5,
  px: 3,
};

function Navigator(props: DrawerProps) {
  const { ...other } = props;
  const activeMenuValue = useRecoilValue(menuState);
  const [categoryOpen, setCategoryOpen] = React.useState<Array<boolean>>([]);

  useEffect( () => {
    for(let item of categories){
      setCategoryOpen([...categoryOpen, item.val]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])

  const handleClick = (indx:any) => {
    let currentCategoryOpen = [...categoryOpen];
    currentCategoryOpen[indx] = !currentCategoryOpen[indx];
    setCategoryOpen(currentCategoryOpen);


  };


  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem sx={{ ...itemCategory, fontSize: 22, color: '#fff' }}>
          <img width={'50px'} src='/menu_logo.png' alt='메뉴로고' /><span style={{alignSelf: 'end'}}>뜨끔한 가계부</span>
        </ListItem>
        <Link component={RouterLink} to="/">
          <ListItem sx={{ ...itemCategory }}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText>홈</ListItemText>
          </ListItem>
        </Link>
        {categories.map(({ id, children, indx }) => (
          <Box key={id} sx={{cursor: 'pointer'}} >
            <ListItem sx={{ py: 2, px: 3 }} onClick={() => handleClick(indx)}>
              <ListItemText className={'nav-menu-title'}>{id}</ListItemText>
              {categoryOpen[indx] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse key={id} in={categoryOpen[indx]} timeout="auto" unmountOnExit>
            {children.map(({ id: childId, icon, uri }) => {
              return (
                <Link key={childId} component={RouterLink} to={uri}>
                  <ListItem disablePadding >
                    <ListItemButton selected={activeMenuValue.activeNav.indexOf(uri) !== -1? true : false}>
                      <ListItemIcon>{icon}</ListItemIcon>
                      <ListItemText>{childId}</ListItemText>
                    </ListItemButton>
                  </ListItem>
                </Link>
              )
            }
            )}
             </Collapse>
            <Divider sx={{backgroundColor: '#CFE5CF'}} />
          </Box>
        ))}
      </List>
    </Drawer>
  );
}

export default Navigator;