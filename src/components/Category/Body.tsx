import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react"
import { useRecoilState, useSetRecoilState } from "recoil";
import { loadingState, SnackBarInfo, snackBarState } from "../../recoil/recoil";
import * as service from '../../services/axiosList';


export default function Body(props: { setAccountBookName?: Function, accountBookNo: number }) {
    const setLoading = useSetRecoilState<boolean>(loadingState);
    const [categoryList, setCategoryList] = useState<any>([]);
    const [snackBarInfo, setSnackBarInfo] = useRecoilState<SnackBarInfo>(snackBarState);


    const getCategoryList: any = async (accountBookNo: number) => {
        try {
            setLoading(true);
            const res = await service.getCategoryList(accountBookNo);
            if (res.status === 200 && res.data.success) {
                setCategoryList(res.data.response);
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


    useEffect(() => {
        getCategoryList(props.accountBookNo);
    }, []);

    return <Grid container spacing={2} p={3} alignItems={'center'}>
        {categoryList.map((category: any) => (
            <Grid key={category.categoryNo} xs={4} sm={6} md={4} lg={3} xl={2} item sx={{
                textAlign: 'center',
                '& .MuiTypography-root':{
                    ['@media (max-width:899px)']:{ // eslint-disable-line no-useless-computed-key
                        fontSize: '0.8rem'
                    }
                }
                    
            }}  >
                <Card>
                    <CardActionArea>
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
                            <Typography component="div" color="#CCBC99" sx={{position:'absolute', bottom: 0, top: '50%',left: '50%', transform: 'translate(-50%, 50%)'}}>
                            <div>하위 <span style={{color: 'yellowgreen'}}>{category.childCategoryList.length}</span> 개 </div>
                            <div>카테고리</div>
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        ))}
    </Grid>
}