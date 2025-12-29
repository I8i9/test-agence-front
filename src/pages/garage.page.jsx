import { useState, useEffect, useMemo } from 'react'
import GarageContent from '../components/rod/garage/garageContent'
import GarageHeader from '../components/rod/garage/garageheader'
import { useFetchGarage } from '../api/queries/garage/usefetchgarage'
import Pagination from '../components/shared/Pagination'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table' 
import { searchFilter } from '../components/shared/tables/searchFilter';
import { useStore } from '../store/store';
import { useQueryClient } from '@tanstack/react-query'


const GaragePage = () => {

  const[globalFilter,setGlobalFilter]=useState('')
  const [columnFilters, setColumnFilters] = useState([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 8 })
  const queryClient = useQueryClient()
  const socket = useStore(state => state.socket)

  const {data : fetchedData , isLoading , isError ,refetch}=useFetchGarage()
  const handleRefetchGarage = () => {
    queryClient.invalidateQueries(['garage']) // Use your actual query key
  }
    useEffect(() => {
      // Listen for socket events to refetch Garage
      if (!socket) return
      // Listen for Garage to trigger refetch

      // listen for push updates  
      socket.on('refetchGarages', handleRefetchGarage)
    }, [socket, queryClient])

  // Memoize data: recalc only if fetchedData changes
  const data = useMemo(() => fetchedData || [], [fetchedData]);

  // Memoize columns: static, so empty dependency array
  const columns = useMemo(() => [
    {
      accessorKey: 'nom_voiture',
      header: 'Nom Voiture',
    },
    {
      accessorKey: 'version_voiture',
      header: 'Version',
    },
    {
      accessorKey: 'matricule_garage',
      header: 'Matricule',
    },
    {
      accessorKey: 'kilometrage_garage',
      header: 'Kilométrage',
      cell: info => `${info.getValue()} km`,
    },
    {
      accessorKey: 'couleur_garage',
      header: 'Couleur',
    },
    {
      accessorKey: 'status_garage',
      header: 'Statut',
    },
    {
      accessorKey: "probleme_vignette",
      header: "Vignette Expirée",
    },
    {
      accessorKey: "probleme_assurance",
      header: "Assurance Expirée",
    },
    {
      accessorKey: "probleme_visite_technique",
      header: "Visite Technique Expirée",
    },
    {
      id: 'hasProblem',
      header: 'Problème détecté',
      accessorFn: row =>
        row.probleme_assurance!==false || row.probleme_vignette!==false || row.probleme_controle!==false ,
    },
  ], []);  // empty array means columns are created once




const table = useReactTable({
  data: data || [],
  columns,
  state: {
    pagination,
    globalFilter,
    columnFilters,
  },
  getRowId : (row) => row.id_garage,
  onPaginationChange: setPagination,
  getPaginationRowModel: getPaginationRowModel(),
  onGlobalFilterChange: setGlobalFilter,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onColumnFiltersChange: setColumnFilters,
  globalFilterFn: searchFilter,
})
  return (
      <div className='w-full h-full grid grid-rows-[40px_1fr_32px] desktop-xl:grid-rows-[48px_1fr_32px] gap-y-4 desktop-lg:gap-y-6 desktop-xl:gap-y-8'>
        <GarageHeader globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} table={table} isLoading={isLoading}/>
        <GarageContent table={table} isLoading={isLoading} isError={isError} refetch={refetch} />
        <Pagination table={table} isLoading={isLoading} isError={isError}/>
      </div>
  )
}

export default GaragePage