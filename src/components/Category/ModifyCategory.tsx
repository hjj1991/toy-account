import { DataGrid, GridActionsCellItem, GridCellParams, GridColumns, GridRowId, GridRowParams, MuiBaseEvent, MuiEvent, useGridApiContext, useGridApiRef} from '@mui/x-data-grid';
import { Box, Button, Modal } from '@mui/material';
import { useEffect, useState } from 'react';
import * as service from '../../services/axiosList';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { loadingState, SnackBarInfo, snackBarState } from '../../recoil/recoil';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { cpuUsage } from 'process';



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

    },[props.categoryNo])

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

    

    const columns: GridColumns = [
        { field: 'categoryName', headerName: '카테고리명', type: 'string', editable: true},
        { field: 'categoryDesc', headerName: '카테고리설명', type: 'string', editable: true  },
        { field: 'categoryIcon', headerName: '아이콘', type: 'string', editable: true },
        { field: 'action', headerName: '', type: 'actions', getActions: ({ id }) => {
      
          return [
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              onClick={(e) =>{ handleClickEdit(e, id)}}
              className="textPrimary"
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              color="inherit"
            />,
          ];
        },
      },
      ];

  return (

    <Modal
    open={props.isCategoryDetailOpen}
    onClose={props.handleCloseCategoryDetail}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={style}>
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid
        editMode="row"
        rows={childCategoryList}
        columns={columns}
        onRowEditStop={handleRowEditStop}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </div>
    </Box>
  </Modal>

  );
}


