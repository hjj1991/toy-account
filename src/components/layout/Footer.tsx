import gitImg from '../../assets/img/github_icon.png';
import emailImg from '../../assets/img/email.png';
import { Link, Typography } from '@mui/material';
export function Footer() {
    return (
        <Typography variant="body2" color="textSecondary" align="center" component="div">
            <div>
                <Link target="_blank" rel="noopener noreferrer" href="https://github.com/hjj1991"><img style={{ width: '40px', marginRight: '5px' }} src={gitImg} alt="github" /></Link>
                <Link href='mailto:hjj19911@naver.com'><img width="40px" src={emailImg} alt="img" /></Link>
            </div>
            <div>
                <Link target="_blank" rel="noopener noreferrer" href='/policy' style={{ marginRight: '5px' }}>[이용약관]</Link>
                <Link target="_blank" rel="noopener noreferrer" href='/privacy'>[개인정보취급방침]</Link>
            </div>
            <div>{'Copyright © 뜨끔한 가계부 All rights reserved.'}</div>
        </Typography>
    )
}