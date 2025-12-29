import { DollarSign, HandCoins, Percent, ReceiptText, ShoppingCart,Eye, BarChartBigIcon, ArrowUp , ArrowDown, Car, TrendingUp, CheckCircle2, ClipboardList, BanknoteArrowUp } from 'lucide-react'
import KpiCard from '../components/rod/dashboard/kpiCard'
import CountUp from '../components/customUi/countUp'
import GarageChart from '../components/rod/dashboard/garageChart'
import { RevenueChart } from '../components/rod/dashboard/revenueChart'
import { Badge } from '../components/ui/badge'
import ToolTipCustom from '../components/customUi/tooltip'
import useGetDashboard from '../api/queries/dashboard/useGetDashboard.js'
import { useStore } from '../store/store.js'
import { Jelly } from 'ldrs/react'
import 'ldrs/react/Jelly.css'

import { useQueryClient } from '@tanstack/react-query';
import placeHolder from '../assets/images/carPlaceHolder.png'
import wave from '../assets/icons/waving_hand_3d_default.png'


// eslint-disable-next-line no-unused-vars
import { motion, time } from "framer-motion";
import Tasks from '../components/rod/dashboard/tasks.jsx'
import NoCarChart from '../components/rod/dashboard/noCarChart.jsx'
import { useEffect } from 'react'
import convertNumberToK from '../utils/NumbersConverter.js'



const Dashboard = () => {
  const user = useStore(state => state.user);

  const isFirstLoad = useStore(state => state.firstLoad);
  const stopFirstLoad = useStore(state => state.stopFirstLoad);

  console.log("isFirstLoad in Dashboard:", isFirstLoad);

  const dataOld = useStore(state => state.dataOld);
  const setDataOld = useStore(state => state.setDataOld);

  const { data  , isSuccess ,isLoading} = useGetDashboard();

  useEffect(() => {
  if (isSuccess) {
    stopFirstLoad();
  }
}, [isSuccess]);

  useEffect(() => {

    setTimeout(() => {
      if(data) {
        setDataOld({
          revenue: data?.revenue,
          expenses: data?.expenses,
          views: data?.views,
          activeOffers: data?.activeOffers,
          activePromotions: data?.activePromotions,
          contracts: data?.contracts,
        });
      }
    }, 4000);

  }, [data]);
  const queryClient = useQueryClient();
  // get cached depense Count query
  const cachedData = queryClient.getQueryData(['countDepense']);
  const tasks = { ...data?.tasks, reminders: cachedData?.countReminders };

  // socket for real time updates
  const socket = useStore(state => state.socket)  

  const handleRefetchDashboard = () => {
    queryClient.invalidateQueries(['dashboard']) // Use your actual query key
  }
    useEffect(() => {
      // Listen for socket events to refetch Dashboard
      if (!socket) return
      // Listen for Dashboard to trigger refetch

      // listen for push updates  
      socket.on('refetchGarages', handleRefetchDashboard);
      socket.on('refetchDemandes', handleRefetchDashboard);
      socket.on('refetchOffres', handleRefetchDashboard);
      socket.on('refetchContrats', handleRefetchDashboard);
      socket.on('refetchDepenses', handleRefetchDashboard);
      socket.on('refetchRappels', handleRefetchDashboard);
    }, [socket])
   

  if (isLoading && isFirstLoad) {
    return (
      <div className='h-full w-full flex  flex-col items-center justify-center'>
                  <span className='font-semibold text-center  flex flex-col items-center'><span className='flex gap-1'>Bienvenue {user.name} <img src={wave} className='size-5' /></span> <span className='font-medium text-gray-500'>votre tableau de bord est en cours de chargement...</span></span>

          <span  className='mt-1' >

            {
              <Jelly
                size="40"
                speed="0.9"
                color="#D90429" 
              /> 
            }
          </span>

      </div>
    )
  } else if (isLoading) {
    return (
    <div className='h-full w-full flex  flex-col items-center justify-center'>
            {
              <Jelly
                size="40"
                speed="0.9"
                color="#D90429" 
              /> 
            }

      </div>
    )
  }


  return (
   
    <div className='grid grid-cols-[65%_1fr] h-full w-full gap-4'>

      {/* Left Side - Main Content */}
      <div className='grid grid-rows-[40%_1fr]  gap-4 min-h-0'>
        <div className='grid grid-cols-3 grid-rows-[1fr_auto]  gap-4'>
          <KpiCard title="Revenu" titleStyle={"text-sm desktop-lg:text-base"} icon={<BanknoteArrowUp className="size-4 desktop-lg:size-5" />}>
            <div className='h-full flex flex-col justify-center text-2xl desktop:text-3xl desktop-lg:text-4xl font-bold gap-1'>
              <CountUp startFrom={dataOld?.revenue || 0} end={data?.revenue} suffix={"DT"} duration={3} />
              <span className='text-sm desktop-lg:text-sm font-normal text-gray-500'>
                <span className={data?.pourcentage_revenue !== 0 ? data?.pourcentage_revenue > 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold' : 'text-gray-600 font-bold' }>
                  {
                    data?.pourcentage_revenue &&
                    <>
                        {data?.pourcentage_revenue > 0 ?
                      <ArrowUp className="inline size-4 mb-0.5 mr-0.5" /> :<ArrowDown className="inline size-4 mb-0.5 mr-0.5" />
                      }
                      {data?.pourcentage_revenue > 0 ? '+' : ''}{data?.pourcentage_revenue}% {" "}                    
                    </>
                  }
                  
                </span>
                {
                  data?.pourcentage_revenue ? 'vs le mois dernier' : 'Pas d\'activité le mois dernier'
                }
              </span>
            </div>
          </KpiCard>
          <KpiCard title="Dépenses" titleStyle={"text-sm desktop-lg:text-base"}  icon={<HandCoins className="size-4 desktop-lg:size-5" />}>
            <div className='h-full flex flex-col justify-center text-2xl desktop:text-3xl desktop-lg:text-4xl font-bold gap-1 '>
              <CountUp startFrom={dataOld?.expenses || 0} end={data?.expenses} suffix={"DT"} duration={3} />
              <span className='text-sm desktop-lg:text-base  font-normal text-gray-500'>
                <span className={data?.pourcentage_expenses !== 0 ? data?.pourcentage_expenses < 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold' : 'text-gray-600 font-bold' }>
                  {
                    data?.pourcentage_expenses &&
                  <>
                    {data?.pourcentage_expenses > 0 ?
                      <ArrowUp className="inline size-4 mb-0.5 mr-0.5" /> :
                      <ArrowDown className="inline size-4 mb-0.5 mr-0.5" />
                    }
                    {data?.pourcentage_expenses > 0 ? '+' : ''}{data?.pourcentage_expenses}% {" "}
                  </>
                  }
                </span>
                {
                  data?.pourcentage_expenses ? 'vs le mois dernier' : 'Pas d\'activité le mois dernier'
                }
                              
              </span>
            </div>
          </KpiCard>
          <KpiCard title="Vues" titleStyle={"text-sm desktop-lg:text-base"} icon={<Eye className="size-4 desktop-lg:size-5" />}>
              <div className='h-full flex flex-col justify-center text-2xl desktop:text-3xl desktop-lg:text-4xl font-bold gap-1'>
              <CountUp startFrom={dataOld?.views || 0} end={data?.views} duration={3} />
              <span className='text-sm desktop-lg:text-base font-normal text-gray-500'>
                <span className={data?.pourcentage_views !== 0 ? data?.pourcentage_views > 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold' : 'text-gray-600 font-bold' }>
                {
                    data?.pourcentage_views &&
                    <>
                    {data?.pourcentage_views > 0 ?
                    <ArrowUp className="inline size-4 mb-0.5 mr-0.5" /> :<ArrowDown className="inline size-4 mb-0.5 mr-0.5" />
                    }
                    {data?.pourcentage_views > 0 ? '+' : ''}{data?.pourcentage_views}% {" "}
                    </>
                }
                </span>
                {
                  data?.pourcentage_views ? 'vs le mois dernier' : 'Pas d\'activité le mois dernier'
                }
              </span>
            </div>
          </KpiCard>
          <KpiCard title="Offres Actifs" titleStyle={"text-sm desktop-lg:text-base"}  icon={<ShoppingCart className="size-4 desktop-lg:size-5" />}>
            <div className='h-fit flex flex-col justify-center text-2xl desktop:text-3xl desktop-lg:text-4xl font-bold  pb-2 '>
                <CountUp startFrom={dataOld?.activeOffers || 0} end={data?.activeOffers} duration={3} />
            </div>
          </KpiCard>
          <KpiCard title="Promo Actifs"  titleStyle={"text-sm desktop-lg:text-base"} icon={<Percent className="size-4 desktop-lg:size-5" />}>
            <div className='h-fit flex flex-col justify-center text-2xl desktop:text-3xl desktop-lg:text-4xl  font-bold pb-2 '>
                <CountUp startFrom={dataOld?.activePromotions || 0} end={data?.activePromotions} duration={3} />
            </div>
          </KpiCard>

          <KpiCard title="Contrats" titleStyle={"text-sm desktop-lg:text-base"} icon={<ReceiptText className="size-4 desktop-lg:size-5" />}>
            <div className='h-fit flex flex-col justify-center text-2xl desktop:text-3xl desktop-lg:text-4xl font-bold pb-2'>
                <CountUp startFrom={dataOld?.contracts || 0} end={data?.contracts} duration={3} />
            </div>
          </KpiCard>
        </div>

        {/*graphs*/}
        <div className=' grid grid-cols-3 gap-4 h-full'>
          <KpiCard className={"col-span-1"} title="Mon Garage" titleStyle={"text-base desktop-lg:text-lg"} icon={<Car className="size-4 desktop-lg:size-5" />}>
          <div className='h-full flex flex-col justify-between'>
            {
              data?.disponible === 0 && data?.en_location===0 && data?.en_panne===0 ?
              <NoCarChart /> : 
            
            <GarageChart data={{en_location: data?.en_location, en_panne: data?.en_panne, disponible: data?.disponible}}/>
            }
            <div className='flex h-full items-center justify-center gap-2'>
              <div className='flex flex-col justify-around h-full'>
                  <span className='size-4  desktop-lg:size-4.5 bg-rod-primary rounded-sm'></span>
                  <span className='size-4  desktop-lg:size-4.5 bg-rod-accent rounded-sm'></span>
                  <span className='size-4  desktop-lg:size-4.5 bg-rod-foreground  border rounded-sm'></span>
              </div>
              <div className='flex flex-col justify-around h-full'>
                  <span className='text-sm desktop-lg:text-lg font-medium text-gray-800'><span className='font-semibold mr-1'>{data?.en_location}</span> En Location</span>
                  <span className='text-sm desktop-lg:text-lg font-medium text-gray-800'><span className='font-semibold mr-1'>{data?.en_panne}</span> En Panne</span>
                  <span className='text-sm  desktop-lg:text-lg font-medium text-gray-800'><span className='font-semibold mr-1'>{data?.disponible}</span> Dispo/Publié</span>
              </div>
            </div>
          </div>
            
          </KpiCard>

          <KpiCard className={"col-span-2"} titleStyle={"text-base desktop-lg:text-lg"} title="Revenus Quotidiens Générés" icon={<BarChartBigIcon className="size-4 desktop-lg:size-5" />}>
                  <RevenueChart chartData={data?.chartData} />
          </KpiCard>
        </div>

      </div>

      {/* Right Side - Sidebar or Additional Content */}
      <div className='grid grid-rows-[40%_1fr]  gap-4 min-h-0'>
         <KpiCard title="À faire aujourd'hui" icon={<ClipboardList className="size-4 desktop-lg:size-5" />} titleStyle={"text-base desktop-lg:text-lg"}>
            {
              !data?.hasTasks || !tasks ? (
                <div className='h-full flex flex-col items-center justify-center text-center gap-2 px-2'>
                  <span className='bg-gray-100 p-2 rounded-full'><CheckCircle2 className='size-5 desktop:size-6 desktop-lg:size-8 text-gray-400' /></span>
                  <p className='text-xs desktop:text-sm desktop-lg:text-base  text-gray-500'>
                    Tous est bien pour votre agence
                  </p>
                </div>
              ) : (
                <Tasks data={tasks} />
                
              )
            }
            
              
          </KpiCard>
        <div className='grid grid-rows-2 gap-4'>

          {/*most demanded car and best offer*/}
          {
            data?.demande === null ?
            <KpiCard title="Véhicule le plus demandé" icon={<TrendingUp className='size-4 desktop-lg:size-5 mr-1.5' />} titleStyle={"text-base desktop-lg:text-lg"}>
              <div className='h-full flex items-center gap-8 desktop-lg:gap-12'>
                <img 
                  src={placeHolder} 
                  alt={"voiture"} 
                  className='h-18  desktop-lg:h-26 '
                />  
                <div className='flex flex-col gap-0.5 items-start mb-2 desktop-lg:mb-1 flex-1 min-w-0 overflow-hidden'>
                  <ToolTipCustom
                  trigger={<p className='text-sm desktop:text-base desktop-lg:text-lg font-semibold truncate max-w-full'>
                    Pas de véhicule populaire
                  </p>}
                  message={"Pas de véhicule populaire"}
                  />
                  <span className='text-xs desktop:text-sm desktop-lg:text-base font-medium text-gray-500  text-wrap  max-w-full'>
                    Aucun véhicule n’a encore été le plus demandé.
                  </span>
                </div>
              </div>
          </KpiCard>

            :
            <KpiCard title="Véhicule le plus demandé" icon={<span className='font-medium  text-sm flex items-center'><TrendingUp className='size-4 desktop-lg:size-5 mr-1.5' /><span className='font-bold mr-1'>{data?.demande?.nombre_demandes}</span> <span>demande{data?.demande?.nombre_demandes > 1 ? 's' : ''}</span></span>} titleStyle={"text-base desktop-lg:text-lg"}>
              <div className='h-full flex items-center gap-8 desktop-lg:gap-12'>
                <img 
                  src={data?.demande?.garage?.image_voiture} 
                  alt={data?.demande?.garage?.nom_voiture} 
                  className='h-18  desktop-lg:h-26 '
                />
                <div className='flex flex-col gap-0.5 items-start mb-2 desktop-lg:mb-1 flex-1 min-w-0 overflow-hidden'>
                  <ToolTipCustom
                    trigger={
                  <p className='text-sm desktop:text-base desktop-lg:text-xl font-semibold truncate max-w-full'>
                    {data?.demande?.garage?.nom_voiture}
                  </p>
                    }
                    message={data?.demande?.garage?.nom_voiture}
                  />
                  <ToolTipCustom
                    trigger={
                  <span className='text-xs desktop:text-sm desktop-lg:text-lg font-medium text-gray-600 leading-none truncate max-w-full'>
                    {data?.demande?.garage?.version_voiture}
                  </span> 
                    }
                    message={data?.demande?.garage?.version_voiture}
                  />
                  <Badge variant='default' className="text-xs desktop:text-xs desktop-lg:text-sm mt-1">
                    {data?.demande?.garage?.matricule_garage}
                  </Badge>
                </div>
              </div>
          </KpiCard>
          }
          
          {
            data?.offre === null ?
            <KpiCard title="Offre la plus performante" icon={<Eye className='size-4 desktop-lg:size-5 mr-1.5' />} titleStyle={"text-base desktop-lg:text-lg"}>
              <div className='h-full flex items-center gap-8 desktop-lg:gap-12'>
                 <img 
                  src={placeHolder} 
                  alt={"voiture"} 
                  className='h-18  desktop-lg:h-26 '
                />  
                <div className='flex flex-col gap-0.5 items-start mb-2 desktop-lg:mb-1 flex-1 min-w-0 overflow-hidden'>
                  <ToolTipCustom
                  trigger={
                  <p className='text-sm desktop:text-base desktop-lg:text-lg font-semibold truncate max-w-full'>
                    Pas d’offre populaire
                  </p>
                  }
                  message={"Pas d’offre populaire"}
                  />
                  <span className='text-xs desktop:text-sm desktop-lg:text-base font-medium text-gray-500  text-wrap  max-w-full'>
                    Aucune offre n’a encore été la plus consultée.
                  </span> 
                </div>
              </div>
          </KpiCard> :

          <KpiCard title="Offre la plus performante" icon={<span className='font-medium  text-sm flex items-center'><Eye className='size-4 desktop-lg:size-5 mr-1.5 mb-0.5' /><span className='font-bold mr-1'>{convertNumberToK(data?.offre?.nombre_vues)}</span> <span>vue{data?.offre?.nombre_vues > 1 ? 's' : ''}</span></span>} titleStyle={"text-base desktop-lg:text-lg"}>
             <div className='h-full flex items-center gap-8 desktop-lg:gap-12'>
                <img 
                  src={data?.offre?.garage?.image_voiture} 
                  alt={data?.offre?.garage?.nom_voiture} 
                  className='h-18  desktop-lg:h-26 flex-shrink-0'
                />
                <div className='flex flex-col  items-start mb-2 desktop-lg:mb-1 flex-1 min-w-0 overflow-hidden'>
                  <p className='text-base desktop:text-lg desktop-lg:text-2xl font-semibold truncate max-w-full'>
                    Offre {data?.offre?.sequence_offre}
                  </p>
                  <div className='flex gap-4 mt-1'>
                    <div className='flex flex-col items-start'>
                      <span className='text-sm desktop:text-sm desktop-lg:text-base  font-medium text-gray-500 leading-none truncate max-w-full'>
                        Demandes
                      </span>
                      <span className='text-sm desktop:text-sm desktop-lg:text-base font-semibold text-gray-700'>
                        {data?.offre?.demandes_offre}
                      </span>
                    </div>
                    <div className='flex flex-col items-start'>
                      <span className='text-sm desktop:text-sm desktop-lg:text-base  font-medium text-gray-500 leading-none truncate max-w-full'>
                        Contrats
                      </span>
                      <span className='text-sm desktop:text-sm desktop-lg:text-base font-semibold text-gray-700'>
                        {data?.offre?.contrats_offre}
                      </span>
                    </div>
                  </div>
                 
                </div>
              </div>
          </KpiCard>
          }
        </div>
      </div>

    </div>
  )
}

export default Dashboard