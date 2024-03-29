import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react"
import { useRecoilState, useSetRecoilState } from "recoil";
import { loadingState, SnackBarInfo, snackBarState } from "../../recoil/recoil";
import * as service from '../../services/axiosList';
import CommonModal from "../common/CommonModal";
import { AddCategory } from "./AddCategory";
import ChildCategory from "./ChildCategory";
import { ModifyCategory } from "./ModifyCategory";

interface CategoryDetailForm {
    categoryNo: number;
    isCategoryDetailOpen: boolean;
}


export default function Body(props: { setAccountBookName?: Function, accountBookNo: number }) {
    const setLoading = useSetRecoilState<boolean>(loadingState);
    const [accountRole, setAccountRole] = useState<string>("");
    const [categories, setCategories] = useState<any>([]);
    const [categoryDetail, setCategoryDetail] = useState<CategoryDetailForm>({
        categoryNo: 0,
        isCategoryDetailOpen: false
    });
    const [modifyCategoryNo, setModifyCategoryNo] = useState<number>(0);
    const [categoryModifyForm, setCategoryModifyForm] = useState<service.CategoryForm>({
        accountBookNo: props.accountBookNo,
        categoryName: "",
        categoryDesc: "",
        categoryIcon: ""
    });
    const [isModifyModalOpen, setIsModifyModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [deleteCategoryNo, setDeleteCategoryNo] = useState<number>(0);
    const [reload, setReload] = useState<boolean>(false);
    const [snackBarInfo, setSnackBarInfo] = useRecoilState<SnackBarInfo>(snackBarState);

    const changeReload = () => {
        setReload(!reload);
    }

    const handleModfiyClose = () => {
        setIsModifyModalOpen(false);
        setModifyCategoryNo(0);
        setCategoryModifyForm({
            accountBookNo: props.accountBookNo,
            categoryName: "",
            categoryDesc: "",
            categoryIcon: ""
        })
    }

    const getCategories: any = async (accountBookNo: number) => {
        try {
            setLoading(true);
            const res = await service.getCategories(accountBookNo);
            if (res.status === 200 && res.data.success) {
                setCategories(res.data.response.categories);
                setAccountRole(res.data.response.accountRole);
                if(props.setAccountBookName !== undefined){
                    props.setAccountBookName(res.data.response.accountBookName);
                }
            }
        } catch (err) {
            setSnackBarInfo({
                ...snackBarInfo,
                message: "서버에러입니다.",
                severity: 'error',
                title: "에러",
                open: true
            })
        } finally {
            setLoading(false);
        }

    }

    const handleCloseCategoryDetail = () => {
        setCategoryDetail({
            ...categoryDetail,
            categoryNo: 0,
            isCategoryDetailOpen: false
        })
    }
    const handleClickModifyCategory = (categoryNo:number, modifyCategory:service.CategoryForm) => {
        setModifyCategoryNo(categoryNo)
        setIsModifyModalOpen(true);
        setCategoryModifyForm(modifyCategory)
    }

    const handleClickCategoryDetail = (e:any, categoryNo: number) => {

        setCategoryDetail({
            categoryNo: categoryNo,
            isCategoryDetailOpen: true
        })
    }

    const handleClickCategoryDeleteOk = async (selectIndx:number) => {
        try{
            setLoading(true);
            const res = await service.deleteCategoryDelete(selectIndx, {accountBookNo: props.accountBookNo});
            if(res.data.success){
                setSnackBarInfo({
                    ...snackBarInfo,
                    message: "삭제되었습니다..",
                    severity: 'success',
                    title: "성공",
                    open: true
                })
            }else{
                setSnackBarInfo({
                    ...snackBarInfo,
                    message: res.data.apiError.message,
                    severity: 'error',
                    title: "에러",
                    open: true
                })
            }
        }catch{
            setSnackBarInfo({
                ...snackBarInfo,
                message: "서버에러입니다.",
                severity: 'error',
                title: "에러",
                open: true
            })
        }finally{
            setLoading(false);
            setIsDeleteModalOpen(false);
            setDeleteCategoryNo(0);
            setReload(!reload);
        }

    }

    const handleClickCategoryDelete = (categoryNo: number) => {
        setIsDeleteModalOpen(true);
        setDeleteCategoryNo(categoryNo);
    }

    const handleClickCategoryDeleteCancel = () => {
        setIsDeleteModalOpen(false);
        setDeleteCategoryNo(0);
    }



    useEffect(() => {
        getCategories(props.accountBookNo);
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [props.accountBookNo, reload]);

    return <>
    {accountRole === "OWNER" && <AddCategory accountBookNo={props.accountBookNo} categories={categories} reloadFunction={changeReload} />}
    {accountRole === "OWNER" && isModifyModalOpen && <ModifyCategory modifyCategoryNo={modifyCategoryNo} modfiyClose={handleModfiyClose} categoryDetail={categoryModifyForm} accountBookNo={props.accountBookNo} reloadFunction={changeReload} />}
    {accountRole === "OWNER" && isDeleteModalOpen && <CommonModal showModal={isDeleteModalOpen} selectedIndx={deleteCategoryNo} title="카테고리 삭제" contents="삭제시 하위 카테고리는 전부 삭제됩니다." clickOkHandle={handleClickCategoryDeleteOk} clickCancelHandle={handleClickCategoryDeleteCancel} />}
    {categoryDetail.isCategoryDetailOpen && <ChildCategory accountRole={accountRole} categoryNo={categoryDetail.categoryNo} accountBookNo={props.accountBookNo} isCategoryDetailOpen={categoryDetail.isCategoryDetailOpen} handleCloseCategoryDetail={handleCloseCategoryDetail} /> }
    <Grid container spacing={2} p={3} alignItems={'center'}>
        {categories.map((category: any) => (
            <Grid key={category.categoryNo} xs={4} sm={6} md={4} lg={3} xl={2} item sx={{
                textAlign: 'center',
                '& .MuiTypography-root':{
                    ['@media (max-width:899px)']:{ // eslint-disable-line no-useless-computed-key
                        fontSize: '0.8rem'
                    }
                }
                    
            }}  >
                <Card>
                    <CardActionArea  onClick={(e:any) => {handleClickCategoryDetail(e, category.categoryNo)}}>
                        <CardMedia
                            component="img"
                            sx={{
                                width: '30px',
                                m: 'auto',
                                mt: 2
                            }}
                            image={category.categoryIcon}
                            alt={category.categoryName}
                        />
                        <CardContent sx={{
                                      height: "150px"
                                            }}>
                            <Typography gutterBottom variant="h5" component="div">
                                {category.categoryName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {category.categoryDesc}
                            </Typography>
                            <Typography component="div" color="#CCBC99" sx={{position:'absolute', bottom: 0, top: '40%',left: '50%', transform: 'translate(-50%, 50%)'}}>
                            <div>하위 <span style={{color: 'yellowgreen'}}>{category.childCategories.length}</span> 개 </div>
                            <div>카테고리</div>
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions sx={{justifyContent: 'space-evenly'}}>
                        <Button onClick={() => handleClickModifyCategory(category.categoryNo, {
                            accountBookNo: props.accountBookNo,
                            categoryName: category.categoryName,
                            categoryDesc: category.categoryDesc,
                            categoryIcon: category.categoryIcon})} 
                            size="small"
                            color="success"
                            sx={{
                                minWidth: 0,
                                
                            }}
                          >수정</Button>
                        <Button onClick={() => handleClickCategoryDelete(category.categoryNo)}
                         size="small"
                         color="error"
                         sx={{
                            minWidth: 0,
                            color: 'red'
                        }}
                        >삭제</Button>
                       
                    </CardActions>
                </Card>
            </Grid>
        ))}
    </Grid>
    </>
}