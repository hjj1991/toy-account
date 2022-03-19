import { Box, Container, Grid } from "@mui/material";
import { MyInfoDetail } from "./MyInfoDetail";
import { Profile } from "./Profile";

export function Body(){

    return (
    <>
     <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 2
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={4}
            md={6}
            xs={12}
          >
            <Profile/>
          </Grid>
          <Grid
            item
            lg={8}
            md={6}
            xs={12}
          >
            <MyInfoDetail />
          </Grid>
        </Grid>
      </Container>
    </Box>
    
    
    </>
    )
}