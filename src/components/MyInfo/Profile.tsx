import { Avatar, Box, Button, Card, CardActions, CardContent, Container, Divider, Grid, Typography } from '@mui/material';
import { useCallback, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import { Area, Point } from 'react-easy-crop/types';
import { useRecoilValue } from 'recoil';
import storage from '../../lib/storage';
import { authenticatedState } from '../../recoil/recoil';
import { getCroppedImg } from '../common/canvasUtils';
import * as service from '../../services/axiosList';
import { CountertopsOutlined } from '@mui/icons-material';

export function Profile(props: any) {
    const authenticated = useRecoilValue(authenticatedState);
    const profileUrl = process.env.REACT_APP_API_HOST + "/user/profile?picture=" + authenticated.data?.picture + "&access_token=" + storage.get('accessToken');
    //파일 미리볼 url을 저장해줄 state
    const [fileImage, setFileImage] = useState("");
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(2);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
      }, []);

    const postCroppedImage = useCallback(async () => {
        try {
          const croppedImage = await getCroppedImg( fileImage, croppedAreaPixels);


          console.log(croppedImage);

          var file = new File([croppedImage], "tempImg.jpeg");
          const formData = new FormData();
          formData.append("pictureFile", croppedImage);
          console.log(file);

          const res = await service.patchUserModify(formData);

          console.log(res);
        } catch (e) {
          console.error(e)
        }
      }, [fileImage, croppedAreaPixels])
    

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
                        <Grid
                            item
                            lg={8}
                            md={6}
                            xs={12}
                        >
                            <input
                                name="imgUpload"
                                type="file"
                                accept="image/*"
                                onChange={saveFileImage}
                            />
                            <Button
                                onClick={postCroppedImage}
                                variant="contained"
                                color="primary"
                                >
                                Show Result
                                </Button>

                        </Grid>
                    </Grid>
                </Container>
            </CardActions>
        </Card>
    );

}