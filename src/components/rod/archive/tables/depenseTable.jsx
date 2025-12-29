import React, { useEffect, useMemo, useState } from 'react'
import { DragHandle , DraggableRow } from './dragable'
import { Info , ChevronsLeft , X , ChevronRight, ChevronsRight, ChevronLeft, CircleCheck, Loader, XCircle, ImageIcon, Settings, HistoryIcon, CheckCircle2, FileX, Trash2, Eye  } from 'lucide-react'
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
import { Label } from '@/components/ui/label'
import { Avatar  , AvatarFallback , AvatarImage} from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '../../../customUi/animatedCheckbox'
import { calculateRowsArchive } from '../../../../utils/rowsCalculator'
import ToolTipCustom from '../../../customUi/tooltip'
import { archiveCosts } from '../../../../utils/costs' 
import { formatDateDDmmmmYYYY, FormatDateEEEEddMMyyyy } from '../../../../utils/dateConverter'
import ReactDOM from "react-dom";
import EditDepenseModal from '../../../modals/archive/EditDepenseModal'
import { DeleteDepenseModal} from '../../../modals/depense/DepenseActions/DeleteDepenseModal'
import { ViewDepenseModal } from '../../../modals/depense/DepenseActions/ViewDepenseModal'
import ViewHistory from '../../../modals/archive/viewHistory'
import useFetchPaimentDepense from '../../../../api/queries/depense/useFetchPaiementDepense'


const DepenseTable = ({ initialData , fournisseurs , types }) => {


    const statusStyling = {
        "PAYEE" :{ style : "bg-green-100 text-green-600" , icon : <CircleCheck className='size-4' />, Label : "Payé" },
        "EN_ATTENTE" :{ style : "bg-yellow-100 text-yellow-600" , icon : <Loader className='size-4' />, Label : "Partiellement payé" },
        "IMPAYE" :{ style : "bg-red-100 text-red-600" , icon : <XCircle className='size-4' />, Label : "Impayé" },
    }
    
    const [selectedDepense, setSelectedDepense] = useState(null)
    const [viewModalOpen, setViewModalOpen] = useState(false)
    const [historyOpen , setHistoryOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [viewedFacture , setViewedFacture] = useState(null)
    const [maximizedFacture, setMaximizedFacture] = useState(null)
    const [canSlide, setCanSlide] = useState(false);
        console.log('selected depense ' , selectedDepense);


    const closeFact = () => {
        setMaximizedFacture(null)
        setViewedFacture(null)
        
    }

    const openFact = (path , cell) => {
        if(!path) return
        setMaximizedFacture({ url: path[0] , label : cell  , index : 0} )
        setViewedFacture( path  )
    }

    const handleNextFact = () => {
        if(!maximizedFacture) return
        
        const currentIndex = viewedFacture?.indexOf(maximizedFacture.url);
        console.log('viewedFacture' , viewedFacture , maximizedFacture , currentIndex);
        if(currentIndex === -1) return
        const nextIndex = (currentIndex + 1) % viewedFacture?.length;
        const nextUrl = viewedFacture[nextIndex];
        setMaximizedFacture({  ...maximizedFacture , url: nextUrl , index : nextIndex });
    }

    const handlePrevFact = () => {
        if(!maximizedFacture) return
        const currentIndex = viewedFacture?.indexOf(maximizedFacture.url);
        if(currentIndex === -1) return
        const prevIndex = (currentIndex - 1 + viewedFacture?.length) % viewedFacture?.length;
        const prevUrl = viewedFacture[prevIndex];
        setMaximizedFacture({ ...maximizedFacture ,  url: prevUrl , index: prevIndex });
    }

    const handleHistoryDepense = (depense) => {
        setSelectedDepense(depense)
        setHistoryOpen(true)
    }

    const handleCloseHistoryDepense = () => {
        setHistoryOpen(false)
        setSelectedDepense(null) 
    }

    const handleOpenEditModal = (depense) => {
        setSelectedDepense(depense)
        setEditModalOpen(true)
    }

    const handleCloseEditModal = () => {
        setEditModalOpen(false)
        setSelectedDepense(null)
    }

    const handleOpenViewModal = (depense) => {
        setSelectedDepense(depense)
        setViewModalOpen(true)
    }

    const handleCloseViewModal = () => {
        setViewModalOpen(false)
        setSelectedDepense(null)
    }

    const handleOpenDeleteModal = (depense) => {
        setSelectedDepense(depense)
        setDeleteModalOpen(true)
    }

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false)
        setSelectedDepense(null)
    }

    const columns = useMemo(() => [
        {
            id: "drag",
            header: () => null,
            cell: ({ row }) => <DragHandle id={row.original.id_depense} />,
            meta: { width: '4%' },
        },
        {
            id: 'facture_image_path',
            accessorFn: row => row?.hasInvoice ? row?.recu_depense : row?.sequence_depense,
            header: 'Facture',
            cell: ({ row }) => {
                const path = row.original?.facture_image_path
                const cell = row.original?.hasInvoice ? row?.original?.recu_depense : row?.original?.sequence_depense
                return <span onClick={()=> {openFact(path , cell) ; setCanSlide(path.length>1)}} className={`font-medium ${( path && path.length > 0) ? "text-blue-700 cursor-pointer hover:text-blue-800 group-hover:underline" : ""}`}>
                    {cell}
                    {
                        !row.original?.hasInvoice ?
                        <ToolTipCustom message="Aucune facture affectée"

                        trigger={<FileX className='inline-block size-3.5 ml-1 mb-0.5 text-orange-500' />}
                        />
                        :
                        /*(path && path.length > 0) ? 
                        <ImageIcon className='inline-block size-3 ml-1  mb-0.5' />
                        :*/ null
                    }
                </span>
               
            },
            meta: { width: '12%' },

        },
        {
            accessorFn:  row => FormatDateEEEEddMMyyyy(row?.date_depense),
            header: 'Date',
            cell: ({ row }) => {
                const cell = row.original?.date_depense
                return <span>
                    { cell ? formatDateDDmmmmYYYY(cell) : "_"}
                </span>
                
            },
            meta: { width: '10%' },
        },
        {
            id : "fournisseur_nom",
            accessorFn: row => row?.fournisseur?.nom_fournisseur || "Sans fournisseur",
            header: 'Fournisseur',
            cell: ({ row }) => {
                const path = row?.original?.fournisseur?.logo_fournisseur
                return <ToolTipCustom
                trigger={<span className='w-fit gap-2 flex  items-center max-w-[180px] truncate'>
                    
                <Avatar className="size-6 border inline-block rounded-full ">
                    <AvatarImage src={path}  alt={row?.original?.fournisseur?.nom_fournisseur || "Sans fournisseur"} className={"object-cover"} />
                    <AvatarFallback className='text-xs font-semibold'>?</AvatarFallback>
                </Avatar>
                    <span className='inline-block truncate'>{row?.original?.fournisseur?.nom_fournisseur || "Sans fournisseur"}</span>
                </span>}
                message={row?.original?.fournisseur?.nom_fournisseur || "Sans fournisseur"}
                />
            },
            meta: { width: '14%' },
        },
        {
            //TODO
            id: "type_depense",
            accessorKey : "type_depense",
            header : "Type / Class",
            cell : ({ cell , row }) => {

                const cost = archiveCosts.find(c => c.value === cell.getValue())
                return <span className='flex flex-col items-start'>

                    <ToolTipCustom trigger={<span className=' max-w-[200px] truncate'>{cost?.label || "Divers"}</span>}
                    message={cost?.label || "Dépense divers"}
                    />
                    <span className='text-xs leading-none text-gray-500 text-truncate'> {row.original?.class_comptable_depense}  </span>
                </span>
            },
            meta: { width: '16%' },
        },
        {
            accessorKey: 'montant_depense',
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
            meta: { width: '8%' },
        },{
            accessorKey: 'status_depense',
            header: 'Status',
            cell: ({ cell }) => {
                return <span className='w-full flex '><ToolTipCustom
                    message={statusStyling[cell.getValue()]?.Label || cell.getValue()}
                    trigger={<span className={`ml-2 inline-flex items-center gap-2 rounded-full px-1 py-1 text-sm font-medium ${statusStyling[cell.getValue()]?.style || "bg-gray-100 text-gray-800" }`}>
                        {statusStyling[cell.getValue()]?.icon && statusStyling[cell.getValue()]?.icon }
                    </span>}
                /></span>
            },
            meta: { width: '6%' },
        },{
            id: 'deductible',
            accessorFn: row => row?.deductible,
            header: <ToolTipCustom message={<>
                        <span className='font-medium'>TVA % :</span> le taux légal de TVA appliqué (ex : 19%). <br />
                        <span className='font-medium'>Déductible % :</span> la part de cette TVA que vous pouvez récupérer. 
                    </>}
            trigger={<span className='flex gap-0.5 cursor-pointer'>TVA <Info className='size-3' /></span>} />,
            cell: ({ row }) => {
                
                return <span className='flex flex-col'>
                    <span className=''>{row.original?.tva_depense || 0} %</span>
                    {
                        row.original?.tva_depense ?
                             <span className='text-xs leading-none text-gray-500 text-truncate'>{row.original?.taux_deduction_tva * 100}  % </span>
                        : null

                    }
                </span>
            },
            meta: { width: '6%' },
        },
        {
            id: 'ras',
            accessorFn: row => row?.ras,
            header: <ToolTipCustom message={"Retenue à la source (RAS) appliquée sur cette dépense."}
            trigger={<span className='flex gap-0.5 cursor-pointer'>RAS <Info className='size-3' /></span>} />,
            cell: ({ row }) => {
                
                return <span className=''>{row.original?.ras ? row.original?.ras + " DT" : "_"} </span>
                
            },
            meta: { width: '6%' },
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
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleOpenViewModal(row.original)}
                        >
                            <Eye />
                            <span className="sr-only">Détails Dépense</span>
                        </Button>}
                        message="Voir les détails de la dépense"
                    />

                    <ToolTipCustom
                        trigger={
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleHistoryDepense(row.original)}
                        >
                            <HistoryIcon />
                            <span className="sr-only">Histoire de paiement</span>
                        </Button>}
                        message="Voir l'histoire des paiements sur cette dépense"
                    />

                    <ToolTipCustom
                        trigger={
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleOpenEditModal(row.original)}
                        >
                            <Settings />
                            <span className="sr-only">supprimer</span>
                        </Button>}
                        message="Modifier la dépense"
                    />
                    
                    <ToolTipCustom
                        trigger={
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleOpenDeleteModal(row.original)}
                        >
                            <Trash2 className="text-red-600" />
                            <span className="sr-only">Supprimer</span>
                        </Button>}
                        message="Supprimer la dépense"
                    />
                </div>
            },
            meta: { width: '6%' },
        }
    ], [])

  const [data, setData] = React.useState(() => initialData)
  useEffect(() => {
      setData(initialData)
  
      // Cleanup function 
      return () => {}
  
    }, [initialData])
  const [columnFilters, setColumnFilters] = React.useState( [] )
  const [sorting, setSorting] = React.useState([])
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,   
    pageSize: calculateRowsArchive(window.innerHeight, window.innerWidth),
  })

      console.log(initialData , columnFilters);


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
    () => data?.map(({ id_depense }) =>  id_depense) || [],
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination,
      globalFilter
    },
    getRowId: (row) => row?.id_depense.toString(),
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

            <DepenseHeader types={types} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} columnFilters={columnFilters} setColumnFilters={setColumnFilters} fournisseurs={fournisseurs} />
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
                            <DraggableRow key={row.id} row={row} id={"id_depense"} />
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
                {<span className='flex gap-2'>{table.getFilteredRowModel().rows.length} dépense(s)
                <Separator className='rotate-90 !w-3 self-center ' />
                <span>{"Total : "+table.getFilteredRowModel().rows.reduce((acc, row) => acc + row.original.montant_depense, 0)+" TTC"} </span>

                    {
                    (table.getFilteredRowModel().rows.reduce((acc, row) => acc +  ( parseFloat(row.original.montant_depense) || 0) - (parseFloat(row?.original?.reste) || 0),0)) > 0 ?
                        <><Separator className='rotate-90 !w-3 self-center ' />
                        <span className='text-green-600 '>Payé : {table.getFilteredRowModel().rows.reduce((acc, row) => acc + (parseFloat(row?.original?.montant_depense) || 0) - (parseFloat(row?.original?.reste) || 0),0)} TTC</span></>
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

        {viewModalOpen && selectedDepense && (
          <ViewDepenseModal open={viewModalOpen} data={{id : selectedDepense.id_depense , sequence: selectedDepense.sequence_depense }} close={handleCloseViewModal} />
        )}

        {
            historyOpen && selectedDepense && (
                <ViewHistory 
                    open={historyOpen}
                    onClose={handleCloseHistoryDepense} 
                    entityType="depense"
                    entityNumber={selectedDepense.sequence_depense}
                    id={selectedDepense.id_depense}
                    totalAmount={selectedDepense.montant_depense} // Adjust if needed
                    isForDepense={true}
                    useMutate={useFetchPaimentDepense}
                />
            )
        }
        


        {editModalOpen && selectedDepense && (
            <EditDepenseModal
                open={editModalOpen}
                depenseData={{
                    id_depense: selectedDepense.id_depense,
                    sequence_depense: selectedDepense.sequence_depense,
                    deductible : selectedDepense.deductible,
                    tva_depense: selectedDepense.tva_depense,
                    class_comptable_depense: selectedDepense.class_comptable_depense,
                    recu_depense: selectedDepense.recu_depense || "",
                    taux_deduction_tva: selectedDepense.taux_deduction_tva
                }}
                onClose={handleCloseEditModal} 
            />
        )}

        {deleteModalOpen && selectedDepense && (
            <DeleteDepenseModal 
                open={deleteModalOpen}
                data={{ 
                    id: selectedDepense.id_depense, 
                    sequence: selectedDepense.sequence_depense 
                }}
                close={handleCloseDeleteModal}
            />
        )}

        
        {maximizedFacture &&
            ReactDOM.createPortal(
            <div
                className="fixed inset-0 z-[100] bg-rod-primary/80 backdrop-blur-xs flex items-center justify-center p-4"
                onClick={closeFact}
                style={{ pointerEvents: 'auto' }} // make sure it's clickable
            >


                {/* Invisible blocker to prevent background interactions */}
                <div className="absolute inset-0 z-0" />

                {/* Content wrapper that stops propagation */}
                <div
                className="relative z-10 max-w-full max-h-full flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
                >
                {/* Close Button */}
                <button
                    onClick={(e) => {
                    e.stopPropagation();
                    closeFact();
                    }}
                    className="fixed top-4 right-4 cursor-pointer transition-all duration-300 ease-in-out  flex items-center justify-center"
                >
                    <X className="w-6 h-6 text-gray-300 hover:text-gray-400" />
                </button>

                {/* Navigation Buttons */}
                {canSlide ? <>
                    <button
                        onClick={(e) => {
                        e.stopPropagation();
                        handlePrevFact();
                        }
                        }
                        className="fixed top-1/2 left-4 -translate-y-1/2 cursor-pointer transition-all duration-300 ease-in-out  flex items-center justify-center"
                    >
                        <ChevronLeft className="w-8 h-8 text-gray-300 hover:text-gray-400" />
                    </button>
                    <button 
                        onClick={(e) => {
                        e.stopPropagation();
                        handleNextFact();
                        }}
                        className="fixed top-1/2 right-4 -translate-y-1/2 cursor-pointer transition-all duration-300 ease-in-out  flex items-center justify-center"
                    >
                        <ChevronRight className="w-8 h-8 text-gray-300 hover:text-gray-400" />
                    </button>
                </> : null}

                {/* Image */}
                <img
                    src={maximizedFacture.url}
                    alt={maximizedFacture.label}
                    className="max-w-full max-h-[80dvh] object-contain rounded-lg shadow-2xl"
                />

               

                {/* Caption */}
                <div className="mt-6 text-center text-white">
                    <h2 className="text-2xl font-semibold">{maximizedFacture.label}</h2>
                    <h2 className='text-sm font-semibold text-gray-300'>{maximizedFacture.index + 1} / {viewedFacture.length}</h2>
                </div>
                </div>
            </div>,
            document.body
        )}
    </div>
  )
}

export default DepenseTable


const DepenseHeader = ({globalFilter, setGlobalFilter , fournisseurs , types, columnFilters , setColumnFilters}) => {
    return (
        <div className="flex w-full items-center justify-between  ">
                <div className='flex gap-4'>
                    <Select value={columnFilters.find(cf => cf.id === "fournisseur_nom")?.value || "all"} onValueChange={(value) => {
                        setColumnFilters((old) => {
                            const otherFilters = old.filter(cf => cf.id !== "fournisseur_nom")
                            if (value === "all") {
                                return otherFilters
                            }
                            return [...otherFilters , {id:"fournisseur_nom" , value}]
                        }
                    )}}>
                        <SelectTrigger className="w-[208px]">
                            <SelectValue  />
                        </SelectTrigger>
                        <SelectContent className="max-h-68">
                            <SelectItem key={"all-fournisseur"} value={"all"}>
                                Tous les fournisseurs
                            </SelectItem>
                            {fournisseurs.map((fournisseur , index) => (
                                <SelectItem key={index} value={fournisseur?.nom_fournisseur}>
                                    <Avatar className="size-5 rounded-full object-cover mr-0.5 inline-block">
                                        <AvatarImage src={fournisseur?.logo_fournisseur}  alt={fournisseur.nom_fournisseur} />
                                        <AvatarFallback className='text-xs font-semibold'>?</AvatarFallback>
                                    </Avatar>
                                        {fournisseur.nom_fournisseur}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={columnFilters.find(cf => cf.id === "type_depense")?.value || "all"} onValueChange={(value) => {
                        setColumnFilters((old) => {
                            const otherFilters = old.filter(cf => cf.id !== "type_depense")
                            if (value === "all") {
                                return otherFilters
                            }
                            return [...otherFilters , {id:"type_depense" , value}]
                        }
                    )}}>
                        <SelectTrigger className="w-[164px]">
                            <SelectValue  />
                        </SelectTrigger>
                        <SelectContent className="max-h-68">
                            <SelectItem key={"all-depenses"} value={"all"}>
                                Tous les types
                            </SelectItem>

                            {
                                types.map((type , index) => {
                                    const cost = archiveCosts.find(c => c.value === type)
                                    const Icon = cost?.icon
                                    return <SelectItem key={index} value={type}>
                                        <Icon className="h-5 w-5 mr-0.5 mb-0.5" />
                                        {cost?.label}
                                    </SelectItem>
                                })
                            }

                        </SelectContent>
                    </Select>

                    <Select value={columnFilters.find(cf => cf.id === "status_depense")?.value || "all"} onValueChange={(value) => {
                        setColumnFilters((old) => {
                            const otherFilters = old.filter(cf => cf.id !== "status_depense")
                            if (value === "all") {
                                return otherFilters
                            }
                            return [...otherFilters , {id:"status_depense" , value}]
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

                    <div className='flex items-center' >
                        <Checkbox checked={columnFilters.find(cf => cf.id === "deductible")?.value || false} onCheckedChange={(value) => {
                            setColumnFilters((old) => {
                                const otherFilters = old.filter(cf => cf.id !== "deductible")
                                if (!value) {
                                    return otherFilters
                                }
                                return [...otherFilters , {id:"deductible" , value}]
                            })
                        }} />  
                        <Label className='ml-2 leading-none'>Déductible seulement</Label>                 

                    </div>
                </div>
                <Input 
                    placeholder="Rechercher une dépense..."
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="w-[300px] "
                />

            </div>
    )
}