import { Button, Dialog, DialogActions, DialogContent, InputLabel, MenuItem, Select, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { FormControl } from '@mui/material';
import DateAdapter from '@mui/lab/AdapterMoment';
import Input from '@mui/material/Input';
import * as service from '../../services/axiosList';
import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import NumberFormat from "react-number-format";
import { useEffect, useState } from "react";
import moment from "moment";
import { useRecoilState, useSetRecoilState } from "recoil";
import { loadingState, SnackBarInfo, snackBarState } from "../../recoil/recoil";
import _ from "lodash";


export default function ModifyPurchase(props:{
    reloadPurchaseListFunction: any,
    purchaseNo: number,
    accountBookNo: number,
    categoryList: any,
    handleCloseModifyPurchase: any,
    cardList: []
}) {
    const [snackBarInfo, setSnackBarInfo] = useRecoilState<SnackBarInfo>(snackBarState);
    const setLoading = useSetRecoilState<boolean>(loadingState);
    const initPurchaseForm = {
        accountBookNo: props.accountBookNo,
        price: "",
        purchaseDate: moment().format("YYYY-MM-DD"),
        purchaseType: "",
        reason: "",
        storeName: "",
        categoryNo: 0,
        cardNo: 0
    };
    const [purchaseDate, setPurchaseDate] = useState<string>(
        moment().format("yyyy-MM-DD")
      );
    const [purchaseForm, setPurchaseForm] = useState<service.PurchaseAddForm>(initPurchaseForm);
    const [categoryCollection, setCategoryCollection] = useState<any>({
        selectedSubCategoryNo: 0,
        childCategories: []
    })

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

      async function getPurchase(purchaseNo:number) {
        try {
            setLoading(true);

            const res = await service.getPurchase(purchaseNo);
            if (res.status === 200 && res.data.success) {
                let selectedSubCategoryNo = 0;
                let selectedCategoryNo = 0;
                /* 세부 카테고리가 설정되어 있으면 셋팅해준다 */
                if(res.data.response.categoryNo !== null && res.data.response.parentCategoryNo !== null){
                    selectedSubCategoryNo = res.data.response.categoryNo;
                    selectedCategoryNo = res.data.response.categoryNo;
                }else if(res.data.response.categoryNo !== null && res.data.response.parentCategoryNo === null){
                    selectedCategoryNo = res.data.response.categoryNo;
                }

                /* 세부카테고리목록을 셋팅해준다 */
                const categoryInfo = props.categoryList.categoryList.find((value:any) => value.categoryNo === res.data.response.parentCategoryNo);
                if(categoryInfo !== undefined){
                    setCategoryCollection({
                        selectedSubCategoryNo: selectedSubCategoryNo,
                        childCategories: categoryInfo.childCategoryList
                    })
                }else{
                    setCategoryCollection({
                        selectedSubCategoryNo: selectedSubCategoryNo,
                        childCategories: []
                    })
                }
                setPurchaseForm({
                    accountBookNo: res.data.response.accountBookNo,
                    categoryNo: selectedCategoryNo,
                    price: res.data.response.price,
                    purchaseDate: res.data.response.purchaseDate,
                    purchaseType: res.data.response.purchaseType,
                    reason: res.data.response.reason,
                    cardNo: res.data.response.cardNo === null? 0 : res.data.response.cardNo,
                    storeName: res.data.response.storeName

                })
            }else{
                alert("서버 오류입니다.");
            }
        } catch {
            alert("서버 오류입니다.");
        } finally {
            setLoading(false);
        }


    }

      useEffect(()=>{
        getPurchase(props.purchaseNo);
           // eslint-disable-next-line react-hooks/exhaustive-deps 
      }, [])

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
            const categoryInfo = props.categoryList.categoryList.find((value:any) => value.categoryNo === e.target.value);

            setCategoryCollection({
                selectedSubCategoryNo: 0,
                childCategories: categoryInfo !== undefined? categoryInfo.childCategoryList: []
            })

            setPurchaseForm({
                ...purchaseForm,
                categoryNo: e.target.value
            })
        }
        if(e.target.name === "subCategorySelect"){
            setCategoryCollection({
                ...categoryCollection,
                selectedSubCategoryNo: e.target.value
            });
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


        let purchaseModifyForm: service.PurchaseAddForm = _.cloneDeep(purchaseForm);
        /* 세부 카테고리가 설정되었을 경우 세부카테고리를 넣어준다 */
        if(categoryCollection.selectedSubCategoryNo !== 0){
            purchaseModifyForm.categoryNo = categoryCollection.selectedSubCategoryNo;
        }
        purchaseModifyForm.purchaseDate = purchaseDate;
        purchaseModifyForm.purchaseNo = props.purchaseNo;
        purchaseModifyForm.price = String(purchaseModifyForm.price);

        /* 수입의 경우 카테고리를 초기화 해준다. */
        if(purchaseModifyForm.purchaseType === "INCOME"){
            purchaseModifyForm.categoryNo = 0;
        }
        

        try{
            setLoading(true);
            const res = await service.patchPurchaseModify(purchaseModifyForm);

            if (res.data.success) {
                setPurchaseForm(initPurchaseForm);
                setCategoryCollection({
                    ...categoryCollection,
                    selectedSubCategoryNo: 0
                });
                setSnackBarInfo({
                    ...snackBarInfo,
                    message: "수정 되었습니다.",
                    severity:'success',
                    title: "성공",
                    open: true
                })
                props.handleCloseModifyPurchase();
                props.reloadPurchaseListFunction();
            }
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
        <Dialog
        open={true}
        onClose={props.handleCloseModifyPurchase}
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
                        label={purchaseForm.purchaseType === "OUTGOING"? "지출 일자": "수입 일자"}
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
                        {props.categoryList.categoryList.map((category: any)=>(
                            <MenuItem key={category.categoryNo} value={category.categoryNo}>
                                <img style={{ width: '20px', marginRight: '10px' }} alt={category.categoryName} src={category.categoryIcon} />{category.categoryName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl 
                    margin='normal'
                    fullWidth >
                    <InputLabel id="demo-simple-select-required-label">세부항목</InputLabel>
                    <Select
                        fullWidth
                        name="subCategorySelect"
                        labelId="demo-simple-select-required-label"
                        id="demo-simple-select-required"
                        value={categoryCollection.selectedSubCategoryNo}
                        label="항목"
                        onChange={handleChangeFormValue}
                    >
                        <MenuItem value={0}>--항목 선택--</MenuItem>
                        {categoryCollection.childCategories.map((category: any)=>(
                            <MenuItem key={category.categoryNo} value={category.categoryNo}>
                                <img style={{ width: '20px', marginRight: '10px' }} alt={category.categoryName} src={category.categoryIcon} />{category.categoryName}
                            </MenuItem>
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
            <Button onClick={props.handleCloseModifyPurchase}>
                취소
            </Button>
        </DialogActions>
        </form>
    </Dialog>
    </>
    )
}
