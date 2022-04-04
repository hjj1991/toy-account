import { GridRowId, GridRowParams, MuiBaseEvent, MuiEvent, useGridApiContext, useGridApiRef} from '@mui/x-data-grid';
import { Box, Button, Modal } from '@mui/material';
import { useEffect, useState } from 'react';
import * as service from '../../services/axiosList';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { loadingState, SnackBarInfo, snackBarState } from '../../recoil/recoil';
import MaterialTable from 'material-table';



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
    iconObject[`/images${fileName.substring(1)}`] = <img alt={fileName.substring(1)} src={`/images${fileName.substring(1)}`} />;
  })

  const [columns, setColumns] = useState([
    { title: 'No', field: 'categoryNo'},
    { title: '카테고리명', field: 'categoryName' },
    { title: '카테고리설명', field: 'categoryDesc' },
    {
      title: '아이콘',
      field: 'categoryIcon',
      lookup: iconObject
    },
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
    const apiRef = useGridApiRef();
    console.log(apiRef);

    

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

    const handleRowEditStop = (
        params: GridRowParams,
        event: MuiEvent<MuiBaseEvent>,
      ) => {
          console.log(event);
        event.defaultMuiPrevented = true;

        console.log(params);
      };

    const handleClickEdit = (e:any, id:GridRowId) => {


    }

    


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
      title="Editable Preview"
      columns={columns}
      data={childCategoryList}
      editable={{
        onRowAdd: newData =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              setChildCategoryList([...childCategoryList, newData]);
              
              resolve(newData);
            }, 1000)
          })}}
    />
    </div>
    </Box>
  </Modal>

  );
}


