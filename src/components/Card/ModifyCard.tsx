import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Grid, Card, Box, CardContent, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isCardListReloadState, isModifyModalShowState, loadingState } from "../../recoil/recoil";
import * as service from '../../services/axiosList';


// props 받아올 값의 type 을 선언
interface Iprops {
    cardNo: number
}




export function ModifyCard(props: Iprops) {

    const [isCardListReload, setIsCardListReload] = useRecoilState<boolean>(isCardListReloadState);
    const [isModifyModalShow, setIsModifyModalShow] = useRecoilState<boolean>(isModifyModalShowState);
    const setLoading = useSetRecoilState<boolean>(loadingState);
    const [cardForm, setCardForm] = useState({
        cardName: "",
        cardType: "",
        cardDesc: ""
    })

    async function getCardDetail() {

        try {
            setLoading(true);
            const res = await service.getCardDetail(props.cardNo);
            if (res.status === 200 && res.data.success) {
                setCardForm(res.data.response);
            }
        } catch (err) {
            alert("서버 에러입니다." + err);
        } finally {
            setLoading(false);
        }



    }


    React.useEffect(() => {

        getCardDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps 
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

        try{
            setLoading(true);
            const res = await service.updateCardModify(cardUpdateForm);

            if (res.data.success) {
                setCardForm({
                    cardName: "",
                    cardDesc: "",
                    cardType: ""
                })
            }
        }catch(err){
            alert("서버 에러입니다." + err);
        }finally{
            setLoading(false);
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
                <DialogTitle id="responsive-dialog-title" sx={{ textAlign: 'center' }}>
                    {"카드 수정"}
                </DialogTitle>
                <DialogContent>
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
