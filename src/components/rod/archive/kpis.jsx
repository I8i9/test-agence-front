import { BanknoteArrowUp, CircleDollarSign, DollarSign, FileBadge2, HandCoins, Info, Stamp, TicketPercent } from 'lucide-react'
import React from 'react'
import useFetchKpis from '../../../api/queries/archive/useGetKpis';
import { Skeleton } from '../../ui/skeleton';
import ToolTipCustom from '../../customUi/tooltip';

const KpisArchive = ({year, month}) => {

    const {isLoading, data} = useFetchKpis(year, month);

    if (isLoading) {
        return <div className='w-full h-fit grid-cols-6 gap-x-4 mt-4 grid'>
            <Skeleton className='h-21 rounded-lg col-span-1' />
            <Skeleton className='h-21 rounded-lg col-span-1' />
            <Skeleton className='h-21 rounded-lg col-span-1' />
            <Skeleton className='h-21 rounded-lg col-span-1' />
            <Skeleton className='h-21 rounded-lg col-span-1' />
            <Skeleton className='h-21 rounded-lg col-span-1' />
            </div>
    }
  return (
    <div className='w-full h-fit grid-cols-6 gap-x-4 mt-4 grid'>

        {/* KPI Card 1 */}
        <ToolTipCustom
        side="bottom"
        trigger={
        <div className={`bg-white cursor-pointer h-full flex flex-col gap-0 desktop:gap-2 desktop-lg:gap-4 rounded-lg shadow-card-garage p-3 desktop-lg:p-4 hover:shadow-card-garage-hover transition-shadow duration-500 `}>
            <div className="flex items-center justify-between">
                <h3 className={`font-medium text-gray-800 text-sm `}>Revenu</h3>
                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                <BanknoteArrowUp className='size-4' />
                </div>
            </div>
            <div className='flex-1 flex gap-1 min-h-0 font-bold text-xl items-start'>
    
                <span className='truncate min-w-0'>
                    {data?.revenue} TTC
                </span>
                {
                    data?.revenue ? 
                    <Info className='inline-block size-3 text-gray-500 mt-0.5 flex-shrink-0' /> : null
                }
            </div>
        </div>
        }
        message={
            <span className='flex gap-4  p-1 '>
                <span className='flex flex-col font-normal gap-1 text-gray-800'>
                    <span>Revenu TTC </span>
                    <span>TVA Collectée</span>
                    <span>Revenu HT </span>

                </span>
                <span className='flex flex-col gap-1 font-bold text-right'>
                    <span>{parseFloat(data?.revenue) || '0'} TTC</span>
                    <span> {parseFloat(data?.revenue_vat) || '0'} DT </span> 
                    <span> {parseFloat(data?.revenue_ht) || '0'} DT</span>
                </span>
            </span>
        }
        />

        {/* KPI Card 1 */}

        <ToolTipCustom
        side="bottom"
        trigger={
        <div className={`bg-white h-full cursor-pointer flex flex-col gap-0 desktop:gap-2 desktop-lg:gap-4 rounded-lg shadow-card-garage p-3 desktop-lg:p-4 hover:shadow-card-garage-hover transition-shadow duration-500 `}>
            <div className="flex items-center justify-between">
                <h3 className={`font-medium text-gray-800 text-sm`}>Dépenses</h3>
                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                <HandCoins className='size-4' />
                </div>
            </div>
            <div className='flex-1 flex gap-1 min-h-0 font-bold text-xl items-start'>
    
                <span className='truncate min-w-0'>
                    {data?.expenses} TTC
                </span>
                {
                    data?.expenses ? 
                    <Info className='inline-block size-3 text-gray-500 mt-0.5 flex-shrink-0' /> : null
                }
            </div>
        </div>
        }

        message={
            <span className='flex gap-4  p-1 '>
                <span className='flex flex-col font-normal gap-1 text-gray-800'>
                    <span>Dépenses TTC </span>
                    <span>Total TVA</span>
                    <span>TVA Déductible</span>
                    <span>Dépenses HT </span>

                </span>
                <span className='flex flex-col gap-1 font-bold text-right'>
                    <span>{parseFloat(data?.expenses) || '0'} TTC</span>
                    <span> {parseFloat(data?.expenses_vat_total) || '0'} DT </span> 
                    <span> {parseFloat(data?.expenses_vat_deductible) || '0'} DT </span>
                    <span> {parseFloat(data?.expenses_ht) || '0'} DT</span>
                </span>
            </span>
        }
        />

        {/* KPI Card 1 */}
        
        <ToolTipCustom
        side="bottom"
        trigger={
        <div className={`bg-white cursor-pointer h-full flex flex-col gap-0 desktop:gap-2 desktop-lg:gap-4 rounded-lg shadow-card-garage p-3 desktop-lg:p-4 hover:shadow-card-garage-hover transition-shadow duration-500 `}>
            <div className="flex items-center justify-between">
                <h3 className={`font-medium text-gray-800 text-sm`}>TVA à Payer</h3>
                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                <TicketPercent className='size-4'/>
                </div>
            </div>
            <div className='flex-1 flex gap-1 min-h-0 font-bold text-xl items-start'>
    
                <span className='truncate min-w-0'>
                    {data?.vatResult} DT
                </span>
                {
                    data?.vatResult ? 
                    <Info className='inline-block size-3 text-gray-500 mt-0.5 flex-shrink-0' /> : null
                }
            </div>
        </div>}
        message={
            <span className='flex gap-4  p-1 '>
                <span className='flex flex-col font-normal gap-1 text-gray-800'>
                    <span>TVA collectée</span>
                    <span>TVA déductible</span>
                    <span className='ml-2 font-medium'>* Sur dépenses</span>
                    <span className='ml-2 font-medium'>* Sur acquisitions</span>

                    <span>TVA à payer</span>

                </span>
                <span className='flex flex-col gap-1 font-bold text-right'>
                    <span>{parseFloat(data?.revenue_vat) || '0'} TTC</span>
                    <span> {parseFloat(data?.vatTotal) || '0'} DT </span> 
                    <span> {parseFloat(data?.expenses_vat_deductible) || '0'} DT </span> 
                    <span> {parseFloat(data?.vatCars) || '0'} DT </span> 
                    <span> {parseFloat(data?.vatResult) || '0'} DT </span>
                </span>
            </span>
        }
        />

        <ToolTipCustom
        side="bottom"
        trigger={
        <div className={`bg-white h-full cursor-pointer flex flex-col gap-0 desktop:gap-2 desktop-lg:gap-4 rounded-lg shadow-card-garage p-3 desktop-lg:p-4 hover:shadow-card-garage-hover transition-shadow duration-500 `}>
            <div className="flex items-center justify-between">
                <h3 className={`font-medium text-gray-800 text-sm`}>Résultat Net </h3>
                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                <CircleDollarSign className='size-4' />
                </div>
            </div>
            <div className='flex-1 flex gap-1 min-h-0 font-bold text-xl items-start'>
    
                <span className='truncate min-w-0'>
                    {data?.revenue_net} DT
                </span>
                {
                    (data?.revenue_vat && data?.expenses_ht ) ? 
                    <Info className='inline-block size-3 text-gray-500 mt-0.5 flex-shrink-0' /> : null
                }
            </div>
        </div>
        }
        message={
            <span className='flex gap-4  p-1 '>
                <span className='flex flex-col font-normal gap-1 text-gray-800'>
                    <span>Revenue HT</span>
                    <span>Dépenses HT</span>
                    <span>Résultat Net</span>

                </span>
                <span className='flex flex-col gap-1 font-bold text-right'>
                    <span>{parseFloat(data?.revenue_ht) || '0'} DT</span>
                    <span> {parseFloat(data?.expenses_ht) || '0'} DT </span> 
                    <span> {parseFloat(data?.revenue_net) || '0'} DT </span>
                </span>
            </span>
        }
        />

        <ToolTipCustom
        side="bottom"
        trigger={
        <div className={`bg-white h-full cursor-pointer flex flex-col gap-0 desktop:gap-2 desktop-lg:gap-4 rounded-lg shadow-card-garage p-3 desktop-lg:p-4 hover:shadow-card-garage-hover transition-shadow duration-500 `}>
            <div className="flex items-center justify-between">
                <h3 className={`font-medium text-gray-800 text-sm`}>Rétenue à la source</h3>
                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                <Stamp className='size-4' />
                </div>
            </div>
            <div className='flex-1 flex gap-1 min-h-0 font-bold text-xl items-start'>
    
                <span className='truncate min-w-0'>
                    {data?.rasResult} DT
                </span>
               
            </div>
        </div>
        }
        message={
            <span>{data?.rasResult} DT</span>
        }
        />


        <ToolTipCustom
        side="bottom"
        trigger={
        <div className={`bg-white h-full cursor-pointer flex flex-col gap-0 desktop:gap-2 desktop-lg:gap-4 rounded-lg shadow-card-garage p-3 desktop-lg:p-4 hover:shadow-card-garage-hover transition-shadow duration-500 `}>
            <div className="flex items-center justify-between">
                <h3 className={`font-medium text-gray-800 text-sm`}>Droit de timbre</h3>
                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                <FileBadge2 className='size-4' />
                </div>
            </div>
            <div className='flex-1 flex gap-1 min-h-0 font-bold text-xl items-start'>
    
                <span className='truncate min-w-0'>
                    {data?.timbreResult} DT
                </span>
               
            </div>
        </div>
        }
        message={
            <span>{data?.timbreResult} DT</span>
        }
        />

        
        
    </div>
  )
}

export default KpisArchive