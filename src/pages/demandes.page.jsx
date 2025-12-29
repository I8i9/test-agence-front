import { useFetchDemandes } from '../api/queries/demande/useFetchDemandes'
import { useEffect, useMemo, useState } from 'react'
import { ToolTipImage } from '../components/customUi/tooltiplist';
import {  formatDateDDMMYYYY , formatTimeHHmm, formatDepuis } from '../utils/dateConverter';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'; 
import Pagination from '../components/shared/Pagination';
import DemandeHeader from '../components/rod/demande/demandeHeader';
import { TableContent } from '../components/shared/tables/TableContent';
import DemandeSkeleton from '../components/rod/demande/demandeSkeleton';
import { Handshake , Wand } from 'lucide-react';
import { calculateRowsGeneral } from '../utils/rowsCalculator';
import { searchFilter } from '../components/shared/tables/searchFilter';
import { DemandeModal } from '../components/modals/demande/DetailDemandeModal/demandeModal';
import {Button } from '@/components/ui/button';
import { differenceInCalendarDays } from 'date-fns';
import CreateContratModal from '../components/modals/demande/CreateContratModal/CreateContratModal';
import { useQueryClient } from '@tanstack/react-query'
import { useStore } from '../store/store' 


const DemandesPage = () => {

  const { data, isLoading , isError , refetch } = useFetchDemandes();
  const [modalState, setModalState] = useState({open: false , id_demande: null ,  notification_demande: null , client : null , date_creation : null});
  const [contractModal, setContractModal] = useState({open: false, demande: null});
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize : calculateRowsGeneral(window.innerHeight, window.innerWidth)  })

  const queryClient = useQueryClient()
  const socket = useStore(state => state.socket) 

   const handleRefetchDemande = () => {
    queryClient.invalidateQueries(['demande']) // Use your actual query key
  }
    useEffect(() => {
      // Listen for socket events to refetch Demande
      if (!socket) return
      // Listen for Demande to trigger refetch

      // listen for push updates  
      socket.on('refetchDemandes', handleRefetchDemande)
    }, [socket, queryClient])

  useEffect(() => {
    const handleResize = () => {
      console.log('Window resize' , window.innerHeight, window.innerWidth , calculateRowsGeneral(window.innerHeight, window.innerWidth))
      setPagination((prev) => ({ ...prev, pageSize: calculateRowsGeneral(window.innerHeight, window.innerWidth) }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  

  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState([{ id: 'status_demande', value: 'RECU' }])
  const [columnVisibility, setColumnVisibility] = useState({
    image : true,
    date_creation_demande : true,
    sequence_offre : true,
    lieu_depart_retour : true,
    date_depart_demande : true,
    date_retour_demande : true,
    prix_total : true,
    id_demande : true,

    //hidden at start
    client: false,
    status_demande : false,

  });

  const columns = useMemo(() => [
     {header:'',
      accessorKey: 'notification_demande',
      enableSorting: false,
      cell: ({ cell }) => {
        const value = cell.getValue();
        return (
          !value ?
          <div className="rounded-s-xs min-h-full h-16 desktop:h-17 desktop-lg:h-17 w-1  bg-red-500">
          </div> : null
        );
      },
      meta: { width: '1%' ,padding : '0' },
    },
    {
      header : '\u00A0',
      id: 'image',
      accessorFn: (row) => `${row.offre.garage.nom_voiture} ${row.offre.garage.version_voiture} ${row.offre.garage.matricule_garage}`,
      enableSorting: false,
      cell : ({ row }) => {
        const data = row.original.offre.garage;
        return <ToolTipImage  src={data.image_voiture} 
        title = {data.nom_voiture}
        version={
          <span className='flex flex-col  items-start'>
            <span className='text-base font-medium  '>{data.nom_voiture}</span>
            <span className='text-sm text-gray-700'>{data.version_voiture}</span>
            <span className='text-xs px-1.5 py-0.5 rounded-sm font-medium bg-rod-primary text-white my-1 '>{data.matricule_garage}</span>
          </span>
        } />;
      },
      meta: { width: '12%' },
    },
    {
      header: 'Reçue le',
      accessorKey: 'date_creation_demande',
      cell: ({ cell , row }) => 
        {
          const isRecueFilter = table.getState().columnFilters?.some(
            (f) => f.id === 'status_demande' && f.value === 'RECU'
          );
          const isSeen = isRecueFilter ? row.original.notification_demande : false;
          return (
            <span className={`text-sm flex flex-col gap-1 desktop-lg:text-base `}>
              <span  className={`leading-none ${isSeen ? 'text-gray-600 font-medium' : 'font-semibold'}`}>{formatDepuis(cell.getValue())[0]}</span>
              {formatDepuis(cell.getValue())[1] && <span className={`leading-none ${isSeen ? 'text-gray-500 font-normal' : 'font-medium text-gray-500'}`}>{formatDepuis(cell.getValue())[1]}</span>}
            </span>
          );
        },
      meta: { width: '10%' },
    },
    {
      header: 'Offre',
      id: 'sequence_offre',
      accessorKey: 'offre.sequence_offre',
      cell: ({ cell , row }) => {
        const isRecueFilter =  table.getState().columnFilters?.some(
          (f) => f.id === 'status_demande' && f.value === 'RECU'
        );
        const isSeen = isRecueFilter ? row.original.notification_demande : false;
        return (
          <span className={`text-base desktop-lg:text-lg ${isSeen ? 'text-gray-600 font-medium' : 'font-semibold'}`}>
            {cell.getValue()}
          </span>
        );
      },
      meta: { width: '8%' },
    },
    {
      header : "Client"
      ,id: 'client',
      accessorFn: (row) => `${row.client.nom_client} ${row.client.telephone_client}`,
      cell: ({ row }) => {
        const client = row.original.client.nom_client;
        const phone = row.original.client.telephone_client;
        return (
          <div className="flex flex-col items-start gap-1.5">
            <span className="text-base desktop-lg:text-lg leading-none font-medium">{client}</span>
            <span className="text-sm desktop-lg:text-base leading-none text-gray-500">{phone}</span>
          </div>
        );
      }
      ,meta: { width: '20%' },
    },
    {
      header: 'Lieu Départ & Retour',
      id: 'lieu_depart_retour',
      accessorFn: (row) => `${row.lieu_depart_demande} ${row.lieu_retour_demande}`,
      enableSorting: false,
      cell: ({ row }) => {
        // Apply styling only when the status_demande filter is set to 'RECU'
        const isRecueFilter =  table.getState().columnFilters?.some(
          (f) => f.id === 'status_demande' && f.value === 'RECU'
        );
        const isSeen = isRecueFilter ? row.original.notification_demande : false;
        return (
          <span className='flex flex-col items-start gap-1.5'>
            <span className={`text-base desktop-lg:text-lg leading-none ${isSeen ? 'font-medium text-gray-600' : !isRecueFilter ? "font-medium" : 'font-semibold'}`}>{row.original.lieu_depart_demande}</span>
            <span className={`text-sm desktop-lg:text-base leading-none ${isSeen ? 'font-normal text-gray-500' : !isRecueFilter ? 'font-normal text-gray-600' : 'font-medium text-gray-600'}`}>{row.original.lieu_retour_demande}</span>
          </span>
        );
      },
      meta: { width: '19%' },
    },
    {
      header: 'Date Départ',
      accessorKey: 'date_debut_demande',
      cell: ({ cell , row }) => {
        const isRecueFilter =  table.getState().columnFilters?.some(
          (f) => f.id === 'status_demande' && f.value === 'RECU'
        );
        const isSeen = isRecueFilter ? row.original.notification_demande : false;
        return (
          <span className="flex items-start flex-col gap-1.5">
            <span className={`leading-none text-base ${isSeen ? 'font-medium text-gray-600' : !isRecueFilter ? 'font-medium' : 'font-semibold'} desktop-lg:text-lg`}>{formatDateDDMMYYYY(cell.getValue())}</span>
            <span className={`text-sm desktop-lg:text-base leading-none ${isSeen ? 'font-normal text-gray-500' : !isRecueFilter ?  'font-normal text-gray-600' : 'font-medium text-gray-600'}`}>{formatTimeHHmm(cell.getValue())}</span>
          </span>
        );
      },
      meta: { width: '12%' },
    },
    {
      header: 'Date Retour',
      accessorKey: 'date_fin_demande',
      cell: ({ cell , row }) => {
        // Apply styling only when the status_demande filter is set to 'RECU'
        const isRecueFilter =  table.getState().columnFilters?.some(
          (f) => f.id === 'status_demande' && f.value === 'RECU'
        );
        const isSeen = isRecueFilter ? row.original.notification_demande : false;
        return (
          <span className="flex items-start flex-col gap-1.5">
            <span className={`leading-none text-base ${isSeen ? 'font-medium text-gray-600' : !isRecueFilter ? 'font-medium' : 'font-semibold'} desktop-lg:text-lg`}>{formatDateDDMMYYYY(cell.getValue())}</span>
            <span className={`text-sm desktop-lg:text-base leading-none ${isSeen ? 'font-normal text-gray-500' : !isRecueFilter ?  'font-normal text-gray-600' : 'font-medium text-gray-600'}`}>{formatTimeHHmm(cell.getValue())}</span>
          </span>
        );
      },
      meta: { width: '12%' },
    },
    {
      header: 'Jours',
      accessorKey: 'jours', // We will calculate days based on start and end date
      cell: ({ row }) => {
        // Apply styling only when the status_demande filter is set to 'RECU'
        const isRecueFilter =  table.getState().columnFilters?.some(
          (f) => f.id === 'status_demande' && f.value === 'RECU'
        );
        const isSeen = isRecueFilter ? row.original.notification_demande : false;
        return (
          <span className={`text-base desktop-lg:text-lg ${isSeen ? 'font-medium text-gray-600' : 'font-semibold'}`}>{differenceInCalendarDays(row.original.date_fin_demande,row.original.date_debut_demande)}</span>
        );
      },
      meta: { width: '7%' },
    },


    {
      header: 'Montant Total',
      accessorKey: 'prix_total',
      cell: ({ cell , row }) => {
        // Apply styling only when the status_demande filter is set to 'RECU'
        const isRecueFilter =  table.getState().columnFilters?.some(
          (f) => f.id === 'status_demande' && f.value === 'RECU'
        );

       
        const isSeen = isRecueFilter ? row.original.notification_demande : false;
        
        return (
          <span className={`text-base desktop-lg:text-lg ${isSeen ? 'font-medium text-gray-600' : 'font-semibold'}`}>{cell.getValue()} DT</span>
        );
      },
      meta: { width: '14%' },
    },
    {
      header: '',
      accessorKey: 'id_demande',
      enableSorting: false,
      cell: ({ row }) => {
        const id = row.original.id_demande;
        const status = row.original.status_demande;
        const notification = row.original.notification_demande;
        return <span className="text-base relative flex justify-center desktop-lg:text-lg font-medium text-right">
            <Button className="[&>svg]:!w-5 [&>svg]:!h-5" variant="outline" onClick={() => setModalState({open: true , id_demande: id , status : status , notification_demande: notification , client: row.original.client.nom_client , date_creation: row.original.date_creation_demande})}>
              <Wand />
            </Button>
          </span>
      },
      meta: { width: '5%' },
    },
    {
      header: '',
      accessorKey: 'status_demande',
      enableColumnFilter: true,
      enableSorting: false,
      meta: { width: '0%' },
      cell: () => null, // This column is used for filtering only
    },
   
  ], []);


  // this to reset paging when filtering
  useEffect(() => {
    if (globalFilter !== "" && table.pageIndex !== 0) {
      table.setPageIndex(0);
    }
  }, [globalFilter]);

  const table = useReactTable({
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
      columnFilters,
      columnVisibility,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    globalFilterFn: searchFilter,
    onColumnVisibilityChange: setColumnVisibility,
    }); 

    

  return (
    <div className="w-full  h-full grid grid-rows-[40px_1fr_32px] desktop-xl:grid-rows-[48px_1fr_32px] gap-y-4 desktop-lg:gap-y-6 desktop-xl:gap-y-8">
      <DemandeHeader
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        isError={isError}
        refetch={refetch}
      />
      {
        isLoading ? <DemandeSkeleton pageSize={pagination.pageSize} /> : <TableContent isError={isError} refetch={refetch} table={table} icon={Handshake} NoContentTitle="Oups... Pas encore de demandes ici" NoContentDescription="Créez des offres attractives et compétitives pour commencer à recevoir des demandes de réservation." />
      }
      <Pagination table={table} isLoading={isLoading} isError={isError} />
      {
        contractModal.open &&
        <CreateContratModal open={contractModal.open} demande={contractModal.demande} setOpen={() => setContractModal({open: false, demande: null})}  close={() => setModalState({open: false , id_demande: null , status_demande: null , notification_demande: null , client: null , date_creation : null})} />
      }

      {/*here show the actions modal */}
      {
        modalState.open &&
        <DemandeModal setModalContrat={setContractModal}  id_demande={modalState.id_demande} notification_demande={modalState.notification_demande}  client={modalState.client} date_creation={modalState.date_creation} close={() => setModalState({open: false , id_demande: null ,  notification_demande: null , client: null , date_creation : null})} />
      }
    </div>
  )
}

export default DemandesPage