import { Button, Dialog, DialogActions, DialogContent, InputLabel, MenuItem, Select, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { FormControl } from '@mui/material';
import DateAdapter from '@mui/lab/AdapterMoment';
import CreateIcon from '@mui/icons-material/Create';
import Input from '@mui/material/Input';
import * as service from '../../services/axiosList';
import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import NumberFormat from "react-number-format";
import { useState } from "react";
import moment from "moment";
import { useRecoilState, useSetRecoilState } from "recoil";
import { loadingState, SnackBarInfo, snackBarState } from "../../recoil/recoil";


export function AddPurchase(props:{
    reloadPurchaseListFunction: any,
    accountBookNo: number,
    categoryList: [],
    cardList: []
}) {
    const [isAddPurchase, setIsAddPurchase] = useState<boolean>(false);
    const [snackBarInfo, setSnackBarInfo] = useRecoilState<SnackBarInfo>(snackBarState);
    const setLoading = useSetRecoilState<boolean>(loadingState);
    const initPurchaseForm = {
        accountBookNo: props.accountBookNo,
        price: "",
        purchaseDate: moment().format("YYYY-MM-DD"),
        purchaseType: "",
        reason: "",
        storeName: "",
        categoryNo: 0
    };
    const [purchaseDate, setPurchaseDate] = useState<string>(
        moment().format("yyyy-MM-DD")
      );
    const [purchaseForm, setPurchaseForm] = useState<service.PurchaseAddForm>(initPurchaseForm);

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


    const handleChangeFormValue = (e: any) => {
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
        if(e.target.name === "categorySelect"){
            setPurchaseForm({
                ...purchaseForm,
                categoryNo: e.target.value
            })
        }
        
    }

    const handleChangeDate = (newValue: string | null) => {
            setPurchaseDate(moment(newValue, "YYYY-MM-DD").format("YYYY-MM-DD"));

    };

    const handleSubmitAddPurchase = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(purchaseForm.purchaseType === ""){
            setSnackBarInfo({
                ...snackBarInfo,
                message: "유형을 선택해주세요.",
                severity:'error',
                title: "에러",
                open: true
            })
            return;
        }

        if(purchaseForm.price === "0" || purchaseForm.price === ""){
            setSnackBarInfo({
                ...snackBarInfo,
                message: "금액은 필수값 입니다.",
                severity:'error',
                title: "에러",
                open: true
            })
            return;
        }

        const purchaseAddForm: service.PurchaseAddForm = purchaseForm;
        purchaseForm.purchaseDate = purchaseDate;
        
        try{
            setLoading(true);
            const res = await service.postPurchaseAdd(purchaseAddForm);

            if (res.data.success) {
                setPurchaseForm(initPurchaseForm);
                setSnackBarInfo({
                    ...snackBarInfo,
                    message: "추가 되었습니다.",
                    severity:'success',
                    title: "성공",
                    open: true
                })
                props.reloadPurchaseListFunction();
            }
            setIsAddPurchase(false);
        }catch(err) {
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


    }

    return (
        <>
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
        <Dialog
        open={isAddPurchase}
        onClose={() => { setIsAddPurchase(false);
            setPurchaseForm(initPurchaseForm) }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <form name="purchaseForm" id="purchaseForm" onSubmit={handleSubmitAddPurchase}>
        <DialogContent>
            
               <div style={{textAlign: 'center'}}>
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
                        onChange={(value) => {handleChangeDate(value)}}
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
                        {props.cardList.map((card: any)=>(
                            <MenuItem key={card.cardNo} value={card.cardNo}>{card.cardName}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl 
                    margin='normal'
                    fullWidth >
                    <InputLabel id="demo-simple-select-required-label">항목</InputLabel>
                    <Select
                        fullWidth
                        name="categorySelect"
                        labelId="demo-simple-select-required-label"
                        id="demo-simple-select-required"
                        value={purchaseForm.categoryNo}
                        label="항목"
                        onChange={handleChangeFormValue}
                    >
                        <MenuItem value={0}>--항목 선택--</MenuItem>
                        {props.categoryList.map((category: any)=>(
                            <MenuItem key={category.categoryNo} value={category.categoryNo}>{category.categoryName}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                </>
                ):(<></>)}
                <FormControl margin='normal' fullWidth >
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
                <FormControl margin='normal' fullWidth >
                    <TextField

                        id="outlined-name"
                        label="내용"
                        name="reason"
                        required
                        value={purchaseForm.reason}
                        onChange={handleChangeFormValue}
                            />
                </FormControl>
                
                
                </div>
        </DialogContent>
        <DialogActions>
            <Button autoFocus type="submit">확인</Button>
            <Button onClick={() => {  
                setIsAddPurchase(false);
                setPurchaseForm(initPurchaseForm); }}>
                취소
            </Button>
        </DialogActions>
        </form>
    </Dialog>
    </>
    )
}
