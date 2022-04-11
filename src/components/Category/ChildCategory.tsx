import { Box, MenuItem, Modal, Paper, Select, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import * as service from '../../services/axiosList';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { loadingState, SnackBarInfo, snackBarState } from '../../recoil/recoil';
import MaterialTable, { Column } from 'material-table';



const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  width: {
    xs: '100%',
    md: '70%'
  }
};

interface CategoryDetail {
  categoryNo: number;
  categoryName: string;
  categoryDesc: string;
  categoryIcon: string | null;
}

interface ChildCategoryDetail {
  categoryNo: number;
  categoryName: string;
  categoryDesc: string;
  categoryIcon: any;
}

export default function ChildCategory(props: {
  accountRole: string,
  categoryNo: number,
  accountBookNo: number,
  isCategoryDetailOpen: boolean,
  handleCloseCategoryDetail: any
}) {


  function useWidth() {
    const theme = useTheme();
    const keys = [...theme.breakpoints.keys].reverse();
    return (
      keys.reduce((output: any, key: any) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const matches = useMediaQuery(theme.breakpoints.up(key));
        return !output && matches ? key : output;
      }, null) || "xs"
    );
  }
  const width = useWidth();
  const TITLE_TEXT_COLOR = '#3D4D42';


  const columns: Column<ChildCategoryDetail>[] = [
    { title: 'No', field: 'categoryNo', editable: 'never', sorting: false, hidden: true },
    {
      title: '카테고리명', field: 'categoryName',
      cellStyle:
        width === "xs" ? {
          width: "100%",
          display: "flex",
          flexDirection: "column",
        } : {},
      render: (data) => {
        if (width === "xs") {
          return (
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <Box sx={{
                display: 'table',
                width: '30%'
              }}><Box component={'span'} sx={{ display: 'table-cell', verticalAlign: 'middle', color: TITLE_TEXT_COLOR }}>카테고리명</Box></Box>
              <Box sx={{
                width: '70%',
                textAlign: 'right'
              }}>{data.categoryName}</Box>
            </Box>
          )
        } else {
          return data.categoryName
        }
      },
      editComponent: (props: any) => {
        if (width === "xs") {
          return (
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <Box sx={{
                display: 'table',
                width: '30%'
              }}><Box component={'span'} sx={{ display: 'table-cell', verticalAlign: 'middle', color: TITLE_TEXT_COLOR }}>카테고리명</Box></Box>
              <Box sx={{
                width: '70%',
                textAlign: 'right'
              }}>
                <TextField
                  type="text"
                  size='small'
                  value={props.value ? props.value : ''}
                  onChange={e => props.onChange(e.target.value)}
                />
              </Box>
            </Box>
          )
        } else {
          return (
            <TextField
              type="text"
              size='small'
              value={props.value ? props.value : ''}
              onChange={e => props.onChange(e.target.value)}
            />
          )
        }
      },
      validate: (rowData) => rowData['categoryName'] !== undefined && rowData.categoryName !== ""
    },
    {
      title: '카테고리설명', field: 'categoryDesc',
      render: (data) => {
        if (width === "xs") {
          return (
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <Box sx={{
                display: 'table',
                width: '30%'
              }}><Box component={'span'} sx={{ display: 'table-cell', verticalAlign: 'middle', color: TITLE_TEXT_COLOR }}>카테고리설명</Box></Box>
              <Box sx={{
                width: '70%',
                textAlign: 'right'
              }}>{data.categoryDesc}</Box>
            </Box>
          )
        } else {
          return data.categoryDesc
        }
      },
      cellStyle: width === "xs" ? {
        wordBreak: 'break-all',
        whiteSpace: 'normal',
        width: "100%",
        display: "flex",
        flexDirection: "column"
      } : {
        wordBreak: 'break-all',
        whiteSpace: 'normal',
      },
      editComponent: (props: any) => {
        if (width === "xs") {
          return (
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <Box sx={{
                display: 'table',
                width: '30%'
              }}><Box component={'span'} sx={{ display: 'table-cell', verticalAlign: 'middle', color: TITLE_TEXT_COLOR }}>카테고리설명</Box></Box>
              <Box sx={{
                width: '70%',
                textAlign: 'right'
              }}><TextField
              type="text"
              size='small'
              value={props.value ? props.value : ''}
              onChange={e => props.onChange(e.target.value)}
              sx={{
                fontSize: '10px'
              }}
            /></Box>
            </Box>
          )
        } else {
          return (
            <TextField
              type="text"
              size='small'
              value={props.value ? props.value : ''}
              onChange={e => props.onChange(e.target.value)}
              sx={{
                fontSize: '10px'
              }}
            />
          )
        }
      
    }},
    {
      title: '아이콘',
      field: 'categoryIcon',
      sorting: false,
      cellStyle: width === "xs" ? {
        width: "100%",
        display: "flex",
        flexDirection: "column"
      } : {},
      render: (rowData) => {
        if (width === "xs") {
          return (
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <Box sx={{ color: TITLE_TEXT_COLOR }}>아이콘</Box>
              <Box><img style={{ 'width': '20px' }} alt={"아이콘"} src={rowData.categoryIcon} /></Box>
            </Box>
          )
        } else {
          return <img style={{ 'width': '20px' }} alt={"아이콘"} src={rowData.categoryIcon} />
        }

      },
      editComponent: (props: any) => {

        if (width === "xs") {
          return (
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <Box sx={{ color: TITLE_TEXT_COLOR }}>아이콘</Box>
              <Box>
        <Select
          value={props.value || ''}
          size={'small'}
          defaultValue=""
          onChange={(event) => {
            props.onChange(event.target.value);
          }}
        >
          {require.context('/public/images/', false, /\.(png|jpe?g|svg)$/).keys().map((fileName) => (
            <MenuItem key={fileName} value={`/images${fileName.substring(1)}`}>
              <img style={{ 'width': '20px' }} alt={fileName.substring(1)} src={`/images${fileName.substring(1)}`} />
            </MenuItem>
          ))}
        </Select>
      </Box>
            </Box>
          )
        } else {
          return (
            <Select
              value={props.value || ''}
              size={'small'}
              defaultValue=""
              onChange={(event) => {
                props.onChange(event.target.value);
              }}
            >
              {require.context('/public/images/', false, /\.(png|jpe?g|svg)$/).keys().map((fileName) => (
                <MenuItem key={fileName} value={`/images${fileName.substring(1)}`}>
                  <img style={{ 'width': '20px' }} alt={fileName.substring(1)} src={`/images${fileName.substring(1)}`} />
                </MenuItem>
              ))}
            </Select>
          )
        }
        
          }
    }
  ];

  const initCategoryDetail = {
    categoryNo: 0,
    categoryName: "",
    categoryDesc: "",
    categoryIcon: "",
    childCategoryList: []
  }
  const [categoryDetail, setCategoryDetail] = useState<CategoryDetail>(initCategoryDetail);
  const [childCategoryList, setChildCategoryList] = useState<Array<ChildCategoryDetail>>([]);
  const [reload, setReload] = useState<boolean>(false);

  const [snackBarInfo, setSnackBarInfo] = useRecoilState<SnackBarInfo>(snackBarState);
  const setLoading = useSetRecoilState<boolean>(loadingState);

  useEffect(() => {
    const getCategoryDetail = async (categoryNo: number) => {
      try {
        const res = await service.getCategoryDetail(categoryNo);
        if (res.data.success) {
          const data = res.data.response;
          setCategoryDetail({
            categoryNo: data.categoryNo,
            categoryName: data.categoryName,
            categoryDesc: data.categoryDesc,
            categoryIcon: data.categoryIcon
          })

          let childCategoryList = [];
          for (let child of data.childCategoryList) {
            let childCategory: ChildCategoryDetail;
            childCategory = {
              categoryNo: child.categoryNo,
              categoryName: child.categoryName,
              categoryDesc: child.categoryDesc,
              categoryIcon: child.categoryIcon
            }
            childCategoryList.push(childCategory);
          }
          setChildCategoryList(childCategoryList);
        }
      } catch {
        setSnackBarInfo({
          ...snackBarInfo,
          message: "서버오류입니다.",
          severity: 'error',
          title: "실패",
          open: true
        })
      } finally {
        setLoading(false);
      }

    }

    getCategoryDetail(props.categoryNo);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [reload])


  /* OWNER 권한인 경우에만 추가/수정/삭제 가능하도록 */
  const authProps = {
    onRowAdd: (newData: any) =>
      new Promise<void>(async (resolve) => {
        const categoryAddForm: service.CategoryForm = {
          accountBookNo: props.accountBookNo,
          parentCategoryNo: props.categoryNo,
          categoryName: newData.categoryName,
          categoryDesc: newData.categoryDesc,
          categoryIcon: newData.categoryIcon
        }
        resolve();
        try {
          const res = await service.postCategoryAdd(categoryAddForm);
          if (res.data.success) {
            resolve(
              setSnackBarInfo({
                ...snackBarInfo,
                message: "등록되었습니다.",
                severity: 'success',
                title: "성공",
                open: true
              }))
          } else {
            setSnackBarInfo({
              ...snackBarInfo,
              message: res.data.apiError.message,
              severity: 'error',
              title: "실패",
              open: true
            });
          }
        } catch {
          setSnackBarInfo({
            ...snackBarInfo,
            message: "서버오류입니다.",
            severity: 'error',
            title: "실패",
            open: true
          });
        } finally {
          setReload(!reload);
        }

      }),
    onRowUpdate: (newData: any) =>
      new Promise<void>(async (resolve) => {
        let modifyForm: any = { ...newData };
        modifyForm.accountBookNo = props.accountBookNo;
        modifyForm.parentCategoryNo = props.categoryNo;
        delete modifyForm.categoryNo;
        resolve();
        try {
          const res = await service.patchCategoryModify(newData.categoryNo, modifyForm);
          if (res.data.success) {
            resolve(
              setSnackBarInfo({
                ...snackBarInfo,
                message: "수정되었습니다.",
                severity: 'success',
                title: "성공",
                open: true
              }))
          } else {
            setSnackBarInfo({
              ...snackBarInfo,
              message: res.data.apiError.message,
              severity: 'error',
              title: "실패",
              open: true
            });
          }
        } catch {
          setSnackBarInfo({
            ...snackBarInfo,
            message: "서버오류입니다.",
            severity: 'error',
            title: "실패",
            open: true
          });
        } finally {
          setReload(!reload);
        }

      }),
    onRowDelete: (oldData: any) =>
      new Promise<void>(async (resolve) => {
        resolve();
        try {
          const res = await service.deleteCategoryDelete(oldData.categoryNo, { accountBookNo: props.accountBookNo });
          if (res.data.success) {
            setSnackBarInfo({
              ...snackBarInfo,
              message: "삭제되었습니다.",
              severity: 'success',
              title: "성공",
              open: true
            })
          } else {
            setSnackBarInfo({
              ...snackBarInfo,
              message: res.data.apiError.message,
              severity: 'error',
              title: "실패",
              open: true
            });
          }
        } catch {
          setSnackBarInfo({
            ...snackBarInfo,
            message: "서버오류입니다.",
            severity: 'error',
            title: "실패",
            open: true
          });
        } finally {
          setReload(!reload);
        }
      }
      )
  }


  return (

    <Modal
      open={props.isCategoryDetailOpen}
      onClose={props.handleCloseCategoryDetail}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    > 
      <Box sx={style}>
        <div onClick={props.handleCloseCategoryDetail} style={{textAlign: 'right', cursor: 'pointer', color: '#FF6200'}}>닫기</div>
        <div style={{ height: 550, width: '100%' }}>
        <Typography variant="h6"   textAlign={'center'}>
          {categoryDetail.categoryName}
        </Typography>
        <Typography variant="subtitle1" textAlign={'center'} >
          {categoryDetail.categoryDesc}
        </Typography>
          <MaterialTable
            components={{
              Container: (props) => <Paper className="category-table" {...props} />
            }}
            columns={columns}
            data={childCategoryList}

            editable={props.accountRole === "OWNER" ? authProps : undefined}
            localization={{
              'body': {
                'addTooltip': '추가',
                'emptyDataSourceMessage': '카테고리를 추가해보세요',
                'deleteTooltip': '삭제',
                'editRow': {
                  'deleteText': <span style={{ color: 'red' }}>해당 카테고리를 삭제하시겠습니까?</span>,
                  'saveTooltip': '저장',
                  'cancelTooltip': '취소'
                }
              },
              'header': {
                'actions': '수정/삭제'
              }
            }}
            options={{
              'showTitle': false,
              'actionsCellStyle': width === "xs" ? {
                textAlign: 'right',
                width: '100%',
                border: 0,
                justifyContent: 'right'
              } : {},
              'actionsColumnIndex': 4,
              'paging': false,
              'maxBodyHeight': 430,
              'rowStyle': width === "xs" ? {
                color: '#8C8C8C',
                width: "98%",
                display: "flex",
                flexDirection: "column",
                border: '1px solid #a3cca3',
                marginBottom: '5px',
                marginLeft: 'auto',
                marginRight: 'auto',
                borderRadius: '10px'
              } : {},
              'headerStyle': width === "xs" ? {
                display: "none"
              } : {}
            }}
          />
        </div>
      </Box>
    </Modal>

  );
}


