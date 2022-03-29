import { Avatar, AvatarGroup, Box, Grid, Link, Typography } from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../../recoil/recoil";
import * as service from '../../services/axiosList';
import { AddAccountBook } from "./AddAccountBook";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import roleOwner from '../../assets/img/role-owner.png';
import { Link as RouterLink } from 'react-router-dom';



export function Body() {
    const setLoading = useSetRecoilState<boolean>(loadingState);
    const [reload, setReload] = useState<boolean>(false);
    const [accountBookList, setAccountBookList] = useState<any>([]);
    const [startDate, setStartDate] = React.useState<string | null>(
        moment().format("yyyy-MM-") + "01"
    );
    const [endDate, setEndDate] = React.useState<string | null>(
        moment().format("yyyy-MM-DD")
    );

    const changeReload = () => {
        setReload(!reload);
    }



    async function getAccountBookList() {
        try {
            setLoading(true);
            const res = await service.getAccountBookList(startDate, endDate);
            if (res.status === 200 && res.data.success) {
                setAccountBookList(res.data.response);
            }
        } catch (err) {
            alert("서버 오류입니다." + err);
        } finally {
            setLoading(false);
        }


    }

    React.useEffect(() => {


        getAccountBookList();
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [reload])
    return <>
        <AddAccountBook
            reloadFunction={changeReload} />
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
            {accountBookList.map((elevation: any) => (
                <Link key={elevation.accountBookNo} component={RouterLink} to={`/account/account-book/${elevation.accountBookNo}`}>
                <Grid container spacing={0} >
                    <Grid item xs={12} sx={{
                            boxShadow: "0px 2px 1px -1px rgba(0, 0, 0, 20%), 0px 1px 1px 0px rgba(0, 0, 0, 14%), 0px 1px 3px 0px rgba(0, 0, 0, 12%)",
                            borderRadius: "8px",
                            padding: "16px",
                            backgroundColor: elevation.backGroundColor,
                            color: elevation.color}}>
                        <Grid container spacing={0}>
                            <Grid item xs={11} sx={{fontSize: '20px'}}>
                                {elevation.accountRole==="OWNER" && <img src={roleOwner} alt={elevation.accountBookName} style={{width: '20px', marginRight: '5px'}} />}
                                {elevation.accountBookName}
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
                        <Grid container spacing={0} sx={{height: '27px'}}>
                            <Grid item xs={12}>
                                <Typography component="span" sx={{
                                    fontSize:'18px',
                                    opacity: '60%'
                                }}>
                                {elevation.accountBookDesc}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={0}>
                            <Grid item xs={4}>
                                <AvatarGroup max={4} sx={{justifyContent: 'left'}}>
                                    {elevation.joinedUserList.map((user: any) => (
                                        <Avatar key={user.userNo} alt={user.nickName} src={user.picture} />
                                    ))}
                                </AvatarGroup>
                            </Grid>
                            <Grid item xs={8} sx={{textAlign: 'right', lineHeight: '40px'}}>
                                 {elevation.joinedUserList.map((user: any, indx:number) => (
                                    <Typography key={user.userNo} component="span" sx={{verticalAlign: 'bottom'}}>
                                        {user.nickName}{indx < elevation.joinedUserList.length - 1? ', ': ''}
                                    </Typography>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                </Link>
            ))}
        </Box>
    </>
}