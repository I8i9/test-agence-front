import { BadgeCheck, BanknoteArrowDown, Blend, Bubbles, CheckCircle2, Eye, GaugeCircle, Handshake, Headset, ReceiptText, Target, Timer, TrendingDown, TrendingUp, UserCheck, UserStar, Zap } from 'lucide-react'
import React from 'react'
import { Skeleton } from '../../../ui/skeleton';

const formatResponseTime = (minutes) => {
    if (minutes == null) return '-';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? hrs + 'h' : ''}${mins}min`;
};

const ClientsKpi = ({ data , loading}) => {

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

  const GrowthIcon1 = getGrowthIcon(data?.retentionRate?.growth);
  const GrowthIcon2 = getGrowthIcon(data?.averageResponseTime?.growth);
  const GrowthIcon3 = getGrowthIcon(data?.totalDiscounts?.growth);
  const GrowthIcon4 = getGrowthIcon(data?.rodScore?.growth);

  return (

    <div className='w-full h-fit grid-cols-4 gap-x-4 mt-4 grid px-0.5'>
        {/* clics kpi card */}
         <div className={`bg-white h-full cursor-pointer flex flex-col gap-0 desktop:gap-2 desktop-lg:gap-4 rounded-lg shadow-card-garage p-3 desktop-lg:p-4 hover:shadow-card-garage-hover transition-shadow duration-500 `}>
            <div className="flex items-center justify-between">
                <h3 className={`font-medium text-gray-800 text-sm`}>Taux de Fidélisation</h3>
                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                <UserCheck className='size-4' />
                </div>
            </div>
            <div className='flex-1 flex flex-col gap-1 min-h-0 font-bold text-xl'>
               <span>{data?.retentionRate?.value ?? '-'}{data?.retentionRate?.value != null ? "%" : ""}</span>
                <span className={`text-sm font-normal flex items-center gap-1 ${getGrowthColor(data?.retentionRate?.growth || 0)}`}>
                    {GrowthIcon1 && <GrowthIcon1 className='size-4' />}
                    {data?.retentionRate?.growth !== null && data?.retentionRate?.growth !== undefined && data?.retentionRate?.growth !== 0 
                    ? data?.retentionRate?.growth + ' %' 
                    : 'Aucune variation'}
                </span>
            </div>
        </div>

        <div className={`bg-white h-full cursor-pointer flex flex-col gap-0 desktop:gap-2 desktop-lg:gap-4 rounded-lg shadow-card-garage p-3 desktop-lg:p-4 hover:shadow-card-garage-hover transition-shadow duration-500 `}>
            <div className="flex items-center justify-between">
                <h3 className={`font-medium text-gray-800 text-sm`}>Temps de réponse moyen</h3>
                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                <Timer className='size-4' />
                </div>
            </div>
            <div className='flex-1 flex flex-col gap-1 min-h-0 font-bold text-xl'>
               <span>{formatResponseTime(data?.averageResponseTime?.value)}</span>
                <span className={`text-sm font-normal flex items-center gap-1 ${getGrowthColor(data?.averageResponseTime?.growth || 0)}`}>
                    {GrowthIcon2 && <GrowthIcon2 className='size-4' />}
                    {data?.averageResponseTime?.growth !== null && data?.averageResponseTime?.growth !== undefined && data?.averageResponseTime?.growth !== 0 
                    ? data?.averageResponseTime?.growth + ' %' 
                    : 'Aucune variation'}
                </span>
            </div>
        </div>


        <div className={`bg-white h-full cursor-pointer flex flex-col gap-0 desktop:gap-2 desktop-lg:gap-4 rounded-lg shadow-card-garage p-3 desktop-lg:p-4 hover:shadow-card-garage-hover transition-shadow duration-500 `}>
            <div className="flex items-center justify-between">
                <h3 className={`font-medium text-gray-800 text-sm`}>Totale des remises</h3>
                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                <BanknoteArrowDown className='size-4' />
                </div>
            </div>
            <div className='flex-1 flex flex-col gap-1 min-h-0 font-bold text-xl'>
               <span>{data?.totalDiscounts?.value ?? '-'}{data?.totalDiscounts?.value != null ? "DT" : ""}</span>
                <span className={`text-sm font-normal flex items-center gap-1 ${getGrowthColor(data?.totalDiscounts?.growth || 0)}`}>
                    {GrowthIcon3 && <GrowthIcon3 className='size-4' />}
                    {data?.totalDiscounts?.growth !== null && data?.totalDiscounts?.growth !== undefined && data?.totalDiscounts?.growth !== 0 
                    ? data?.totalDiscounts?.growth + ' %' 
                    : 'Aucune variation'}
                </span>
            </div>
        </div>


        <div className={`bg-white h-full cursor-pointer flex flex-col gap-0 desktop:gap-2 desktop-lg:gap-4 rounded-lg shadow-card-garage p-3 desktop-lg:p-4 hover:shadow-card-garage-hover transition-shadow duration-500 `}>
            <div className="flex items-center justify-between">
                <h3 className={`font-medium text-gray-800 text-sm`}>Score sur Rod</h3>
                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                <UserStar className='size-4' />
                </div>
            </div>
            <div className='flex-1 flex flex-col gap-1 min-h-0 font-bold text-xl'>
               <span>{data?.rodScore?.value ?? '-'} {data?.rodScore?.value != null ? "/ 5" : ""}</span>
                <span className={`text-sm font-normal flex items-center gap-1 ${getGrowthColor(data?.rodScore?.growth || 0)}`}>
                    {GrowthIcon4 && <GrowthIcon4 className='size-4' />}
                    {data?.rodScore?.growth !== null && data?.rodScore?.growth !== undefined && data?.rodScore?.growth !== 0 
                    ? data?.rodScore?.growth + ' %' 
                    : 'Aucune variation'}
                </span>
            </div>
        </div>
    </div>

    


  )
}

export default ClientsKpi