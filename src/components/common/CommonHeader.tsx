import { AppBar, Grid, Toolbar, Typography } from '@mui/material';
import React from 'react';


interface HeaderProps {
    headerTitle?: string,
    headerTab?: any,
    onDrawerToggle: () => void;
}
function CommonHeader(props: HeaderProps) {

  return (
    <React.Fragment>
      <AppBar color="primary" position="sticky" elevation={0}>
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <Typography color="inherit" variant="h5" component="h1" textAlign={'center'}>
                  {props.headerTitle}  {props.headerTab !== undefined? props.headerTab(): null}
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}

export default CommonHeader;