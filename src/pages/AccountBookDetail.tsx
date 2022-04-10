import { Box, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import PurchaseBody from "../components/Purchase/Body";
import { menuState } from "../recoil/recoil";
import { Link as RouterLink } from 'react-router-dom';
import Header from "../components/layout/Header";
import CategoryBody from "../components/Category/Body";


export function AccountBookDetail() {
    let type; 
    const location = useLocation();
    const setMenuState = useSetRecoilState(menuState);
    const [value, setValue] = useState(0);
    const params: any = useParams();
    const accountBookNo = params.accountBookNo;
    const [accountBookName, setAccountBookName] = useState<string>();
    useEffect(() => {
        setMenuState({activeNav:location.pathname });
        // eslint-disable-next-line react-hooks/exhaustive-deps 
        switch(params.type){
            case "calendar":
                setValue(1);
                break;
            case "category":
                setValue(2);
                break;
            default:
                setValue(0); 
                break;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, []);


    switch(params.type){
        case "calendar":
            type = "CALENDAR";
            break;
        case "category":
            type = "CATEGORY";
            break;
        default:
            type = "default";         
            break;
    }


    function LinkTab(props: any) {
        return (
          <Tab
            component={RouterLink}
            onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
            //   event.preventDefault();
            }}
            {...props}
          />
        );
      }

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    
        setValue(newValue);
    };

    function headerTabs() {

        return (
                <Box sx={{ borderBottom: 1, borderColor: 'divider','&.MuiBox-root': {borderBottom: 0}, }}>
                    <Tabs value={value} onChange={handleChange} sx={{
                        '& .MuiButtonBase-root': {color: '#E6FFE6'},
                        '& .Mui-selected': {color: '#804D66!important'}
                        }}>
                        <LinkTab label="내역"  to={`/account/account-book/${accountBookNo}`} />
                        <LinkTab label="달력"  to={`/account/account-book/${accountBookNo}/calendar`} />
                        <LinkTab label="카테고리"to={`/account/account-book/${accountBookNo}/category`} />
                    </Tabs>
                </Box>
         
        )
    }



    return <>
        <Header headerTitle={accountBookName}  headerTab={headerTabs} />
        {
            {
                default:(
                    <PurchaseBody
                        setAccountBookName={setAccountBookName}
                        accountBookNo={Number(accountBookNo)}
                    />
                        ),
                CATEGORY:(
                    <CategoryBody
                        setAccountBookName={setAccountBookName}
                        accountBookNo={Number(accountBookNo)}
                     />
                    )
            }[type]
        }

    </>
}