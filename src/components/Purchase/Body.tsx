import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import NumberFormat from 'react-number-format';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import Typography from '@mui/material/Typography';
import { Button, CardHeader, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import * as service from '../../services/axiosList';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { AuthenticatedInfo, authenticatedState, loadingState, SnackBarInfo, snackBarState,} from '../../recoil/recoil';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import Select from '@mui/material/Select';
import moment from 'moment';
import CommonModal from '../common/CommonModal';
import Budget from '../../assets/img/budget.png';
import outMoney from '../../assets/img/out-money.png';
import inMoney from '../../assets/img/in-money.png';
import allMoney from '../../assets/img/all-money.png';
import { AddPurchase } from './AddPurchase';



export default function Body(props:{
    accountBookNo?:number
}) {

    const [navSelect, setNavSelect] = React.useState<number>(0);
    const [reloadPurchase, setReloadPurchase] = React.useState<boolean>(false);
    const [purchaseList, setPurchaseList] = React.useState<any>([]);
    const [totalPrice, setTotalPrice] = React.useState<any>([]);
    const [filterPurchaseList, setfilterPurchaseList] = React.useState<any>([]);
    const [cardList, setCardList] = React.useState<any>([]);
    const [categoryList, setCategoryList] = React.useState<any>([]);
    const [selectedIndx, setSelectedIndx] = React.useState<number>(0);
    const [snackBarInfo, setSnackBarInfo] = useRecoilState<SnackBarInfo>(snackBarState);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = React.useState<boolean>(false);
    const authenticated = useRecoilValue<AuthenticatedInfo>(authenticatedState);
    const setLoading = useSetRecoilState<boolean>(loadingState);

    const [searchForm, setSerachForm] = React.useState<any>({
        categoryName: "ALL",
        searchValue: ""
    })

    const [startDate, setStartDate] = React.useState<string | null>(
        moment().format("yyyy-MM-") + "01"
      );
    const [endDate, setEndDate] = React.useState<string | null>(
        moment().format("yyyy-MM-DD")
      );

    const reloadPurchaseListFunction = () => {
        setReloadPurchase(!reloadPurchase);
    }

    const handleChangeNav = (event: React.SyntheticEvent, navSelectValue: number) => {
        setNavSelect(navSelectValue);
    };

    const searchChangeResult = () => {

        let tempPurchaseList = purchaseList;
        /* 들어온 돈의 필터 */
        if(navSelect === 1){
            tempPurchaseList = tempPurchaseList.filter( (purchase:any) => {return purchase.purchaseType === "INCOME"});
        }
        /* 나간돈의 필터 */
        if(navSelect === 2){
            tempPurchaseList = tempPurchaseList.filter( (purchase:any) => {return purchase.purchaseType === "OUTGOING"});
        }

        /* 지출항목 필터 */
        if(navSelect === 2 && searchForm.categoryName !== "ALL"){
            tempPurchaseList = tempPurchaseList.filter( (purchase:any) => {
                if(purchase.categoryInfo != null){
                    return purchase.categoryInfo.categoryName.includes(searchForm.categoryName)
                };
                });
                
        }

        if(searchForm.searchValue !== ""){
            tempPurchaseList = tempPurchaseList.filter( (purchase:any) => {return purchase.reason.includes(searchForm.searchValue)});
        }


        setfilterPurchaseList(tempPurchaseList);
           
    }
      
  

      
    async function getPurchaseList() {
        try{
            setLoading(true);
            let res;
            if(props.accountBookNo != undefined){
                res = await service.getPurchaseList(startDate, endDate, props.accountBookNo);
            }else{
                res = await service.getPurchaseList(startDate, endDate);
            }
            
            if (res.status === 200 && res.data.success) {
                setCardList(res.data.response.cardList);
                setCategoryList(res.data.response.categoryList);
                setPurchaseList(res.data.response.purchaseList);
                setSerachForm({
                    categoryName: "ALL",
                    searchValue: ""
                });
                setNavSelect(0);
                setfilterPurchaseList(res.data.response.purchaseList);
                let totalValue = 0;
                for(let purchase of res.data.response.purchaseList){
                    
                    if(purchase.purchaseType === "OUTGOING"){
                        totalValue -= purchase.price;
                    }
                    if(purchase.purchaseType === "INCOME"){
                        totalValue += purchase.price;
                    }
                }
                
                setTotalPrice(totalValue);
                
            }
        }catch(err){
            alert("서버 오류입니다." + err);
        }finally{
            setLoading(false);
        }
    

    }


    
    /* 검색 관련 함수 */
    const handleChangeSearch = (e: any) => {
        if(e.target.name === "searchStoreSelect"){
            setSerachForm({
                ...searchForm,
                categoryName: e.target.value
            })
        }
        if(e.target.name === "searchValue"){
            setSerachForm({
                ...searchForm,
                searchValue: e.target.value
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
    };
    
    const handleClickRemovePurchaseOk = async (indx:number) => {
        try{
            setLoading(true);
            const res = await service.postPurchaseDelete(indx);
            if (res.status === 200 && res.data.success) {
                setSnackBarInfo({
                    ...snackBarInfo,
                    message: "정상 삭제되었습니다.",
                    severity:'success',
                    title: "성공",
                    open: true
                })
            }
            setSelectedIndx(0);
            setIsOpenDeleteModal(false);
        }catch(err){
            setSnackBarInfo({
                ...snackBarInfo,
                message: "서버에러입니다.",
                severity:'error',
                title: "에러",
                open: true
            })
        }finally{
            setLoading(false);
        }
        getPurchaseList();
    }

    const handleClickRemovePurchaseCancel = () => {
        setSelectedIndx(0);
        setIsOpenDeleteModal(false);
    }





    React.useEffect(() => {
        getPurchaseList();
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [reloadPurchase, startDate, endDate])

    React.useEffect(() => {
        searchChangeResult();
        // eslint-disable-next-line react-hooks/exhaustive-deps 
      }, [navSelect, searchForm]);

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
                    <img width={100} src={Budget} alt={"없다"} />
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
                                    <TextField  
                                        {...params} 
                                            className="purchase-datePicker"
                                                type="string"
                                    />}
                                />
                
                            <DesktopDatePicker
                                label="종료일"
                                inputFormat="yyyy-MM-DD"
                                value={endDate}
                                mask={"____-__-__"}
                                onChange={(value) => {handleChangeDate(value, 'end')}}
                                renderInput={(params) => 
                                <TextField 
                                    className="purchase-datePicker" 
                                    {...params} type="string" />}
                                />
                        </LocalizationProvider>
                        </div>
                        <Typography gutterBottom variant="h5" component="div" style={{fontWeight: "bold", textAlign: "center"}}>
                           안녕하세요. {authenticated.data?.nickName}님!
                        </Typography>
                        <Typography gutterBottom  component="div" style={{fontWeight: "bold", textAlign: "center", color: totalPrice < 0? "red": "#3CB371"}}>
                           총 소비 내역: {totalPrice.toLocaleString()}원
                        </Typography>
                        <Typography variant="body2" color="text.secondary" style={{textAlign: "center"}}>
                            지난 거래내역을 확인하세요.
                        </Typography>
                        <div style={{textAlign: "center"}}>
                        {navSelect === 2?   
                        <FormControl 
                        margin='normal'
                             >
                            <InputLabel focused={false} id='storeSelect-label'>지출항목</InputLabel>
                            <Select
                                
                                labelId='storeSelect-label'
                                label='지출항목'
                                name="searchStoreSelect"
                                id="searchStoreSelect"
                                value={searchForm.categoryName}
                                onChange={handleChangeSearch}
                                sx={{
                                    ".MuiOutlinedInput-notchedOutline": { borderColor: 'rgba(0, 0, 0, 0.23)!important', borderWidth: "1px!important" }
                                }}
                            >
                                <MenuItem value="ALL">전체</MenuItem>
                                {categoryList.map((category: any)=>(
                                    <MenuItem key={category.categoryNo} value={category.categoryName}><img style={{width: '20px', marginRight: '10px'}} src={category.categoryIcon} />{category.categoryName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>: null}
                        <FormControl 
                            margin='normal'
                             >
                            <TextField id="demo-helper-text-misaligned-no-helper" name="searchValue" label="검색어" onChange={handleChangeSearch} value={searchForm.searchValue} />
                        </FormControl>
                        </div>
                    </CardContent>
            </Card>
            <Tabs value={navSelect} onChange={handleChangeNav}  aria-label="icon label tabs example">
                        <Tab className="navSelect" icon={<img src={allMoney} alt={"없다"} width={38}   />} label="전체" />
                        <Tab className="navSelect" icon={<img src={inMoney} alt={"없다"} width={38}  />} label="들어온 돈" />
                        <Tab className="navSelect" icon={<img src={outMoney} alt={"없다"} width={38}  />} label="나간돈" />
            </Tabs>
              <Box 
                sx={{
                  p: 1,
                  bgcolor: 'white',
                  display: 'grid',
                  border: 1,
                  gridTemplateColumns: { 
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(1, 1fr)',
                      md: 'repeat(2, 1fr)'
                    },
                  gap: 1,
                }}
              >
                {filterPurchaseList.map((elevation:any) => (
                <Grid container  key={elevation.purchaseNo} spacing={0}>
                    <Grid className='purchaseBox' item xs={12}>
                    <Grid container  spacing={0}>
                        <Grid item xs={11} className="purchaseBox-header">{elevation.purchaseDate}</Grid>
                        <Grid item xs={1} style={{textAlign: 'right'}}>
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
                                <Grid item style={{textAlign: "right", color: elevation.purchaseType === "INCOME"? "#3CB371": "red"}} xs={6}>+{elevation.price.toLocaleString()}원</Grid>
                            ):(
                                <Grid item style={{textAlign: "right", color: elevation.purchaseType === "INCOME"? "#3CB371": "red"}} xs={6}>-{elevation.price.toLocaleString()}원</Grid>
                            )}
                            
                        </Grid>
                    </Grid>
              
                </Grid>
                ))}
              </Box>
         
          </Grid>
        )
            <AddPurchase 
                accountBookNo={props.accountBookNo!}
                reloadPurchaseListFunction={reloadPurchaseListFunction}
                categoryList={categoryList}
                cardList={cardList}
            />
            <CommonModal 
                showModal={isOpenDeleteModal}
                selectedIndx={selectedIndx}
                title=""
                contents="삭제 하실건가요?"
                clickOkHandle = {handleClickRemovePurchaseOk}
                clickCancelHandle = {handleClickRemovePurchaseCancel}
            />
      </Grid>

    );
}