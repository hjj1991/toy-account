import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardHeader, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import * as service from '../../services/axiosList';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { authenticatedState, isAddCardState, isCardListReloadState, isModifyModalShowState } from '../../recoil/recoil';
import CloseIcon from '@mui/icons-material/Close';
import { AddCard } from './AddCard';
import CreateIcon from '@mui/icons-material/Create';
import { ModifyCard } from './ModifyCard';
import CommonModal from '../common/CommonModal';

export default function Body() {

    const [isModifyModalShow, setIsModifyModalShow] = useRecoilState<boolean>(isModifyModalShowState);
    const setIsAddCard = useSetRecoilState(isAddCardState);
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

    
    const handleClickRemoveCardCancel = () => {
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
                                        <>
                                    <IconButton onClick={() => {handleClickModifyCard(card.cardNo)}}>
                                        <EditIcon color='primary' />
                                    </IconButton>
                                    <IconButton onClick={() => { setIsOpenRemoveCardModal(true); setSelectedIndx(card.cardNo); }}>
                                        <CloseIcon color="error" />
                                    </IconButton>
                                    </>
                                } />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        ({card.cardType === "CREDIT_CARD"? "신용카드": "체크카드"})
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {card.cardDesc}
                                    </Typography>
                                </CardContent>
                        </Card>
                    </Grid>
                ))}

            </Grid>
            <CreateIcon onClick={() => { setIsAddCard(true); }}
                className="createIcon"
                sx={{
                    position: 'fixed',
                    bottom: '80px',
                    right: '40px',
                    width: '2em',
                    height: '2em',
                    zIndex: '10px',
                    cursor: 'pointer',
                    opacity: '0.5'
                }} />
            <CommonModal 
                showModal={isOpenRemoveCardModal}
                selectedIndx={selectedIndx}
                title=""
                contents="삭제 하실건가요?"
                clickOkHandle = {handleClickRemoveCard}
                clickCancelHandle = {handleClickRemoveCardCancel}
            />
            {isModifyModalShow?
            <ModifyCard
            cardNo={selectedIndx}
        />:undefined}
            
            
        </Container>

    );
}