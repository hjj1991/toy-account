import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import NumberFormat from 'react-number-format';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions, CardHeader, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import * as service from '../../services/axiosList';
import { useRecoilState, useRecoilValue } from 'recoil';
import { authenticatedState, isAddCardState, isCardListReloadState, isModifyModalShowState } from '../../recoil/recoil';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import CreateIcon from '@mui/icons-material/Create';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import moment from 'moment';
import CommonModal from '../common/CommonModal';
import Budget from '../../assets/img/budget.png';
import outMoney from '../../assets/img/out-money.png';
import inMoney from '../../assets/img/in-money.png';
import allMoney from '../../assets/img/all-money.png';


const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 60,
    lineHeight: '60px',
  }));
  
  const darkTheme = createTheme({ palette: { mode: 'dark' } });
  const lightTheme = createTheme({ palette: { mode: 'light' } });
  

export default function Body() {

    const [navSelect, setNavSelect] = React.useState<number>(1);
    const [isAddPurchase, setIsAddPurchase] = React.useState<boolean>(false);
    const [purchaseList, setPurchaseList] = React.useState<any>([]);
    const [filterPurchaseList, setfilterPurchaseList] = React.useState<any>([]);
    const [cardList, setCardList] = React.useState<any>([]);
    const [storeList, setStoreList] = React.useState<any>([]);
    const [selectedIndx, setSelectedIndx] = React.useState<number>(0);
    const authenticatedValue = useRecoilValue(authenticatedState);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = React.useState<boolean>(false);
    const [purchaseForm, setPurchaseForm] = React.useState<service.PurchaseAddForm>({
        cardNo: 0,
        price: "0",
        purchaseDate: moment().format("YYYY-MM-DD"),
        purchaseType: "",
        reason: "",
        storeName: "",
        storeNo: 0
    })

    const [startDate, setStartDate] = React.useState<string | null>(
        moment().format("yyyy-MM-") + "01"
      );
    const [endDate, setEndDate] = React.useState<string | null>(
        moment().format("yyyy-MM-DD")
      );
      const [purchaseDate, setPurchaseDate] = React.useState<string>(
        moment().format("yyyy-MM-DD")
      );

      const inputPriceFormat = (str:any) => {
        const comma = (str:any) => {
          str = String(str);
          return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
        };
        const uncomma = (str:any) => {
          str = String(str);
          return str.replace(/[^\d]+/g, "");
        };
        return comma(uncomma(str));
      };



      const handleChangeNav = (event: React.SyntheticEvent, navSelect: number) => {
        setNavSelect(navSelect);

        /* 들어온 돈의 필터 */
        if(navSelect === 1){
            setfilterPurchaseList(purchaseList.filter( (purchase:any) => {return purchase.purchaseType === "INCOME"}))
        /* 나간돈의 필터 */
        }else if(navSelect === 2){
            setfilterPurchaseList(purchaseList.filter( (purchase:any) => {return purchase.purchaseType === "OUTGOING"}))
        }else{
            setfilterPurchaseList(purchaseList);
        }
      };
      
    const handleSubmitAddPurchase = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(purchaseForm.purchaseType === ""){
            alert("유형을 선택해주세요.");
            return;
        }

        if(purchaseForm.price === "0" || purchaseForm.price === ""){
            alert("금액은 필수값 입니다.");
            return;
        }

        const purchaseAddForm: service.PurchaseAddForm = purchaseForm;
        purchaseForm.purchaseDate = purchaseDate;
        


        const res = await service.postPurchaseAdd(authenticatedValue.data?.accessToken!, purchaseAddForm);

        if (res.data.success) {
            setPurchaseForm({
                cardNo: 0,
                price: "0",
                purchaseDate:  moment().format("yyyy-MM-DD"),
                purchaseType: "",
                reason: "",
                storeName: "",
                storeNo: 0
            })
        }
        setIsAddPurchase(false);
        getPurchaseList();
     

    }

      
    async function getPurchaseList() {
        if (authenticatedValue.data?.accessToken !== undefined) {
            const res = await service.getPurchaseList(authenticatedValue.data?.accessToken, startDate, endDate);
            if (res.status === 200 && res.data.success) {
                setCardList(res.data.response.cardList);
                setStoreList(res.data.response.storeList);
                setPurchaseList(res.data.response.purchaseList);
            /* 들어온 돈의 필터 */
            if(navSelect === 1){
                setfilterPurchaseList(res.data.response.purchaseList.filter( (purchase:any) => {return purchase.purchaseType === "INCOME"}))
            /* 나간돈의 필터 */
            }else if(navSelect === 2){
                setfilterPurchaseList(res.data.response.purchaseList.filter( (purchase:any) => {return purchase.purchaseType === "OUTGOING"}))
            }else{
                setfilterPurchaseList(res.data.response.purchaseList);
            }

            }
        }

    }


    const handleChangeFormValue = (e: any) => {
        console.log(e.target.name);
        if (e.target.name === "cardSelect") {
            setPurchaseForm({
                ...purchaseForm,
                cardNo: e.target.value
            })
        }
        if (e.target.name === "price") {
            setPurchaseForm({
                ...purchaseForm,
                price: inputPriceFormat(e.target.value)
            })
        }
        if( e.target.name === "purchaseType"){
            setPurchaseForm({
                ...purchaseForm,
                purchaseType: e.target.value
            })
        }
        if( e.target.name === "reason"){
            setPurchaseForm({
                ...purchaseForm,
                reason: e.target.value
            })
        }
        if(e.target.name === "storeSelect"){
            setPurchaseForm({
                ...purchaseForm,
                storeNo: e.target.value
            })
        }
        

    }
    
    
    const handleChangeDate = (newValue: string | null, type: string) => {
        if(type === "start" && newValue != null && endDate != null && moment(endDate, "YYYY-MM-DD").isBefore(moment(newValue, "YYYY-MM-DD"))){
            alert("종료일이 시작일보다 앞설 수 없습니다.");
            return;
        }
            
        if(type === "end" && newValue != null && startDate != null && moment(startDate, "YYYY-MM-DD").isAfter(moment(newValue, "YYYY-MM-DD"))){
            alert("종료일이 시작일보다 앞설 수 없습니다.");
            return;
        }
            
        if(type === "start"){
            setStartDate(moment(newValue, "YYYY-MM-DD").format("YYYY-MM-DD"));
    
        }
        if(type === "end"){
            setEndDate(moment(newValue, "YYYY-MM-DD").format("YYYY-MM-DD"));
        }

        if(type === "purchase"){
            setPurchaseDate(moment(newValue, "YYYY-MM-DD").format("YYYY-MM-DD"));
        }
        
        
    };
    
    const handleClickRemovePurchaseOk = async (indx:number) => {


        if (authenticatedValue.data?.accessToken !== undefined && indx !== 0) {
            const res = await service.postPurchaseDelete(authenticatedValue.data?.accessToken, indx);
            if (res.status === 200 && res.data.success) {
                
                getPurchaseList();
            }
        }
        setSelectedIndx(0);
        setIsOpenDeleteModal(false);


    }

    const handleClickRemovePurchaseCancel = () => {
        setSelectedIndx(0);
        setIsOpenDeleteModal(false);
    }






    React.useEffect(() => {


        getPurchaseList();

    }, [startDate, endDate])
    return (
        <Grid container spacing={2}>
          <Grid item xs={12}>
          <Card 
          style={{ 
            backgroundColor: '#eaeff1' }}
              >
                <CardHeader
                    style={{textAlign: "center"}}
                    title={
                    <>
                    <img width={100} src={Budget} />
                    <div>소비생활</div>
                    </>
                        }
                   />
                    <CardContent>
                        <div style={{textAlign:"center"}}>
                        <LocalizationProvider dateAdapter={DateAdapter}>
                            <DesktopDatePicker
                                label="시작일"
                                inputFormat="yyyy-MM-DD"
                                value={startDate}
                                mask={"____-__-__"}
                                onChange={(value) => {handleChangeDate(value, 'start')}}
                                renderInput={(params) => 
                                    <TextField  {...params} 
                                                type="string"
                                                sx={{
                                                    width: 150,
                                                    m: 1,
                                                    color: "rgb(0,0,0)",
                                                    input: "red",
                                                    fontSize: 50,
                                                    label: "red"
                                                }} />}
                                />
                
                            <DesktopDatePicker
                                label="종료일"
                                inputFormat="yyyy-MM-DD"
                                value={endDate}
                                mask={"____-__-__"}
                                onChange={(value) => {handleChangeDate(value, 'end')}}
                                renderInput={(params) => <TextField  sx={{
                                    width: 150,
                                    m: 1,
                                    color: "rgb(0,0,0)",
                                    input: "red",
                                    fontSize: 50,
                                    label: "red"
                                }}{...params} type="string" />}
                                />
                        </LocalizationProvider>
                        </div>
                        <Typography gutterBottom variant="h5" component="div" style={{fontWeight: "bold", textAlign: "center"}}>
                           안녕하세요. {authenticatedValue.data?.nickName}님!
                        </Typography>
                        <Typography variant="body2" color="text.secondary" style={{textAlign: "center"}}>
                            지난 거래내역을 확인하세요.
                        </Typography>
                    </CardContent>
            </Card>
            <Tabs value={navSelect} onChange={handleChangeNav}  aria-label="icon label tabs example"
                    sx={{
                        m: 0,
                        backgroundColor: '#009be5'
                    }}>
                        <Tab className="navSelect" icon={<img src={allMoney} />} label="전체" />
                        <Tab className="navSelect" icon={<img src={inMoney} />} label="들어온 돈" />
                        <Tab className="navSelect" icon={<img src={outMoney} />} label="나간돈" />
            </Tabs>
              <Box
                sx={{
                  p: 1,
                  bgcolor: 'white',
                  display: 'grid',
                  border: 1,
                  gridTemplateColumns: { md: '1fr 1fr' },
                  gap: 1,
                }}
              >
                {filterPurchaseList.map((elevation:any) => (
                <Grid container  key={elevation.purchaseNo} spacing={0}>
                    <Grid className='purchaseBox' item xs={12}>
                    <Grid container  spacing={0}>
                        <Grid item xs={11} className="purchaseBox-header">{elevation.purchaseDate}</Grid>
                        <Grid item xs={1}>
                            <DeleteForeverOutlinedIcon
                                    className='deleteIcon'
                                    onClick={() => {
                                            setSelectedIndx(elevation.purchaseNo);
                                            setIsOpenDeleteModal(true);
                                        }}
                                     sx={{
                                        cursor: 'pointer',
                                        color: 'red',
                                        opacity: '0.4'
                                    }} 
                                />
                        </Grid> 
                        </Grid>
                        <Grid container  spacing={0}>
                            <Grid item xs={6} style={{color: "black", fontSize: "18px"}}>{elevation.reason}</Grid>
                            {elevation.purchaseType === "INCOME"?(
                                <Grid item style={{textAlign: "right", color: elevation.purchaseType === "INCOME"? "green": "red"}} xs={6}>+{elevation.price.toLocaleString()}</Grid>
                            ):(
                                <Grid item style={{textAlign: "right", color: elevation.purchaseType === "INCOME"? "green": "red"}} xs={6}>-{elevation.price.toLocaleString()}</Grid>
                            )}
                            
                        </Grid>
                    </Grid>
              
                </Grid>
                ))}
              </Box>
         
          </Grid>
        )
        <Dialog
                open={isAddPurchase}
                onClose={() => { setIsAddPurchase(false);
                    setPurchaseForm({
                        cardNo: 0,
                        price: "0",
                        purchaseDate: "",
                        purchaseType: "",
                        reason: "",
                        storeName: "",
                        storeNo: 0
                    }) }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <form name="purchaseForm" id="purchaseForm" onSubmit={handleSubmitAddPurchase}>
                <DialogContent>
                    <DialogContentText
                        style={{textAlign: "center"}}
                        id="alert-dialog-description">
                        <FormControl 
                            margin='normal'
                            fullWidth >
                        <ToggleButtonGroup
                            color="primary"
                            fullWidth
                            value={purchaseForm.purchaseType}
                            exclusive
                            
                            onChange={handleChangeFormValue}
                            >
                            <ToggleButton name="purchaseType" value="INCOME">들어온 돈</ToggleButton>
                            <ToggleButton name="purchaseType" value="OUTGOING">나간 돈</ToggleButton>
                            </ToggleButtonGroup>
                        </FormControl>
                        <FormControl margin='normal' >
                        <LocalizationProvider dateAdapter={DateAdapter}>
                            <DesktopDatePicker
                                label={purchaseForm.purchaseType === "OUTGOING"? "수입 일자": "지출 일자"}
                                inputFormat="yyyy-MM-DD"
                                value={purchaseDate}
                                mask={"____-__-__"}
                                onChange={(value) => {handleChangeDate(value, 'purchase')}}
                                renderInput={(params) => <TextField style={{margin: "10px"}} {...params} type="string" />}
                                />
                        </LocalizationProvider>
                        </FormControl>
                        {purchaseForm.purchaseType === "OUTGOING"?(
                            <>
                        <FormControl 
                            margin='normal'
                            fullWidth >
                            <InputLabel id="demo-simple-select-required-label">카드종류</InputLabel>
                            <Select
                                fullWidth
                                name="cardSelect"
                                labelId="demo-simple-select-required-label"
                                id="demo-simple-select-required"
                                value={purchaseForm.cardNo}
                                label="카드종류 *"
                                onChange={handleChangeFormValue}
                            >
                                    <MenuItem value={0}>현금</MenuItem>
                                {cardList.map((card: any)=>(
                                    <MenuItem value={card.cardNo}>{card.cardName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl 
                            margin='normal'
                            fullWidth >
                            <InputLabel id="demo-simple-select-required-label">업종</InputLabel>
                            <Select
                                fullWidth
                                name="storeSelect"
                                labelId="demo-simple-select-required-label"
                                id="demo-simple-select-required"
                                value={purchaseForm.storeNo}
                                label="업종 *"
                                onChange={handleChangeFormValue}
                            >
                                <MenuItem value={0}>--업종 선택--</MenuItem>
                                {storeList.map((store: any)=>(
                                    <MenuItem value={store.storeNo}>{store.storeTypeName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        </>
                        ):(<></>)}
                        <FormControl margin='normal' >
                            <InputLabel htmlFor="component-helper">금액</InputLabel>
                            <NumberFormat
                                value={purchaseForm.price}
                                name="price"
                                customInput={Input}
                                thousandSeparator={true}
                                required={true}
                                prefix={'₩'}
                                allowNegative={false}
                                onChange={handleChangeFormValue}
                                displayType={"input"}
                            />
                        </FormControl>
                        <FormControl margin='normal' >
                            <TextField
                                id="outlined-name"
                                label="내용"
                                name="reason"
                                required
                                value={purchaseForm.reason}
                                onChange={handleChangeFormValue}
                                    />
                        </FormControl>
                        
                        
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus type="submit">확인</Button>
                    <Button onClick={() => {  
                        setIsAddPurchase(false);
                        setPurchaseForm({
                            cardNo: 0,
                            price: "0",
                            purchaseDate: purchaseDate,
                            purchaseType: "",
                            reason: "",
                            storeName: "",
                            storeNo: 0
                        }); }}>
                        취소
                    </Button>
                </DialogActions>
                </form>
            </Dialog>
            <CommonModal 
                showModal={isOpenDeleteModal}
                selectedIndx={selectedIndx}
                title=""
                contents="삭제 하실건가요?"
                clickOkHandle = {handleClickRemovePurchaseOk}
                clickCancelHandle = {handleClickRemovePurchaseCancel}
            />
        
        <CreateIcon onClick={() => {
            setIsAddPurchase(true) 
            }}
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
      </Grid>

    );
}