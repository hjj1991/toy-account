import { Avatar, Box, Button, Card, CardActions, CardContent, Container, Divider, Grid, Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import { Point } from 'react-easy-crop/types';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { AuthenticatedInfo, authenticatedState, loadingState, SnackBarInfo, snackBarState } from '../../recoil/recoil';
import { DataURIToBlob, getCroppedImg } from '../common/canvasUtils';
import * as service from '../../services/axiosList';
import kakaoLogin from '../../assets/img/kakao_login.png'
import naverLogin from '../../assets/img/naver_login.png'

export function Profile(props: any) {
    const [authenticated, setAuthenticated] = useRecoilState<AuthenticatedInfo>(authenticatedState);
    const profileUrl = authenticated.data?.picture;
    const hiddenFileInput = useRef<HTMLInputElement>(null);    //파일 input 커스터마이징을 위한 Ref
    const [fileImage, setFileImage] = useState(""); //파일 미리볼 url을 저장해줄 state
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(2);
    const [snackBarInfo, setSnackBarInfo] = useRecoilState<SnackBarInfo>(snackBarState);
    const setLoading = useSetRecoilState<boolean>(loadingState);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, []);

    useEffect(() => {
        
        const receiveMessage = (e:any) =>{
            if (e.data.hasOwnProperty('returnData')) {
                const provider = e.data.returnData;
                switch (provider) {
                    case "NAVER":
                        setAuthenticated({
                            ...authenticated,
                            data: {
                                ...authenticated.data!,
                                provider: provider
                            }
                        })
                        break;
                    case "KAKAO":
                        setAuthenticated({
                            ...authenticated,
                            data: {
                                ...authenticated.data!,
                                provider: provider
                            }
                        })
                        break;
                }
            }
        }
        

        window.addEventListener("message", receiveMessage , false);
        return () => window.removeEventListener("message", receiveMessage);
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    });

    /* 이미지 크롭 */
    const postCroppedImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(fileImage, croppedAreaPixels);

            const formData = new FormData();
            formData.append("pictureFile", DataURIToBlob(croppedImage), "test.jpeg");
            onSubmitProfileImg(formData);

        } catch (e) {
            alert("변경에 실패하였습니다.");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [fileImage, croppedAreaPixels])

    const onSubmitProfileImg = async (formData: any) => {
        try {
            setLoading(true);
            const res = await service.patchUserProfileModify(formData);

            if (res.data.success) {
                setSnackBarInfo({
                    ...snackBarInfo,
                    message: "프로필 변경이 완료되었습니다.",
                    severity:'success',
                    title: "성공",
                    open: true
                })
                window.location.reload();
            }
        } catch {
            setSnackBarInfo({
                ...snackBarInfo,
                message: "프로필 변경이 실패하였습니다.",
                severity:'error',
                title: "실패",
                open: true
            })
        } finally {
            deleteFileImage();
            setLoading(false);
        }
    }

    const handleClickInputFileButton = () => {
        if (hiddenFileInput.current) {
            hiddenFileInput.current.click();
        }
    };

    // 파일 저장
    const saveFileImage = (e: any) => {
        setFileImage(URL.createObjectURL(e.target.files[0]));
    };

    // 파일 삭제
    const deleteFileImage = () => {
        URL.revokeObjectURL(fileImage);
        setFileImage("");
    };

    const handleSocialMapping = (e: any) => {
        // 랜덤이기 때문에 결과값이 다를 수 있음.
        let state = Math.random().toString(36).substr(2, 11); // "twozs5xfni"
        const redirectUri = process.env.REACT_APP_HOST + "/social/mapping";
        window.name = 'parentForm';
        if (e.currentTarget.id === "socialNaver") {
            window.open(`https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=sUyp7Y2KoOfRvdsAEdCc&redirect_uri=${redirectUri}?provider=NAVER&state=${state}`, "popup", "location=no,resizable=no");
        }
        if (e.currentTarget.id === "socialKakao") {
            window.open(`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=656c5afa5455de8f5ad9eb51e09e3720&redirect_uri=${redirectUri}?provider=KAKAO`, "popup", "location=no,resizable=no");
        }

    }

    return (
        <Card {...props}>
            <CardContent>
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <Avatar
                        src={profileUrl}
                        sx={{
                            height: 100,
                            mb: 2,
                            width: 100
                        }}
                    />
                    <Typography
                        color="textPrimary"
                        gutterBottom
                        variant="h3"
                    >
                        {authenticated.data!.nickName}
                    </Typography>
                    <Typography
                        color="textPrimary"
                        gutterBottom
                        variant="subtitle1"
                    >
                        {authenticated.data?.provider != null ? (
                            authenticated.data?.provider + "연동 회원"
                        ) : (
                            <>
                                SNS계정 연동하기
                                <Grid container
                                    direction="row"
                                    justifyContent="space-evenly"
                                    alignItems="center">

                                    <img src={naverLogin} id="socialNaver" style={{ cursor: 'pointer' }} onClick={handleSocialMapping} width={50} alt="네이버 로그인" />

                                    <img src={kakaoLogin} id="socialKakao" style={{ cursor: 'pointer' }} onClick={handleSocialMapping} width={50} alt="카카오 로그인" />

                                </Grid>
                            </>
                        )}
                    </Typography>
                    <Typography
                        color="textSecondary"
                        variant="body2"
                    >
                        가입일:{authenticated.data!.createdDate}
                    </Typography>
                    <Typography
                        color="textSecondary"
                        variant="body2"
                    >
                        최근로그인:{authenticated.data!.lastLoginDateTime}
                    </Typography>
                </Box>
            </CardContent>
            <Divider />
            <CardActions>
                <Container maxWidth="lg">
                    <Grid
                        container
                        spacing={0}
                    >
                        {fileImage !== "" ? (
                            <Grid
                                item
                                xs={12}
                                position="relative"
                                height={300}
                            >
                                <Cropper
                                    image={fileImage}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={3 / 3}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />

                            </Grid>
                        ) : null}

                        <Grid
                            container
                            item
                            xs={12}
                            spacing={0}
                            m={1}
                            justifyContent="space-evenly"
                        >

                            <Button 
                                color='success'
                                onClick={handleClickInputFileButton}>
                                이미지 선택
                            </Button>
                            <input
                                name="imgUpload"
                                ref={hiddenFileInput}
                                type="file"
                                accept="image/*"
                                onChange={saveFileImage}
                                style={{ display: 'none' }}
                            />
                            {fileImage !== "" ? (
                                <Button
                                    onClick={postCroppedImage}
                                    variant="contained"
                                    color="primary"
                                >
                                    프로필 변경
                                </Button>
                            ) : null}
                        </Grid>
                    </Grid>
                </Container>
            </CardActions>
        </Card>
    );

}