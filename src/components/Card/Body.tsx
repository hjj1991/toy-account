import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions, CardHeader, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import * as service from '../../services/axiosList';
import { useRecoilState, useRecoilValue } from 'recoil';
import { authenticatedState, isAddCardState, isCardListReloadState, isModifyModalShowState } from '../../recoil/recoil';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { AddCard } from './AddCard';
import CreateIcon from '@mui/icons-material/Create';
import { ModifyCard } from './ModifyCard';

export default function Body() {

    const [loading, setLoading] = React.useState<boolean>(false);
    const [isModifyModalShow, setIsModifyModalShow] = useRecoilState<boolean>(isModifyModalShowState);
    const [isAddCard, setIsAddCard] = useRecoilState(isAddCardState);
    const [isCardListReload, setIsCardListReload] = useRecoilState<boolean>(isCardListReloadState);
    const [data, setData] = React.useState<any>([]);
    const [isOpenRemoveCardModal, setIsOpenRemoveCardModal] = React.useState<boolean>(false);
    const [selectedIndx, setSelectedIndx] = React.useState<number>(0);
    const authenticatedValue = useRecoilValue(authenticatedState);

    const handleClickRemoveCard = async () => {
        if (authenticatedValue.data?.accessToken !== undefined && selectedIndx !== 0) {
            const res = await service.deleteCardDelete(selectedIndx);
            if (res.status === 200 && res.data.success) {
                
                setIsCardListReload(!isCardListReload);
            }


        }
        setSelectedIndx(0);
        setIsOpenRemoveCardModal(false);


    }
    
    const handleClickModifyCard = (cardNo:number) => {
        setSelectedIndx(cardNo);
        setIsModifyModalShow(true);


    }



    React.useEffect(() => {
        async function getCardList() {
            const res = await service.getCardList();
            if (res.status === 200 && res.data.success) {
                setData(res.data.response);
            }


        }

        getCardList();

    }, [isCardListReload])
    return (
        <Container style={{ paddingTop: 20 }}>
            <Grid container alignItems="center" justifyContent="center" spacing={3}>
                <Grid item xs={12} alignItems="center" justifyContent="center" >
                    <AddCard />
                </Grid>
                {data.map((card: any, index: number) => (
                    <Grid item xs={12} md={5} lg={3} key={index}>
                        <Card>
                            <CardHeader
                                title={card.cardName}
                                action={
                                    <IconButton onClick={() => { setIsOpenRemoveCardModal(true); setSelectedIndx(card.cardNo); }}>
                                        <CloseIcon color="error" />
                                    </IconButton>
                                } />
                            <CardActionArea>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        ({card.cardType === "CREDIT_CARD"? "신용카드": "체크카드"})
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {card.cardDesc}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button size="small" color="primary" onClick={() => {handleClickModifyCard(card.cardNo)}}>
                                    수정
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}

            </Grid>
            <CreateIcon onClick={() => { setIsAddCard(true); }}
                sx={{
                    position: 'fixed',
                    bottom: '80px',
                    right: '40px',
                    width: '2em',
                    height: '2em',
                    zIndex: '10px',
                    cursor: 'pointer',
                    backgroundColor: 'burlywood'
                }} />
            <Dialog
                open={isOpenRemoveCardModal}
                onClose={() => { setIsOpenRemoveCardModal(false); setSelectedIndx(0); }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        정말 삭제하시겠습니까?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickRemoveCard} autoFocus>확인</Button>
                    <Button onClick={() => { setIsOpenRemoveCardModal(false) }}>
                        취소
                    </Button>
                </DialogActions>
            </Dialog>
            {isModifyModalShow?
            <ModifyCard
            cardNo={selectedIndx}
        />:
        <></>}
            
            
        </Container>

    );
}