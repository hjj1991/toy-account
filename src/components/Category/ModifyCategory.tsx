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

interface CategoryDetail{
    categoryNo: number;
    categoryName: string;
    categoryDesc: string;
    categoryIcon: string | null;
}

interface ChildCategory{
    id: number;
    categoryNo: number;
    categoryName: string;
    categoryDesc: string;
    categoryIcon: string | null;
    action: any;
}


export default function ModifyCategory(props:{
    categoryNo: number,
    isCategoryDetailOpen: boolean,
    handleCloseCategoryDetail: any
}) {
  const imageList = require.context('/public/images/', false, /\.(png|jpe?g|svg)$/);
  interface LooseObject {
    [key: string]: any;
}
  let iconObject:LooseObject = {};
  imageList.keys().map((fileName) => {
    iconObject[`/images${fileName.substring(1)}`] = <img  style={{'width': '20px'}} alt={fileName.substring(1)} src={`/images${fileName.substring(1)}`} />;
  })

  const [columns, setColumns] = useState<Column<any>[]>([
    { title: 'No', field: 'categoryNo', editable: 'never',  sorting: false},
    { title: '카테고리명', field: 'categoryName', editComponent: (props) => (
      <TextField
          type="text"
          size='small'
          value={props.value ? props.value : ''}
          onChange={e => props.onChange(e.target.value)}
      />
  ) },
    { title: '카테고리설명', field: 'categoryDesc', editComponent: (props) => (
      <TextField
          type="text"
          size='small'
          value={props.value ? props.value : ''}
          onChange={e => props.onChange(e.target.value)}
          sx={{
            fontSize: '10px'
          }}
      />
  )  },
    {
      title: '아이콘',
      field: 'categoryIcon',
      // lookup: iconObject,
      sorting: false,
      editComponent: ({ value, onChange, rowData }) => (
        <Select
           value={value}
           size={'small'}
           onChange={(event) => {
              onChange(event.target.value);
           }}
        >
           {imageList.keys().map((fileName) =>  (
                <MenuItem key={fileName} value={fileName}>
                   <img  style={{'width': '20px'}} alt={fileName.substring(1)} src={`/images${fileName.substring(1)}`} />
                </MenuItem>
            ))}
        </Select>
   )
    }
  ]);

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
            try{
                const res = await service.getCategoryDetail(categoryNo);
                if(res.data.success){
                    const data = res.data.response;
                  setCategoryDetail({
                      categoryNo: data.categoryNo,
                      categoryName: data.categoryName,
                      categoryDesc: data.categoryDesc,
                      categoryIcon: data.categoryIcon
                  })

                  let childCategoryList = [];
                  for(let child of data.childCategoryList){
                    let childCategory:ChildCategory;
                    childCategory = {
                        id: child.categoryNo,
                        categoryNo: child.categoryNo,
                        categoryName: child.categoryName,
                        categoryDesc: child.categoryDesc,
                        categoryIcon: child.categoryIcon,
                        action: '<div>ㅎㅇㅇ</div>'
                    }
                    childCategoryList.push(childCategory);
                  }
                  setChildCategoryList(childCategoryList);
                }
            }catch{
                setSnackBarInfo({
                    ...snackBarInfo,
                    message: "서버오류입니다.",
                    severity:'error',
                    title: "실패",
                    open: true
                })  
            }finally{
                setLoading(false);
            }
            
        }

        getCategoryDetail(props.categoryNo);

    },[])

    


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
        Container: (props) => <Paper className="category-table" {...props}/>
            }}
      columns={columns}
      data={childCategoryList}
      editable={{
        onRowAdd: newData =>
          new Promise((resolve, reject) => {
              setChildCategoryList([...childCategoryList, newData]);

          })}}
      options={{
        'actionsColumnIndex': 4,
        'paging': false,
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


