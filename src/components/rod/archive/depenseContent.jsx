import { Loader2, RefreshCcw } from 'lucide-react'
import DepenseTable from './tables/depenseTable'
import useFetchDepenses from '../../../api/queries/archive/useGetDepenses';
import { Button } from '@/components/ui/button';

export const DepenseContent = ({year, month}) => {

  const { isLoading , data , isError , refetch } = useFetchDepenses(year, month);
  if(isLoading) {
    return <div className='h-full w-full items-center flex justify-center'><Loader2 className='animate-spin' /></div>
  }

  if (!isLoading && (!data?.data || data?.data.length === 0)) {
    return <div className='h-full w-full flex flex-col desktop-lg:text-lg items-center justify-center gap-4'>
      <span>Aucune dépense déclarée pour cette période.</span>
    </div>
  }

  if (isError) {
    return <div className='h-full w-full flex flex-col desktop-lg:text-lg items-center justify-center '>
      <span>Une erreur est survenue lors du chargement des dépenses.</span>
      <Button className="mt-4" onClick={refetch}><RefreshCcw /> Rafraîchir </Button>
    </div>
  }
    ''
  

  return (
    <DepenseTable month={month} year={year} initialData={data?.data} fournisseurs={data?.fournisseurs || []} types={data?.types || []} />
  )
}
