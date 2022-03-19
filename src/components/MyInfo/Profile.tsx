import { Avatar, Box, Button, Card, CardActions, CardContent, Container, Divider, Grid, Typography } from '@mui/material';
import { useCallback, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import { Point } from 'react-easy-crop/types';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import storage from '../../lib/storage';
import { authenticatedState, loadingState } from '../../recoil/recoil';
import { DataURIToBlob, getCroppedImg } from '../common/canvasUtils';
import * as service from '../../services/axiosList';

export function Profile(props: any) {
    const authenticated = useRecoilValue(authenticatedState);
    const profileUrl = process.env.REACT_APP_API_HOST + "/user/profile?picture=" + authenticated.data?.picture + "&access_token=" + storage.get('accessToken');
    const hiddenFileInput = useRef<HTMLInputElement>(null);    //파일 input 커스터마이징을 위한 Ref
    const [fileImage, setFileImage] = useState(""); //파일 미리볼 url을 저장해줄 state
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(2);
    const setLoading = useSetRecoilState<boolean>(loadingState);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, []);

    const postCroppedImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(fileImage, croppedAreaPixels);

            const formData = new FormData();
            formData.append("pictureFile", DataURIToBlob(croppedImage), "test.jpeg");
            onSubmitProfileImg(formData);



        } catch (e) {
            alert("변경에 실패하였습니다.");
        }
    }, [fileImage, croppedAreaPixels])

    const onSubmitProfileImg = async (formData: any) => {
        try {
            setLoading(true);
            const res = await service.patchUserModify(formData);

            if (res.data.success) {
                alert("변경에 성공하였습니다.");
            }
        } catch {
            alert("변경에 실패하였습니다.");
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
                            height: 64,
                            mb: 2,
                            width: 64
                        }}
                    />
                    <Typography
                        color="textPrimary"
                        gutterBottom
                        variant="h5"
                    >
                        {authenticated.data!.nickName}
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
                            xs={12}
                            spacing={0}
                            justifyContent="space-evenly"
                        >
                         
                                <Button onClick={handleClickInputFileButton}>
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
                                ):null}
                         
                           
                        </Grid>
                    </Grid>
                </Container>
            </CardActions>
        </Card>
    );

}