import React, {  useEffect, useMemo, useState } from 'react'
import { DragHandle , DraggableRow } from './dragable'
import {  ChevronsLeft , X , ChevronRight, ChevronsRight, ChevronLeft, ImageIcon, TriangleAlert, Settings, HistoryIcon, CheckCircle2 } from 'lucide-react'
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
import ReactDOM from "react-dom";


const PaiementsTable = ({ initialData , fournisseurs , clients }) => {

    const [maximizedFacture, setMaximizedFacture] = React.useState(null)
    const [canSlide, setCanSlide] = useState(false);
    const [viewedFacture , setViewedFacture] = useState(null)
    

    
    const closeFact = () => {
        setMaximizedFacture(null)
        setViewedFacture(null)
    }

    const openFact = (path , cell , canOpenInvoice) => {
        if(!canOpenInvoice) return
        setMaximizedFacture({ url: path[0] , label : cell , index : 0} )
        setViewedFacture( path  )
    }

    const handleNextFact = () => {
        if(!maximizedFacture) return
        const currentIndex = viewedFacture?.indexOf(maximizedFacture.url);
        if(currentIndex === -1) return
        const nextIndex = (currentIndex + 1) % viewedFacture?.length;
        const nextUrl = viewedFacture[nextIndex];
        setMaximizedFacture({  ...maximizedFacture ,url: nextUrl , index : nextIndex});
    }

    const handlePrevFact = () => {
        if(!maximizedFacture) return
        const currentIndex = viewedFacture?.indexOf(maximizedFacture.url);
        if(currentIndex === -1) return
        const prevIndex = (currentIndex - 1 + viewedFacture.length) % viewedFacture.length;
        const prevUrl = viewedFacture[prevIndex];
        setMaximizedFacture({ ...maximizedFacture , url: prevUrl , index : prevIndex });
    }


    const columns = useMemo(() => [
        {
            id: "drag",
            header: () => null,
            cell: ({ row }) => <DragHandle id={row.original.id_paiement} />,
            meta: { width: '4%' },
        },
        {
            accessorFn: row => FormatDateEEEEddMMyyyy(row?.date_paiement),
            header: 'Date',
            cell: ({ row }) => {
                const cell = row.original?.date_paiement
                return <span>
                    { cell ? formatDateDDmmmmYYYY(cell) : "_"}
                </span>
                
            },
            meta: { width: '16%' },
        },
        {
            accessorKey: 'methode',
            header: 'Type',
            cell: ({ cell }) => {
                return <span>
                    { cell.getValue() || "_"}
                </span>
                
            },
            meta: { width: '10%' },
        },
        {
            accessorKey: 'reference',
            header: 'Référence',
            cell: ({ cell }) => {
                return <span>
                    { cell.getValue() || "_"}
                </span>
                
            },
            meta: { width: '12%' },
        },

        {
            id: 'transaction',
            accessorFn: row => row?.isForDep ? "out" : row?.isForCr ? row.montant > 0 ? "in" : "out" : "",
            header: 'Transaction',
            cell: null,
            enableColumnFilter: true,
        },

        {
            accessorKey : 'montant',
            header: 'Montant',
            cell: ({  row }) => {

                return <span className={`font-medium ${row?.original?.isForDep ? "text-red-600" : row?.original?.isForCr ? row.original?.montant > 0 ? "text-green-600" : "text-red-600" : "text-gray-500"}`}>
                    {
                        row?.original?.isForDep ? "-" : row?.original?.isForCr ? row.original?.montant > 0 ? "+" : "" : ""
                    }
                    {row?.original?.montant || 0} TTC
                    </span>
            },
            meta: { width: '12%' },
        },
        {
            accessorKey: 'object',
            header: 'Objet',
            cell: ({ row }) => {
                const path = row.original?.facture_image_path
                const canOpenInvoice = path && row.original?.isForDep && path.length > 0
                const cell = row.original?.object
                return <span onClick={()=> {openFact(path , cell , canOpenInvoice) ; setCanSlide(path.length>1)}} className={`font-medium ${canOpenInvoice ? "text-blue-700 cursor-pointer hover:text-blue-800 group-hover:underline" : ""}`}>
                    {cell} 
                    {/*
                        
                        canOpenInvoice ? 
                        <ImageIcon className='inline-block size-3 ml-1  mb-0.5' />
                        : null*/
                    }
                </span>
               
            },
            meta: { width: '12%' },

        },
        
        {
            id : "fournisseur_client",
            accessorFn: row => row.isForDep ?  row?.fournisseur?.nom_fournisseur || "Sans fournisseur" :
                row?.contrat?.client?.id_client  || "Sans client" 
            ,
            header: 'Fournisseur/Client',
            cell: ({ row }) => {
                console.log('Rerender fournisseur_client cell' , row?.original)
                const path = row?.original?.fournisseur?.logo_fournisseur
                if (row?.original?.client?.nom_client || row?.original?.isForCr) {
                    return (<ToolTipCustom
                    trigger={<span className='w-fit gap-2 flex  items-center max-w-[180px] truncate'>
                        <Avatar className="size-6 inline-block rounded-full object-cover ">
                            <AvatarFallback className='text-xs font-semibold'>
                                {
                                    // Get initials from client name
                                    row?.original?.contrat?.client?.nom_client ? row?.original?.contrat?.client?.nom_client.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)  : "?"
                                }
                            </AvatarFallback>
                        </Avatar>
                        <span className='inline-block truncate'>{row?.original?.contrat?.client?.nom_client || "Sans client"}</span>
                    </span>}
                    message={row?.original?.contrat?.client?.nom_client || "Sans client"}
                    />)
                } else if (row?.original?.fournisseur?.nom_fournisseur || row?.original?.isForDep) {
                return (<ToolTipCustom
                trigger={<span className='w-fit gap-2 flex  items-center laptop:max-w-[150px] desktop:max-w-[200px] truncate'>
                    
                <Avatar className="size-6 inline-block rounded-full ">
                    <AvatarImage src={path}  alt={row?.original?.fournisseur?.nom_fournisseur || "Sans fournisseur"} className={"object-cover"}/>
                    <AvatarFallback className='text-xs font-semibold'>?</AvatarFallback>
                </Avatar>
                    <span className='inline-block truncate'>{row?.original?.fournisseur?.nom_fournisseur || "Sans fournisseur"}</span>
                </span>}
                message={row?.original?.fournisseur?.nom_fournisseur || "Sans fournisseur"}
                />)}

                else  {
                    return <span className='ml-2'>
                        _
                    </span>
                }
                
            },
            meta: { width: '20%' },
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
    () => data?.map(({ id_paiement }) =>  id_paiement) || [],
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
    getRowId: (row) => row?.id_paiement.toString(),
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


      console.log('Rerender PaiementsTable',columnFilters)



  return (
    <div className='w-full h-full  grid grid-rows-[1fr_32px] gap-4'>
        <div className='h-full w-full flex flex-col gap-4'>

            <PaiementsHeader clients={clients} fournisseurs={fournisseurs} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} columnFilters={columnFilters} setColumnFilters={setColumnFilters} />
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
                                <DraggableRow key={row.id} row={row} id={"id_paiement"} />
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
                {table.getFilteredRowModel().rows.length === 0 ? "" : `${table.getFilteredRowModel().rows.length} paiement(s)`}
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

export default PaiementsTable


const PaiementsHeader= ({globalFilter, setGlobalFilter , columnFilters , setColumnFilters , fournisseurs , clients}) => {

    const montantFilter = columnFilters.find(filter => filter.id === 'transaction')?.value || ''
    const [client , setClient] = React.useState("all")
    const [fns , setFns] = React.useState("all")

    useEffect(() => {
        if(fns !== "all") {
            setClient("all")
            setColumnFilters((prev) => [...prev.filter((f) => f.id !== 'fournisseur_client'), { id: 'fournisseur_client', value: fns }])
        } else if(client === "all") {
            setColumnFilters((prev) => [...prev.filter((f) => f.id !== 'fournisseur_client')])
        }
    }, [fns])

    useEffect(() => {
        if(client !== "all") {
            setFns("all")
            setColumnFilters((prev) => [...prev.filter((f) => f.id !== 'fournisseur_client'), { id: 'fournisseur_client', value: client }])
        } else if(fns === "all") {
            setColumnFilters((prev) => [...prev.filter((f) => f.id !== 'fournisseur_client')])
        }
    }, [client])

  
    
    return (
        <div className="flex w-full items-center justify-between  ">
                <div className='flex gap-2'>
                {
                    ["","in","out"].map((status) => (
                        <div key={status} className='flex flex-col'>
                            <span
                            className={`cursor-pointer rounded-md h-full px-4 py-2  text-sm font-medium ${status === montantFilter ? "bg-rod-primary hover:bg-rod-primary/90 text-white " : "text-foreground hover:bg-muted border"}`}

                            onClick={() => setColumnFilters((prev) => [...prev.filter((f) => f.id !== 'transaction'), { id: 'transaction', value: status }])} variant={status === montantFilter ? "default" : "outline"}>
                                {status === "" ? "Tous" : status === "in" ? "Entrant" : "Sortant"}
                            </span>
                        </div>
                    ))
                }
                <Select value={fns} onValueChange={setFns} >
                    <SelectTrigger className="w-[208px] ml-2">
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

                <Select value={client} onValueChange={setClient} >
                    <SelectTrigger className="w-[208px] ml-2">
                        <SelectValue  />
                    </SelectTrigger>
                    <SelectContent className="max-h-68">
                        <SelectItem key={"all-fournisseur"} value={"all"}>
                            Tous les client
                        </SelectItem>
                        {clients.map((c , index) => (
                            <SelectItem key={index} value={c?.id_client}>
                                <Avatar className="size-5 rounded-full object-cover mr-0.5 inline-block">
                                    <AvatarFallback className='text-xs font-semibold'>
                                        {
                                            // Get initials from client name
                                            c.nom_client ? c.nom_client.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : "?"
                                        }
                                    </AvatarFallback>
                                </Avatar>
                                    {c.nom_client}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                </div>
                <Input 
                    placeholder="Rechercher une paiement..."
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="w-[300px] "
                />

            </div>
    )
}