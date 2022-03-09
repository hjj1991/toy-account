import { AppBar, Grid, Toolbar, Typography } from '@mui/material';
import React from 'react';

interface HeaderProps {
  onDrawerToggle: () => void;
}
function Header(props: HeaderProps) {

  return (
    <React.Fragment>
      <AppBar enableColorOnDark   position="sticky" elevation={0}>
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <Typography color="inherit" variant="h5" component="h1">
                카드목록
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      
    </React.Fragment>
  );
}

export default Header;