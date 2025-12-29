import { BanknoteArrowUp, Calculator, CheckCircle2, Eye, GaugeCircle, HandCoins, Handshake, PercentCircle, ReceiptText, Target, TrendingDown, TrendingUp } from 'lucide-react'
import React from 'react'
import { Skeleton } from '../../../ui/skeleton';

const FinanceKpi = ({ data, loading }) => {


    if (loading) {
        return <div className='w-full h-fit grid-cols-4 gap-x-4 mt-4 grid'>
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

  const GrowthIcon1 = getGrowthIcon(data?.revenu?.growth);
  const GrowthIcon2 = getGrowthIcon(data?.depenses?.growth);
  const GrowthIcon3 = getGrowthIcon(data?.margeBrute?.growth);
  const GrowthIcon4 = getGrowthIcon(data?.tauxMargeBrute?.growth);
  
  return (

    <div className='w-full h-fit grid-cols-4 gap-x-4 mt-4 px-0.5 grid'>
        {/* clics kpi card */}
         <div className={`bg-white h-full cursor-pointer flex flex-col gap-0 desktop:gap-2 desktop-lg:gap-4 rounded-lg shadow-card-garage p-3 desktop-lg:p-4 hover:shadow-card-garage-hover transition-shadow duration-500 `}>
            <div className="flex items-center justify-between">
                <h3 className={`font-medium text-gray-800 text-sm`}>Revenu</h3>
                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                <BanknoteArrowUp className='size-4' />
                </div>
            </div>
            <div className='flex-1 flex flex-col gap-1 min-h-0 font-bold text-xl'>
                <span>{(data?.revenu?.value ?? "-")}{data?.revenu?.value != null ? "DT" : ""}</span>
                <span className={`text-sm font-normal flex items-center gap-1 ${getGrowthColor(data?.revenu?.growth || 0)}`}>
                    {GrowthIcon1 && <GrowthIcon1 className='size-4' />}
                    {data?.revenu?.growth !== null && data?.revenu?.growth !== undefined && data?.revenu?.growth!== 0 ? data?.revenu?.growth + ' %' : 'Aucune variation'}
                </span>
            </div>
        </div>

        <div className={`bg-white h-full cursor-pointer flex flex-col gap-0 desktop:gap-2 desktop-lg:gap-4 rounded-lg shadow-card-garage p-3 desktop-lg:p-4 hover:shadow-card-garage-hover transition-shadow duration-500 `}>
            <div className="flex items-center justify-between">
                <h3 className={`font-medium text-gray-800 text-sm`}>Dépenses</h3>
                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                <HandCoins className='size-4' />
                </div>
            </div>
            <div className='flex-1 flex flex-col gap-1 min-h-0 font-bold text-xl'>
                <span>{(data?.depenses?.value ?? "-")}{data?.depenses?.value != null ? "DT" : ""}</span>
                <span className={`text-sm font-normal flex items-center gap-1 ${getGrowthColor(data?.depenses?.growth || 0)}`}>
                    {GrowthIcon2 && <GrowthIcon2 className='size-4' />}
                    {data?.depenses?.growth !== null && data?.depenses?.growth !== undefined && data?.depenses?.growth!== 0 ? data?.depenses?.growth + ' %' : 'Aucune variation'}
                </span>
            </div>
        </div>


        <div className={`bg-white h-full cursor-pointer flex flex-col gap-0 desktop:gap-2 desktop-lg:gap-4 rounded-lg shadow-card-garage p-3 desktop-lg:p-4 hover:shadow-card-garage-hover transition-shadow duration-500 `}>
            <div className="flex items-center justify-between">
                <h3 className={`font-medium text-gray-800 text-sm`}>Marge Brute</h3>
                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                <Calculator className='size-4' />
                </div>
            </div>
            <div className='flex-1 flex flex-col gap-1 min-h-0 font-bold text-xl'>
                <span>{(data?.margeBrute?.value ?? "-")}{data?.margeBrute?.value != null ? "DT" : ""}</span>
                <span className={`text-sm font-normal flex items-center gap-1 ${getGrowthColor(data?.margeBrute?.growth || 0)}`}>
                    {GrowthIcon3 && <GrowthIcon3 className='size-4' />}
                    {data?.margeBrute?.growth !== null && data?.margeBrute?.growth !== undefined && data?.margeBrute?.growth!== 0 ? data?.margeBrute?.growth + ' %' : 'Aucune variation'}
                </span>
            </div>
        </div>

        <div className={`bg-white h-full cursor-pointer flex flex-col gap-0 desktop:gap-2 desktop-lg:gap-4 rounded-lg shadow-card-garage p-3 desktop-lg:p-4 hover:shadow-card-garage-hover transition-shadow duration-500 `}>
            <div className="flex items-center justify-between">
                <h3 className={`font-medium text-gray-800 text-sm`}>Taux De Marge Brute</h3>
                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                <PercentCircle className='size-4' />
                </div>
            </div>
            <div className='flex-1 flex flex-col gap-1 min-h-0 font-bold text-xl'>
                <span>{data?.tauxMargeBrute?.value ?? "-"}{data?.tauxMargeBrute?.value != null ? "%" : ""}</span>
                <span className={`text-sm font-normal flex items-center gap-1 ${getGrowthColor(data?.tauxMargeBrute?.growth || 0)}`}>
                    {GrowthIcon4 && <GrowthIcon4 className='size-4' />}
                    {data?.tauxMargeBrute?.growth !== null && data?.tauxMargeBrute?.growth !== undefined && data?.tauxMargeBrute?.growth!== 0  ? data?.tauxMargeBrute?.growth + ' %' : 'Aucune variation'}
                </span>
            </div>
        </div>

    </div>

    


  )
}


export default FinanceKpi