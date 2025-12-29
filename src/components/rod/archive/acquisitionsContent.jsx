import { Loader2, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button';
import useFetchAcquisitions from '../../../api/queries/archive/useGetAcquisition';
import AcquisitionsTable from './tables/acquisitionsTable';

export const AcquisitionsContent = ({year, month}) => {

  const { isLoading , data , isError , refetch } = useFetchAcquisitions(year, month);
  if(isLoading) {
    return <div className='h-full w-full items-center flex justify-center'><Loader2 className='animate-spin' /></div>
  }

  if (!isLoading && (!data?.data || data?.data.length === 0)) {
    return <div className='h-full w-full flex flex-col desktop-lg:text-lg items-center justify-center gap-4'>
      <span>Aucune Acquisitions effectuées pour cette période.</span>
    </div>
  }

  if (isError) {
    return <div className='h-full w-full flex flex-col desktop-lg:text-lg items-center justify-center '>
      <span>Une erreur est survenue lors du chargement des acquisitions.</span>
      <Button className="mt-4" onClick={refetch}><RefreshCcw /> Rafraîchir </Button>
    </div>
  }

  return (
    <AcquisitionsTable initialData={data?.data || []}  />
  )
}
