import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import * as service from '../services/axiosList';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import SignUpImg from '../assets/img/signup.png'
import { useRecoilState, useSetRecoilState } from 'recoil';
import { loadingState, SnackBarInfo, snackBarState } from '../recoil/recoil';
import { Checkbox, Chip, FormControlLabel } from '@mui/material';
import kakaoLogin from '../assets/img/kakao_login.png'
import naverLogin from '../assets/img/naver_login.png'
import { Navigate } from 'react-router-dom';


const getCheckExistsUserId = (userId: string) => {
  return service.getCheckUserIdDuplicate(userId)
    .then((res) => {
      return res.data.success;
    }).catch((error) => {
      return false;
    });
}

const getCheckExistsNickName = (nickName: string) => {
  return service.getCheckNickNameDuplicate(nickName, false)
    .then((res) => {
      return res.data.success;
    }).catch((error) => {
      return false;
    });
}

export interface signUpValidationForm {
  userIdCheckMessage: string,
  userIdCheck: boolean,
  userIdFontColor: string,
  userPwCheckMessage: string,
  userPwCheck: boolean,
  userPwFontColor: string,
  userPw2Check: boolean,
  userPw2CheckMessage?: string,
  userPw2FontColor?: string,
  nickNameCheck: boolean,
  nickNameCheckMessage: string,
  nickNameFontColor: string
}




export default function SignUp() {
  const [signUpValidationForm, setSignUpValidationForm] = React.useState<signUpValidationForm>({
    userIdCheckMessage: "※ 5~20자의 영문 소문자, 숫자만 사용 가능합니다.",
    userIdCheck: false,
    userIdFontColor: "red",
    userPwCheckMessage: "※ 비밀번호는 영문 숫자 조합 7 ~ 14자리 이상입니다.",
    userPwCheck: false,
    userPwFontColor: "red",
    userPw2Check: false,
    nickNameCheck: false,
    nickNameCheckMessage: "※ 공백제외 한글, 영문, 숫자 2 ~ 10자로 입력해주세요.",
    nickNameFontColor: "red"
  });
  const [signUpForm, setSignUpForm] = React.useState<service.SignUpForm>({
    userId: "",
    userPw: "",
    userEmail: "",
    nickName: ""
  });
  const [snackBarInfo, setSnackBarInfo] = useRecoilState<SnackBarInfo>(snackBarState);
  const setLoading = useSetRecoilState<boolean>(loadingState);
  const [userPw2, setUserPw2] = React.useState<string>("");
  const [signUpOk, setSignUpOk] = React.useState<boolean>(false);
  const [checked, setChecked] = React.useState([false, false]);
  const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, event.target.checked]);
  };

  const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, checked[1]]);
  };

  const handleChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([checked[0], event.target.checked]);
  };

  const serviceTerms = (
    <>
      <FormControlLabel
        label="전체 동의"
        control={
          <Checkbox
            checked={checked[0] && checked[1]}
            indeterminate={checked[0] !== checked[1]}
            onChange={handleChange1}
          />
        }
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
        <FormControlLabel
          label={
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>[필수] 개인회원 약관에 동의</span>
              <Link href='/policy' target="_blank" rel="noopener noreferrer" sx={{ display: 'contents' }}>상세보기</Link>
            </div>}
          control={<Checkbox checked={checked[0]} onChange={handleChange2} />}
          sx={{
            '& .MuiTypography-root': {
              width: '100%'
            }
          }}
        />
        <FormControlLabel
          label={
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>[필수] 개인정보 수집 및 이용에 동의</span>
              <Link href='/privacy' target="_blank" rel="noopener noreferrer" sx={{ display: 'contents' }}>상세보기</Link>
            </div>}
          sx={{
            '& .MuiTypography-root': {
              width: '100%'
            }
          }}
          control={<Checkbox checked={checked[1]} onChange={handleChange3} />}
        />
      </Box>
    </>
  );

  React.useEffect(() => {
    const receiveMessage = (e: any) => {
      if (e.data.hasOwnProperty('success') && e.data.success) {
        if (e.data.success) {
          setSnackBarInfo({
            ...snackBarInfo,
            message: "회원가입에 성공하였습니다.",
            severity: 'success',
            title: "환영합니다.",
            open: true
          })
          setSignUpOk(true);
        } else {
          setSnackBarInfo({
            ...snackBarInfo,
            message: e.data.message,
            severity: 'error',
            title: "실패",
            open: true
          })
        }
      }
    }

    window.addEventListener("message", receiveMessage, false);
    return () => window.removeEventListener("message", receiveMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  })

  const handleSocialSignUp = (e: any) => {
    if (!checked[0] || !checked[1]) {
      setSnackBarInfo({
        ...snackBarInfo,
        message: "약관에 동의해주세요.",
        severity: 'error',
        title: "경고",
        open: true
      })
      return;
    }
    // 랜덤이기 때문에 결과값이 다를 수 있음.
    let state = Math.random().toString(36).substr(2, 11); // "twozs5xfni"
    const redirectUri = process.env.REACT_APP_HOST + "/social/signup";
    window.name = 'parentForm';
    if (e.currentTarget.id === "socialNaver") {
      window.open(`https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=sUyp7Y2KoOfRvdsAEdCc&redirect_uri=${redirectUri}?provider=NAVER&state=${state}`, "popup", "location=no,resizable=no");
    }
    if (e.currentTarget.id === "socialKakao") {
      window.open(`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=656c5afa5455de8f5ad9eb51e09e3720&redirect_uri=${redirectUri}?provider=KAKAO&state=${state}`, "popup", "location=no,resizable=no");
    }

  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!checked[0] || !checked[1]) {
      setSnackBarInfo({
        ...snackBarInfo,
        message: "약관에 동의해주세요.",
        severity: 'error',
        title: "경고",
        open: true
      })
      return;
    }

    const { nickNameCheck, userPwCheck, userPw2Check, userIdCheck } = signUpValidationForm;
    if (nickNameCheck && userPwCheck && userPw2Check && userIdCheck) {
      try {
        setLoading(true);
        const res = await service.postSignUp(signUpForm);

        if (res.data.success) {
          setSnackBarInfo({
            ...snackBarInfo,
            message: "회원가입이 완료되었습니다.",
            severity: 'success',
            title: "성공",
            open: true
          })
          setSignUpOk(true);
        } else {
          setSnackBarInfo({
            ...snackBarInfo,
            message: res.data.apiError.message,
            severity: 'error',
            title: "실패",
            open: true
          })

        }
      } catch {
        setSnackBarInfo({
          ...snackBarInfo,
          message: "회원가입에 실패하였습니다.",
          severity: 'error',
          title: "실패",
          open: true
        })
      } finally {
        setLoading(false);
      }
    } else {
      setSnackBarInfo({
        ...snackBarInfo,
        message: "양식에 맞게 작성해주세요.",
        severity: 'error',
        title: "실패",
        open: true
      })
    }
  };

  const handleChangeCheckValue = async (event: any) => {
    let targetId = event.currentTarget.id;
    let re = /^[a-zA-Z0-9]{5,20}$/     // 아이디와 패스워드가 적합한지 검사할 정규식

    if (targetId === "userId") {
      if (re.test(event.currentTarget.value) && event.type === "blur") {
        if (await getCheckExistsUserId(event.currentTarget.value)) {
          setSignUpValidationForm({
            ...signUpValidationForm,
            userIdCheckMessage: "사용가능한 아이디입니다.",
            userIdFontColor: "green",
            userIdCheck: true
          });
        } else {
          setSignUpValidationForm({
            ...signUpValidationForm,
            userIdCheckMessage: "※ 해당 ID가 존재합니다.",
            userIdFontColor: "red",
            userIdCheck: false
          });
        }
      } else {
        setSignUpValidationForm({
          ...signUpValidationForm,
          userIdCheckMessage: "※ 5~20자의 영문 소문자, 숫자만 사용 가능합니다.",
          userIdFontColor: "red",
          userIdCheck: false
        })
      }
      if (event.type !== "blur") {
        setSignUpForm({
          ...signUpForm,
          userId: event.currentTarget.value
        })
      }

    }
    if (targetId === "userEmail") {
      setSignUpForm({
        ...signUpForm,
        userEmail: event.currentTarget.value
      })
    }

    if (targetId === "userPw") {
      let reg1 = /^[a-zA-Z0-9]{7,14}$/;    // a-z 0-9 중에 7자리 부터 14자리만 허용 한다는 뜻이구요
      let reg2 = /[a-z]/g;
      let reg3 = /[0-9]/g;


      if (reg1.test(event.currentTarget.value) && reg2.test(event.currentTarget.value) && reg3.test(event.currentTarget.value)) {
        setSignUpValidationForm({
          ...signUpValidationForm,
          userPwCheckMessage: "사용가능한 비밀번호입니다.",
          userPwFontColor: "green",
          userPwCheck: true
        });
      } else {
        setSignUpValidationForm({
          ...signUpValidationForm,
          userPwCheckMessage: "※ 비밀번호는 영문 숫자 조합 7 ~ 14자리 이상입니다.",
          userPwFontColor: "red",
          userPwCheck: false
        });
      }
      setSignUpForm({
        ...signUpForm,
        userPw: event.currentTarget.value
      })
    }
    if (targetId === "userPw2") {
      setUserPw2(event.currentTarget.value);
      if (signUpForm.userPw === event.currentTarget.value) {
        setSignUpValidationForm({
          ...signUpValidationForm,
          userPw2CheckMessage: "비밀번호가 일치합니다.",
          userPw2FontColor: "green",
          userPw2Check: true
        });
      } else {
        setSignUpValidationForm({
          ...signUpValidationForm,
          userPw2CheckMessage: "※ 비밀번호가 일치하지 않습니다.",
          userPw2FontColor: "red",
          userPw2Check: false
        });
      }
    }

    if (targetId === "nickName") {
      let pattern = /([^가-힣\x20^a-z^A-Z^0-9])/i;
      let blank_pattern = /[\s]/g;
      let name = event.currentTarget.value;

      if ((!pattern.test(name)) && name.length >= 2 && name.length <= 10 && !blank_pattern.test(name) && event.type === "blur") {
        if (await getCheckExistsNickName(event.currentTarget.value)) {
          setSignUpValidationForm({
            ...signUpValidationForm,
            nickNameCheck: true,
            nickNameFontColor: "green",
            nickNameCheckMessage: "사용가능합니다.",
          });
        } else {
          setSignUpValidationForm({
            ...signUpValidationForm,
            nickNameCheckMessage: "※ 해당 닉네임이 존재합니다.",
            nickNameFontColor: "red",
            nickNameCheck: false
          });
        }

      } else {
        setSignUpValidationForm({
          ...signUpValidationForm,
          nickNameCheck: false,
          nickNameFontColor: "red",
          nickNameCheckMessage: "※ 공백제외 한글, 영문, 숫자 2 ~ 10자로 입력해주세요.",
        });
      }
      if (event.type !== "blur") {
        setSignUpForm({
          ...signUpForm,
          nickName: event.currentTarget.value
        })
      }

    }


  }

  return signUpOk ?
    (
      <Navigate replace to="/" />
    ) : (
      <Container component="main" maxWidth="xs">
        <div style={{ textAlign: 'center' }}>
          <img src={SignUpImg} alt="회원가입" />
        </div>
        <Chip variant="filled" label={"회원가입"} sx={{ fontSize: '30px', height: '50px', backgroundColor: '#fdcb02', width: '100%', color: '#fff' }} />
        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            서비스 약관
          </Typography>
        </Divider>
        {serviceTerms}
        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            간편 회원가입
          </Typography>
        </Divider>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <img src={naverLogin} id="socialNaver" style={{ cursor: 'pointer' }} onClick={handleSocialSignUp} width={50} alt="네이버 로그인" />
          </Grid>
          <Grid item>
            <img src={kakaoLogin} id="socialKakao" style={{ cursor: 'pointer' }} onClick={handleSocialSignUp} width={50} alt="카카오 로그인" />
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            OR
          </Typography>
        </Divider>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box component="form" noValidate={false} onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="userId"
                  required
                  fullWidth
                  id="userId"
                  label="아이디"
                  onBlur={handleChangeCheckValue}
                  onChange={handleChangeCheckValue}
                  value={signUpForm.userId}
                  helperText={signUpValidationForm.userIdCheckMessage}
                  sx={{
                    '& p': {
                      color: signUpValidationForm.userIdFontColor
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} >
                <TextField
                  required
                  fullWidth
                  id="nickName"
                  label="닉네임"
                  name="nickName"
                  onBlur={handleChangeCheckValue}
                  onChange={handleChangeCheckValue}
                  value={signUpForm.nickName}
                  helperText={signUpValidationForm.nickNameCheckMessage}
                  sx={{
                    '& p': {
                      color: signUpValidationForm.nickNameFontColor
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="userEmail"
                  label="이메일 주소"
                  name="userEmail"
                  type={'email'}
                  onChange={handleChangeCheckValue}
                  value={signUpForm.userEmail}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="userPw"
                  label="암호"
                  type="password"
                  id="userPw"
                  autoComplete="new-password"
                  onChange={handleChangeCheckValue}
                  value={signUpForm.userPw}
                  helperText={signUpValidationForm.userPwCheckMessage}
                  sx={{
                    '& p': {
                      color: signUpValidationForm.userPwFontColor
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="userPw2"
                  label="암호확인"
                  type="password"
                  id="userPw2"
                  autoComplete="new-password"
                  onChange={handleChangeCheckValue}
                  value={userPw2}
                  helperText={signUpValidationForm.userPw2CheckMessage}
                  sx={{
                    '& p': {
                      color: signUpValidationForm.userPw2FontColor
                    }
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3, mb: 2, backgroundColor: '#fdcb02',
                '&:hover': {
                  backgroundColor: '#fdae02',
                  borderColor: '#0062cc',
                  boxShadow: 'none',
                },
                '&:active': {
                  boxShadow: 'none',
                  backgroundColor: '#fdcb02',
                  borderColor: '#005cbf',
                },
                '&:focus': {
                  boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
                }
              }}
            >
              회원가입
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  이미 회원이신가요? 로그인하러가기
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    )
}