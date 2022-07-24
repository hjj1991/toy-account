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
    sortingFns,
    getSortedRowModel,
    FilterFn,
    SortingFn,
    ColumnDef,
    flexRender,
    ExpandedState,
  } from '@tanstack/react-table'
import {
    RankingInfo,
    rankItem,
    compareItems,
  } from '@tanstack/match-sorter-utils'
import { Table as ResponseTable, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import Container from '@mui/material/Container';
import * as service from '../../services/axiosList';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useMediaQuery } from 'react-responsive'
import { isAddCardState, isCardListReloadState, isModifyModalShowState, loadingState, SnackBarInfo, snackBarState } from '../../recoil/recoil';
import { RawOff } from '@mui/icons-material';
import { Box, Button, Grid, Typography } from '@mui/material';


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

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
    let dir = 0

    // Only sort by rank if the column has ranking information
    if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
        rowA.columnFiltersMeta[columnId]?.itemRank!,
        rowB.columnFiltersMeta[columnId]?.itemRank!
    )
    }

    // Provide an alphanumeric fallback for when the item ranks are equal
    return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
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
      [column.getFacetedUniqueValues()]
    )
  
    return typeof firstValue === 'number' ? (
      <div>
        <div className="flex space-x-2">
          <DebouncedInput
            type="number"
            min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
            max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
            value={(columnFilterValue as [number, number])?.[0] ?? ''}
            onChange={value =>
              column.setFilterValue((old: [number, number]) => [value, old?.[1]])
            }
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
            onChange={value =>
              column.setFilterValue((old: [number, number]) => [old?.[0], value])
            }
            placeholder={`Max ${
              column.getFacetedMinMaxValues()?.[1]
                ? `(${column.getFacetedMinMaxValues()?.[1]})`
                : ''
            }`}
            className="w-24 border shadow rounded"
          />
        </div>
        <div className="h-1" />
      </div>
    ) : (
      <>
        <datalist id={column.id + 'list'}>
          {sortedUniqueValues.slice(0, 5000).map((value: any) => (
            <option value={value} key={value} />
          ))}
        </datalist>
        <DebouncedInput
          type="text"
          value={(columnFilterValue ?? '') as string}
          onChange={value => column.setFilterValue(value)}
          placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
          className="w-36 border shadow rounded"
          list={column.id + 'list'}
        />
        <div className="h-1" />
      </>
    )
  }
  
  // A debounced input react component
function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
  }: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
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
    }, [value])
  
    return (
      <input {...props} value={value} onChange={e => setValue(e.target.value)} />
    )
}

  

interface Saving {
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
    options: Array<SavingOption>
    spclCnd: string
  }
interface SavingOption {
    intrRate: number
    intrRate2: number
    intrRateType: string
    intrRateTypeNm: string
    rsrvType: string
    rsrvTypeNm: string
    saveTrm: string
}

function ExpandRow(props:any){
    return (
            <Box component="div" sx={{ p: 2, border: '1px dashed grey' }}>
                <Grid container spacing={2} columns={12}>
                <Grid item xs={12}>
                    <div className='row-expend-title'>상품문의</div>
                    <div>대표사이트: <a href={props.row.hompUrl} target='_blank'>{props.row.korCoNm}</a></div>
                    <div>대표번호: {props.row.calTel}</div>
                </Grid>
                <Grid item xs={12}>
                    <div className='row-expend-title'>우대조건</div>
                    <div>{props.row.spclCnd}</div>
                </Grid>
                <Grid item xs={8}>
                <Typography noWrap>xs=8</Typography>
                </Grid>
                </Grid>
            </Box>
        )
}
  

export default function Body() {

    const [isCardListReload, setIsCardListReload] = useRecoilState<boolean>(isCardListReloadState);
    const [data, setData] = React.useState<any>([]);
    const [isOpenRemoveCardModal, setIsOpenRemoveCardModal] = React.useState<boolean>(false);
    const [selectedIndx, setSelectedIndx] = React.useState<number>(0);
    const setLoading = useSetRecoilState<boolean>(loadingState);
    const [snackBarInfo, setSnackBarInfo] = useRecoilState<SnackBarInfo>(snackBarState);
    const isTabletOrMobile = useMediaQuery({  query: "(min-width:0px) and (max-width:640px)", })
    const [expanded, setExpanded] = React.useState<ExpandedState>({})

    const rerender = React.useReducer(() => ({}), {})[1]

    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
      []
    )
    const [globalFilter, setGlobalFilter] = React.useState('')

    const columns = React.useMemo<ColumnDef<Saving>[]>(
        () => [
              {
                accessorFn: row => row.bankType,
                id: 'bankType',
                cell: info => info.getValue(),
                header: () => <span>타입</span>,
                footer: props => props.column.id,
              },
              {
                accessorFn: row => row.korCoNm,
                id: 'korCoNm',
                cell: info => info.getValue(),
                header: () => <span>회사명</span>,
                footer: props => props.column.id,
              },
              {
                accessorFn: row => row.finPrdtNm,
                id: 'finPrdtNm',
                cell: info => info.getValue(),
                header: () => <span>상품명</span>,
                footer: props => props.column.id,
                enableColumnFilter: false
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
                    return `${cellValue.intrRate} (${cellValue.saveTrm} 개월 기준)`
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
                    return `${cellValue.intrRate2} (${cellValue.saveTrm} 개월 기준)`
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
        debugTable: true,
        debugHeaders: true,
        debugColumns: false

      })

    async function getSavings(){
        try{
            setLoading(true);
            const res = await service.getSavings();

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
        getSavings();
    },[]);

    function intrRateSorting(){
        table.setSorting([{id: 'intrRate', desc: false}]);
    }

    React.useEffect(() => {

        if (table.getState().columnFilters[0]?.id === 'fullName') {
            if (table.getState().sorting[0]?.id !== 'fullName') {
              table.setSorting([{ id: 'fullName', desc: false }])
            }
          }
        }, [table.getState().columnFilters[0]?.id])

        
    return (
        <Container style={{ paddingTop: 20 }}>
            <Button onClick={intrRateSorting}>ㅎㅇㅎㅇ</Button>
  <ResponseTable>
        <Thead>
            <Tr>
              {table.getHeaderGroups()[0].headers.map(header => {
                return (
                  <Th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: isTabletOrMobile? ()=>{} : header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        {header.column.getCanFilter() && !isTabletOrMobile?
                        (
                            <div>
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
        </Container>

    );
}