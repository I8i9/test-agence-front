import { CheckCircle2, Eye, GaugeCircle, Handshake, ReceiptText, Target, TrendingUp, TrendingDown } from 'lucide-react'
import React from 'react'
import { Skeleton } from '../../../ui/skeleton';

const OperationsKpi = ({ data, loading, error }) => { 

    
    if (loading) {
        return <div className='w-full h-fit grid-cols-6 gap-x-4 mt-4 grid'>
            <Skeleton className='h-[100px] desktop:h-[108px] desktop-lg:h-[124px] rounded-lg col-span-1' />
            <Skeleton className='h-[100px] desktop:h-[108px] desktop-lg:h-[124px] rounded-lg col-span-1' />
            <Skeleton className='h-[100px] desktop:h-[108px] desktop-lg:h-[124px] rounded-lg col-span-1' />
            <Skeleton className='h-[100px] desktop:h-[108px] desktop-lg:h-[124px] rounded-lg col-span-1' />
            <Skeleton className='h-[100px] desktop:h-[108px] desktop-lg:h-[124px] rounded-lg col-span-1' />
            <Skeleton className='h-[100px] desktop:h-[108px] desktop-lg:h-[124px] rounded-lg col-span-1' />
            </div>
    }

    const getGrowthIcon = (growth) => {
        if (growth === null || growth === undefined) return null; 
        if (growth > 0) return TrendingUp;
        if (growth < 0) return TrendingDown; 
        return null;
    };

    const getGrowthColor = (growth) => {
        if (growth > 0) return 'text-green-600';
        if (growth < 0) return 'text-red-600';
        return 'text-gray-500';
    }; 

    const GrowthIcon1 = getGrowthIcon(data?.clics?.growth);
    const GrowthIcon2 = getGrowthIcon(data?.demandes?.growth);
    const GrowthIcon3 = getGrowthIcon(data?.contrats?.growth);
    const GrowthIcon4 = getGrowthIcon(data?.tauxConversion?.growth);
    const GrowthIcon5 = getGrowthIcon(data?.tauxSucces?.growth);
    const GrowthIcon6 = getGrowthIcon(data?.tauxOccupation?.growth);

  return (

    <div className='w-full h-fit grid-cols-6 gap-x-4 mt-4 grid px-0.5'>
        {/* clics kpi card */}
         <div className={`bg-white h-full cursor-pointer flex flex-col gap-0 desktop:gap-2 desktop-lg:gap-4 rounded-lg shadow-card-garage p-3 desktop-lg:p-4 hover:shadow-card-garage-hover transition-shadow duration-500 `}>
            <div className="flex items-center justify-between">
                <h3 className={`font-medium text-gray-800 text-sm`}>Vues</h3>
                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                <Eye className='size-4' />
                </div>
            </div>
            <div className='flex-1 flex flex-col gap-1 min-h-0 font-bold text-xl'>
               <span>{data?.clics?.value ?? '-'}</span>

               <span className={`text-sm font-normal flex items-center gap-1 ${getGrowthColor(data?.clics?.growth)}`}>
                    {GrowthIcon1 && <GrowthIcon1 className='size-4' />}
                    {data?.clics?.growth !== null && data?.clics?.growth !== undefined && data?.clics?.growth !== 0 ? data?.clics?.growth + ' %' : 'Aucune variation'}
                </span>
            </div>
        </div>

        <div className={`bg-white h-full cursor-pointer flex flex-col gap-0 desktop:gap-2 desktop-lg:gap-4 rounded-lg shadow-card-garage p-3 desktop-lg:p-4 hover:shadow-card-garage-hover transition-shadow duration-500 `}>
            <div className="flex items-center justify-between">
                <h3 className={`font-medium text-gray-800 text-sm`}>Demandes</h3>
                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                <Handshake className='size-4' />
                </div>
            </div>
            <div className='flex-1 flex flex-col gap-1 min-h-0 font-bold text-xl'>
                <span>{data?.demandes?.value ?? '-'}</span>

               <span className={`text-sm font-normal flex items-center gap-1 ${getGrowthColor(data?.demandes?.growth)}`}>
                    {GrowthIcon2 && <GrowthIcon2 className='size-4' />}
                    {data?.demandes?.growth !== null && data?.demandes?.growth !== undefined && data?.demandes?.growth!== 0 
                        ? data?.demandes?.growth + '%' 
                        : 'Aucune variation'}
                </span>
            </div>
        </div>


        <div className={`bg-white h-full cursor-pointer flex flex-col gap-0 desktop:gap-2 desktop-lg:gap-4 rounded-lg shadow-card-garage p-3 desktop-lg:p-4 hover:shadow-card-garage-hover transition-shadow duration-500 `}>
            <div className="flex items-center justify-between">
                <h3 className={`font-medium text-gray-800 text-sm`}>Contrats</h3>
                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                <ReceiptText className='size-4' />
                </div>
            </div>
            <div className='flex-1 flex flex-col gap-1 min-h-0 font-bold text-xl'>
                <span>{data?.contrats?.value ?? '-'}</span>

               <span className={`text-sm font-normal flex items-center gap-1 ${getGrowthColor(data?.contrats?.growth)}`}>
                    {GrowthIcon3 && <GrowthIcon3 className='size-4' />}
                    {data?.contrats?.growth !== null && data?.contrats?.growth !== undefined && data?.contrats?.growth!== 0 
                        ? data?.contrats?.growth + '%' 
                        : 'Aucune variation'}
                </span>
            </div>
        </div>

        <div className={`bg-white h-full cursor-pointer flex flex-col gap-0 desktop:gap-2 desktop-lg:gap-4 rounded-lg shadow-card-garage p-3 desktop-lg:p-4 hover:shadow-card-garage-hover transition-shadow duration-500 `}>
            <div className="flex items-center justify-between">
                <h3 className={`font-medium text-gray-800 text-sm`}>Conversion</h3>
                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                <Target className='size-4' />
                </div>
            </div>
            <div className='flex-1 flex flex-col gap-1 min-h-0 font-bold text-xl'>
               <span>{data?.tauxConversion?.value ?? '-'}{data?.tauxConversion?.value != null ? "%" : ""}</span>

               <span className={`text-sm font-normal flex items-center gap-1 ${getGrowthColor(data?.tauxConversion?.growth)}`}>
                    {GrowthIcon4 && <GrowthIcon4 className='size-4' />}
                    {data?.tauxConversion?.growth !== null && data?.tauxConversion?.growth !== undefined && data?.tauxConversion?.growth!== 0 
                        ? data?.tauxConversion?.growth + '%' 
                        : 'Aucune variation'}
                </span>
            </div>
        </div>

        <div className={`bg-white h-full cursor-pointer flex flex-col gap-0 desktop:gap-2 desktop-lg:gap-4 rounded-lg shadow-card-garage p-3 desktop-lg:p-4 hover:shadow-card-garage-hover transition-shadow duration-500 `}>
            <div className="flex items-center justify-between">
                <h3 className={`font-medium text-gray-800 text-sm`}>Succés</h3>
                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                <CheckCircle2 className='size-4' />
                </div>
            </div>
            <div className='flex-1 flex flex-col gap-1 min-h-0 font-bold text-xl'>
               <span>{data?.tauxSucces?.value ?? '-'}{data?.tauxSucces?.value != null ? "%" : ""}</span>

               <span className={`text-sm font-normal flex items-center gap-1 ${getGrowthColor(data?.tauxSucces?.growth)}`}>
                    {GrowthIcon5 && <GrowthIcon5 className='size-4' />}
                    {data?.tauxSucces?.growth !== null && data?.tauxSucces?.growth !== undefined && data?.tauxSucces?.growth!== 0 
                        ? data?.tauxSucces?.growth + '%' 
                        : 'Aucune variation'}
                </span>
            </div>
        </div>

        <div className={`bg-white h-full cursor-pointer flex flex-col gap-0 desktop:gap-2 desktop-lg:gap-4 rounded-lg shadow-card-garage p-3 desktop-lg:p-4 hover:shadow-card-garage-hover transition-shadow duration-500 `}>
            <div className="flex items-center justify-between">
                <h3 className={`font-medium text-gray-800 text-sm`}>Occupation</h3>
                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                <GaugeCircle className='size-4' />
                </div>
            </div>
            <div className='flex-1 flex flex-col gap-1 min-h-0 font-bold text-xl'>
                <span>{data?.tauxOccupation?.value ?? '-'} {data?.tauxOccupation?.value != null ? "%" : ""}</span>

               <span className={`text-sm font-normal flex items-center gap-1 ${getGrowthColor(data?.tauxOccupation?.growth)}`}>
                    {GrowthIcon6 && <GrowthIcon6 className='size-4' />}
                    {data?.tauxOccupation?.growth !== null && data?.tauxOccupation?.growth !== undefined && data?.tauxOccupation?.growth!== 0 
                        ? data?.tauxOccupation?.growth + '%' 
                        : 'Aucune variation'}
                </span>
            </div>
        </div>
    </div>

    


  )
}

export default OperationsKpi