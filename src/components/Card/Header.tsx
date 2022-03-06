import { AppBar, Grid, Toolbar, Typography } from '@mui/material';
import React from 'react';

const lightColor = 'rgba(255, 255, 255, 0.7)';

interface HeaderProps {
  onDrawerToggle: () => void;
}
function Header(props: HeaderProps) {
  const { onDrawerToggle } = props;

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