import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import { SnackBarInfo, snackBarState } from '../../recoil/recoil';
import { useRecoilState } from 'recoil';
import { Alert, AlertTitle, Zoom } from '@mui/material';



export default function CommonSnackBar() {
    const [snackBarInfo, setSnackBarInfo] = useRecoilState<SnackBarInfo>(snackBarState);
    const { vertical, horizontal } = snackBarInfo;
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
        setSnackBarInfo({
            ...snackBarInfo,
            message: "",
            title: "",
            open: false
        })
    }

    return (
        <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={snackBarInfo.open}
            onClose={handleClose}
            autoHideDuration={3000}
            TransitionComponent={Zoom}
            key={vertical + horizontal}
        >
              <Alert onClose={handleClose} severity={snackBarInfo.severity} sx={{ width: '100%' }}>
                  <AlertTitle>{snackBarInfo.title}</AlertTitle>
              {snackBarInfo.message}
            </Alert>
            </Snackbar>
    )
}