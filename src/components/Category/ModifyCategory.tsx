import { Box, MenuItem, Modal, Paper, Select, TextField } from '@mui/material';
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
    md: '50%'
  }
};

interface CategoryDetail {
  categoryNo: number;
  categoryName: string;
  categoryDesc: string;
  categoryIcon: string | null;
}

interface ChildCategory {
  id: number;
  categoryNo: number;
  categoryName: string;
  categoryDesc: string;
  categoryIcon: any;
  action: any;
}


export default function ModifyCategory(props: {
  categoryNo: number,
  accountBookNo: number,
  isCategoryDetailOpen: boolean,
  handleCloseCategoryDetail: any
}) {

  const columns:Column<ChildCategory>[] = [
    { title: 'No', field: 'categoryNo', editable: 'never', sorting: false },
    {
      title: '카테고리명', field: 'categoryName', editComponent: (props:any) => (
        <TextField
          type="text"
          size='small'
          value={props.value ? props.value : ''}
          onChange={e => props.onChange(e.target.value)}
        />
      )
    },
    {
      title: '카테고리설명', field: 'categoryDesc', editComponent: (props:any) => (
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
    },
    {
      title: '아이콘',
      field: 'categoryIcon',
      sorting: false,
      editComponent: ({ value, onChange }) => (
        <Select
          value={value || ''}
          size={'small'}
          defaultValue=""
          onChange={(event) => {
            onChange(event.target.value);
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
  ];

  const initCategoryDetail = {
    categoryNo: 0,
    categoryName: "",
    categoryDesc: "",
    categoryIcon: "",
    childCategoryList: []
  }
  const [categoryDetail, setCategoryDetail] = useState<CategoryDetail>(initCategoryDetail);
  const [childCategoryList, setChildCategoryList] = useState<Array<ChildCategory>>([]);



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
            let childCategory: ChildCategory;
            childCategory = {
              id: child.categoryNo,
              categoryNo: child.categoryNo,
              categoryName: child.categoryName,
              categoryDesc: child.categoryDesc,
              categoryIcon: <img style={{ 'width': '20px' }} alt={"아이콘"} src={child.categoryIcon} />,
              action: '<div>ㅎㅇㅇ</div>'
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

  }, [])




  return (

    <Modal
      open={props.isCategoryDetailOpen}
      onClose={props.handleCloseCategoryDetail}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div style={{ height: 500, width: '100%' }}>
          <MaterialTable
            title="카테고리 목록"
            components={{
              Container: (props) => <Paper className="category-table" {...props} />
            }}
            columns={columns}
            data={childCategoryList}
            editable={{
              onRowAdd: newData =>
                new Promise(async (resolve, reject) => {
                  console.log(newData);
                  const categoryAddForm: service.CategoryAddForm = {
                    accountBookNo: props.accountBookNo,
                    parentCategoryNo: props.categoryNo,
                    categoryName: newData.categoryName,
                    categoryDesc: newData.categoryDesc,
                    categoryIcon: newData.categoryIcon
                  }
                  try {
                    const res = await service.postCategoryAdd(categoryAddForm);
                    if (res.data.success) {
                      newData.categoryIcon = <img style={{ 'width': '20px' }} alt={"아이콘"} src={newData.categoryIcon} />
                      console.log(newData);
                      setChildCategoryList([...childCategoryList, newData]);
                      resolve(
                        setSnackBarInfo({
                          ...snackBarInfo,
                          message: "등록되었습니다.",
                          severity: 'success',
                          title: "성공",
                          open: true
                        }))
                    }
                  } catch {
                    reject(
                      setSnackBarInfo({
                        ...snackBarInfo,
                        message: "서버오류입니다.",
                        severity: 'error',
                        title: "실패",
                        open: true
                      }));
                  }

                })
            }}
            options={{
              'actionsColumnIndex': 4,
              'paging': false,
              'maxBodyHeight': 430,
              'rowStyle': {
                fontSize: '10px'
              },
              'headerStyle': {
              }
            }}
          />
        </div>
      </Box>
    </Modal>

  );
}


