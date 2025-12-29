import { useEffect, useState, useMemo } from 'react'

import { TableContent } from '../../shared/tables/TableContent';
import { Users } from 'lucide-react' 
import DetailClientModal from '../../modals/client/DetailClientModal'

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper
} from '@tanstack/react-table' 

import { useFetchClientAgence } from '../../../api/queries/client/useFetchClientAgence' 
import { calculateRowsClients } from '../../../utils/rowsCalculator'
import { FormatDateEEEEddMMyyyy } from '../../../utils/dateConverter';
import { searchFilter } from '../../shared/tables/searchFilter';
import ClientSkeleton from '../../rod/client/ClienSkeleton';
import Pagination from '../../shared/Pagination';



const columnHelper = createColumnHelper()

const ClientsContent = () => {
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ 
    pageIndex: 0, 
    pageSize: calculateRowsClients(window.innerHeight, window.innerWidth) 
  })
  const [globalFilter, setGlobalFilter] = useState('')

  const { data: clients , isLoading , isError , refetch } = useFetchClientAgence(); 

  useEffect(() => {
    const handleResize = () => {
      console.log('Window resize', window.innerHeight, window.innerWidth, calculateRowsClients(window.innerHeight, window.innerWidth))
      setPagination((prev) => ({ 
        ...prev, 
        pageSize: calculateRowsClients(window.innerHeight, window.innerWidth) 
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Define columns with useMemo for performance 
const columns = useMemo(() => [
  columnHelper.accessor('client_avatar', {
    id: 'client_avatar',
    header: '\u00A0',
    cell: ({ row }) => {
      const name = row.original.nom_client;
      // Get first letter and first letter after a space
      const initials = name
        ? name
            .split(' ')
            .filter(Boolean)
            .map(word => word[0].toUpperCase())
            .slice(0, 2)
            .join('')
        : '';
      return (
          <span className='rounded-full justify-self-center  size-12 bg-rod-foreground text-rod-primary font-semibold text-sm desktop-lg:text-base flex items-center justify-center mr-2'>
            {initials}
          </span>
      );
    },
    meta: { width: '7%' },
  }),

  columnHelper.accessor('nom_client', {
    id: 'client',
    header: 'Client',
    cell: ({ getValue }) => {
      const name = getValue();
      return (
        <span className="text-base  font-medium truncate flex gap-4 items-center">
          {name}
        </span>
      );
    },
    meta: { width: '20%' },
  }),
  columnHelper.accessor('telephone_client', {
    id: 'telephone',
    header: 'Téléphone',
    cell: ({ getValue }) => (
      <span className="text-base desktop-lg:text-base font-medium  truncate ">
        {getValue()}
      </span>
    ),
    meta: { width: '14%' },
  }),
  columnHelper.accessor('derniere_location', {
    id: 'derniere_location',
    header: 'Dernière location',
    cell: ({ getValue }) => {
      if (!getValue()) return <span className="text-base desktop-lg:text-lg font-medium truncate">—</span>;
      return (
        <span className="text-base desktop-lg:text-base  font-medium truncate ">
          {FormatDateEEEEddMMyyyy(getValue())}
        </span>
      );
    },
    meta: { width: '20%' },
  }),
  columnHelper.accessor('nombre_contrats_termine', {
    id: 'locations',
    header: 'Locations',
    cell: ({ getValue }) => (
      <span className="text-base px-2 py-1 w-fit leading-none font-semibold bg-blue-100 text-blue-600 flex items-center justify-center rounded-full truncate">
        {getValue()}
      </span>
    ),
    meta: { width: '10%' },
  }),
  columnHelper.accessor('revenus_generes', {
    id: 'revenus',
    header: 'Revenus générés',
    cell: ({ getValue }) => (
      <span className="text-base font-semibold px-3 py-1 rounded-full w-fit bg-green-100 text-green-600 truncate">
        {getValue()} DT
      </span>
    ),
    meta: { width: '12%' },
  }), 
  
  columnHelper.accessor('reste_a_payer', {
    id: 'reste_a_payer',
    header: 'Reste à payer',
    cell: ({ getValue }) => {
      const value = getValue();
      if (!value || value === 0) {
        return (
          <span className="text-base font-semibold px-3 py-1 rounded-full w-fit bg-gray-100 text-gray-600 truncate">
            0 DT
          </span>
        );
      }
      return (
        <span className="text-base font-semibold px-3 py-1 rounded-full w-fit bg-red-100 text-red-600 truncate">
          {value} DT
        </span>
      );
    },
    meta: { width: '12%' },
  }),
  
  columnHelper.display({
    id: 'actions',
    header: '\u00A0', 
    cell: ({ row }) => (
      <span className="text-base relative flex justify-center desktop-lg:text-lg font-medium text-right">
        <DetailClientModal client={row.original}/>
      </span>
    ),
    meta: { width: '5%' },
  }),
], []);


  // Create table instance
  const table = useReactTable({
    data: clients || [],
    columns,
    state: {
      pagination,
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: searchFilter,
  }) 
  return (
    <> 
      {/* Show skeleton while loading, otherwise show the actual table */}
      {isLoading ? (
        <ClientSkeleton pageSize={pagination.pageSize}/>
      ) : (
        <TableContent
          table={table}
          isError={isError}
          refetch={refetch}
          icon={Users}
          NoContentTitle="Aucun client trouvé"
          NoContentDescription="Il semble qu'il n'y ait aucun client enregistré dans votre agence. Commencez par ajouter votre premier client pour voir les informations ici."
        />
      )}
      <Pagination table={table} isLoading={isLoading} isError={isError} />
    </>
  )
}
export default ClientsContent