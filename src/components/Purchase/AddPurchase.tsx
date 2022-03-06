import { Button, Fab, IconButton, TextField } from "@mui/material";
import { Grid, Card, Box, CardHeader, CardContent, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { authenticatedState, isAddCardState, isCardListReloadState } from "../../recoil/recoil";
import CloseIcon from '@mui/icons-material/Close';
import * as service from '../../services/axiosList';






export function AddPurchase() {

    const [isAddCard, setIsAddCard] = useRecoilState(isAddCardState);
    const [loading, setLoading] = useState(true);
    const [isCardListReload, setIsCardListReload] = useRecoilState<boolean>(isCardListReloadState);
    const [cardForm, setCardForm] = useState({
        cardName: "",
        cardType: "",
        cardDesc: ""
    })
    const authenticated = useRecoilValue(authenticatedState);


    const handleSubmitAddCard = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const cardAddForm: service.CardAddForm = {
            cardName: e.currentTarget["cardName"].value,
            cardType: e.currentTarget["cardType"].value,
            cardDesc: e.currentTarget["cardDesc"].value
        }

        setLoading(false);

        const res = await service.postCardAdd(authenticated.data?.accessToken!, cardAddForm);

        console.log(res);
        if (res.data.success) {
            setCardForm({
                cardName: "",
                cardDesc: "",
                cardType: ""
            })
        }
        setIsAddCard(false);
        setLoading(true);
        setIsCardListReload(!isCardListReload);

    }

    const handleChangeFormValue = (e: any) => {
        console.log(e.target.name);
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
        <form name="cardForm" id="cardForm" onSubmit={handleSubmitAddCard} style={isAddCard?{display: ''}: {display: 'none'}}>
            <Card>
                <CardHeader
                    title="카드 추가"
                    action={
                        <IconButton onClick={() => {setIsAddCard(false)}}>
                          <CloseIcon color="error" />
                        </IconButton>
                      }
                />
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
                        <Grid item xs={12} md={5} lg={3}>
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">카드종류</FormLabel>
                                    <RadioGroup row aria-label="cardType" name="cardType" value={cardForm.cardType} onChange={handleChangeFormValue} >
                                        <FormControlLabel value="CREDIT_CARD" control={<Radio required={true} />} label="신용카드" />
                                        <FormControlLabel value="CHECK_CARD" control={<Radio required={true} />} label="체크카드" />
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={5} lg={3}>
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
                        <Grid item xs={12} >
                            <Button type="submit" fullWidth={true} size="large" >추가</Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>


        </form>
    )

}
