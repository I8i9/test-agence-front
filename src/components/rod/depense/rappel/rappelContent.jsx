import { searchFilter } from '../../../shared/tables/searchFilter';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'; 
import { TableContent } from '../../../shared/tables/TableContent';
import  Pagination  from '../../../shared/Pagination';
import { useMemo , useState } from 'react'
import useFetchRappels from '../../../../api/queries/depense/rappel/useFetchRappels';
import { allCosts  } from '../../../../utils/costs';
import { ToolTipImage  } from '../../../customUi/tooltiplist';
import { CalendarSync , Icon } from 'lucide-react';
import { FormatDateEEEEddMMyyyy } from '../../../../utils/dateConverter';
import { Badge } from '../../../ui/badge';
import ToolTipCustom from '../../../customUi/tooltip';
import { useDeleteRappel } from '../../../../api/queries/depense/rappel/useDeleteRappel';
import { DeleteDepenseModal } from '../../../modals/depense/DepenseActions/DeleteDepenseModal';
import { ViewRappelModal } from '../../../modals/depense/RappelActions/ViewRappelModal';
import { useEffect } from 'react';
import { calculateRowsGeneral } from '../../../../utils/rowsCalculator';
import { useStore } from '../../../../store/store';
import { useQueryClient } from '@tanstack/react-query'

const RappelContent = ({globalFilter, setGlobalFilter}) => {
  const queryClient = useQueryClient()
  const socket = useStore(state => state.socket)

    const handleRefetchRappel = () => {
      queryClient.invalidateQueries(['rappels']) // Use your actual query key
    }
      useEffect(() => {
        // Listen for socket events to refetch Rappel
        if (!socket) return
        // Listen for Rappel to trigger refetch

        // listen for push updates  
        socket.on('refetchRappels', handleRefetchRappel)
      }, [socket, queryClient])
    
    const { data , isLoading ,isError , refetch} = useFetchRappels()
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize :  calculateRowsGeneral(window.innerHeight, window.innerWidth)  });
    useEffect(() => {
            const handleResize = () => {
              console.log('Window resize' , window.innerHeight, window.innerWidth , calculateRowsGeneral(window.innerHeight, window.innerWidth))
              setPagination((prev) => ({ ...prev, pageSize: calculateRowsGeneral(window.innerHeight, window.innerWidth) }));
            };
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
          }, []);
    const [openModal , setOpenModal] = useState({});

    console.log('rappel data rerenderd', data);

    const columns = useMemo(() => [
        {
                header : '\u00A0',
                id: 'image',
                accessorFn: row => row.garage ? `${row.garage.nom_voiture} ${row.garage.version_voiture} ${row.garage.matricule_garage}` : '',
                enableSorting: false,
                cell : ({ row }) => {
                  const data = row.original.garage;
                  const object = allCosts.find(item => item.value === row.original.type_depense_rappel);
                  const IconComp = object.icon ;    
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
                    : <span className='w-22 flex items-center justify-center desktop:w-24 desktop-lg:w-24 h-12 desktop:h-13'>
                      <div className={`p-3.5 flex items-center justify-center ${object?.style} ring-1 ring-gray-200/50  rounded-full `}>
                         <IconComp className="shrink-0 h-5 w-5" />
                      </div>
                    </span>
                  },
                  meta: { width: '13%' },
              },
              {
                header : 'Rappel',
                accessorKey: 'sequence_rappel',
                sortingFn: (rowA, rowB, columnId) => {
                // Extract the numeric part after 'RP-'
                const numA = parseInt((rowA.getValue(columnId) || '').replace(/^RP-/, '')) || 0;
                const numB = parseInt((rowB.getValue(columnId) || '').replace(/^RP-/, '')) || 0;
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
          header: 'Rappel lié à',
          id: 'objet',
          accessorFn: row => {
            if (row.garage) {
              return `voitures`;
            }
            console.log("r" ,row.type_depense_rappel, allCosts.find(c => c.value === row.type_depense_rappel)?.label);
            return allCosts.find(c => c.value === row.type_depense_rappel)?.label ;
          },
          cell: ({ row }) => {
            return (
              row.original.garage ?
              <span className="text-base font-medium">{"Voitures"}</span>
              :
              <span className="text-base font-medium text-wrap max-w-full">{allCosts.find(c => c.value === row.original.type_depense_rappel)?.label}</span>
            )
          },
          meta: { width: '10%' },
        },
        {
          header: 'Type de dépense',
          id : 'type_depense_rappel',
          accessorFn : row => allCosts.find(item => item.value === row.type_depense_rappel)?.label,
          cell: ({ row }) => {
            const object = allCosts.find(item => item.value === row.original.type_depense_rappel);
             return (
               <ToolTipCustom
            trigger = {<span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-base gap-3 font-medium bg-rod-foreground max-w-full">{<span className='truncate '>{object.label}</span>}</span>}
            message={<span className="text-sm">{object.label}</span>}
          />
            );
          },
          meta: { width: '20%' },
        },
        {
          header: 'Date du dernier paiement',
          accessorKey: 'last_confirmation',
          cell: ({ cell , row }) => {
            return (
               <span className="text-base desktop-lg:text-base font-medium truncate ">
                        {cell.getValue() ? FormatDateEEEEddMMyyyy(cell.getValue()) : FormatDateEEEEddMMyyyy(row.original.date_debut_rappel)}
                      </span>
            );
          },
          meta: { width: '20%' },
        },
        {
          header: 'Montant',
          accessorKey: 'montant_rappel',
          cell: ({ cell }) => {
            return (
              <span className={`text-base desktop-lg:text-lg font-semibold`}>{cell.getValue() ? `${cell.getValue()} DT` :<span className='ml-1.5'>_</span>}</span>
            );
          },
          meta: { width: '9%' },
        },
        {
          header: 'Périodicité',
          accessorKey: 'periodicite_rappel',
          cell: ({ cell }) => {
            const labels = {
              HEBDOMADAIRE : "Chaque semaine" ,
              MENSUEL :  "Chaque mois"  ,
              TRIMESTRIEL :  "Chaque trimestre",
              SEMESTRIEL :  "Chaque semestre" ,
              ANNUEL :  "Chaque année" 
            }
            return (
              <Badge className={`text-sm  font-medium bg-blue-100 text-blue-700`}>{labels[cell.getValue()]}</Badge>
            );
          },
          meta: { width: '15%' },
        },
        {
          header: '\u00A0',
          id:'actions',
          cell: ({ row }) =>
            {
            return <DepenseActions  openDeleteModal={() => setOpenModal({ type: 'delete', id: row.original.id_rappel ,  sequence: row.original.sequence_rappel })} openDetailModal={() => setOpenModal({ type: 'detail', id: row.original.id_rappel , sequence: row.original.sequence_rappel })} />
           },
          meta: { width: '5%' },
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
          isLoading ? <RappelSkeleton pageSize={pagination.pageSize} /> : 
          <TableContent isError={isError} refetch={refetch} table={table} icon={CalendarSync} NoContentTitle="Oups… pas encore de rappels ici" NoContentDescription="Aucun rappel de dépense n’a encore été créé. Commencez à créer des rappels pour ne rien oublier et garder vos finances sous contrôle !" />}
        <Pagination table={table} isLoading={isLoading} isError={isError} />

        {
          openModal?.type === 'delete' && (
          <DeleteDepenseModal open={!!openModal} data={openModal} close={() => setOpenModal({})} 
              Icon={CalendarSync}
              title={`Supprimer le rappel ${openModal.sequence} ?`}
              desc="Vous êtes sur le point de supprimer définitivement ce rappel."
              formDesc={<>Tapez l'identifiant <span className="font-medium">{openModal.sequence}</span> du rappel pour confirmer la suppression</>}
              useMutation={useDeleteRappel}
          />
        )
        }

        {
          openModal?.type === 'detail' && (
          <ViewRappelModal open={!!openModal} data={openModal} close={() => setOpenModal({})} />
        )
        }
    </>
  )
}

export default RappelContent


import { Skeleton } from "../../../ui/skeleton"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { DepenseActions } from '../depenseActions';


const RappelSkeleton = (pageSize) => {
  return (
    <Table className="w-full">
        <TableHeader >
          <TableRow >
            <TableHead className="w-[13%] text-gray-600">
                
            </TableHead>
            <TableHead className="w-[8%] text-gray-600">
                Rappel
                
            </TableHead>
            <TableHead className="w-[10%] text-gray-600">
                Rappel lié à
              
            </TableHead>
            <TableHead className="w-[20%] text-gray-600">
               Type de dépense
               
            </TableHead>
            <TableHead className="w-[20%] text-gray-600">
                 Date du dernier paiement
            </TableHead>
             <TableHead className="w-[9%] text-gray-600">
                 Montant
            </TableHead>
            <TableHead className="w-[15%] text-gray-600">
                Périodicité                
            </TableHead>
            <TableHead className=" flex justify-end w-[12%] text-gray-600 ">
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {[...Array(pageSize)].map((_, index) => (
              <TableRow key={index}>
                <TableCell className="flex items-center justify-center">
                  <Skeleton className="size-12 desktop:size-13  ml-[20%] mr-auto rounded-full " />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 desktop:h-4.5 w-3/4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 desktop:h-4.5 w-3/4" />
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
                    <Skeleton className="h-4 desktop:h-4.5 w-3/4" />
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
