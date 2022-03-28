import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, Paper, PaperProps, TextField, Typography } from "@mui/material";
import * as service from '../../services/axiosList';
import { useRef, useState } from "react";
import CreateIcon from '@mui/icons-material/Create';
import Draggable from "react-draggable";
import { AccountBookAddForm } from "../../services/axiosList";
import { HexColorPicker } from "react-colorful";
import { useRecoilState, useSetRecoilState } from "recoil";
import { loadingState, SnackBarInfo, snackBarState } from "../../recoil/recoil";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

function PaperComponent(props: PaperProps) {
    const nodeRef = useRef(null);
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
            nodeRef={nodeRef}
        >
            <Paper ref={nodeRef} {...props} />
        </Draggable>
    );
}

export function AddAccountBook(props:{reloadFunction: Function}) {
    const [isOpenAddAccountModal, setIsOpenAddAccountModal] = useState<boolean>(false);
    const setLoading = useSetRecoilState<boolean>(loadingState);
    const [snackBarInfo, setSnackBarInfo] = useRecoilState<SnackBarInfo>(snackBarState);
    const initAccountBookForm = {
        accountBookName: "",
        accountBookDesc: "",
        backGroundColor: "#" + Math.floor(Math.random() * 16777215).toString(16),
        color:  "#" + Math.floor(Math.random() * 16777215).toString(16)
    }
    const [accountBookForm, setAccountBookForm] = useState<AccountBookAddForm>(initAccountBookForm)


    const handleClickClose = () => {
        setAccountBookForm(initAccountBookForm);
        setIsOpenAddAccountModal(false);
    }

    const handleChangeFormValue = (e:any) => {
        if (e.target.name === "accountBookName") {
            setAccountBookForm({
                ...accountBookForm,
                accountBookName: e.target.value
            })
        }

        if (e.target.name === "accountBookDesc") {
            setAccountBookForm({
                ...accountBookForm,
                accountBookDesc: e.target.value
            })
        }

    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setLoading(true);
        try{
            const res = await service.postAccountBookAdd(accountBookForm);
            if(res.data.success){
                setSnackBarInfo({
                    ...snackBarInfo,
                    message: "추가 되었습니다.",
                    severity:'success',
                    title: "성공",
                    open: true
                })
                handleClickClose();
            }else{
                setSnackBarInfo({
                    ...snackBarInfo,
                    message: res.data.apiError.message,
                    severity:'error',
                    title: "실패",
                    open: true
                })
            }
        }catch{
            setSnackBarInfo({
                ...snackBarInfo,
                message: "서버에러입니다.",
                severity:'error',
                title: "에러",
                open: true
            })
        }finally{
            props.reloadFunction();
            setLoading(false);
        }

    }


    return <>
        <CreateIcon onClick={() => { setIsOpenAddAccountModal(true); }}
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
            open={isOpenAddAccountModal}
            onClose={handleClickClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"

        >
            <Box component='form' onSubmit={handleSubmit}>
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    가계부 생성
                </DialogTitle>
                <DialogContent>
                    <FormControl margin='normal' fullWidth >
                        <TextField
                            label="가계부명"
                            name="accountBookName"
                            required
                            value={accountBookForm.accountBookName}
                            onChange={handleChangeFormValue}
                        />
                    </FormControl>
                    <FormControl margin='normal' fullWidth >
                        <TextField
                            label="가계부설명"
                            name="accountBookDesc"
                            value={accountBookForm.accountBookDesc}
                            onChange={handleChangeFormValue}
                        />
                    </FormControl>
                    <FormControl margin='normal' fullWidth  sx={{textAlign: 'center'}}>
                        <div>가게부 배경색</div>
                        <HexColorPicker style={{width: "auto"}} color={accountBookForm.backGroundColor} onChange={(value) => {setAccountBookForm({...accountBookForm, backGroundColor: value})}} />
                    </FormControl>
                    <FormControl margin='normal' fullWidth  sx={{textAlign: 'center'}}>
                        <div>가게부 글씨색</div>
                        <HexColorPicker style={{width: "auto"}} color={accountBookForm.color} onChange={(value) => {setAccountBookForm({...accountBookForm, color: value})}} />
                    </FormControl>
                    <FormControl margin='normal' fullWidth  sx={{textAlign: 'center'}}>
                        <div>미리보기</div>
                        <Grid item xs={12} sx={{
                            boxShadow: "0px 2px 1px -1px rgba(0, 0, 0, 20%), 0px 1px 1px 0px rgba(0, 0, 0, 14%), 0px 1px 3px 0px rgba(0, 0, 0, 12%)",
                            borderRadius: "8px",
                            padding: "16px",
                            backgroundColor: accountBookForm.backGroundColor}}>
                        <Grid container spacing={0} sx={{textAlign: 'left'}}>
                            <Grid item xs={11} sx={{fontSize: '20px', color: accountBookForm.color}}>
                                {accountBookForm.accountBookName}
                            </Grid>
                            <Grid item xs={1} style={{ textAlign: 'right' }}>
                                <DeleteForeverOutlinedIcon
                                    className='deleteIcon'
                                    sx={{
                                        cursor: 'pointer',
                                        color: 'red',
                                        opacity: '0.4'
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={0} sx={{textAlign: 'left', height: '27px'}}>
                            <Grid item xs={12}>
                                <Typography component="span" sx={{
                                    fontSize:'18px',
                                    opacity: '60%',
                                    color: accountBookForm.color
                                }}>
                                {accountBookForm.accountBookDesc}
                                </Typography>
                            </Grid>
                        </Grid>
                        </Grid>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button type='submit'>확인</Button>
                    <Button onClick={handleClickClose}>
                        취소
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    </>
}