import { useState, useEffect ,useMemo , useCallback, } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper,
} from '@tanstack/react-table'; 
import Header from '../components/rod/historique/Header';
import { TableContent } from '../components/shared/tables/TableContent';
import Pagination from '../components/shared/Pagination';
import { useHistorique } from '../api/queries/historiqueQuery';
const columnHelper = createColumnHelper();
import { subDays } from 'date-fns'; 
import ToolTipCustom from '../components/customUi/tooltip'; 
import { History } from 'lucide-react';
import { calculateRowsHistorique } from '../utils/rowsCalculator';
import { searchFilter } from '../components/shared/tables/searchFilter';
import { formatDateDDMMYYYY } from '../utils/dateConverter';
import { formatDateOnly } from '../utils/datautils';
import HistoriqueSkeleton from '../components/rod/historique/historiqueSkeleton';


const actions = {
  AJOUT: 'Ajout',
  MODIFICATION: 'Mise à jour',
  SUPPRESSION: 'Suppression',
  CONFIRMATION: 'Confirmation',
  ANNULATION: 'Annulation',
  REFUS: 'Refus',
  PAIEMENT: 'Paiement'
}

const getObjLabel = (obj) => {
  switch (obj) {
    case 'Depense':
      return 'Dépense';
    case 'Paiement_Depense':
      return 'Paiement Dépense';
    case 'Paiement_Contrat':
      return 'Paiement Contrat';
    default:
      return obj;
  }
};


const HistoriquePage = () => {
  const [date, setDate] = useState({
    from: subDays(new Date(), 3),
    to: new Date(),
  });
  
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ 
    pageIndex: 0, 
    pageSize: calculateRowsHistorique(window.innerHeight, window.innerWidth) 
  });
  const [columnFilters, setColumnFilters] = useState([]);
  
  
  const { 
    data: fetchedData, 
    isLoading,
    isError,
    refetch
  } = useHistorique({
    date_debut: date?.from ? formatDateOnly(date?.from) : null,
    date_fin: date?.to ? formatDateOnly(date?.to) : null
  },
  // Only fetch when both dates are not null/undefined
  {enabled: date?.from != null && date?.to != null },

);

useEffect(() => {
    refetch();
  }, [date, refetch]);


  useEffect(() => {
    const handleResize = () => {
      console.log('Window resize', window.innerHeight, window.innerWidth, calculateRowsHistorique(window.innerHeight, window.innerWidth))
      setPagination((prev) => ({ 
        ...prev, 
        pageSize: calculateRowsHistorique(window.innerHeight, window.innerWidth) 
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper functions to get current filter values
  const getActionFilter = () => {
    const actionFilter = columnFilters.find(filter => filter.id === 'action');
    return actionFilter?.value || 'all';
  };

  const getTypeFilter = () => {
    const typeFilter = columnFilters.find(filter => filter.id === 'type');
    return typeFilter?.value || 'all';
  };

  // Helper functions to set filters
  const setActionFilter = (value) => {

    console.log("value",value);
    setColumnFilters(prev => {
      const otherFilters = prev.filter(filter => filter.id !== 'action');
      if (value === 'all') {
        return otherFilters;
      }
      return [...otherFilters, { id: 'action', value }];
    });
    
  };

  const setTypeFilter = (value) => {
    setColumnFilters(prev => {
      const otherFilters = prev.filter(filter => filter.id !== 'type');
      if (value === 'all') {
        return otherFilters;
      }
      return [...otherFilters, { id: 'type', value }];
    });
  };

  // Object type styling
  const getObjectTypeStyle = useCallback((type)=> {
    switch (type) {
      case 'Voiture':
        return 'bg-blue-100 text-blue-700 ';
      case 'Offre':
        return 'bg-red-100 text-red-700 ';
      case 'Promo':
        return 'bg-purple-100 text-purple-700 ';
      case 'Contrat':
        return 'bg-green-100 text-green-700 ';
      case 'Depense':
        return 'bg-orange-100 text-orange-700 ';
      case 'Agence':
        return 'bg-pink-100 text-pink-700 ';
      case 'Login':
        return 'bg-yellow-100 text-yellow-600 ';
      case 'Fournisseur':
        return 'bg-teal-100 text-teal-700 ';
      case "Paiement_Depense":
        return 'bg-indigo-200 text-indigo-800 ';
      case "Paiement_Contrat":
        return 'bg-fuchsia-200 text-fuchsia-800 ';
      default:
        return 'bg-gray-100 text-gray-700 ';
    }
  }, []);

  const columns = useMemo(() => [
    columnHelper.accessor('createdAt', {
      id: 'date',
      header: 'Date & heure',
      cell: ({ getValue }) => {
        const date = new Date(getValue());
        return (
          <div className="text-base overflow-hidden">
            <div className="font-medium truncate">{formatDateDDMMYYYY(getValue())}</div>
            <div className="text-gray-500 font-medium truncate">{date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
          </div>
        );
      },
      meta: { width: '13%' },
    }),
    columnHelper.accessor('login.nom_agent_login', {
      id: 'agent',
      header: 'Agent',
      cell: ({ getValue }) => (
        <span className="text-base font-medium truncate block">{getValue()}</span>
      ),
      meta: { width: '15%' },
    }),
    columnHelper.accessor('type_log', {
      id: 'type',
      header: 'Type d\'objet',
      // Custom filter function for type
      filterFn: (row, columnId, filterValue) => {
        if (filterValue === 'all') return true;
        return row.getValue(columnId) === filterValue;
      },
      cell: ({ getValue }) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium truncate max-w-full ${getObjectTypeStyle(getValue())}`}>
          {getObjLabel(getValue())}
        </span>
      ),
      meta: { width: '14%' },
    }),
    columnHelper.accessor('action_log', {
      id: 'action',
      header: 'Action',
      accessorFn: (row) => actions[row.action_log],
      // Custom filter function for action
      filterFn: (row, columnId, filterValue) => {
        if (filterValue === 'all') return true;
        return row.getValue(columnId) === filterValue;
      },
      cell: ({ getValue }) => {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-rod-foreground truncate max-w-full">
            {getValue()}
          </span>
        );
      },
      meta: { width: '12%' },
    }),
    columnHelper.accessor('sequence_log', {
      id: 'reference',
      header: 'Ref Objet',
      cell: ({ getValue }) => (
        <span className="font-medium text-base group-hover:underline group-hover:text-rod-accent transition-all duration-100 ease-in-out truncate block">
          {getValue()}
        </span>
      ),
      meta: { width: '13%' },
    }),
    columnHelper.accessor('description_log', {
      id: 'details',
      header: 'Détails',
      cell: ({ getValue }) => (
        <ToolTipCustom
          trigger={
            <span className="text-sm text-gray-500 truncate block w-fit max-w-full">{getValue()}</span>
          }
          message={getValue()}
        />
      ),
      meta: { width: '33%' },
    }) 
  ], []);

  const table = useReactTable({
    data: fetchedData || [], // Use original data directly
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
      sorting,
      pagination,
      columnFilters, // Add columnFilters to state
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    globalFilterFn: searchFilter,
    onColumnFiltersChange: setColumnFilters, // Add column filters handler
  }); 

  return (
  <div className='w-full h-full grid grid-rows-[40px_1fr_32px] desktop-xl:grid-rows-[48px_1fr_32px] gap-y-4 desktop-lg:gap-y-6 desktop-xl:gap-y-8'>
    <Header
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      date={date}
      setDate={setDate}
      selectedAction={getActionFilter()}
      setSelectedAction={setActionFilter}
      selectedType={getTypeFilter()}
      setSelectedType={setTypeFilter}
    />

    {isLoading ? (
        <HistoriqueSkeleton pageSize={pagination.pageSize} />
      ) : (
      <TableContent 
        table={table}
        icon={History}
        isError={isError}
        refetch={refetch}
        NoContentTitle="Aucun historique trouvé"
        NoContentDescription="Il n'y a pas d'activité enregistrée pour la période sélectionnée. Essayez d'ajuster la plage de dates."
      />
    )}

    <Pagination table={table} isLoading={isLoading} isError={isError} />
  </div>
);

}; 
export default HistoriquePage
