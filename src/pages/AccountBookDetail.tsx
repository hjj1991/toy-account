import { Box, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import Body from "../components/Purchase/Body";
import { menuState } from "../recoil/recoil";
import { Link as RouterLink } from 'react-router-dom';
import Header from "../components/layout/Header";


export function AccountBookDetail(props: any) {



    const setMenuState = useSetRecoilState(menuState);
    const [value, setValue] = useState(0);
    const params: any = useParams();
    const accountBookNo = params.accountBookNo;
    const [accountBookName, setAccountBookName] = useState<string>();
    useEffect(() => {
        setMenuState({ activeNav: props.match.path });
    });

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
        console.log(newValue);
        setValue(newValue);
    };


    function headerTabs() {

        return (
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <LinkTab label="내역"  to={`/account/account-book/${accountBookNo}`} />
                        <LinkTab label="달력"  to={`/account/account-book/${accountBookNo}/calendar`} />
                        <LinkTab label="카테고리 설정"to={`/account/account-book/${accountBookNo}/category`} />
                    </Tabs>
                </Box>
         
        )
    }



    return <>
        <Header headerTitle={accountBookName}  headerTab={headerTabs} />
        <Body
            setAccountBookName={setAccountBookName}
            accountBookNo={Number(accountBookNo)}
        />
    </>
}