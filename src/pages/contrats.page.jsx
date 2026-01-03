import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'; 
import { useState, useEffect, useMemo } from 'react';
import Header from '../components/rod/contrat/ContratHeader';
import ContratActions from '../components/rod/contrat/ContratActions';
import { TableContent } from '../components/shared/tables/TableContent';
import Pagination from '../components/shared/Pagination';
import { Badge } from '../components/ui/badge';
import { ToolTipImage } from '../components/customUi/tooltiplist';
import { searchFilter } from '../components/shared/tables/searchFilter';
import { calculateRowsGeneral } from '../utils/rowsCalculator';
import { ReceiptText } from 'lucide-react'
import { formatDateDDMMYYYY, formatTimeHHmm } from '../utils/dateConverter';
import useFetchContrats from '../api/queries/contrat/useFetchContrats';
import ContratSkeleton from '../components/rod/contrat/ContratSkeleton';
import { useQueryClient } from '@tanstack/react-query'
import { useStore } from '../store/store'

// Custom filter function for multi-status filtering
const multiStatusFilter = (row, columnId, filterValue) => {
  const statuses = row.original.statuses || [];
  return statuses.includes(filterValue);
};

const ContratsPage = () => {
  const { data: contratsData, isLoading , isError , refetch } = useFetchContrats();
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize : calculateRowsGeneral(window.innerHeight) })
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState([{ id: 'statuses', value: 'En_cours' }])
  const [columnVisibility, setColumnVisibility] = useState({});

  console.log('Contrats Data' , contratsData)

  const queryClient = useQueryClient()
  const socket = useStore(state => state.socket) 

   const handleRefetchContrat = () => {
    queryClient.invalidateQueries(['contrats'])
  }
    useEffect(() => {
      if (!socket) return
      socket.on('refetchContrats', handleRefetchContrat)
      
    }, [socket, queryClient])


  useEffect(() => {
      const handleResize = () => {
        console.log('Window resize' , window.innerHeight, window.innerWidth , calculateRowsGeneral(window.innerHeight))
        setPagination((prev) => ({ ...prev, pageSize: calculateRowsGeneral(window.innerHeight) }));
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

  const columns = useMemo(() => [
   {
      header : '\u00A0',
      id: 'image',
      accessorFn: (row) => `${row.garage.nom_voiture} ${row.garage.version_voiture} ${row.garage.matricule_garage}`,
      enableSorting: false,
      cell : ({ row }) => {
        const data = row.original.garage;
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
  header: 'Contrat',
  id: 'sequence',
  accessorFn: (row) => {
    return Number(row.sequence_contrat.replace('CO-', ''));
  },
  cell: ({ row }) => (
    <span className="text-base desktop-lg:text-lg font-medium">
      {row.original.sequence_contrat}
    </span>
  ),
  meta: { width: '8%' },
},
    {
      header: 'Lieu Départ & Retour',
      accessorFn: row => `${row.lieu_depart} ${row.lieu_retour}`,
      cell: ({ row }) => {
        return (
          <span className='flex flex-col items-start gap-1.5 truncate'>
            <span className={`text-base desktop-lg:text-lg leading-none font-medium`}>{row.original.lieu_depart}</span>
            <span className={`text-sm desktop-lg:text-base leading-none   font-medium text-gray-500`}>{row.original.lieu_retour}</span>
          </span>
        );
      },
      meta: { width: '18%' },
    },
    {
      header: "Client",
      id: 'client',
      accessorFn: (row) => `${row.client.nom_client} ${row.client.telephone_client}`,
      cell: ({ row }) => {
        const client = row.original.client;
        return (
          <div className="flex flex-col items-start gap-1.5">
            <span className="text-base desktop-lg:text-lg leading-none font-medium">{client.nom_client}</span>
            <span className="text-sm desktop-lg:text-base leading-none text-gray-500 font-medium">{client.telephone_client}</span>
          </div>
        );
      },
      meta: { width: '16%' },
    },
{
  header: 'Date de Depart',
  accessorKey: 'date_depart',
  cell: ({ cell }) => {
    const dateValue = cell.getValue();
    return (
      <div className="flex flex-col items-start gap-1.5">
            <span className="text-base desktop-lg:text-lg leading-none font-medium">{formatDateDDMMYYYY(dateValue)}</span>
            <span className="text-sm desktop-lg:text-base leading-none text-gray-500 font-medium">{formatTimeHHmm(dateValue)}</span>
      </div>
    );
  },
  meta: { width: '16%' },
},
{
  header: 'Date Retour',
  accessorKey: 'date_retour',
  cell: ({ cell }) => {
    const dateValue = cell.getValue();
    return (
       <div className="flex flex-col items-start gap-1.5">
            <span className="text-base desktop-lg:text-lg leading-none font-medium">{formatDateDDMMYYYY(dateValue)}</span>
            <span className="text-sm desktop-lg:text-base leading-none text-gray-500 font-medium">{formatTimeHHmm(dateValue)}</span>
      </div>
    );
  },
  meta: { width: '16%' },
},
    {
  header: 'Status',
  cell: ({ row }) => {
    const badge = row.original.badge;
    let styleClass = '';

    switch (true) {
      // En cours
      case badge === 'En cours':
        styleClass = 'bg-green-100 text-green-600 text-sm';
        break;
      // Planifiée
      case badge === 'Planifiée' || badge.startsWith('Commence'):
        styleClass = 'bg-blue-100 text-blue-600 text-sm';
        break;
      case badge === 'Annulé':
        styleClass = 'bg-orange-100 text-orange-600 text-sm';
        break;
      // Terminée
      case badge === 'Expirée':
        styleClass = 'bg-red-100 text-red-600 text-sm';
        break;
      
      case  badge.startsWith('Expire dans'):
        styleClass='bg-amber-100 text-amber-600 text-sm'
        break;
      default:
        styleClass = 'bg-rose-100 text-rose-600  text-sm';
    }

    return (
      <div className="flex flex-col gap-1.5">
        <Badge className={styleClass}>{badge}</Badge> 
      </div>
    );
  },
  meta: { width: '16%' },

    },
    {
      header: '',
      id: 'actions',
      cell: ({ row }) => {
        const data = row.original;
        return <ContratActions id={data.id_contrat} contratData={data} />;
      },
      meta: { width: '5%' },
    },
     {
      header: '',
      id: 'statuses',
      accessorKey: 'statuses',
      cell: () => null,
      meta: { width: '0%' },
      enableColumnFilter: true,
      filterFn: multiStatusFilter,
    },
  ], [columnFilters]);

  const table = useReactTable({
    data : contratsData || [],
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
      columnVisibility: {
        ...columnVisibility,
        statuses: false,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    globalFilterFn: searchFilter,
    onColumnVisibilityChange: setColumnVisibility,
    }); 

  return (
    <div className='w-full h-full grid grid-rows-[40px_1fr_32px] desktop-xl:grid-rows-[48px_1fr_32px] gap-y-4 desktop-lg:gap-y-6 desktop-xl:gap-y-8'>
      <Header 
        table={table}
        setGlobalFilter={setGlobalFilter}
        globalFilter={globalFilter}
      />
      {isLoading ? (
        <ContratSkeleton pageSize={pagination.pageSize}/>
      ) : (
      <TableContent 
        table={table}
        icon={ReceiptText}
        isError={isError}
        refetch={refetch}
        NoContentTitle="Aucun contrat trouvé"
        NoContentDescription="Publiez des offres, recevez des demandes, et approuvez celles qui vous intéressent pour créer vos premiers contrats !"
        />
      )}
      <Pagination table={table} isLoading={isLoading} isError={isError} />
    </div>
  )
}

export default ContratsPage