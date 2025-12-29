import { searchFilter } from '../../../shared/tables/searchFilter';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'; 
import { CheckCheck, ClipboardCheck, Icon } from 'lucide-react';
import { TableContent } from '../../../shared/tables/TableContent';
import  Pagination  from '../../../shared/Pagination';
import { useMemo , useState } from 'react'
import useFetchReminders from '../../../../api/queries/depense/rappel/useFetchReminders';
import { ToolTipImage  } from '../../../customUi/tooltiplist';
import { allCosts } from '../../../../utils/costs';
import { Badge } from '@/components/ui/badge';
import { FormatDateEEEEddMMyyyy } from '../../../../utils/dateConverter';
import { Button } from '../../../ui/button';
import { calculateRowsGeneral } from '../../../../utils/rowsCalculator';
import { useEffect } from 'react';
import ToolTipCustom from '../../../customUi/tooltip';
import { ReminderConfirmModal } from '../../../modals/depense/reminderActions/reminderConfirmModal';

const ReminderContent = ({globalFilter, setGlobalFilter}) => {

    const {data , isLoading ,isError , refetch  } = useFetchReminders();

    console.log('reminder data rerenderd', data);


    const [sorting, setSorting] = useState([]);
    const [openModal , setOpenModal] = useState({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize : calculateRowsGeneral(window.innerHeight, window.innerWidth)  })
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
                        {['SALAIRES','CNSS_ASSURANCE','FOURNITURES','PNEUS'].includes(object.value) ?
                            <Icon iconNode={IconComp} className="shrink-0 h-5 w-5" />
                            :
                            <IconComp className="shrink-0 h-5 w-5" />
                            
                        }
                      </div>
                  </span>
                },
                meta: { width: '13%' },
        },
        {
          header: 'Dépense liée à',
          id: 'objet',
          accessorFn: row => {
            if (row.garage) {
              return `voitures`;
            }
            return allCosts.find(c => c.value === row.type_depense_rappel)?.label ;
          },
          cell: ({ row }) => {
            //const data = row.original.garage
            return (
              row.original.garage ?
              /*<div className="flex  flex-col items-start gap-0.5">
                <span className="text-base  font-medium">{"GLC PLUGIN HYBRED E3005FS"}</span>
                <Badge variant='secondary' className="text-xs py-0.25 desktop-lg:text-sm font-semibold">
                  {data.matricule_garage}
                </Badge>
              </div>*/
              <span className="text-base font-medium">{"Voitures"}</span>
              :
              <span className="text-base font-medium text-wrap max-w-full">{allCosts.find(c => c.value === row.original.type_depense_rappel)?.label}</span>
            )
          },
          meta: { width: '14%' },
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
          header: 'Date d\'échéance',
          accessorKey: 'date_rappel',
          cell: ({ cell }) => {
            return (
               <span className="text-base desktop-lg:text-base font-medium truncate ">
                        {FormatDateEEEEddMMyyyy(cell.getValue())}
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
              <span className={`text-base desktop-lg:text-lg font-semibold `}>{cell.getValue() ? `${cell.getValue()} DT` :<span className='ml-1.5'>_</span>}</span>
            );
          },
          meta: { width: '12%' },
        },
        {
          header: 'Status',
          accessorKey: 'daysDiff',
          cell: ({ cell }) => {
            let styleClass ='';
            switch (true) {
              case cell.getValue() === 0:
                styleClass = 'bg-yellow-100 text-yellow-600 text-sm';
                break;
              case cell.getValue() < 0:
                styleClass = 'bg-red-100 text-red-600 text-sm';
                break;
              case cell.getValue() > 0:
                styleClass = 'bg-green-100 text-green-600 text-sm';
                break;
            }
            return (
              <Badge className={styleClass}>
                {cell.getValue()  === 0 ? 'À payer aujourd\'hui' : cell.getValue()===1 ? 'À payer demain' : cell.getValue() < 0 ? 'Paiement manqué (' + cell.getValue() + ' j'+ ')' : 'À payer dans ' + cell.getValue() + ' j'}
              </Badge>
            );
          },
          meta: { width: '12%' },
          
        },
        {
          header: '\u00A0',
          id: 'actions',
          enableSorting:false,
          cell: ({row}) => (
           <span className=" flex justify-end  font-medium mr-1 ">
            <Button onClick={() => setOpenModal({id: row.original?.id_rappel , id_garage : row.original?.garage?.id_garage  || null, type: row.original?.type_depense_rappel , montant : row.original?.montant_rappel})} className="[&>svg]:!w-5 [&>svg]:!h-5" variant="outline" >
              <CheckCheck />
            </Button>
          </span>
          ),
          meta: { width: '12%' },
          
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
          isLoading ? <ReminderSkeleton pageSize={pagination.pageSize} /> : 
                  <TableContent isError={isError} refetch={refetch} table={table} icon={ClipboardCheck} SucessMode={true} NoContentTitle="Tout est à jour !" NoContentDescription="Vous n’avez actuellement aucun traite de leasing en attente de paiement." />
        }
        <Pagination table={table} isLoading={isLoading} isError={isError} />
        {
          openModal?.id && (
            <ReminderConfirmModal
              open={!!openModal?.id}
              data={openModal}
              close={() => setOpenModal({})}
            />
          )
        }

    </>
  )
}

export default ReminderContent



// skeleton

import { Skeleton } from "../../../ui/skeleton"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"

const ReminderSkeleton = ({pageSize}) => {
  return (
    <Table className="w-full">
        <TableHeader >
          <TableRow >
            <TableHead className="w-[13%] text-gray-600">
                
            </TableHead>
            <TableHead className="w-[14%] text-gray-600">
                Dépense liée à
                
            </TableHead>
            <TableHead className="w-[20%] text-gray-600">
                Type de dépense
              
            </TableHead>
            <TableHead className="w-[20%] text-gray-600">
               Date d\'échéance
               
            </TableHead>
            <TableHead className="w-[12%] text-gray-600">
                 Montant
            </TableHead>
            <TableHead className="w-[12%] text-gray-600">
            Status                
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
                <TableCell className="  ">
                  <Skeleton className="size-8 mr-4 ml-auto rounded-full" />
                </TableCell>
                </TableRow>
        ))}
        </TableBody>
      </Table>
  );
};