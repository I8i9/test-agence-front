import { useEffect, useState, useMemo } from 'react'
import { TableContent } from '../../shared/tables/TableContent'
import { Truck } from 'lucide-react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper
} from '@tanstack/react-table'
import { calculateRowsClients } from '../../../utils/rowsCalculator'
import { searchFilter } from '../../shared/tables/searchFilter'
import ClientSkeleton from '../../rod/client/ClienSkeleton'
import Pagination from '../../shared/Pagination'
import FournisseurActions from '../../rod/client/FournisseurActions'
import useFetchFournisseur from '../../../api/queries/fournisseurs/useFetchFournisseur'
import ToolTipCustom from '../../customUi/tooltip'
import { fournisseurTypes, getTypeStyle } from '../../../utils/fournisseur'
import FournisseurSkeleton from './FournisseurSkeleton'

const columnHelper = createColumnHelper()

const FournisseurContent = ({ globalFilter, setGlobalFilter }) => {
  const [sorting, setSorting] = useState([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: calculateRowsClients(window.innerHeight, window.innerWidth)
  })

  // Fetch fournisseurs from API
  const { data: fournisseurs = [], isLoading, isError, refetch } = useFetchFournisseur()
  console.log('Fournisseurs data:', fournisseurs)
  
  useEffect(() => {
    const handleResize = () => {
      setPagination((prev) => ({
        ...prev,
        pageSize: calculateRowsClients(window.innerHeight, window.innerWidth)
      }))
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])


  

  const columns = useMemo(() => [
    columnHelper.accessor('logo_fournisseur', {
      id: 'logo',
      header: '\u00A0',
      cell: ({ row }) => {
        const logo = row.original.logo_fournisseur
        const name = row.original.nom_fournisseur
        
        if (logo) {
          return (
            <div className="flex justify-center">
              <img 
                src={logo} 
                alt={name}
                className="size-12 rounded-full object-cover"
              />
            </div>
          )
        }
        
        const initial = name ? name[0].toUpperCase() : '?'
        return (
          <span className="rounded-full justify-self-center size-12 bg-rod-foreground text-rod-primary font-semibold text-sm desktop-lg:text-base flex items-center justify-center">
            {initial}
          </span>
        )
      },
      meta: { width: '7%' },
    }),

    columnHelper.accessor('nom_fournisseur', {
      id: 'nom',
      header: 'Fournisseur',
      cell: ({ getValue }) => {
        const name = getValue() 
        
        return ( 
          <span className="text-base font-medium truncate flex gap-4 items-start">
            {name || '—'}
          </span>
        )
      },
      meta: { width: '12%' },
    }), 

    columnHelper.accessor('email_fournisseur', {
      id: 'email_fournisseur',
      header: 'Contact',
      cell: ({ row }) => { 
        const email = row.original.email_fournisseur
        const phone = row.original.telephone_fournisseur
        
        return (
          <div className="flex flex-col items-start gap-1.5">
            <span className="text-base desktop-lg:text-lg leading-none font-medium">{email || '—'}</span>
            <span className="text-sm desktop-lg:text-base leading-none text-gray-500">{phone || '—'}</span>
          </div>
        )
      },
      meta: { width: '18%' },
    }), 
    
    columnHelper.accessor('matricule_fiscale', {
      id: 'matricule_fiscale',
      header: 'Matricule Fiscale',
      cell: ({ getValue }) => {
        const matricule_fiscale = getValue()
        return (
          <ToolTipCustom
            trigger={
              <span className="text-base font-medium truncate flex gap-4 items-start cursor-pointer w-fit">
                {matricule_fiscale || '—'}
              </span>
            }
            message={matricule_fiscale || 'Aucun matricule fiscale'}
          />        
        )
      },
      meta: { width: '17%' },
    }), 

    columnHelper.accessor('type_fournisseur', {
      id: 'type',
      header: 'Type',
      cell: ({ getValue }) => {
        const type = getValue()
        
        return (
          <ToolTipCustom
            trigger={
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium  max-w-full ${getTypeStyle(type)}`}>
            <span className='truncate'>{fournisseurTypes[type] || 'Type inconnu'}</span>
          </span>
            }
            message={fournisseurTypes[type] || 'Type inconnu'}
          />
        )
      },
      meta: { width: '17%' },
    }),

    columnHelper.accessor('montant_paye', {
      id: 'montant_paye',
      header: 'Montant Payé',
      cell: ({ getValue }) => {
        const value = getValue() || 0
        if (value === 0) {
          return (
            <span className="text-base font-semibold px-3 py-1 rounded-full w-fit bg-gray-100  truncate">
              _
            </span>
          )
        }
        return (
          <span className="text-base font-semibold px-3 py-1 rounded-full w-fit bg-green-100 text-green-600 truncate">
            {parseFloat(value.toFixed(2))} DT
          </span>
        )
      },
      meta: { width: '12%' },
    }),

    columnHelper.accessor('reste_a_payer', {
      id: 'reste_a_payer',
      header: 'Reste à Payer',
      cell: ({ getValue }) => {
        const value = getValue() || 0
        if (value === 0) {
          return (
            <span className="text-base font-semibold px-3 py-1 rounded-full w-fit bg-gray-100  truncate">
              _
            </span>
          )
        }
        return (
          <span className="text-base font-semibold px-3 py-1 rounded-full w-fit bg-red-100 text-red-600 truncate">
            {parseFloat(value.toFixed(2))} DT
          </span>
        )
      },
      meta: { width: '12%' },
    }),

    columnHelper.display({
      id: 'actions',
      header: '\u00A0',
      cell: ({ row }) => {
        const data = row.original
        return (
          <span className="text-base relative flex justify-end desktop-lg:text-lg font-medium text-right">
            <FournisseurActions fournisseurData={data} />
          </span>
        )
      },
      meta: { width: '5%' },
    }),
  ], [])

  const table = useReactTable({
    data: fournisseurs || [],
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
      {isLoading ? (
        <FournisseurSkeleton pageSize={pagination.pageSize} />
      ) : (
        <TableContent
          table={table}
          isError={isError}
          refetch={refetch}
          icon={Truck}
          NoContentTitle="Aucun fournisseur trouvé"
          NoContentDescription="Il semble qu'il n'y ait aucun fournisseur enregistré dans votre agence. Commencez par ajouter votre premier fournisseur pour voir les informations ici."
        />
      )}
      <Pagination table={table} isLoading={isLoading} isError={isError} />
    </>
  )
}

export default FournisseurContent