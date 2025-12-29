import { Loader2, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button';
import FactureTable from './tables/factureTable';
import useFetchFactures from '../../../api/queries/archive/useGetFactures';

export const FactureContent = ({year, month}) => {

  const { isLoading , data , isError , refetch } = useFetchFactures(year, month);
  if(isLoading) {
    return <div className='h-full w-full items-center flex justify-center'><Loader2 className='animate-spin' /></div>
  }

  if (!isLoading && (!data?.data || data?.data.length === 0)) {
    return <div className='h-full w-full flex flex-col desktop-lg:text-lg items-center justify-center gap-4'>
      <span>Aucune facture générée pour cette période.</span>
    </div>
  }

  if (isError) {
    return <div className='h-full w-full flex flex-col desktop-lg:text-lg items-center justify-center '>
      <span>Une erreur est survenue lors du chargement des factures.</span>
      <Button className="mt-4" onClick={refetch}><RefreshCcw /> Rafraîchir </Button>
    </div>
  }  

  return (
    <FactureTable initialData={data?.data}  clients={data?.clients} />
  )
}
