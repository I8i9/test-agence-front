import React, {  useEffect, useMemo, useState } from 'react'
import { DragHandle , DraggableRow } from './dragable'
import {  ChevronsLeft , CircleCheck ,Loader , XCircle , ChevronRight, ChevronsRight, ChevronLeft, CheckCircle, TriangleAlert, CheckCircle2, FilePlus, FileText, FileTextIcon, Plus, Download, Eye, Cog, Settings, Trash2, Info } from 'lucide-react'
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
import { Avatar  , AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { calculateRowsArchive } from '../../../../utils/rowsCalculator'
import ToolTipCustom from '../../../customUi/tooltip'
import { formatDateDDmmmmYYYY } from '../../../../utils/dateConverter'
import { useDownloadFacture } from '../../../../api/queries/facture/useDownloadFacture'
import ViewFactureDrawer from '../../../modals/facture/ViewFactureDrawer'
import ModifyFactureDrawer from '../../../modals/facture/ModifyFactureDrawer'
import { DeleteFactureModal } from '../../../modals/facture/DeleteFactureModal';

const FactureTable = ({ initialData , clients }) => {

    const {mutate , isPending} = useDownloadFacture();
    const [ViewFacture , setViewFacture] = useState(null);
    const [ModifyFacture, setModifyFacture] = useState(null);
    const [DeleteFacture, setDeleteFacture] = useState( {open : false , data : null} );

    const statusStyling = {
        "PAYEE" :{ style : "bg-green-100 text-green-600" , icon : <CircleCheck className='size-4' />, Label : "Payé" },
        "EN_ATTENTE" :{ style : "bg-yellow-100 text-yellow-600" , icon : <Loader className='size-4' />, Label : "Partiellement payé" },
        "IMPAYE" :{ style : "bg-red-100 text-red-600" , icon : <XCircle className='size-4' />, Label : "Impayé" },
    }


    const columns = useMemo(() => [
        {
            id: "drag",
            header: () => null,
            cell: ({ row }) => <DragHandle id={row.original.id_facture} />,
            meta: { width: '4%' },
        },
         {
            id: 'reference',
            accessorFn: row => row?.reference,
            header: 'Référence',
            cell: ({ row }) => {
                return <span className="font-medium ">
                    {row.original?.reference} 
                   
                </span>
            },
            meta: { width: '16%' },

        },

        {
            accessorKey: 'date_facture',
            header: 'Date Facture',
            cell: ({  row }) => {
                return  <span className=''>{formatDateDDmmmmYYYY(row?.original?.date_facture) || "_"} </span>

                
                
            },
            meta: { width: '16%' },
        },

        {
            accessorKey: 'date_echeance_facture',
            header: 'Date Échéance',
            cell: ({  row }) => {
                return <span className='flex flex-col'>
                    <span className=''>{formatDateDDmmmmYYYY(row?.original?.date_echeance_facture) || "_"} </span>
                    {
                        
                            <span className={`text-xs leading-none text-gray-500 text-truncate ${   row?.original?.status_facture === "PAYEE" ? "text-green-600" : row?.original?.days_till_due > 0 ? row?.original?.days_till_due > 7  ? "text-green-600"  : "text-yellow-600": "text-red-600"}`}>{row?.original?.status_facture !== "PAYEE" ? row?.original?.days_till_due ? row?.original?.days_till_due + " jours" : "" : "" } </span>
              
                    }
                </span>
            },
            meta: { width: '16%' },
        },

        {
            accessorFn: row => row?.contrats.map(c => c).join(", "),
            header: 'Contrats liés',
            cell: ({ row }) => {
                const cell = row.original?.contrats
                return <ToolTipCustom
                    trigger={<span className='w-fit gap-2 flex  items-center max-w-[100px] truncate'>
                        <span className='inline-block truncate'>{cell[0]}</span>
                        {cell.length > 1 ? <span className='text-gray-500 text-xs'>+{cell.length - 1} </span> : null}
                    </span>}
                    message={<span className='grid grid-cols-1 gap-2 font-medium'>
                        {cell.map((contrat , index) => (
                            <span key={index}>{contrat}</span>
                        ))}

                    </span>}
                />
                
            },
            meta: { width: '10%' },
        },

        

        
        {
            accessorFn: row => row?.client?.id_client,
            header: 'Client',
            cell: ({ row }) => {

                    return (<ToolTipCustom
                    trigger={<span className='w-fit gap-2 flex  items-center laptop:max-w-[150px] desktop:max-w-[200px] truncate'>
                        <Avatar className="size-6 inline-block rounded-full object-cover ">
                            <AvatarFallback className='text-xs font-semibold'>
                                {
                                    // Get initials from client name
                                    row?.original?.client?.nom_client ? row?.original?.client?.nom_client.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)  : "?"
                                }
                            </AvatarFallback>
                        </Avatar>
                        <span className='inline-block truncate'>{row?.original?.client?.nom_client || "Sans client"}</span>
                    </span>}
                    message={row?.original?.client?.nom_client || "Sans client"}
                    />)
                
            },
            meta: { width: '16%' },
        },

         {
            accessorKey: 'prix_total',
            header: <ToolTipCustom 
                        message={<span className='flex flex-col'>
                            <span className='font-semibold'>Montant Totale</span>
                            <span className=' leading-none text-gray-500 text-truncate'>Reste à payé </span>
                        </span>}
                    trigger={<span className='flex gap-0.5 cursor-pointer'>Montant <Info className='size-3' /></span>} />,
            cell: ({ cell , row }) => {
                const reste = row.original?.reste || 0
                return <span className='flex flex-col'>
                    <span className='font-semibold'>{cell.getValue() || 0} TTC</span>
                    <span className='text-xs leading-none text-gray-500 text-truncate'>{reste ? "-" + reste : ""} </span>
                </span>
            },
            meta: { width: '12%' },
        },

        
        
        {
            accessorKey: 'status_facture',
            header: 'Status',
            cell: ({ cell }) => {
                return <span className='w-full flex '><ToolTipCustom
                    message={statusStyling[cell.getValue()]?.Label || cell.getValue()}
                    trigger={<span className={`ml-2 inline-flex items-center gap-2 rounded-full px-1 py-1 text-sm font-medium ${statusStyling[cell.getValue()]?.style || "bg-gray-100 text-gray-800" }`}>
                        {statusStyling[cell.getValue()]?.icon ? statusStyling[cell.getValue()]?.icon : null}
                    </span>}
                /></span>
            },
            meta: { width: '12%' },
        },
        {
            id: 'actions',
            header: <span className='mr-4'>Actions</span>,
            cell: ({ row }) => {
                if(row.original?.cantEdit) {
                    return null
                }
                return <span className='flex'><ToolTipCustom
                        trigger={
                        <Button onClick={() => setViewFacture(row.original?.id_facture)} variant="ghost" size="sm">
                            <Eye />
                            <span className="sr-only">Voir la facture</span>
                        </Button>}
                        message="Voir la facture"
                    />
                    <ToolTipCustom
                        trigger={
                        <Button onClick={() => setModifyFacture(row.original?.id_facture)} disabled={isPending} variant="ghost" size="sm">
                            <Settings />
                            <span className="sr-only">Modifier la facture</span>
                        </Button>}
                        message="Modifier la facture"
                    />
                    <ToolTipCustom
                        trigger={
                        <Button onClick={() => mutate({id: row.original.id_facture , reference: row.original.reference})} disabled={isPending} variant="ghost" size="sm">
                            <Download />
                            <span className="sr-only">Télécharger la facture</span>
                        </Button>}
                        message="Télécharger la facture"
                    />
                    <ToolTipCustom
                        trigger={
                        <Button onClick={() => setDeleteFacture({ open : true, data: { id: row.original.id_facture, sequence: row.original.reference } })} variant="ghost" size="sm">
                            <Trash2 className="text-red-600" />
                            <span className="sr-only">Supprimer la facture</span>
                        </Button>}
                        message="Supprimer la facture"
                    />
                    </span>
                    
            },
            meta: { width: '4%' , textAlign : 'right' },
        }
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
    () => data?.map(({ id_facture }) =>  id_facture) || [],
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
      globalFilter
    },
    getRowId: (row) => row?.id_facture.toString(),
    enableRowSelection: true,
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

            <FactureHeader clients={clients} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} columnFilters={columnFilters} setColumnFilters={setColumnFilters} />
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
                                <DraggableRow key={row.id} row={row} id={"id_facture"} />
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
                {<span className='flex gap-2'>{table.getFilteredRowModel().rows.length} facture(s)
                    <Separator className='rotate-90 !w-3 self-center ' />
                    <span>{"Total : "+table.getFilteredRowModel().rows.reduce((acc, row) => acc + row.original.prix_total, 0)+" DT"} </span>

                     {
                        table.getFilteredRowModel().rows.reduce((acc, row) => acc +  ( parseFloat(row.original.prix_total) - (parseFloat(row?.original?.reste) || 0)), 0) > 0 ?
                            <><Separator className='rotate-90 !w-3 self-center ' />
                            <span className='text-green-600 '>Payé : {table.getFilteredRowModel().rows.reduce((acc, row) => acc + (parseFloat(row?.original?.prix_total) || 0) - (parseFloat(row?.original?.reste) || 0),0)} DT</span></>
                        : null
                    }

                    {
                        table.getFilteredRowModel().rows.reduce((acc, row) => acc + (parseFloat(row?.original?.reste) || 0),0) > 0 ?
                            <><Separator className='rotate-90 !w-3 self-center ' />
                            <span className='text-red-500 '>Impayé : {table.getFilteredRowModel().rows.reduce((acc, row) => acc + (parseFloat(row?.original?.reste) || 0),0)} DT</span></>
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

        
        <ViewFactureDrawer open={!!ViewFacture} id={ViewFacture} close={() => setViewFacture(null)} />

        <ModifyFactureDrawer open={!!ModifyFacture} id={ModifyFacture} close={() => setModifyFacture(null)} />
        
        <DeleteFactureModal open={DeleteFacture.open} data={DeleteFacture.data} close={() => {
            // close right away
            setDeleteFacture(prev => ({ ...prev, open: false }));

            // wipe data after animation finishes
            setTimeout(() => {
            setDeleteFacture({ open: false, data: null });
            }, 300);
        }} />
    </div>
  )
}

export default FactureTable


const FactureHeader= ({globalFilter, setGlobalFilter , columnFilters , setColumnFilters , clients}) => {

    
    return (
        <div className="flex w-full items-center justify-between  ">
            <div className='flex items-center gap-4'>
                    <Select value={columnFilters.find(cf => cf.id === "client")?.value || "all"} onValueChange={(value) => {
                        setColumnFilters((old) => {
                            const otherFilters = old.filter(cf => cf.id !== "client")
                            if (value === "all") {
                                return otherFilters
                            }
                            return [...otherFilters , {id:"client" , value}]
                        }
                    )}}>
                        <SelectTrigger className="w-[208px]">
                            <SelectValue  />
                        </SelectTrigger>
                        <SelectContent className="max-h-68">
                            <SelectItem key={"all-client"} value={"all"}>
                                Tous les clients
                            </SelectItem>
                            {clients.map((client , index) => (
                                <SelectItem key={index} value={client.id_client}>
                                    <Avatar className="size-5 rounded-full object-cover mr-0.5 inline-block">
                                        <AvatarFallback className='text-xs font-semibold'>
                                            {
                                                // Get initials from client name
                                                client.nom_client ? client.nom_client.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : "?"
                                            }
                                        </AvatarFallback>
                                    </Avatar>
                                    {client.nom_client}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={columnFilters.find(cf => cf.id === "status_facture")?.value || "all"} onValueChange={(value) => {
                            setColumnFilters((old) => {
                                const otherFilters = old.filter(cf => cf.id !== "status_facture")
                                if (value === "all") {
                                    return otherFilters
                                }
                                return [...otherFilters , {id:"status_facture" , value}]
                            }
                        )}}>
                            <SelectTrigger className="w-[164px]">
                                <SelectValue  />
                            </SelectTrigger>
                            <SelectContent className="max-h-68">
                                <SelectItem key={"all-status"} value={"all"}>
                                    Tous les statuts
                                </SelectItem>
                                <SelectItem key={"PAYEE"} value={"PAYEE"}>
                                    <span className='p-1 bg-green-100 text-green-600 rounded-full'><CheckCircle2 className='size-4 text-green-600'/></span> Payée
                                </SelectItem>
                                <SelectItem key={"EN_ATTENTE"} value={"EN_ATTENTE"}>
                                    <span className='p-1 bg-yellow-100 text-yellow-600 rounded-full'><Loader className='size-4 text-yellow-600'/></span> Partiellement payé
                                </SelectItem>
                                <SelectItem key={"IMPAYE"} value={"IMPAYE"}>
                                    <span className='p-1 bg-red-100 text-red-600 rounded-full'><XCircle className='size-4 text-red-600'/></span> Impayé
                                </SelectItem>
                            </SelectContent>
                    </Select>

                </div>

                <Input 
                    placeholder="Rechercher une facture..."
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="w-[300px] "
                />

            </div>
    )
}