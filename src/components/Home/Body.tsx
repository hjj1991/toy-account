import { Box, Grid, Link, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { loadingState } from '../../recoil/recoil';
import * as service from '../../services/axiosList';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

interface MainTop10TableProps {
    korCoNm: string;
    finPrdtNm: string;
    intrRate: number;
    intrRate2: number;
}


function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
}

function MainTop10Table({mainTop10Arr}:{mainTop10Arr:Array<MainTop10TableProps>}){

    return (
        <table className='basic-table' style={{fontSize: '0.9em', width: '100%'}}>
            <thead>
                <tr>
                    <th style={{width: '30%'}}>은행</th>
                    <th style={{width: '66%'}}>상품명</th>
                    <th style={{width: '2%'}}>기본</th>
                    <th style={{width: '2%'}}>우대</th>
                </tr>
            </thead>
            <tbody>
                {mainTop10Arr.map((mainTop10, indx) => {
                return (
                    <tr key={indx}>
                        <td>{mainTop10.korCoNm}</td>
                        <td style={{textOverflow: 'ellipsis'}}>{mainTop10.finPrdtNm}</td>
                        <td>{mainTop10.intrRate}%</td>
                        <td>{mainTop10.intrRate2}%</td>
                    </tr>
                    )
                })}
            </tbody>
        </table>
    )

}


export function Body() {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'));
    const [data, setData] = useState<{deposits:Array<MainTop10TableProps>, savings:Array<MainTop10TableProps>}>({deposits:[], savings:[]});
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const setLoading = useSetRecoilState<boolean>(loadingState);


    async function getHome(){
        try{
            setLoading(true);
            const res = await service.getHome();

            if (res.status === 200 && res.data.success) {
                setData(res.data.response);
            }
        }catch (err) {
            alert("서버 오류입니다." + err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() =>{

        getHome();
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, []);



    /* 반응형 사이즈 md(Width: 900px) 이하인 경우 Render */
    if(!matches){
        const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
            setSelectedTab(newValue);
          };

        return (
        <>      
            <Tabs value={selectedTab} onChange={handleChangeTab} aria-label="basic tabs example"
            sx={{
                button: {
                    '&.Mui-selected': {
                        fontWeight: 'bold',
                        color: 'rgba(255, 255, 255, 0.87)'
                    }
                }
            }}>
                <Tab label="적금Top10" />
                <Tab label="예금Top10" />
            </Tabs>
            <TabPanel value={selectedTab} index={0}>
            <Link component={RouterLink} to="/saving" sx={{ color: '#A69480', float: 'right', borderBottom: 'groove'}}><img src="/images/move.png" style={{ verticalAlign: 'middle', width: '30px' }}alt="move" />전체보기</Link>
                <MainTop10Table mainTop10Arr={data.savings} />
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
            <Link component={RouterLink} to="/deposit" sx={{ color: '#A69480', float: 'right', borderBottom: 'groove'}}><img src="/images/move.png" style={{ verticalAlign: 'middle', width: '30px' }}alt="move" />전체보기</Link>
                <MainTop10Table mainTop10Arr={data.deposits} />
            </TabPanel>
        </>
    )
    }else{
        return (
        <>
        <Grid container p={1} spacing={2}>
            <Grid item xs={6}>
                <div>
                    <div style={{float: 'left', fontSize: '28px', fontWeight: 'bold'}}>적금 Top10</div>
                    <Link component={RouterLink} to="/saving" sx={{ color: '#A69480', float: 'right', borderBottom: 'groove'}}><img src="/images/move.png" style={{ verticalAlign: 'middle', width: '30px' }}alt="move" />전체보기</Link>
                </div>
                <MainTop10Table mainTop10Arr={data.savings} />
            </Grid>
            <Grid item xs={6}>
                <div>
                    <div style={{float: 'left', fontSize: '28px', fontWeight: 'bold'}}>예금 Top10</div>
                    <Link component={RouterLink} to="/deposit" sx={{ color: '#A69480', float: 'right', borderBottom: 'groove'}}><img src="/images/move.png" style={{ verticalAlign: 'middle', width: '30px' }}alt="move" />전체보기</Link>
                </div>
                <MainTop10Table mainTop10Arr={data.deposits} />
            </Grid>
        </Grid>
        </>
        )
    }

    
}



