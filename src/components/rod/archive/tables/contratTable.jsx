import React, {  useEffect, useMemo } from 'react'
import { DragHandle , DraggableRow } from './dragable'
import {  ChevronsLeft , CircleCheck ,Loader , XCircle , ChevronRight, ChevronsRight, ChevronLeft, Plus, EyeIcon, FileCheck, FileX, CheckCircle2, HistoryIcon, Info, CircleAlert } from 'lucide-react'
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
import {Checkbox} from '../../../customUi/animatedCheckbox'
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
import { formatDateDDmmmmYYYY, FormatDateEEEEddMMyyyy } from '../../../../utils/dateConverter'
import CreateFactureMultiple from '../../../modals/archive/createFactureMultiple'
import DetailContratModal from '../../../modals/contrat/DetailContratModal/DetailContratModal'
import ViewHistory from '../../../modals/archive/viewHistory'
import useFetchPaimentContrat from '../../../../api/queries/contrat/useFetchPaiementContrat'


const ContratsTable = ({ initialData , clients }) => {

    const [multipleOpen , setMultipleOpen] = React.useState(false)
    const [detailModalOpen, setDetailModalOpen] = React.useState(false)
    const [selectedContratId, setSelectedContratId] = React.useState(null)
    const [historyModalOpen, setHistoryModalOpen] = React.useState(false)
    

    const statusStyling = {
        "PAYEE" :{ style : "bg-green-100 text-green-600" , icon : <CircleCheck className='size-4' />, Label : "Payé" },
        "EN_ATTENTE" :{ style : "bg-yellow-100 text-yellow-600" , icon : <Loader className='size-4' />, Label : "Partiellement payé" },
        "SUR_PAYE" : {style : "bg-blue-100 text-blue-600" , icon: <CircleAlert className='size-4'/> , Label : "À Rembourser - Excédent de paiement suite à la réduction de la durée." },
        "IMPAYE" :{ style : "bg-red-100 text-red-600" , icon : <XCircle className='size-4' />, Label : "Impayé" },
    }

    const handleHistory = (contrat) => {
        setSelectedContratId(contrat)
        setHistoryModalOpen(true)
    }

    const handleCloseHistory = () => {
        setHistoryModalOpen(false)
        setSelectedContratId(null)
    }

    const handleOpenDetail = (contratId) => {
        setSelectedContratId(contratId)
        setDetailModalOpen(true)
    }

    const handleCloseDetail = () => {
        setDetailModalOpen(false)
        setSelectedContratId(null)
    }

    const columns = useMemo(() => [
        {
            id: "drag",
            header: () => null,
            cell: ({ row }) => <DragHandle id={row.original.id_contrat} />,
            meta: { width: '4%' },
        },
        {
    id: "select",
   header: ({ table }) => {
  // Rows that can be selected (hasInvoice === false)
  const eligibleRows = table
    .getRowModel()
    .rows.filter(row => row.original.hasInvoice === false);
  
  // Compute checkbox state
  const allSelected = eligibleRows.length > 0 && eligibleRows.every(r => r.getIsSelected());
  const someSelected = eligibleRows.some(r => r.getIsSelected());
  
  return (
    <div className="flex items-center justify-center">
      <Checkbox
        disabled={eligibleRows.length === 0 || (!allSelected && !someSelected)}
        checked={allSelected ? true : someSelected ? true : false}
        onCheckedChange={(value) => {
          const shouldSelect = !!value;
          eligibleRows.forEach(row => {
            row.toggleSelected(shouldSelect);
          });
        }}
        aria-label="Select all without invoice"
      />
    </div>
  );
},
    cell: ({ row , table }) => {
        const thisClient = row.original?.client.id_client;
        const rowid = Object.keys(table.getState().rowSelection)[0] ;
        const selectedContractsClient = table.getCoreRowModel().rowsById[rowid]?.original?.client.id_client;
        
        if (row.original?.hasInvoice || (selectedContractsClient && (selectedContractsClient !== thisClient))) { return null}
        return (
            <div className="flex items-center justify-center">
                <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        </div>
        );
    },
    enableSorting: false,
  },
         {
            id: 'reference',
            accessorFn: row => row?.reference,
            header: 'Référence',
            cell: ({ row }) => {
                return <span className="font-medium ">
                    {row.original?.reference} 
                    {
                        row.original?.hasInvoice ? 
                        <ToolTipCustom message="Facture liée"

                        trigger={<FileCheck className='inline-block size-3.5 ml-1 mb-0.5 text-green-600'  />}
                        />
                        : <ToolTipCustom message="Aucune facture liée"

                        trigger={<FileX className='inline-block size-3.5 ml-1 mb-0.5 text-orange-600' />}
                        />
                    }
                </span>
            },
            meta: { width: '16%' },

        },

        {
            id: 'periode_contrat',
            accessorFn: row => `${formatDateDDmmmmYYYY(row?.date_debut_contrat)} - ${formatDateDDmmmmYYYY(row?.date_fin_contrat)}`,
            header: 'Début/Fin',
            cell: ({  row }) => {
                return <span className='flex flex-col'>
                    <span className='font-semibold'>{formatDateDDmmmmYYYY(row?.original?.date_debut_contrat) || "_"} </span>
                    <span className='text-xs leading-none text-gray-500 text-truncate'>{formatDateDDmmmmYYYY(row?.original?.date_fin_contrat) || "_" } </span>
                </span>
            },
            meta: { width: '16%' },
        },

        {
            accessorFn: row => FormatDateEEEEddMMyyyy(row?.facture?.reference),
            header: 'Facture',
            cell: ({ row }) => {
                const cell = row.original?.facture?.reference
                return <span className={`font-medium`}>
                    {cell || "_" }
                </span>
                
            },
            meta: { width: '16%' },
        },

        

        
        {
            accessorFn: row => row?.client?.id_client,
            header: 'Client',
            cell: ({ row }) => {
 
                    return (<ToolTipCustom
                    trigger={<span className='laptop:w-[150px] desktop:w-[200px] gap-2 flex  items-center laptop:max-w-[150px] desktop:max-w-[200px] truncate'>
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
                const reste = parseFloat(row.original?.reste) || 0
                return <span className='flex flex-col'>
                    <span className='font-semibold'>{cell.getValue() || 0} TTC</span>
                    <span className='text-xs leading-none text-gray-500 text-truncate'>{reste ? (row?.original?.status_contrat === "SUR_PAYE" ? "+" : "-") + reste : ""} </span>
                </span>
            },
            meta: { width: '10%' },
        },

        
        
        {
            accessorKey: 'status_contrat',
            header: 'Status',
            cell: ({ cell }) => {
                return <span className='w-full flex '><ToolTipCustom
                    message={statusStyling[cell.getValue()]?.Label || cell.getValue()}
                    trigger={<span className={`ml-2 inline-flex items-center gap-2 rounded-full px-1 py-1 text-sm font-medium ${statusStyling[cell.getValue()]?.style || "bg-gray-100 text-gray-800" }`}>
                        {statusStyling[cell.getValue()]?.icon && statusStyling[cell.getValue()]?.icon }
                    </span>}
                /></span>
            },
            meta: { width: '8%' },
        },

        {
            accessorKey: 'prix_mois',
            header: <ToolTipCustom 
                        message={<span >
                            Ce montant correspond aux revenus générés uniquement <br/> sur les jours actifs du contrat pour ce mois.
                        </span>}
                    trigger={<span className='flex gap-0.5 cursor-pointer'>Montant/Mois <Info className='size-3' /></span>} />,
            cell: ({ cell  }) => {
                return <span className='font-semibold'>{parseFloat(cell.getValue()) || 0} TTC</span>
            },
            meta: { width: '10%' },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                if(row.original?.cantEdit) {
                    return null
                }
                return <div> 
                    
                    
                    <ToolTipCustom
                        trigger={
                        <Button variant="ghost" size="sm" onClick={() => handleOpenDetail(row.original.id_contrat)}>
                            <EyeIcon />
                            <span className="sr-only">Voir contrat</span>
                        </Button>}
                        message="Voir contrat"
                    />

                    <ToolTipCustom
                        trigger={
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleHistory(row.original)}
                        >
                            <HistoryIcon />
                            <span className="sr-only">Histoire de paiement</span>
                        </Button>}
                        message="Voir l'histoire des paiements sur cette contrat"
                    />
                </div>
                    
            },
            meta: { width: '4%' },
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
    () => data?.map(({ id_contrat }) =>  id_contrat) || [],
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
    getRowId: (row) => row?.id_contrat.toString(),
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

        <div className="flex w-full items-center justify-between  ">
                <div className='flex gap-4'>
                    <Button disabled={Object.keys(rowSelection).length === 0} onClick={() => setMultipleOpen(true)}>
                        <Plus />
                        <span>Générer facture 
                            {Object.keys(rowSelection).length > 0 && ` (${Object.keys(rowSelection).length})`}
                        </span>
                    </Button>
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

                    <Select value={columnFilters.find(cf => cf.id === "status_contrat")?.value || "all"} onValueChange={(value) => {
                            setColumnFilters((old) => {
                                const otherFilters = old.filter(cf => cf.id !== "status_contrat")
                                if (value === "all") {
                                    return otherFilters
                                }
                                return [...otherFilters , {id:"status_contrat" , value}]
                            }
                        )}}>
                            <SelectTrigger className="w-[164px]">
                                <SelectValue  />
                            </SelectTrigger>
                            <SelectContent className="max-h-68">
                                <SelectItem key={"all-status"} value={"all"}>
                                    Tous les statuts
                                </SelectItem>
                                <SelectItem key={"SUR_PAYE"} value={"SUR_PAYE"}>
                                    <span className='p-1 bg-blue-100 text-blue-600 rounded-full'><CircleAlert className='size-4 text-blue-600'/></span> À Rembourser
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
                    placeholder="Rechercher un contrat..."
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
                                <DraggableRow key={row.id} row={row} id={"id_contrat"} />
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
                    rowSelection && Object.keys(rowSelection).length > 0 ? `${Object.keys(rowSelection).length} sélectionné(s)` : table.getFilteredRowModel().rows.length === 0 ? "" :
                    <span className='flex gap-2'>{table.getFilteredRowModel().rows.length} contrat(s)
                    <Separator className='rotate-90 !w-3 self-center ' />
                    <span>{"Total : "+table.getFilteredRowModel().rows.reduce((acc, row) => acc + row?.original?.prix_total || 0, 0)+" TTC"} </span>

                     {
                        table.getFilteredRowModel().rows.reduce((acc, row) => acc + (parseFloat(row?.original?.prix_mois) || 0), 0) > 0 ?
                            <><Separator className='rotate-90 !w-3 self-center ' />
                            <span className='text-blue-600 '>Total Mois : {table.getFilteredRowModel().rows.reduce((acc, row) => acc + (parseFloat(row?.original?.prix_mois) || 0),0)} TTC</span></>
                        : null
                    }

                     {
                        (table.getFilteredRowModel().rows.reduce((acc, row) => acc +  ( parseFloat(row?.original?.prix_total) || 0) - (parseFloat(row?.original?.reste) || 0),0)) > 0 ?
                            <><Separator className='rotate-90 !w-3 self-center ' />
                            <span className='text-green-600 '>Payé : {table.getFilteredRowModel().rows.reduce((acc, row) => acc + ((parseFloat(row?.original?.prix_total) || 0) - (parseFloat(row?.original?.reste) || 0)),0)} TTC</span></>
                        : null
                    }

                    {
                        table.getFilteredRowModel().rows.reduce((acc, row) => acc + (parseFloat(row?.original?.reste) || 0),0) > 0 &&
                            <><Separator className='rotate-90 !w-3 self-center ' />
                            <span className='text-red-500 '>Impayé : {table.getFilteredRowModel().rows.reduce((acc, row) => acc + (parseFloat(row?.original?.reste) || 0),0)} TTC</span></>

                        
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



        <CreateFactureMultiple open={multipleOpen} onClose={() => setMultipleOpen(false)} contrats={Object.keys(rowSelection).filter(key => rowSelection[key]).map(key => ({ id_contrat: table.getRow(key)?.original.id_contrat , sequence: table.getRow(key)?.original?.reference }))} />

        {
            detailModalOpen && selectedContratId ?
            <DetailContratModal 
            id={selectedContratId} 
            open={detailModalOpen} 
            onClose={handleCloseDetail}
            /> : null
        }
        

         {
            historyModalOpen && selectedContratId && (
                <ViewHistory 
                    open={historyModalOpen}
                    onClose={handleCloseHistory} 
                    entityType="contrat"
                    entityNumber={selectedContratId.sequence_contrat}
                    id={selectedContratId.id_contrat}
                    totalAmount={selectedContratId.prix_total} // Adjust if needed
                    isForDepense={false}
                    isOverPaid={selectedContratId.status_contrat === "SUR_PAYE"}
                    useMutate={useFetchPaimentContrat}
                />
            )
        }
    </div>
  )
}

export default ContratsTable

