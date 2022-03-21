import gitImg from '../../assets/img/github_icon.png';
import emailImg from '../../assets/img/email.png';
import { Typography } from '@mui/material';
export function Bottom() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
        <div>
        <a target="_blank" rel="noopener noreferrer" href="https://github.com/hjj1991"><img style={{width: '40px', marginRight: '5px'}} src={gitImg} alt="github" /></a>
        <a href='mailto:hjj19911@naver.com'><img width="40px" src={emailImg} alt="img" /></a>
        </div>
        <div>
            <a target="_blank" rel="noopener noreferrer" href='/policy'>[이용약관]</a>
            <a target="_blank" rel="noopener noreferrer" href='/privacy'>[개인정보취급방침]</a>
        </div>
        {'Copyright © 뜨끔한 가계부 All rights reserved.'}
    </Typography>
    )
}