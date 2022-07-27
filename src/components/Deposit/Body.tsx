import * as React from 'react';
import {
    Column,
    Table,
    useReactTable,
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getExpandedRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    getPaginationRowModel,
    getSortedRowModel,
    FilterFn,
    ColumnDef,
    flexRender,
    ExpandedState,
  } from '@tanstack/react-table'
import {
    RankingInfo,
    rankItem
  } from '@tanstack/match-sorter-utils'
import { Table as ResponseTable, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import Container from '@mui/material/Container';
import * as service from '../../services/axiosList';
import { useSetRecoilState } from 'recoil';
import { loadingState } from '../../recoil/recoil';
import { Box, Button, Grid, Pagination, Stack, SxProps, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';


declare module '@tanstack/table-core' {
    interface FilterMeta {
      itemRank: RankingInfo
    }
  }
  
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)

    // Store the itemRank info
    addMeta({
    itemRank,
    })

    // Return if the item should be filtered in/out
    return itemRank.passed
}

function Pagintaion({table, siblingCount}: {table:Table<any>, siblingCount:number}){

  let currentPage = table.getState().pagination.pageIndex;

  return (
    <>
      <Stack spacing={2} alignItems={'center'}>
      <Pagination count={table.getPageCount()} page={currentPage+1} onChange={(e: any, currentPage:number) => table.setPageIndex(currentPage-1)}
      hidePrevButton hideNextButton showFirstButton showLastButton  siblingCount={siblingCount}
      sx={{
        '& .Mui-selected':{
          backgroundColor: '#a3cca3!important'
        },
        '.MuiPaginationItem-root:hover':{
          backgroundColor: '#a3cca3'
        }
      }} />
    </Stack>
  </>
  )
}

function Filter({
    column,
    table,
  }: {
    column: Column<any, unknown>
    table: Table<any>
  }) {
    const firstValue = table
      .getPreFilteredRowModel()
      .flatRows[0]?.getValue(column.id)
  
    const columnFilterValue = column.getFilterValue()
  
    const sortedUniqueValues = React.useMemo(
      () =>
        typeof firstValue === 'number'
          ? []
          : Array.from(column.getFacetedUniqueValues().keys()).sort(),
          // eslint-disable-next-line react-hooks/exhaustive-deps 
      [column.getFacetedUniqueValues()]
    )

    if(typeof firstValue === 'number'){
        return (<div>
        <div className="flex space-x-2">
          <DebouncedInput
            type="number"
            min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
            max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
            value={(columnFilterValue as [number, number])?.[0] ?? ''}
            onChange={value =>{
              column.setFilterValue((old: [number, number]) => [value, old?.[1]]);
              if(table.getState().pagination.pageIndex + 1 > table.getPageCount()){
                table.resetPageIndex();
              }
            }}
            placeholder={`Min ${
              column.getFacetedMinMaxValues()?.[0]
                ? `(${column.getFacetedMinMaxValues()?.[0]})`
                : ''
            }`}
            className="w-24 border shadow rounded"
          />
          <DebouncedInput
            type="number"
            min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
            max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
            value={(columnFilterValue as [number, number])?.[1] ?? ''}
            onChange={value =>{
              column.setFilterValue((old: [number, number]) => [old?.[0], value]);
              if(table.getState().pagination.pageIndex + 1 > table.getPageCount()){
                table.resetPageIndex();
              }
            }}
            placeholder={`Max ${
              column.getFacetedMinMaxValues()?.[1]
                ? `(${column.getFacetedMinMaxValues()?.[1]})`
                : ''
            }`}
            className="w-24 border shadow rounded"
          />
        </div>
        <div className="h-1" />
      </div>)
    }else if(column.id === 'bankType'){

        return (
            <>
            <DebouncedSelect
              type="text"
              value={(columnFilterValue ?? '') as string}
              onChange={value => {

                
                
                column.setFilterValue(value)
                if(table.getState().pagination.pageIndex + 1 > table.getPageCount()){
                  table.resetPageIndex();
                }
              
              }}
              placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
              className="w-36 border shadow rounded"
              optionList ={['은행', '저축은행']}
            />
            <div className="h-1" />
          </>
        )

    }else{
        return (
                <>
                <datalist id={column.id + 'list'}>
                {sortedUniqueValues.slice(0, 5000).map((value: any) => (
                    <option value={value} key={value} />
                ))}
                </datalist>
                <DebouncedInput
                type="text"
                value={(columnFilterValue ?? '') as string}
                onChange={value => {
                  column.setFilterValue(value)

                  if(table.getState().pagination.pageIndex + 1 > table.getPageCount()){
                    table.resetPageIndex();
                  }
                }}
                placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
                className="w-36 border shadow rounded"
                list={column.id + 'list'}
                sxStyle={{
                  input: {
                        textAlign:'center',
                          '&::placeholder':{
                          color: 'gold',
                          textAlign: 'center'
                      }
                  }
              }}
                />
                <div className="h-1" />
            </>
      )
    }

  }
  
// A debounced input react component
function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    sxStyle = {}
  }: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number,
    sxStyle?: SxProps
  } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = React.useState(initialValue)
  
    React.useEffect(() => {
      setValue(initialValue)
    }, [initialValue])
  
    React.useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)
  
      return () => clearTimeout(timeout)
      // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [value])
  
    return (
        <TextField placeholder='검색어입력' color='warning' variant="standard" size='small' value={value} onChange={e => setValue(e.target.value)}
        sx={sxStyle} />
    )
  }

function DebouncedSelect({
    value: initialValue,
    onChange,
    debounce = 500,
    optionList
  }: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
    optionList: any
  } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = React.useState(initialValue)
  
    React.useEffect(() => {
      setValue(initialValue)
    }, [initialValue])
  
    React.useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)
  
      return () => clearTimeout(timeout)
      // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [value])
    return (
        <select className='basic-select' onChange={(e:any) => setValue(e.target.value)}>
          <option value="">전체</option>
          {optionList.slice(0, 5000).map((value: any) => (
                <option value={value} key={value} >{value}</option>
              ))}
        </select>
    )
}

  

interface Deposit {
    bankType: string
    calTel: string
    dclsChargMan: string
    dclsEndDay: string
    dclsMonth: string
    dclsStrtDay: string
    finCoNo: string
    finCoSubmDay: string
    finPrdtCd: string
    finPrdtNm: string
    hompUrl: string
    joinDeny: string
    joinMember: string
    joinWay: string
    korCoNm: string
    maxLimit: number
    mtrtInt: string
    options: Array<DepositOption>
    spclCnd: string
  }
interface DepositOption {
    intrRate: number
    intrRate2: number
    intrRateType: string
    intrRateTypeNm: string
    saveTrm: string
}

function ExpandRow(props:any){
    return (
            <Box component="div" sx={{ p: 2, border: '1px dashed grey' }}>
                <Grid container spacing={2} columns={12}>
                    <Grid item xs={12} sm={6} xl={4}>
                        <div className='row-expend-title'>상품문의</div>
                        <div>대표사이트: <a href={props.row.hompUrl} target="_blank" rel="noopener noreferrer">{props.row.korCoNm}</a></div>
                        <div>대표번호: {props.row.calTel}</div>
                    </Grid>
                    <Grid item xs={12} sm={6} xl={4}>
                        <div className='row-expend-title'>우대조건</div>
                        <div className='row-expend-contents'>{props.row.spclCnd}</div>
                    </Grid>
                    <Grid item xs={12} sm={6} xl={4}>
                        <div className='row-expend-title'>가입대상</div>
                        <div className='row-expend-contents'>{props.row.joinMember}</div>
                    </Grid>
                    <Grid item xs={12} sm={6} xl={4}>
                        <div className='row-expend-title'>가입방법</div>
                        <div className='row-expend-contents'>{props.row.joinWay}</div>
                    </Grid>
                    <Grid item xs={12} sm={6} xl={4}>
                        <div className='row-expend-title'>만기후 이자율</div>
                        <div className='row-expend-contents'>{props.row.mtrtInt}</div>
                    </Grid>
                    <Grid item xs={12} sm={6} xl={4}>
                        <div className='row-expend-title'>기타 유의사항</div>
                        <div className='row-expend-contents'>{props.row.etcNote}</div>
                    </Grid>
                    <Grid item xs={12}>
                        <div className='row-expend-title'>가입 정보</div>
                        <ResponseTable>
                            <Thead>
                                <Tr style={{backgroundColor: 'black'}}>
                                    <Th>타입</Th>
                                    <Th>금리</Th>
                                    <Th>우대금리</Th>
                                    <Th>기간</Th>
                                </Tr>
                            </Thead>
                            <Tbody className='basic-table-detail-body'>
                                {props.row.options.map((option:any, index:number) => {
                                    return (
                                    <Tr key={index}>
                                        <Td>{option.intrRateTypeNm}</Td>
                                        <Td>{option.intrRate}%</Td>
                                        <Td>{option.intrRate2}%</Td>
                                        <Td>{option.saveTrm}개월</Td>                                     
                                    </Tr>
                                    )
                                })}
                            </Tbody>
                        </ResponseTable>
                    </Grid>
                </Grid>
            </Box>
        )
}
  

export default function Body() {
    const [data, setData] = React.useState<any>([]);
    const setLoading = useSetRecoilState<boolean>(loadingState);
    const [isMobile, setIsMobile] = React.useState<boolean>(window.innerWidth <= 642? true: false);
    const resizingHandler = () => {
      if (window.innerWidth <= 642) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    const [expanded, setExpanded] = React.useState<ExpandedState>({})

    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
      []
    )
    const [globalFilter, setGlobalFilter] = React.useState('')

    const columns = React.useMemo<ColumnDef<Deposit>[]>(
        () => [
              {
                accessorFn: row => row.bankType,
                id: 'bankType',
                cell: info => info.getValue(),
                header: () => <span>타입</span>,
                footer: props => props.column.id,
                filterFn: 'equalsString'
              },
              {
                accessorFn: row => row.korCoNm,
                id: 'korCoNm',
                cell: info => info.getValue(),
                header: () => <span>회사명</span>,
                footer: props => props.column.id
              },
              {
                accessorFn: row => row.finPrdtNm,
                id: 'finPrdtNm',
                cell: info => info.getValue(),
                header: () => <span>상품명</span>,
                footer: props => props.column.id
              },
              {
                accessorFn: row => {
                    let findedIndx = row.options.findIndex(option => option.saveTrm === "12");
                    if(findedIndx === -1){
                        return row.options[0]
                    }

                    return row.options[findedIndx]
                },
                id: 'intrRate',
                cell: info => {
                    let cellValue:any = info.getValue();
                    return `${cellValue.intrRate}% (${cellValue.saveTrm} 개월 기준)`
                },
                header: () => <span>이율</span>,
                footer: props => props.column.id,
                enableColumnFilter: false,
                sortingFn: (rowA, rowB):number => {

                    let indexA = rowA.original.options.findIndex(option => option.saveTrm === "12") === -1? 0 : rowA.original.options.findIndex(option => option.saveTrm === "12");
                    let indexB = rowB.original.options.findIndex(option => option.saveTrm === "12") === -1? 0 : rowB.original.options.findIndex(option => option.saveTrm === "12");
                    
                    if(rowA.original.options[indexA].intrRate > rowB.original.options[indexB].intrRate){
                        return 1;
                    }else{
                        return -1;
                    }
                }
              },
              {
                accessorFn: row => {
                    let findedIndx = row.options.findIndex(option => option.saveTrm === "12");
                    if(findedIndx === -1){
                        return row.options[0]
                    }

                    return row.options[findedIndx]
                },
                id: 'intrRate2',
                cell: info => {
                    let cellValue:any = info.getValue();
                    return `${cellValue.intrRate2}% (${cellValue.saveTrm} 개월 기준)`
                },
                header: () => <span>우대이율</span>,
                footer: props => props.column.id,
                enableColumnFilter: false,
                sortingFn: (rowA, rowB):number => {

                    let indexA = rowA.original.options.findIndex(option => option.saveTrm === "12") === -1? 0 : rowA.original.options.findIndex(option => option.saveTrm === "12");
                    let indexB = rowB.original.options.findIndex(option => option.saveTrm === "12") === -1? 0 : rowB.original.options.findIndex(option => option.saveTrm === "12");
                    
                    if(rowA.original.options[indexA].intrRate2 > rowB.original.options[indexB].intrRate2){
                        return 1;
                    }else{
                        return -1;
                    }
                }
              },
              {
                id: 'expand',
                cell: ({ row, getValue }) => (
                      <>
                        
                        {row.getIsExpanded() ? <Button onClick={() => row.toggleExpanded(!row.getIsExpanded())}>👇</Button> : 
                        <Button onClick={() => row.toggleExpanded(!row.getIsExpanded())}>👉</Button>}
                      </>
                  ),
                header: () => <span>상세</span>,
                footer: props => props.column.id,
                enableColumnFilter: false,
                enableSorting: false
              }

        ],
        []
      )


    const table = useReactTable({
        data,
        columns,
        state: {
          columnFilters,
          globalFilter,
          expanded
        },
        onExpandedChange: setExpanded,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        getExpandedRowModel: getExpandedRowModel(),
        autoResetPageIndex: false,
        debugTable: true,
        debugHeaders: true,
        debugColumns: false

      })

    async function getDeposits(){
        try{
            setLoading(true);
            const res = await service.getDeposits();

            if (res.status === 200 && res.data.success) {
                setData(res.data.response);
            }
        }catch (err) {
            alert("서버 오류입니다." + err);
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
      getDeposits();
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    },[]);



    React.useEffect(() => {
      window.addEventListener("resize", resizingHandler);
      return () => {
        // 메모리 누수를 줄이기 위한 removeEvent
        window.removeEventListener("resize", resizingHandler);
      };
    }, []);
  
    let seletedButton = '';
    if(table.getColumn('intrRate').getIsSorted() === "desc"){
      seletedButton = 'intrRate';
    }else if(table.getColumn('intrRate2').getIsSorted() === "desc"){
      seletedButton = 'intrRate2';
    }else{
      seletedButton = '';
    }

    function handleChangeIntrRateButton(e: any){
        let selectedValue = e.target.value;

        if((selectedValue === 'intrRate' && table.getColumn(selectedValue).getIsSorted()) || (selectedValue === 'intrRate2' && table.getColumn(selectedValue).getIsSorted())){
          table.resetSorting();
        }else {
          table.setSorting([{id: selectedValue, desc: true}]);
        }

    }
        
    return (
        <Container style={{ paddingTop: 20 }}>
          <Grid container spacing={2} mb={1}>
            <Grid item xs={6} className='basic-filter-intrRate'>
              <ToggleButtonGroup
                value={seletedButton}
                onChange={handleChangeIntrRateButton}
                color={'success'}
                size={'small'}
                exclusive
              >
                <ToggleButton value="intrRate">
                  기본금리순
                </ToggleButton>
                <ToggleButton value="intrRate2">
                  최고금리순
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid item xs={6}>
              <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => {
                setGlobalFilter(String(value))
                if(table.getState().pagination.pageIndex + 1 > table.getPageCount()){
                  table.resetPageIndex();
                }
              }}
              className="p-2 font-lg shadow border border-block"
              placeholder="Search all columns..."
              sxStyle={{

              }}
            />
            </Grid>
          </Grid>
    <ResponseTable className='basic-table saving_deposit'>
        <Thead>
            <Tr>
              {table.getHeaderGroups()[0].headers.map(header => {
                return (
                  <Th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <>
                      {isMobile?
                      (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      ):( 
                        <div onClick={header.column.getToggleSortingHandler()} >                        
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        )}

                        {header.column.getCanFilter()?
                        (
                            <div className='basic-filter'>
                                <Filter column={header.column} table={table} />
                            </div>
                        ): null
                        }
                      </>
                    )}
                  </Th>
                )
              })}
            </Tr>
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map(row => {
            return (
                <React.Fragment key={row.id}>
                    <Tr>
                        {row.getVisibleCells().map(cell => {
                        return (
                            <Td key={cell.id}>
                            {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                            )}
                            </Td>
                        )
                        })}
                    </Tr>
                    {row.getIsExpanded()? 
                        <tr>
                            <td colSpan={100}>
                                <ExpandRow
                                    row={row.original} />
                            </td>
                        </tr>: null
                    }
              </React.Fragment>
            )
          })}
        </Tbody>
      </ResponseTable>


          <Pagintaion 
            table={table} 
            siblingCount={isMobile? 1: 3}
            />
        </Container>

    );
}