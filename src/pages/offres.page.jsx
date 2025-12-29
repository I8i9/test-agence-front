import { useEffect, useState,useMemo } from 'react'
import OffreHeader from '../components/rod/offre/Offreheader'
import { TableContent } from '../components/shared/tables/TableContent'
import useFetchOffre from '../api/queries/offre/usefetchoffre'
import { ToolTipGouvernorat, ToolTipPrix, ToolTipImage } from '../components/customUi/tooltiplist'
import OffreActions from '../components/rod/offre/offreactions'
import Pagination from '../components/shared/Pagination'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import { searchFilter } from '../components/shared/tables/searchFilter'
import { ShoppingCart } from 'lucide-react'

import { Badge } from '../components/ui/badge'
import { calculateRowsGeneral } from '../utils/rowsCalculator'
import OffreSkeleton from '../components/rod/offre/offreSkeleton'
import { useQueryClient } from '@tanstack/react-query'
import { useStore } from '../store/store'
import ToolTipCustom from '../components/customUi/tooltip'
import convertNumberToK from '../utils/NumbersConverter'


const OffresPage = () => {
  const { data, isLoading ,isError , refetch } = useFetchOffre()
  const queryClient = useQueryClient()
  const socket = useStore(state => state.socket) 

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize : calculateRowsGeneral(window.innerHeight,window.innerWidth) })
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([{ id: 'status', value: 'En cours' }])



  const handleRefetchOffre = () => {
    queryClient.invalidateQueries(['offre']) // Use your actual query key
  }

  
    useEffect(() => {
      // Listen for socket events to refetch Offre
      if (!socket) return
      // Listen for Offre to trigger refetch

      // listen for push updates  
      socket.on('refetchOffres', handleRefetchOffre)
    }, [socket, queryClient])

  useEffect(() => {
      const handleResize = () => {
        setPagination((prev) => ({ ...prev, pageSize: calculateRowsGeneral(window.innerHeight, window.innerWidth) }));
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

  const columns = useMemo(() => [
    {
      header: '',
      id: 'image',
      cell: ({ row }) => {
        const data = row.original.garage
        return  <ToolTipImage  src={data.image_voiture} 
        title = {data.nom_voiture}
        version={
          <span className='flex flex-col  items-start'>
            <span className='text-base font-medium  '>{data.nom_voiture}</span>
            <span className='text-sm text-gray-700'>{data.version_voiture}</span>
            <span className='text-xs px-1.5 py-0.5 rounded-sm font-medium bg-rod-primary text-white my-1 '>{data.matricule_garage}</span>
          </span>
        } />;
      },
      meta: { width: '13%' },
    },
 {
  header: 'Offre',
  id: 'sequence',
  accessorFn: (row) => {
    return Number(row.sequence_offre.replace('OF-', ''));
  },
  cell: ({ row }) => (
    <span className="text-base desktop-lg:text-lg font-medium">
      {row.original.sequence_offre}
    </span>
  ),
  meta: { width: '8%' },
}
,
    {
      header: 'Voiture',
      id: 'voiture',
      accessorFn: row => `${row.garage.nom_voiture} ${row.garage.matricule_garage}`,
      cell: ({ row }) => {
        const data = row.original.garage
        return (
          <div className="flex  flex-col w-fit items-start gap-0.5 max-w-full">
            <ToolTipCustom trigger={<span className="truncate w-[100%] text-base font-medium">{data.nom_voiture}</span>} message={data?.nom_voiture} />
            <Badge variant='secondary' className="text-xs px-1 desktop-lg:text-sm font-semibold">
              {data.matricule_garage}
            </Badge>
          </div>
        )
      },
      meta: { width: '18%' },
    },
    {
      accessorKey: 'gouvernorat_offre',
      enableSorting: false,
      header: 'Lieux', 
      cell: ({ cell }) => <ToolTipGouvernorat list={cell.getValue()} />,
      meta: { width: '16%' },
    },
    {
      header: 'Prix/Jour',
      id: 'prix/jour',
      accessorKey: 'prix_jour_offre',
      cell: ({ row }) => {
        const data = row.original
        return (
          <ToolTipPrix prix={data.prix_jour_offre} prixdynamique={data.prix_dynamique_offre} taux={ data?.promo?.showpromo && data?.promo?.taux_promo} />
        )
      },
      meta: { width: '10%' },
    },
    {
      header: 'Promo',
      accessorFn: row => row?.promo?.taux_promo,
      cell: ({ row }) => {
      const data = row?.original?.promo;
      return(
        data ?
          data?.showpromo ? <div className="text-base desktop-lg:text-lg font-semibold inline-flex ">{data?.taux_promo}% <div className='rounded-full bg-rod-accent size-1 ml-0.75 mt-1'></div> </div>
          : <div className="text-base desktop-lg:text-lg font-normal ">{data?.taux_promo}% </div>
        : <span className='ml-4'>-</span>
      )
      },
      meta: { width: '9%' },
    },
    {
      header: 'Vue',
      accessorKey: 'clics_offre',
      cell: ({ cell }) => <div className="text-base desktop-lg:text-lg font-medium">{convertNumberToK(cell?.getValue())}</div>,
      meta: { width: '9%' },
    },
 {
  header: 'Status',
  cell: ({ row }) => {
    const badge = row.original.badge;
    let styleClass = '';

    switch (true) {
      // En cours
      case badge === 'Active' :
        styleClass = 'bg-green-100 text-green-600 text-sm';
        break;
      case badge.startsWith('Expire'):
        styleClass = 'bg-amber-100 text-amber-600 text-sm';
        break;

      // Planifiée
      case badge === 'Suspendu':
        styleClass = 'bg-blue-100 text-blue-600 text-sm';
        break;

      // Terminée
      case badge === 'Expirée' || badge === 'Clôturée':
        styleClass = 'bg-red-100 text-red-600 text-sm';
        break;

      default:
        styleClass = 'bg-gray-100 text-gray-600 text-sm';
    }

    return <Badge className={styleClass}>{badge}</Badge>;
  },
  meta: { width: '12%' },
},{
      header: '',
      id:'actions',
      cell: ({ row }) =>
        {
        const data = row.original
        return(<OffreActions id={data.id_offre} offerData={data}/>)},
      meta: { width: '5%' },
    },
    {
      header: '',
      id: 'status',
      accessorKey: 'status',
      cell: () => null,
      meta: { width: '0%' },
      enableColumnFilter: true,
    },
  ], []);

  const table = useReactTable({
    data: data || [],
    columns,
    autoResetPageIndex: false,
    state: {
      pagination,
      globalFilter,
      sorting,
      columnFilters,
      columnVisibility : {
        status: false,
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    globalFilterFn: searchFilter,
    onColumnFiltersChange: setColumnFilters,
  })

  console.log('Offres data:', data);

  return (
    <div className="w-full h-full grid grid-rows-[40px_1fr_32px] desktop-xl:grid-rows-[48px_1fr_32px] gap-y-4 desktop-lg:gap-y-6 desktop-xl:gap-y-8">
      <OffreHeader
        setGlobalFilter={setGlobalFilter}
        globalFilter={globalFilter}
        table={table}
        
      />
      {isLoading? <OffreSkeleton pageSize={pagination.pageSize}/>:
      <TableContent table={table} isError={isError}
        refetch={refetch} icon={ShoppingCart} NoContentTitle="Oups... Pas encore d'offres ici" NoContentDescription="Créez votre première offre dès maintenant pour permettre aux utilisateurs de réserver vos voitures." />}
      <Pagination table={table} isLoading={isLoading} isError={isError}  />
    </div>
  )
}

export default OffresPage
