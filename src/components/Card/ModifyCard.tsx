import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, IconButton, TextField, useMediaQuery } from "@mui/material";
import { Grid, Card, Box, CardHeader, CardContent, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { authenticatedState, isAddCardState, isCardListReloadState, isModifyModalShowState } from "../../recoil/recoil";
import CloseIcon from '@mui/icons-material/Close';
import * as service from '../../services/axiosList';
import { useTheme } from '@mui/material/styles';
import { cpuUsage } from "process";
import PropTypes from 'prop-types';


// props 받아올 값의 type 을 선언
interface Iprops {
    cardNo: number
}




export function ModifyCard(props:Iprops) {

    const [isAddCard, setIsAddCard] = useRecoilState(isAddCardState);
    const [loading, setLoading] = useState(false);
    const [data, setData] = React.useState<any>([]);
    const [isCardListReload, setIsCardListReload] = useRecoilState<boolean>(isCardListReloadState);
    const [isModifyModalShow, setIsModifyModalShow] = useRecoilState<boolean>(isModifyModalShowState);
    const [cardForm, setCardForm] = useState({
        cardName: "",
        cardType: "",
        cardDesc: ""
    })
    const authenticatedValue = useRecoilValue(authenticatedState);


      React.useEffect(() => {
        async function getCardDetail() {
            if (authenticatedValue.data?.accessToken !== undefined) {
                const res = await service.getCardDetail(props.cardNo);
                if (res.status === 200 && res.data.success) {
                    setCardForm(res.data.response);
                }


            }

        }

        getCardDetail();

    }, [])

    const handleClose = () => {
        setIsModifyModalShow(false);
      };
      


    const handleSubmitModifyCard = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const cardUpdateForm: service.CardUpdateForm = {
            cardNo: props.cardNo,
            cardName: e.currentTarget["cardName"].value,
            cardType: e.currentTarget["cardType"].value,
            cardDesc: e.currentTarget["cardDesc"].value
        }

        const res = await service.updateCardModify(cardUpdateForm);

        if (res.data.success) {
            setCardForm({
                cardName: "",
                cardDesc: "",
                cardType: ""
            })
        }
        setIsModifyModalShow(false);
        setIsCardListReload(!isCardListReload);

    }

    const handleChangeFormValue = (e: any) => {
        if (e.target.name === "cardName") {
            setCardForm({
                ...cardForm,
                cardName: e.target.value
            })
        }
        if (e.target.name === "cardType") {
            setCardForm({
                ...cardForm,
                cardType: e.target.value
            })
        }
        if (e.target.name === "cardDesc") {
            setCardForm({
                ...cardForm,
                cardDesc: e.target.value
            })
        }

    }

    return (
       
            <Dialog
                open={isModifyModalShow}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                 <form name="cardForm" id="cardForm" onSubmit={handleSubmitModifyCard}>
            <DialogTitle id="responsive-dialog-title" sx={{textAlign: 'center'}}>
                {"카드 수정"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Card>
                        <CardContent>
                            <Grid container spacing={5} rowSpacing={4}>
                                <Grid item xs={12} md={5} lg={3}>
                                    <Box display="flex" justifyContent="center" alignItems="center">
                                        <TextField
                                            required
                                            id="cardName"
                                            name="cardName"
                                            label="카드명"
                                            variant="standard"
                                            helperText="Required"
                                            value={cardForm.cardName}
                                            onChange={handleChangeFormValue}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={5} lg={4}>
                                    <Box display="flex" justifyContent="center" alignItems="center">
                                        <FormControl component="fieldset">
                                            <FormLabel component="legend">카드종류</FormLabel>
                                            <RadioGroup row aria-label="cardType" name="cardType" value={cardForm.cardType} onChange={handleChangeFormValue}>
                                                <FormControlLabel value="CREDIT_CARD" control={<Radio required={true} />} label="신용카드" />
                                                <FormControlLabel value="CHECK_CARD" control={<Radio required={true} />} label="체크카드" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={5} lg={5}>
                                    <Box display="flex" justifyContent="center" alignItems="center">
                                        <TextField
                                            id="cardDesc"
                                            name="cardDesc"
                                            label="카드설명"
                                            multiline
                                            value={cardForm.cardDesc}
                                            onChange={handleChangeFormValue}
                                            maxRows={8}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button type="submit" >
                    수정
                </Button>
                <Button onClick={handleClose}>
                    취소
                </Button>
            </DialogActions>
            </form>
        </Dialog>
      
        
    )

}
