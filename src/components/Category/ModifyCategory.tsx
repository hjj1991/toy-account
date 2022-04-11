import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Paper, PaperProps, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import * as service from '../../services/axiosList';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { loadingState, SnackBarInfo, snackBarState } from '../../recoil/recoil';


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

export function ModifyCategory(props: {modifyCategoryNo: number, categoryDetail:service.CategoryForm, accountBookNo:number, reloadFunction: Function, modfiyClose: any}) {
    const imageList = require.context('/public/images/', false, /\.(png|jpe?g|svg)$/);
    const setLoading = useSetRecoilState<boolean>(loadingState);
    const [snackBarInfo, setSnackBarInfo] = useRecoilState<SnackBarInfo>(snackBarState);
    const [modifyCategoryForm, setModifyCategoryForm] = useState<service.CategoryForm>(props.categoryDetail);

    const handleSubmit = async (e:any) => {
        e.preventDefault();

        try{
            setLoading(true);
            const res = await service.patchCategoryModify(props.modifyCategoryNo, modifyCategoryForm);
            if(res.data.success){
                setSnackBarInfo({
                    ...snackBarInfo,
                    message: "카테고리가 수정되었습니다.",
                    severity:'success',
                    title: "성공",
                    open: true
                })
                props.modfiyClose();
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
                message: "서버오류입니다.",
                severity:'error',
                title: "실패",
                open: true
            })  
        }finally{
            setLoading(false);
            props.reloadFunction();
        }
        
    }

    const handleChangeFormValue = (e:any) => {

        if (e.target.name === "categoryName") {
            setModifyCategoryForm({
                ...modifyCategoryForm,
                categoryName: e.target.value
            })
        }

        if (e.target.name === "categoryDesc") {
            setModifyCategoryForm({
                ...modifyCategoryForm,
                categoryDesc: e.target.value
            })
        }

    }

    const handleChangeIcon = (
        event: React.MouseEvent<HTMLElement>,
        value: string,
      ) => {
        setModifyCategoryForm({
            ...modifyCategoryForm,
            categoryIcon: value
        });
      };
    

    return <>
        <Dialog
            open={true}
            onClose={props.modfiyClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"

        >
            <Box component='form' onSubmit={handleSubmit}>
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    카테고리 수정
                </DialogTitle>
                <DialogContent>
                    <FormControl margin='normal' fullWidth >
                        <TextField
                            label="카테고리명"
                            name="categoryName"
                            required
                            value={modifyCategoryForm.categoryName}
                            onChange={handleChangeFormValue}
                            sx={{
                                '& .MuiFormHelperText-root':{
                                    color: 'red'
                                }
                            }}
                        />
                    </FormControl>
                    <FormControl margin='normal' fullWidth >
                        <TextField
                            label="카테고리설명"
                            name="categoryDesc"
                            value={modifyCategoryForm.categoryDesc}
                            onChange={handleChangeFormValue}
                        />
                    </FormControl>
                    <Typography>아이콘 선택</Typography>
                        <ToggleButtonGroup
                            value={modifyCategoryForm.categoryIcon}
                            exclusive
                            size='small'
                            onChange={handleChangeIcon}
                            sx={{
                                '&.MuiToggleButtonGroup-root':{
                                    border: '1px solid rgba(0, 0, 0, 0.12)',
                                    borderRadius: 0,
                                    m: 0.5
                                },
                                flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}
                            >
                            {imageList.keys().map( (fileName) => (
                                <ToggleButton key={fileName} value={`/images${fileName.substring(1)}`}
                                sx={{
                                    '&.MuiToggleButton-root':{
                                        border: '1px solid rgba(0, 0, 0, 0.12)!important',
                                        borderRadius: 0,
                                        margin: '4px 4px 4px 4px'
                                    },
                                    '&.Mui-selected, &:hover, &.Mui-selected:hover': {
                                        backgroundColor: '#E6FFFB'
                                    }
                                }}>
                                <img alt={fileName.substring(1)} src={`/images${fileName.substring(1)}`} />
                                </ToggleButton>
                                ))}
                        </ToggleButtonGroup>

                </DialogContent>
                <DialogActions>
                    <Button type='submit'>확인</Button>
                    <Button onClick={props.modfiyClose}>
                        취소
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
                </>
}