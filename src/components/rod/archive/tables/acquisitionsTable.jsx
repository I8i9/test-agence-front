import React, {  useEffect, useMemo } from 'react'
import { DragHandle , DraggableRow } from './dragable'
import {  ChevronsLeft , CircleCheck ,Loader , XCircle , ChevronRight, ChevronsRight, ChevronLeft, Plus, EyeIcon, FileCheck, FileX, CheckCircle2, HistoryIcon } from 'lucide-react'
import {
  DndContext,
  closestCenter,
    KeyboardSensor,
    MouseSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    flexRender,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { calculateRowsArchive } from '../../../../utils/rowsCalculator'
import ToolTipCustom from '../../../customUi/tooltip'
import { formatDateDDmmmmYYYY, FormatDateEEEEddMMyyyy } from '../../../../utils/dateConverter'

const getLabelBypaymentType = {
    "COMPTANT": "En Comptant",
    "LEASING": "Par Leasing",
    "CREDIT_BANCAIRE": "Par Crédit",
}

const AcquisitionsTable = ({ initialData  }) => {
    


    

    const columns = useMemo(() => [
        {
            id: "drag",
            header: () => null,
            cell: ({ row }) => <DragHandle id={row.original.id_garage} />,
            meta: { width: '2%' },
        },
         {
            id: 'image',
            accessorFn : null ,
            header: '',
            cell: ({ row }) => {
                return <img 
                    src={row.original?.image_voiture}
                    alt={row.original?.nom_voiture || "Voiture"}
                    className='h-8 w-fit object-fill '
                />
            },
            meta: { width: '6%' },

        },

        {
            accessorFn: formatDateDDmmmmYYYY(row => row?.date_achat_garage),
            header: 'Date Achat',
            cell: ({ row }) => {

                return <span className={`font-medium`}>
                    { formatDateDDmmmmYYYY(row?.original?.date_achat_garage) || "_"}
                </span>
                
            },
            meta: { width: '8%' },
        },

        {
            id: 'marque_modele',
            accessorFn: row => `${row?.nom_voiture || ''} ${row?.version_voiture || ''}`,
            header: 'Véhicule',
            cell: ({  row }) => {
                return <span className='flex flex-col laptop:max-w-[150px] desktop:max-w-[180px]'>
                    <ToolTipCustom trigger = {
                    <span className='font-semibold truncate w-fit'> {row?.original?.nom_voiture || "_"} </span>}
                    message = {row?.original?.nom_voiture || "_"}
                    />

                    <ToolTipCustom
                        trigger = {
                            <span className='text-xs w-fit  leading-none text-gray-500 text-truncate'>{row?.original?.version_voiture || "_" } </span>
                        }
                        message = {row?.original?.version_voiture || "_"}
                    />
                </span>
            },
            meta: { width: '16%' },
        },

        {
            accessorKey: 'matricule_garage',
            header: 'Matricule',
            cell: ({ cell }) => {

                return <span className={`font-medium px-2.5 text-xs py-1 bg-rod-primary text-white  rounded-md`}>
                    {cell.getValue() || "_"}
                </span>
                
            },
            meta: { width: '8%' },
        },
        
        {
            accessorKey: 'prix_achat_garage',
            header: 'Prix Achat',
            cell: ({ cell }) => {
                return (
                    <div>
                        {parseFloat(cell.getValue()) +" TTC"}
                    </div>
                )
            },
            meta: { width: '8%' },
        },

        {
            accessorKey: 'type_achat_garage',
            header: 'Paiement',
            cell: ({ cell }) => {
                return (
                    <div>
                        {getLabelBypaymentType[cell.getValue()] || "_"}
                    </div>
                )
            },
            meta: { width: '8%' },

        },

        {
            accessorKey: 'tva_rate',
            header: 'Taux TVA',
            cell: ({ cell  }) => {
                return <span className='font-semibold'>{parseFloat(cell.getValue()) || 0}%</span>
            },
            meta: { width: '6%' },
        },

        {
            accessorKey: 'tva',
            header: 'TVA déductible',
            cell: ({ cell  }) => {
                return <span className='font-semibold '>{cell.getValue() ? (parseFloat(cell.getValue())  || 0) + 'DT' : "_"} </span>
            },
            meta: { width: '10%' },
        },

    ], [])

  const [data, setData] = React.useState(() => initialData)

  useEffect(() => {
    setData(initialData)

    // Cleanup function 
    return () => {}

  }, [initialData])

  const [columnFilters, setColumnFilters] = React.useState( [] )
  const columnVisibility = {
    transaction: false,   // hidden but usable
  };
  const [sorting, setSorting] = React.useState([])
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [rowSelection, setRowSelection] = React.useState({})

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,   
    pageSize: calculateRowsArchive(window.innerHeight, window.innerWidth),
  })


  useEffect(() => {
      const handleResize = () => {
        console.log('Window resize' , window.innerHeight, window.innerWidth , calculateRowsArchive(window.innerHeight, window.innerWidth))
        setPagination((prev) => ({ ...prev, pageSize: calculateRowsArchive(window.innerHeight, window.innerWidth) }));
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo(
    () => data?.map(({ id_garage }) =>  id_garage) || [],
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination,
      columnVisibility,
      globalFilter,
      rowSelection
    },
    getRowId: (row) => row?.id_garage.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    setGlobalFilter: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }


  return (
    <div className='w-full h-full  grid grid-rows-[1fr_32px] gap-4'>
        <div className='h-full w-full flex flex-col gap-4'>

        <div className="flex w-full items-center justify-end  ">

                <Input 
                    placeholder="Rechercher une acquisition..."
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="w-[300px] "
                />

        </div>
            <div className='h-full'>
                <div className="overflow-hidden h-fit rounded-lg border">
                    <DndContext
                        collisionDetection={closestCenter}
                        modifiers={[restrictToVerticalAxis]}
                        onDragEnd={handleDragEnd}
                        sensors={sensors}
                        id={sortableId}
                    >
                        <Table>
                        <TableHeader className="h-full bg-muted sticky top-0 z-10">
                            {table.getHeaderGroups().map((headerGroup) => (
                                
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id} colSpan={header.colSpan} style={{ ...header?.column?.columnDef?.meta }}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </TableHead>
                                )
                                })}
                            </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody className="h-full **:data-[slot=table-cell]:first:w-8">
                            {table.getRowModel().rows?.length ? (
                            <SortableContext
                                items={dataIds}
                                strategy={verticalListSortingStrategy}
                            >
                                {table.getRowModel().rows.map((row) => (
                                <DraggableRow key={row.id} row={row} id={"id_garage"} />
                                ))}
                            </SortableContext>
                            ) : (
                            <TableRow >
                                <TableCell
                                colSpan={columns.length}
                                className="h-full items-center justify-center min-h-full text-center"
                                >
                                Pas de résultats.
                                </TableCell>
                            </TableRow>
                            )}
                        </TableBody>
                        </Table>
                    </DndContext>
                </div>
            </div>
        </div>
        {/* Pagination */}
        <div className="flex w-full items-center justify-between  px-4 gap-8 ">
            <span className=" font-medium text-sm">
                {
                    <span className='flex gap-2'>{table.getFilteredRowModel().rows.length} Acquisition(s)
                    <Separator className='rotate-90 !w-3 self-center ' />
                    <span>{"Total Payé : "+table.getFilteredRowModel().rows.reduce((acc, row) => acc + row.original.prix_achat_garage, 0)+" TTC"} </span>
                    
                    {
                        table.getFilteredRowModel().rows.reduce((acc, row) => acc + row.original.tva, 0) > 0 ?
                            <><Separator className='rotate-90 !w-3 self-center ' />
                            <span className=''>Total TVA Déductible : {table.getFilteredRowModel().rows.reduce((acc, row) => acc + row.original.tva, 0)} DT</span></>
                        : null
                    }
                     </span> 
                }
            </span>
            <div className='flex w-fit items-center justify-center gap-8'>
                <div className=" text-sm font-medium">
                    Page {table.getState().pagination.pageIndex + 1} sur {" "}
                    {table.getPageCount()}
                </div>
                <div className="ml-auto flex items-center gap-2 ">
                    <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    >
                    <span className="sr-only">Aller à la première page</span>
                    <ChevronsLeft />
                    </Button>
                    <Button
                    variant="outline"
                    className="size-8"
                    size="icon"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    >
                    <span className="sr-only">Aller à la page précédente</span>
                    <ChevronLeft />
                    </Button>
                    <Button
                    variant="outline"
                    className="size-8"
                    size="icon"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    >
                    <span className="sr-only">Aller à la page suivante</span>
                    <ChevronRight />
                    </Button>
                    <Button
                    variant="outline"
                    className="hidden size-8 lg:flex"
                    size="icon"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                    >
                    <span className="sr-only">Aller à la dernière page</span>
                    <ChevronsRight />
                    </Button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AcquisitionsTable

