import { searchFilter } from '../../shared/tables/searchFilter';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'; 
import { HandCoins , Icon } from 'lucide-react'; 
import { TableContent } from '../../shared/tables/TableContent';
import  Pagination  from '../../shared/Pagination';
import { useMemo , useState , useEffect } from 'react'
import useFetchDepense from '../../../api/queries/depense/useFetchDepense';
import { ToolTipImage  } from '../../customUi/tooltiplist';
import { allCosts } from '../../../utils/costs';
import { FormatDateEEEEddMMyyyy } from '../../../utils/dateConverter';
import { Badge } from '../../ui/badge';
import  ToolTipCustom  from '../../customUi/tooltip';
import { DepenseActions } from './depenseActions';
import { ViewDepenseModal } from '../../modals/depense/DepenseActions/ViewDepenseModal';
import { useStore } from '../../../store/store';
import { useQueryClient } from '@tanstack/react-query'
import { X , ChevronLeft , ChevronRight , ImageIcon } from 'lucide-react';
import ReactDOM from 'react-dom';



const DepenseContent = ({globalFilter,setGlobalFilter}) => {

   const [viewedFacture , setViewedFacture] = useState(null)
    const [maximizedFacture, setMaximizedFacture] = useState(null)
    const [canSlide, setCanSlide] = useState(false);

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

  const queryClient = useQueryClient()
  const socket = useStore(state => state.socket)

    const handleRefetchDepense = () => {
      queryClient.invalidateQueries(['depense']) // Use your actual query key
    }
      useEffect(() => {
        // Listen for socket events to refetch Depense
        if (!socket) return
        // Listen for Depense to trigger refetch

        // listen for push updates  
        socket.on('refetchDepenses', handleRefetchDepense)
      }, [socket, queryClient])


const { data , isLoading ,isError , refetch} = useFetchDepense()
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize : calculateRowsGeneral(window.innerHeight, window.innerWidth)  })
    const [openModal , setOpenModal] = useState({});

    useEffect(() => {
    const handleResize = () => {
      console.log('Window resize' , window.innerHeight, window.innerWidth , calculateRowsGeneral(window.innerHeight, window.innerWidth))
      setPagination((prev) => ({ ...prev, pageSize: calculateRowsGeneral(window.innerHeight, window.innerWidth) }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    }, []);

    const columns = useMemo(() => [
        {
          header : '\u00A0',
          id: 'image',
          accessorFn: row => row.garage ? `${row.garage.nom_voiture} ${row.garage.version_voiture} ${row.garage.matricule_garage}` : '',
          enableSorting: false,
          cell : ({ row }) => {
            const data = row.original.garage;
            const object = allCosts.find(item => item.value === row.original.type_depense);
            const IconComp = object?.icon;
            
            if (!object) return null; // Handle case where type is not found
            
            return data ? 
            <ToolTipImage  src={data.image_voiture} 
            title = {data.nom_voiture}
            version={
              <span className='flex flex-col  items-start'>
                <span className='text-base font-medium  '>{data.nom_voiture}</span>
                <span className='text-sm text-gray-700'>{data.version_voiture}</span>
                <span className='text-xs px-1.5 py-0.5 rounded-sm font-medium bg-rod-primary text-white my-1 '>{data.matricule_garage}</span>
              </span>
            } />
            :<ToolTipCustom  trigger={<span className='w-22 cursor-pointer flex items-center justify-center desktop:w-24 desktop-lg:w-24 h-12 desktop:h-13'>
                <div className={`p-3.5 flex items-center justify-center ${object?.style || "bg-rod-foreground text-rod-primary"} ring-1 ring-gray-200/50  rounded-full `}>
                  <IconComp className="shrink-0 h-5 w-5" />
                </div>
            </span>}
            message={object?.label} />
          },
          meta: { width: '11%' },
        },
        {
          header : 'Dépense',
          accessorKey: 'sequence_depense',
          sortingFn: (rowA, rowB, columnId) => {
                // Extract the numeric part after 'RP-'
                const numA = parseInt((rowA.getValue(columnId) || '').replace(/^DP-/, '')) || 0;
                const numB = parseInt((rowB.getValue(columnId) || '').replace(/^DP-/, '')) || 0;
                return numA - numB;
                },
          cell: ({ cell }) => {
            return (
              <span className="text-base desktop-lg:text-lg font-semibold ">
                {cell.getValue()}
              </span>
            );
          },
          meta: { width: '8%' },
        },
        {
          header: 'Facture',
          id : 'facture',
          accessorFn : row => row.hasInvoice ? row.recu_depense : 'Aucune facture',
           cell: ({ row }) => {
                const path = row.original?.facture_image_path
                const cell = row.original?.hasInvoice ? row?.original?.recu_depense : row?.original?.sequence_depense
                return <span onClick={()=> {openFact(path , cell) ; setCanSlide(path.length>1)}} className={`font-medium ${( path && path.length > 0) ? "text-blue-700 cursor-pointer hover:text-blue-800 group-hover:underline" : (!row?.original?.hasImage && !row?.original?.recu_depense) ? "text-gray-700 font-normal" : "" }  text-base desktop-lg:text-base  `}>
                    {
                        !row.original?.hasInvoice ?
                        (row.original?.hasImage && path && path.length > 0) ? "Aucune" : 'Aucune'
                        : row.original?.recu_depense
                    }
                    {/*
                        (row.original?.hasImage && path && path.length > 0) ? 
                        <ImageIcon className='inline-block size-3 ml-1  mb-0.5' />
                        : null
                    */}
                </span>
               
          },
          meta: { width: '14%' },
        },
        {
          header: 'Type de dépense',
          id : 'type_depense',
          accessorFn : row => allCosts.find(item => item.value === row.type_depense)?.label,
          cell: ({ row }) => {
            const object = allCosts.find(item => item.value === row.original.type_depense);
            return (
               <ToolTipCustom
            trigger = {<span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-base gap-3 font-medium bg-rod-foreground max-w-full">{<span className='truncate '>{object.label}</span>}</span>}
            message={<span className="text-sm">{object.label}</span>}
          />
            );
          },
          meta: { width: '22%' },
        },
        {
          header: 'Date du dépense',
          accessorKey: 'date_creation_depense',
          cell: ({ cell }) => {
            return (
               <span className="text-base desktop-lg:text-base font-medium  ">
                        {FormatDateEEEEddMMyyyy(cell.getValue())}
                      </span>
            );
          },
          meta: { width: '24%' },
        },
        {
          header: 'Montant',
          accessorKey: 'montant_depense',
          cell: ({ cell }) => {
            return (
              <span className={`text-base desktop-lg:text-lg font-semibold `}>{cell.getValue() ? `${cell.getValue() } DT` :<span className='ml-1.5'>_</span>}</span>
            );
          },
          meta: { width: '12%' },
        },
        {
          header: 'Statut',
          accessorKey: 'status_depense',
          cell: ({ cell }) => {
            const status = cell.getValue();
            const statusConfig = {
              PAYE: { label: 'Payé', className: 'bg-green-100 text-green-600' },
              PARTIELLE: { label: 'Partielle', className: 'bg-yellow-100 text-yellow-600' },
              NON_PAYE: { label: 'Non payé', className: 'bg-red-100 text-red-600' }
            };
            const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
            
            return (
              <Badge className={`text-sm ${config.className}`}>
                {config.label}
              </Badge>
            );
          },
          meta: { width: '11%' },
        },
        {
          header: '\u00A0',
          id:'actions',
          cell: ({ row }) =>
          ( <DepenseActions id={row.original.id_depense} depenseData={row.original} openDeleteModal={() => setOpenModal({ type: 'delete', id: row.original.id_depense ,  sequence: row.original.sequence_depense })} openDetailModal={() => setOpenModal({ type: 'detail', id: row.original.id_depense , sequence: row.original.sequence_depense })} />
           ),
          meta: { width: '4%' },
        },        
    ], []);

    const table  = useReactTable(
        { 
            data : data || [],
            columns,
            getCoreRowModel: getCoreRowModel(),
            getFilteredRowModel: getFilteredRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            getSortedRowModel: getSortedRowModel(),
            autoResetPageIndex: false,

            state: {
                globalFilter,
                sorting,
                pagination,
                
            },
            onGlobalFilterChange: setGlobalFilter,
            onSortingChange: setSorting,
            onPaginationChange: setPagination,
            globalFilterFn: searchFilter,
        }
    )


  return (
    <>
      {
        isLoading ?
        <DepenseSkeleton pageSize={pagination.pageSize} />
        :
        <TableContent isError={isError} refetch={refetch} table={table} icon={HandCoins} NoContentTitle="Oups... Pas encore de depenses ici" NoContentDescription="Votre historique de dépenses est vide pour l'instant. Toutes vos dépenses apparaîtront ici dès que vous commencerez à en enregistrer." />
      }
        <Pagination table={table} isLoading={isLoading} isError={isError} />

      {/* Modal for detail view */}
      {
        openModal?.type === 'detail' && (
          <ViewDepenseModal open={!!openModal} data={openModal} close={() => setOpenModal({})} />
        )
      }
      {/* Modal for delete confirmation */}
      {
        openModal?.type === 'delete' && (
          <DeleteDepenseModal open={!!openModal.type} data={{ id: openModal.id, sequence: openModal.sequence }} close={() => setOpenModal({})} />
        )
      }

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
    </>
  )
}

export default DepenseContent



import { Skeleton } from "../../ui/skeleton"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { DeleteDepenseModal } from '../../modals/depense/DepenseActions/DeleteDepenseModal';
import { calculateRowsGeneral } from '../../../utils/rowsCalculator';

const DepenseSkeleton = ({pageSize}) => {
  return (
    <Table className="w-full">
        <TableHeader >
          <TableRow >
            <TableHead className="w-[11%] text-gray-600">
                
            </TableHead>
            <TableHead className="w-[8%] text-gray-600">
                Dépense
                
            </TableHead>
            <TableHead className="w-[14%] text-gray-600">
                Facture
            </TableHead>
            <TableHead className="w-[22%] text-gray-600">
               Type de dépense
               
            </TableHead>
            <TableHead className="w-[24%] text-gray-600">
                 Date du dépense
            </TableHead>
            <TableHead className="w-[12%] text-gray-600">
                  Montant                
            </TableHead>
            <TableHead className="w-[11%] text-gray-600">
                  Statut                
            </TableHead>
            <TableHead className=" flex justify-end w-[4%] text-gray-600 ">
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {[...Array(pageSize)].map((_, index) => (
              <TableRow key={index}>
                <TableCell className="flex items-center justify-center">
                  <Skeleton className="size-12 desktop:size-13  ml-[20%] mr-auto rounded-full " />
                </TableCell>
                <TableCell >
                  <Skeleton className="h-4 desktop:h-4.5 w-3/4" />
                </TableCell>
                <TableCell className="space-y-1">
                  <Skeleton className="h-4 desktop:h-4.5 w-3/4" />
                  <Skeleton className="h-3.5 desktop:h-4  w-1/3" />

                </TableCell>
                <TableCell className="space-y-1">
                    <Skeleton className="h-4 desktop:h-4.5 w-3/4" />
                </TableCell>
                <TableCell className="space-y-1">
                    <Skeleton className="h-4 desktop:h-4.5 w-3/4" />
                </TableCell>
                <TableCell className="space-y-1">
                    <Skeleton className="h-4 desktop:h-4.5 w-3/4" />
                </TableCell>
                <TableCell className="space-y-1">
                    <Skeleton className="h-4 desktop:h-4.5 w-2/3" />
                </TableCell>
                <TableCell className="  ">
                  <Skeleton className="size-8 mr-4 ml-auto rounded-full" />
                </TableCell>
                </TableRow>
        ))}
        </TableBody>
      </Table>
  );
};