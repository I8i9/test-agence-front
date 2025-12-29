import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Badge, BanknoteArrowUp, Bubbles, Calculator, CalendarDays, CalendarDaysIcon, Car, CarFront, CheckCircle2, DollarSign, Eye, GaugeCircle, Globe, HandCoins, Handshake, Headset, Layers3, Loader2, LucideMonitorX, Map, PercentCircle, ReceiptText, ShoppingCart, Tag, Target, TrendingDown, TrendingUp, UserCheck, Users, UserStar, UserX2, X, XCircle, Zap } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '../../../ui/button'
import { useGetSelects } from '../../../../api/queries/performance/report/useGetSelects'
import First from '../../../../assets/icons/1st_place_medal.svg'
import Second from '../../../../assets/icons/2nd_place_medal.svg'
import Third from '../../../../assets/icons/3rd_place_medal.svg'
import { allCosts } from '../../../../utils/costs'
import { CustomTooltip } from '../../../rod/performance/finance/pieCharts/PieChartReusable'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Pie, PieChart } from "recharts"
import { useFetchRapportStats } from '../../../../api/queries/performance/report/useFetchRapportStats'
import { formatDateOnly } from '../../../../utils/datautils'
import { raisonsShow } from '../../../../utils/demandReasons'
import { Jelly } from 'ldrs/react'
import 'ldrs/react/Jelly.css'



const chartConfig = {
  revenu:{
    label: "Revenu",
  },
  "1_3":{
    label: "1–3 jours",
    color: "#a5b4fc",
  },
  "4_7":{
    label: "4–7 jours",
    color: "#818cf8",
  },
  "8_14":{
    label: "8–14 jours",
    color: "#6366f1",
  },
  "15_30":{
    label: "15 jours – 1 mois",
    color: "#4f46e5",
  },
  "30_90":{
    label: "1 mois – 3 mois",
    color: "#4338ca",
  },
  "3_mois":{
    label: "+3 mois",
    color: "#3730a3",
  },
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

const RapportModal = ({open , close , dateRange}) => {
    const [selected , setSelected] = React.useState({type: null , object : null , name: null});

    const hasSelection = selected?.type && selected?.object

    const debut = dateRange?.from ? formatDateOnly(dateRange?.from) : null;
    const fin = dateRange?.to ? formatDateOnly(dateRange?.to) : null;
    
    // Fetch rapport stats when selection is made
    const { data: rapportData, isLoading: rapportLoading, error: rapportError } = useFetchRapportStats({
        type: selected?.type,
        value: selected?.object,
        date_debut: debut,
        date_fin: fin
    });
    
    const chartData = rapportData?.durations.map((item => ({
        ...item,
        fill: chartConfig[item.type]?.color || "#000000",
    }))
    )
        

    const { data, isLoading, error } = useGetSelects({ enabled: open && !hasSelection }); 

    console.log("Selects data in RapportModal", data);

    const GrowthIcon1 = getGrowthIcon(rapportData?.metrics?.operations?.views?.growth);
    const GrowthIcon2 = getGrowthIcon(rapportData?.metrics?.operations?.demandes?.growth);
    const GrowthIcon3 = getGrowthIcon(rapportData?.metrics?.misc?.nbre_fail?.growth);
    const GrowthIcon4 = getGrowthIcon(rapportData?.metrics?.operations?.contracts?.growth);

    const GrowthIcon5 = getGrowthIcon(rapportData?.metrics?.finance?.revenu?.growth);
    const GrowthIcon6 = getGrowthIcon(rapportData?.metrics?.finance?.depenses?.growth);
    const GrowthIcon7 = getGrowthIcon(rapportData?.metrics?.finance?.margeBrute?.growth);
    const GrowthIcon8 = getGrowthIcon(rapportData?.metrics?.finance?.tauxMargeBrute?.growth);


  if (!hasSelection) {
    return ( 
    <Dialog open={open} onOpenChange={close}>
        
      <DialogContent className=' h-[494px] w-[626px] flex flex-col'>
        <DialogHeader className="h-fit">
            <DialogTitle className="w-full leading-tight">
                Rapports de Performance Détaillés</DialogTitle>
            <DialogDescription className="leading-tight text-base -mt-2">
                Sélectionnez une catégorie et un élément pour voir les analyses complètes
            </DialogDescription>

          <Separator />
            
       
        </DialogHeader>
        {
            (isLoading ) ? 
                <div className='flex items-center justify-center h-full w-full'><Loader2 className='animate-spin'/></div>
            : (error ) ? 
                <div className='flex items-center justify-center h-full w-full text-destructive'>Erreur de chargement des rapports.</div>
            : (data?.cars?.length === 0) ?
                <div className='flex flex-col items-center justify-center  h-full w-full text-gray-500'>
                    <div className='bg-rod-foreground p-2 rounded-full mb-2 text-gray-800'><Car className='size-8  '/></div>
                    <span className='text-center text-gray-800 font-medium'>Aucune voiture dans la flotte.</span>
                    <span>Veuillez ajouter des voitures pour générer des rapports.</span>
                </div>
            :
        
        
        <div className='grid grid-cols-2 grid-rows-2 gap-4 mt-1 p-1 '>
                <div className='bg-white p-4 rounded-md group flex flex-col justify-center items-center gap-2 hover:bg-gray-50 hover:border-zinc-300 cursor-pointer border-2 transition-all duration-300  h-[160px]'>
                    <div className='p-2 bg-rod-foreground rounded-md transition-all duration-300 w-fit'>
                        <CarFront className='size-6 ' />
                    </div>
                    <span className='text-sm font-semibold'>Voiture Spécifique</span>

                    <Select
                        key = "car-select"
                        onValueChange={(value) =>
                            setSelected((prev) => ({ ...prev, type: 'car', object: value ,name : data?.cars.find(car => car.id === value)?.nom + " (" + data?.cars.find(car => car.id === value)?.matricule + ")" }))
                        }
                    >
                        <SelectTrigger  className="w-full mt-2 group-hover:flex data-[state=open]:flex hidden transition-all duration-300">
                            <SelectValue placeholder="Sélectionner une voiture" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                data?.cars.map((car) => (
                                    <SelectItem key={car.id} value={car.id}>
                                        {car.nom} {"("}{car.matricule}{")"}
                                    </SelectItem>
                                ))
                            }
                           
                        </SelectContent>
                    </Select>
                </div>

                <div className='bg-white p-4 rounded-md group flex flex-col justify-center items-center gap-2 hover:bg-gray-50 hover:border-zinc-300 cursor-pointer border-2 transition-all duration-300  h-[160px]'>
                    <div className='p-2 bg-rod-foreground rounded-md transition-all duration-300 w-fit'>
                        <Tag className='size-6 ' />
                    </div>
                    <span className='text-sm font-semibold'>Modéle Voiture Spécifique</span>
                    <Select
                        onValueChange={(value) =>
                            setSelected((prev) => ({ ...prev, type: 'model', object: value , name: data?.models.find(m => m.models.some(mod => mod.model === value))?.marque +' '+ data?.models.flatMap(m => m.models).find(mod => mod.model === value)?.model + " (" + data?.models.flatMap(m => m.models).find(mod => mod.model === value)?.nbre + " voitures)" }) )
                        }
                    >
                        <SelectTrigger className="w-full max-h- mt-2 group-hover:flex data-[state=open]:flex hidden transition-all duration-300">
                            <SelectValue placeholder="Sélectionner un modèle" />
                        </SelectTrigger>
                        <SelectContent>
                           {
                                data?.models.map((model) => (
                                    <SelectGroup key={model.marque}>
                                        <SelectLabel>{model.marque}</SelectLabel>
                                        {
                                            model?.models.map((modele) => (
                                                <SelectItem key={modele.model} value={modele.model}>
                                                    {modele.model} - {"("}{modele.nbre} voitures{")"}
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectGroup>
                                ))
                           }
                        </SelectContent>
                    </Select>
                </div>

                <div className='bg-white p-4 rounded-md group flex flex-col justify-center items-center gap-2 hover:bg-gray-50 hover:border-zinc-300 cursor-pointer border-2 transition-all duration-300  h-[160px]'>
                    <div className='p-2 bg-rod-foreground rounded-md transition-all duration-300 w-fit'>
                        <Badge className='size-6 ' />
                    </div>
                    <span className='text-sm font-semibold'>Marque Spécifique</span>
                    <Select
                        onValueChange={(value) =>
                            setSelected((prev) => ({ ...prev, type: 'brand', object: value , name:  data?.brands.find(brand => brand.marque === value)?.marque + " (" + data?.brands.find(brand => brand.marque === value)?.nbre + " voitures)" }) )
                        }
                    >
                        <SelectTrigger className="w-full mt-2 group-hover:flex data-[state=open]:flex hidden transition-all duration-300">
                            <SelectValue placeholder="Sélectionner une marque" />
                        </SelectTrigger>
                        <SelectContent>
                           {
                                data?.brands.map((brand) => (
                                    <SelectItem key={brand.marque} value={brand.marque}>
                                        {brand.marque} - {"("}{brand.nbre} voitures{")"}
                                    </SelectItem>
                                ))
                           }

                        </SelectContent>
                    </Select>
                </div>

                <div className='bg-white p-4 rounded-md group flex flex-col justify-center items-center gap-2 hover:bg-gray-50 hover:border-zinc-300 cursor-pointer border-2 transition-all duration-300  h-[160px]'>
                    <div className='p-2 bg-rod-foreground rounded-md transition-all duration-300 w-fit'>
                        <Car className='size-6 ' />
                    </div>
                    <span className='text-sm font-semibold'>Type De Véhicule</span>
                     <Select
                        onValueChange={(value) =>
                            setSelected((prev) => ({ ...prev, type: 'type', object: value , name: value + " (" + data?.types.find(t => t.type === value)?.nbre + " voitures)" }) )
                        }
                    >
                        <SelectTrigger className="w-full mt-2 group-hover:flex data-[state=open]:flex hidden transition-all duration-300">
                            <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                        <SelectContent>
                           {
                                data?.types.map((type) => (
                                    <SelectItem key={type.type} value={type.type}>
                                        {type.type} - {"("}{type.nbre} voitures{")"}
                                    </SelectItem>
                                ))
                           }

                        </SelectContent>
                    </Select>
                </div>

            </div>
        }
      </DialogContent>
    </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className='flex flex-col w-[850px] overflow-y-auto   h-[600px]'>
        <DialogHeader className="h-fit ">
            <DialogTitle className="w-full leading-tight flex gap-2 items-center">
                <Button size="sm" onClick={()=> setSelected ({type :null , object : null})} variant={"outline"} className='w-fit '> <ArrowLeft className='size-5'/></Button> 
                Rapports de Performance Détaillés</DialogTitle>
            <DialogDescription className="leading-tight text-base -mt-1">
                Analyse détaillée pour {selected.type === 'car' ? 'la voiture' : selected.type === 'model' ? 'le modèle' : selected.type === 'brand' ? 'la marque' : selected.type === 'type' ? 'le type de véhicule' : ''} {selected.name}
            </DialogDescription>

          <Separator />
            
       
        </DialogHeader>
        {
            rapportLoading ?
                <div className='flex items-center justify-center h-full w-full'>
                     {
                    <Jelly
                        size="40"
                        speed="0.9"
                        color="#D90429" 
                    /> 
                    }
                </div>
            : rapportError ?
                <div className='flex items-center justify-center h-full w-full text-destructive'>Erreur de chargement des rapports.</div>
            : 
        
        <div className='w-full h-full '>
            {/* Render detailed report for selected.type and selected.object */}
            <div className='grid gap-4'>
                {/* Metrics content here */}

                <Card className="gap-4">
                    <CardHeader>
                        <CardTitle className="flex gap-3 items-center "> <div className='p-2 bg-rod-foreground rounded-full w-fit '> <ShoppingCart className='size-5' /></div>
                        Metriques Commerciales</CardTitle>
                    </CardHeader>
                    <CardContent className='grid grid-cols-4 gap-12'>
                         <div className={`bg-white h-fit  flex flex-col  rounded-lg  duration-500 `}>
                            <div className="flex items-center justify-between">
                                <h3 className={`font-medium text-gray-800 text-sm`}>Vues</h3>
                                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                                <Eye className='size-4' />
                                </div>
                            </div>
                            <div className='flex-1 flex flex-col min-h-0 font-bold text-xl'>
                                <span>{rapportData?.metrics?.operations?.views?.value ?? "-"} </span>
                                <span className={`text-sm font-normal flex items-center gap-1 ${getGrowthColor(rapportData?.metrics?.operations?.views?.growth)}`}>
                                    {GrowthIcon1 && <GrowthIcon1 className='size-4' />}
                                    {rapportData?.metrics?.operations?.views?.growth !== null && rapportData?.metrics?.operations?.views?.growth !== undefined && rapportData?.metrics?.operations?.views?.growth !== 0 
                                        ? rapportData?.metrics?.operations?.views?.growth + ' %' 
                                        : 'Aucune variation'}
                                </span>
                            </div>
                        </div>

                         <div className={`bg-white h-fit  flex flex-col  rounded-lg  duration-500 `}>
                            <div className="flex items-center justify-between">
                                <h3 className={`font-medium text-gray-800 text-sm`}>Demandes</h3>
                                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                                <Handshake className='size-4' />
                                </div>
                            </div>
                            <div className='flex-1 flex flex-col min-h-0 font-bold text-xl'>
                                <span>{rapportData?.metrics?.operations?.demandes?.value ?? "-"} </span>
                                <span className={`text-sm font-normal flex items-center gap-1 ${getGrowthColor(rapportData?.metrics?.operations?.demandes?.growth)}`}>
                                    {GrowthIcon2 && <GrowthIcon2 className='size-4' />}
                                    {rapportData?.metrics?.operations?.demandes?.growth !== null && rapportData?.metrics?.operations?.demandes?.growth !== undefined && rapportData?.metrics?.operations?.demandes?.growth !== 0 
                                        ? rapportData?.metrics?.operations?.demandes?.growth + ' %' 
                                        : 'Aucune variation'}
                                </span>
                            </div>
                        </div>

                         <div className={`bg-white h-fit  flex flex-col  rounded-lg  duration-500 `}>
                            <div className="flex items-center justify-between">
                                <h3 className={`font-medium text-gray-800 text-sm`}>Échecs</h3>
                                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                                <X className='size-4' />
                                </div>
                            </div>
                            <div className='flex-1 flex flex-col min-h-0 font-bold text-xl'>
                                <span>{
                                    rapportData?.metrics?.misc?.nbre_fail?.value ?? "-"
                                    } </span>
                                <span className={`text-sm font-normal flex items-center gap-1 ${getGrowthColor(rapportData?.metrics?.misc?.nbre_fail?.growth)}`}>
                                    {GrowthIcon3 && <GrowthIcon3 className='size-4' />}
                                    {rapportData?.metrics?.misc?.nbre_fail?.growth !== null && rapportData?.metrics?.misc?.nbre_fail?.growth !== undefined && rapportData?.metrics?.misc?.nbre_fail?.growth !== 0 
                                        ? rapportData?.metrics?.misc?.nbre_fail?.growth + ' %' 
                                        : 'Aucune variation'}
                                </span>
                            </div>
                        </div>

                         <div className={`bg-white h-fit  flex flex-col  rounded-lg  duration-500 `}>
                            <div className="flex items-center justify-between">
                                <h3 className={`font-medium text-gray-800 text-sm`}>Contrats</h3>
                                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                                <ReceiptText className='size-4' />
                                </div>
                            </div>
                            <div className='flex-1 flex flex-col min-h-0 font-bold text-xl'>
                                <span>{
                                    rapportData?.metrics?.operations?.contracts?.value ?? "-"
                                    } </span>
                                <span className={`text-sm font-normal flex items-center gap-1 ${getGrowthColor(rapportData?.metrics?.operations?.contracts?.growth)}`}>
                                    {GrowthIcon4 && <GrowthIcon4 className='size-4' />}
                                    {rapportData?.metrics?.operations?.contracts?.growth !== null && rapportData?.metrics?.operations?.contracts?.growth !== undefined && rapportData?.metrics?.operations?.contracts?.growth !== 0 
                                        ? rapportData?.metrics?.operations?.contracts?.growth + ' %' 
                                        : 'Aucune variation'}
                                </span>
                            </div>
                        </div>

                        

                    </CardContent>
                </Card>
                <Card className="gap-4">
                    <CardHeader>
                        <CardTitle className="flex gap-3 items-center "> <div className='p-2 bg-rod-foreground rounded-full w-fit '> <PercentCircle className='size-5' /></div>
                        Performance</CardTitle>
                    </CardHeader>
                    <CardContent className='grid grid-rows-2 grid-cols-2 gap-y-4 gap-x-12'>
                        {/* Metrics content here */}
                         <div className={`bg-white h-fit  flex flex-col  rounded-lg  duration-500 `}>
                            <div className="flex items-center justify-between">
                                <h3 className={`font-medium text-gray-800 text-sm`}>Taux de conversion</h3>
                                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                                <Target className='size-4' />
                                </div>
                            </div>
                            <div className='flex-1 flex flex-col h-2 gap-1  mt-2 text-lg px-2'>
                                <div className='w-full bg-rod-foreground h-2 rounded-md'>
                                    <div
                                      className='bg-rod-accent h-2 rounded-md'
                                      style={{ width: `${rapportData?.metrics?.operations?.conversion_rate?.value || 0}%` }}
                                    ></div>
                                </div>
                                <span className='font-semibold self-end text-sm'>{rapportData?.metrics?.operations?.conversion_rate?.value || 0}%</span>

                            </div>
                        </div>

                        <div className={`bg-white h-fit  flex flex-col  rounded-lg  duration-500 `}>
                            <div className="flex items-center justify-between">
                                <h3 className={`font-medium text-gray-800 text-sm`}>Taux de Succés</h3>
                                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                                <CheckCircle2 className='size-4' />
                                </div>
                            </div>
                            <div className='flex-1 flex flex-col h-2 gap-1  mt-2 text-lg px-2'>
                                <div className='w-full bg-rod-foreground h-2 rounded-md'>
                                    <div
                                      className='bg-rod-accent h-2 rounded-md'
                                      style={{ width: `${rapportData?.metrics?.operations?.success_rate?.value || 0}%` }}
                                    ></div>
                                </div>
                                <span className='font-semibold self-end text-sm'>{rapportData?.metrics?.operations?.success_rate?.value || 0}%</span>

                            </div>
                        </div>

                        <div className={`bg-white h-fit  flex flex-col  rounded-lg  duration-500 `}>
                            <div className="flex items-center justify-between">
                                <h3 className={`font-medium text-gray-800 text-sm`}>Taux de Occupation</h3>
                                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                                <GaugeCircle className='size-4' />
                                </div>
                            </div>
                            <div className='flex-1 flex flex-col h-2 gap-1  mt-2 text-lg px-2'>
                                <div className='w-full bg-rod-foreground h-2 rounded-md'>
                                    <div
                                      className='bg-rod-accent h-2 rounded-md'
                                      style={{ width: `${rapportData?.metrics?.operations?.occupancy_rate?.value || 0}%` }}
                                    ></div>
                                </div>
                                <span className='font-semibold self-end text-sm'>{rapportData?.metrics?.operations?.occupancy_rate?.value || 0}%</span>

                            </div>
                        </div>

                        <div className={`bg-white h-fit  flex flex-col  rounded-lg  duration-500 `}>
                            <div className="flex items-center justify-between">
                                <h3 className={`font-medium text-gray-800 text-sm`}>Taux d'échec</h3>
                                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                                <XCircle className='size-4' />
                                </div>
                            </div>
                            <div className='flex-1 flex flex-col h-2 gap-1  mt-2 text-lg px-2'>
                                <div className='w-full bg-rod-foreground h-2 rounded-md'>
                                    <div
                                      className='bg-rod-accent h-2 rounded-md'
                                      style={{ width: `${rapportData?.metrics?.misc?.fail_rate?.value || 0}%` }}
                                    ></div>
                                </div>
                                <span className='font-semibold self-end text-sm'>{rapportData?.metrics?.misc?.fail_rate?.value || 0}%</span>

                            </div>
                        </div>
                    </CardContent>
                </Card>

                {
                    !((!rapportData?.refused || rapportData?.refused?.length === 0) && (!rapportData?.canceled || rapportData?.canceled?.length === 0)) ?
                        <div className='grid grid-cols-2  gap-4 '>
                            <Card className="gap-4">
                                <CardHeader>
                                    <CardTitle className="flex gap-3 items-center "> <div className='p-2 bg-rod-foreground rounded-full w-fit '> <LucideMonitorX className='size-5' /></div>
                                    Raison du refus par l'agence</CardTitle>
                                </CardHeader>
                                <CardContent className='overflow-auto mr-1 h-[360px]'>

                                {
                                    (!rapportData?.refused || rapportData?.refused?.length === 0) ? 
                                            <div className='h-full w-full flex flex-col text-gray-800 gap-1 items-center justify-center '>
                                                <span className='text-sm font-medium text-gray-800'>Pas de refus pour cette periode</span>
                                            </div>
                                    :
                                    <div className='grid grid-rows '>
                                        { rapportData?.refused?.map((refu, index) => {
                                                return (
                                                <div key={`${refu.type}-${index}`} className='flex  flex-col mb-4  py-1.5 px-3 border rounded-lg  gap-2 justify-between items-start '>
                                                    <div className='text-base flex justify-between w-full items-center '>
                                                                    
                                                    <span className='w-full max-w-full text-sm text-nowrap flex items-center gap-2 truncate text-rod-primary font-normal '>
                                                
                                                    { refu?.type === "VOITURE_INDISPONIBLE" ? "Surbooking" : raisonsShow[refu.type] || '-'}</span>
                                                    
                                                    <span >
                                                    {index === 0 ? <img src={First} className="w-5 h-5" />
                                                        : index === 1 ?<img src={Second} className="w-5 h-5" /> 
                                                        : index === 2 ? <img src={Third} className="w-5 h-5" /> : "" }
                                                    </span>
                                                    </div>
                                                    <div className='w-full bg-rod-foreground h-2 rounded-md'>
                                                        <div
                                                        className='bg-rose-500 h-2 rounded-md'
                                                        style={{ width: `${refu.percentage}%` }}
                                                        ></div>
                                                        </div>
                                                    <div className='flex justify-between text-gray-800   w-full'>
                                                    <div className='text-sm  font-semibold '>{refu.nbre} </div>
                                                    <div className='text-sm  font-semibold '>{refu.percentage} %</div>
                                        
                                                    </div>
                                                    </div>
                                                )
                                            })}
                                    </div>
                                }

                                    

                                </CardContent>
                            </Card>

                            <Card className="gap-4">
                                <CardHeader>
                                    <CardTitle className="flex gap-3 items-center "> <div className='p-2 bg-rod-foreground rounded-full w-fit '> <UserX2 className='size-5' /></div>
                                    Raison d'annulation par le client</CardTitle>
                                </CardHeader>
                                <CardContent className='overflow-auto mr-1 h-[360px]'>
                                        {
                                            (!rapportData?.canceled || rapportData?.canceled?.length === 0) ? 
                                            <div className='h-full w-full flex flex-col text-gray-800 gap-1 items-center justify-center '>
                                                <span className='text-sm font-medium text-gray-800'>Pas d'annulation pour cette periode</span>
                                            </div>
                                            :
                                            <div className='grid grid-rows '>

                                            { rapportData?.canceled?.map((cancel, index) => {
                                                return (
                                                <div key={`${cancel.type}-${index}`} className='flex  flex-col mb-4  py-1.5 px-3 border rounded-lg  gap-2 justify-between items-start '>
                                                    <div className='text-base flex justify-between w-full items-center '>
                                                                    
                                                    <span className='w-full max-w-full text-sm text-nowrap flex items-center gap-2 truncate text-rod-primary font-normal '>
                                                    {raisonsShow[cancel.type] || '-'}</span>
                                                    
                                                    <span >
                                                    {index === 0 ? <img src={First} className="w-5 h-5" />
                                                        : index === 1 ?<img src={Second} className="w-5 h-5" /> 
                                                        : index === 2 ? <img src={Third} className="w-5 h-5" /> : "" }
                                                    </span>
                                                    </div>
                                                    <div className='w-full bg-rod-foreground h-2 rounded-md'>
                                                        <div
                                                        className='bg-emerald-500 h-2 rounded-md'
                                                        style={{ width: `${cancel.percentage}%` }}
                                                        ></div>
                                                        </div>
                                                    <div className='flex justify-between text-gray-800   w-full'>
                                                    <div className='text-sm  font-semibold '>{cancel.nbre}</div>
                                                    <div className='text-sm  font-semibold '>{cancel.percentage} %</div>
                                        
                                                    </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        }   
                                </CardContent>
                            </Card>
                        </div>
                    :null 
                }   


                
               <Card className="gap-4">
                    <CardHeader>
                        <CardTitle className="flex gap-3 items-center "> <div className='p-2 bg-rod-foreground rounded-full w-fit '> <DollarSign className='size-5' /></div>
                        Metriques Financières</CardTitle>
                    </CardHeader>
                    <CardContent className='grid grid-cols-4 gap-12'>
                        {/* Metrics content here */}
                         <div className={`bg-white h-fit  flex flex-col  rounded-lg  duration-500 `}>
                            <div className="flex items-center justify-between">
                                <h3 className={`font-medium text-gray-800 text-sm`}>Revenu</h3>
                                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                                <BanknoteArrowUp className='size-4' />
                                </div>
                            </div>
                            <div className='flex-1 flex flex-col min-h-0 font-bold text-xl'>
                                <span>{rapportData?.metrics?.finance?.revenu?.value ?? "-"}{rapportData?.metrics?.finance?.revenu?.value != null ? "DT" : ""} </span>
                                <span className={`text-sm font-normal flex items-center gap-1 ${getGrowthColor(rapportData?.metrics?.finance?.revenu?.growth)}`}>
                                    { GrowthIcon5 && <GrowthIcon5 className='size-4' />}
                                    {rapportData?.metrics?.finance?.revenu?.growth !== null && rapportData?.metrics?.finance?.revenu?.growth !== undefined && rapportData?.metrics?.finance?.revenu?.growth !== 0 
                                        ? rapportData?.metrics?.finance?.revenu?.growth + ' %' 
                                        : 'Aucune variation'}
                                </span>
                            </div>
                        </div>

                         <div className={`bg-white h-fit  flex flex-col  rounded-lg  duration-500 `}>
                            <div className="flex items-center justify-between">
                                <h3 className={`font-medium text-gray-800 text-sm`}>Dépenses</h3>
                                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                                <HandCoins className='size-4' />
                                </div>
                            </div>
                            <div className='flex-1 flex flex-col min-h-0 font-bold text-xl'>
                                <span>{rapportData?.metrics?.finance?.depense?.value ?? "-"}{rapportData?.metrics?.finance?.depense?.value != null ? "DT" : ""} </span>
                                <span className={`text-sm font-normal flex items-center gap-1 ${getGrowthColor(rapportData?.metrics?.finance?.depense?.growth)}`}>
                                    { GrowthIcon6 && <GrowthIcon6 className='size-4' />}
                                    {rapportData?.metrics?.finance?.depense?.growth !== null && rapportData?.metrics?.finance?.depense?.growth !== undefined && rapportData?.metrics?.finance?.depense?.growth !== 0 
                                        ? rapportData?.metrics?.finance?.depense?.growth + ' %' 
                                        : 'Aucune variation'}
                                </span>
                            </div>
                        </div>

                         <div className={`bg-white h-fit  flex flex-col  rounded-lg  duration-500 `}>
                            <div className="flex items-center justify-between">
                                <h3 className={`font-medium text-gray-800 text-sm`}>Marge Brut</h3>
                                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                                <Calculator className='size-4' />
                                </div>
                            </div>
                            <div className='flex-1 flex flex-col min-h-0 font-bold text-xl'>
                                <span>{
                                    rapportData?.metrics?.finance?.brut?.value ?? "-"
                                    }{rapportData?.metrics?.finance?.brut?.value != null ? "DT" : ""} </span>
                                <span className={`text-sm font-normal flex items-center gap-1 ${getGrowthColor(rapportData?.metrics?.finance?.brut?.growth)}`}>
                                    { GrowthIcon7 && <GrowthIcon7 className='size-4' />}
                                    {rapportData?.metrics?.finance?.brut?.growth !== null && rapportData?.metrics?.finance?.brut?.growth !== undefined && rapportData?.metrics?.finance?.brut?.growth !== 0 
                                        ? rapportData?.metrics?.finance?.brut?.growth + ' %' 
                                        : 'Aucune variation'}
                                </span>
                            </div>
                        </div>

                         <div className={`bg-white h-fit  flex flex-col  rounded-lg  duration-500 `}>
                            <div className="flex items-center justify-between">
                                <h3 className={`font-medium text-gray-800 text-sm`}>Taux M.B</h3>
                                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                                <PercentCircle className='size-4' />
                                </div>
                            </div>
                            <div className='flex-1 flex flex-col min-h-0 font-bold text-xl'>
                                <span>{
                                    rapportData?.metrics?.finance?.taux_brut?.value ?? "-"
                                    }{rapportData?.metrics?.finance?.taux_brut?.value != null ? "%" : ""} </span>
                                <span className={`text-sm font-normal flex items-center gap-1 ${getGrowthColor(rapportData?.metrics?.finance?.taux_brut?.growth)}`}>
                                    { GrowthIcon8 && <GrowthIcon8 className='size-4' />}
                                    {rapportData?.metrics?.finance?.taux_brut?.growth !== null && rapportData?.metrics?.finance?.taux_brut?.growth !== undefined && rapportData?.metrics?.finance?.taux_brut?.growth !== 0 
                                        ? rapportData?.metrics?.finance?.taux_brut?.growth + ' %' 
                                        : 'Aucune variation'}
                                </span>
                            </div>
                        </div>

                        

                    </CardContent>
                </Card>

                { !((!rapportData?.regions || rapportData?.regions?.length === 0) && (!rapportData?.durations || rapportData?.durations?.length === 0 ) )  ?
                    <div className='grid grid-cols-2  gap-4'>
                        <Card className="gap-4">
                        <CardHeader>
                            <CardTitle className="flex gap-3 items-center "> <div className='p-2 bg-rod-foreground rounded-full w-fit '> <Map className='size-5' /></div>
                            Lieux de location </CardTitle>
                        </CardHeader>
                        <CardContent className='overflow-auto mr-1 h-[360px]'>

                            {
                                (!rapportData?.regions || rapportData?.regions?.length === 0) ?
                                  <div className='h-full w-full flex flex-col text-gray-800 gap-1 items-center justify-center '>
                                        <span className='text-sm font-medium text-gray-800'>Pas d'informations pour cette periode</span>
                                    </div>
                                    :
                                <div className='grid grid-rows '>
                                    {
                                        rapportData?.regions?.map((location, index) => {
                                            return (
                                            <div key={`${location.label}-${index}`} className='flex  flex-col mb-4  py-1.5 px-3 border rounded-lg  gap-2 justify-between items-start '>
                                                <div className='text-base flex justify-between w-full items-center '>
                                                    
                                                    <span className='w-full max-w-full text-sm truncate text-rod-primary font-normal '>{location.label}</span>
                                                    <span >
                                                        {index === 0 ? <img src={First} className="w-5 h-5" />
                                                        : index === 1 ?<img src={Second} className="w-5 h-5" /> 
                                                        : index === 2 ? <img src={Third} className="w-5 h-5" /> : "" }
                                                    </span>
                                                    </div>
                                                <div className='w-full bg-rod-foreground h-2 rounded-md'>
                                                    <div
                                                    className='bg-blue-500 h-2 rounded-md'
                                                    style={{ width: `${location.percentage}%` }}
                                                    ></div>
                                                    </div>
                                                <div className='flex justify-between text-gray-800   w-full'>
                                                <div className='text-sm  font-semibold '>{location.revenu} DT - {location.nbre} contrats</div>
                                                <div className='text-sm  font-semibold '>{location.percentage} %</div>
                                    
                                                </div>
                                                </div>
                                            )
                                        })
                                    }

                                </div>
                            }
                            

                            

                        </CardContent>
                        </Card>

                        <Card className="gap-4">
                            <CardHeader>
                                <CardTitle className="flex gap-3 items-center "> <div className='p-2 bg-rod-foreground rounded-full w-fit '> <CalendarDaysIcon className='size-5' /></div>
                                Durées de location</CardTitle>
                            </CardHeader>
                            <CardContent className='overflow-auto mr-1 h-[360px]'>
                                {
                                (!rapportData?.durations || rapportData?.durations?.length === 0 ) ?
                                  <div className='h-full w-full flex flex-col text-gray-800 gap-1 items-center justify-center '>
                                        <span className='text-sm font-medium text-gray-800'>Pas d'informations pour cette periode</span>
                                    </div>
                                    :
                                
                                    <ChartContainer
                                        config={chartConfig}
                                        className="[&_.recharts-text]:fill-background mx-auto mt-8  aspect-square max-h-[310px] "
                                    >
                                        <PieChart className="*:overflow-visible">
                                        <ChartTooltip
                                            content={<CustomTooltip chartConfig={chartConfig} dataKey={"revenu"} nameKey={"type"} hideLabel />}
                                        />
                                        <Pie  innerRadius={65}
                                            strokeWidth={2} key={"revenue-rapports"} data={chartData} dataKey={"revenu"} 
                                            labelLine={false}
                                            label={({ payload, ...props }) => {
                                                return (
                                                <text
                                                    cx={props.cx}
                                                    cy={props.cy}
                                                    x={props.x}
                                                    y={props.y}
                                                    textAnchor={props.textAnchor}
                                                    fontSize={14}
                                                    offset={4}
                                                    fontWeight={500}
                                                    dominantBaseline={props.dominantBaseline}
                                                    fill="hsla(var(--foreground))"
                                                >
                                                    {payload["revenu"]} DT
                                                </text>
                                                )
                                            }}
                            
                                        >
                                        
                                        </Pie>
                                        <ChartLegend
                                            content={<ChartLegendContent key={"revenue-rapports"} nameKey={"type"} />}
                                            className="-translate-y-2 mt-4 h-[60px] flex-wrap gap-2  *:justify-center"
                                        />
                                        </PieChart>
                                    </ChartContainer>
                                }
                                

                                

                            </CardContent>
                            {
                                !(!rapportData?.durations || rapportData?.durations?.length === 0) ?
                                <CardFooter className="flex  justify-center text-sm font-medium">
                                    Durée moyenne de location :  <span className='font-semibold ml-2'> {" " + rapportData?.metrics?.misc?.avg_duration?.value || 0} jours</span>
                                </CardFooter>
                                : null}
                        </Card>
                    </div>
                    : null
                }

                {
                    !((!rapportData?.clients || (rapportData?.clients["COMPANY"]?.nbre === 0 && rapportData?.clients["INDIVIDUAL"]?.nbre === 0 )) &&  (!rapportData?.expenses || rapportData?.expenses?.length === 0))  ?


                    <div className='grid grid-cols-2  gap-4'>

                        <Card className="gap-4">
                            <CardHeader>
                                <CardTitle className="flex gap-3 items-center "> <div className='p-2 bg-rod-foreground rounded-full w-fit '> <Users className='size-5' /></div>
                                Répartition des types de clients</CardTitle>
                            </CardHeader>
                            <CardContent className='overflow-auto mr-1 h-[360px]'>
                                {

                                    (!rapportData?.clients || (rapportData?.clients["COMPANY"]?.nbre === 0 && rapportData?.clients["INDIVIDUAL"]?.nbre === 0 )) ?
                                    <div className='h-full w-full flex flex-col text-gray-800 gap-1 items-center justify-center '>
                                            <span className='text-sm font-medium text-gray-800'>Pas d'informations pour cette periode</span>
                                        </div>
                                        :
                                        <ChartContainer
                                        config={
                                                {
                                                    revenu:{
                                                        label: "Revenu",
                                                    },
                                                    "INDIVIDUAL":{
                                                        label: "Particulier",
                                                        color: "#fbbf24",
                                                        },
                                                    "COMPANY":{
                                                        label: "Entreprise",
                                                        color: "#f59e0b",
                                                        },
                                                }
                                        }
                                        className="[&_.recharts-text]:fill-background mx-auto  mt-8 aspect-square max-h-[280px] "
                                    >
                                        <PieChart className="*:overflow-visible">
                                        <ChartTooltip
                                            content={<ChartTooltipContent  nameKey={"type"} suffix="DT" hideLabel />}
                                        />
                                        <Pie  innerRadius={80}
                                            strokeWidth={2} key={"revenue-rapports"} data={[
                                                {
                                                    type: "INDIVIDUAL",
                                                    revenu: rapportData?.clients["INDIVIDUAL"]?.revenu || 0,
                                                    fill: "#fbbf24",
                                                },
                                                {
                                                    type: "COMPANY",
                                                    revenu: rapportData?.clients["COMPANY"]?.revenu || 0,
                                                    fill: "#f59e0b",
                                                },
                                            ]} dataKey={"revenu"} 
                                            labelLine={false}
                                            label={({ payload, ...props }) => {
                                                return (
                                                <text
                                                    cx={props.cx}
                                                    cy={props.cy}
                                                    x={props.x}
                                                    y={props.y }
                                                    textAnchor={props.textAnchor}
                                                    fontSize={14}
                                                    offset={4}
                                                    fontWeight={500}
                                                    dominantBaseline={props.dominantBaseline}
                                                    fill="hsla(var(--foreground))"
                                                >
                                                    {payload["revenu"] ? payload["revenu"] + "DT" : ""}
                                                </text>
                                                )
                                            }}
                            
                                        >
                                        
                                        </Pie>
                                        
                                        </PieChart>
                                        </ChartContainer>
                                }
                                

                                

                            </CardContent>
                            {
                                !(!rapportData?.clients || (rapportData?.clients["COMPANY"]?.nbre === 0 && rapportData?.clients["INDIVIDUAL"]?.nbre === 0 )) ?
                                    <CardFooter className="flex  justify-center text-sm font-medium">
                                        <span className='font-semibold mr-1 flex items-center gap-1.5'><div className='bg-amber-400 mb-0.5 size-3 rounded-xs'></div> {" " + rapportData?.clients["INDIVIDUAL"]?.nbre || 0}</span>Particuliers <span className='ml-2'>-</span> <span className='font-semibold ml-2 mr-1 flex items-center gap-1.5'><div className='bg-amber-500 mb-0.5 size-3 rounded-xs'></div> {" " + rapportData?.clients["COMPANY"]?.nbre || 0}</span>Entreprises
                                    </CardFooter>
                                : null
                            }
                        
                        </Card>


                        <Card className="gap-4">
                            <CardHeader>
                                <CardTitle className="flex gap-3 items-center "> <div className='p-2 bg-rod-foreground rounded-full w-fit '> <HandCoins className='size-5' /></div>
                                Dépenses les plus importantes</CardTitle>
                            </CardHeader>
                            <CardContent className='overflow-auto mr-1 h-[360px]'>

                                {
                                    (!rapportData?.expenses || rapportData?.expenses?.length === 0) ?
                                        <div className='h-full w-full flex flex-col text-gray-800 gap-1 items-center justify-center '>
                                                <span className='text-sm font-medium text-gray-800'>Pas d'informations pour cette periode</span>
                                        </div> 
                                    :
                                        <div className='grid grid-rows '>
                                            {
                                                rapportData?.expenses?.map((expense, index) => {
                                                    const cost = allCosts.find((cost) => cost.value === expense.key);
                                                    const IconComp = cost ? cost.icon : null;
                                                    return (
                                                    <div key={`${expense.label}-${index}`} className='flex  flex-col mb-4  py-1.5 px-3 border rounded-lg  gap-2 justify-between items-start '>
                                                        <div className='text-base flex justify-between w-full items-center '>
                                                                        
                                                        <span className='w-full max-w-full text-sm text-nowrap flex items-center gap-2 truncate text-rod-primary font-normal '>
                                                        {
                                                        IconComp && <IconComp className='size-4 shrink-0 text-muted-foreground' />
                                                        }
                                                        {cost?.label || '-'}</span>
                                                        
                                                        <span >
                                                        {index === 0 ? <img src={First} className="w-5 h-5" />
                                                            : index === 1 ?<img src={Second} className="w-5 h-5" /> 
                                                            : index === 2 ? <img src={Third} className="w-5 h-5" /> : "" }
                                                        </span>
                                                        </div>
                                                        <div className='w-full bg-rod-foreground h-2 rounded-md'>
                                                            <div
                                                            className='bg-orange-500 h-2 rounded-md'
                                                            style={{ width: `${expense.percentage}%` }}
                                                            ></div>
                                                            </div>
                                                        <div className='flex justify-between text-gray-800   w-full'>
                                                        <div className='text-sm  font-semibold '>{expense.depense} DT - {expense.nbre} Occurences</div>
                                                        <div className='text-sm  font-semibold '>{expense.percentage} %</div>
                                            
                                                        </div>
                                                        </div>
                                                    )
                                                })
                                            }

                                        </div>
                                }
                                

                                

                            </CardContent>
                        </Card>
                    </div>
                    : null
                }
                
                <Card className="gap-4 mb-8">
                    <CardHeader>
                        <CardTitle className="flex gap-3 items-center "> <div className='p-2 bg-rod-foreground rounded-full w-fit '> <UserStar className='size-5' /></div>
                        <div><span className='font-bold'>{rapportData?.ratings?.overall || 0}/5</span> d’après <span className='font-bold'>{rapportData?.ratings?.ratings || 0}</span> retours clients</div></CardTitle>
                    </CardHeader>
                    <CardContent className='grid grid-cols-4 gap-8'>
                        {/* Metrics content here */}
                         <div className={`bg-white h-fit  flex flex-col  rounded-lg  duration-500 `}>
                            <div className="flex items-center justify-between">
                                <h3 className={`font-medium text-gray-800 text-sm`}>Acceuil & Service</h3>
                                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                                <Headset className='size-4' />
                                </div>
                            </div>
                            <div className='flex-1 flex flex-col min-h-0 font-bold text-xl'>
                                <span>{rapportData?.ratings?.service || 0}/5 </span><span className='text-sm font-normal text-gray-500'> - % </span>
                            </div>
                        </div>

                         <div className={`bg-white h-fit  flex flex-col  rounded-lg  duration-500 `}>
                            <div className="flex items-center justify-between">
                                <h3 className={`font-medium text-gray-800 text-sm`}>Propreté de flotte</h3>
                                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                                <Bubbles className='size-4' />
                                </div>
                            </div>
                            <div className='flex-1 flex flex-col min-h-0 font-bold text-xl'>
                                <span>{rapportData?.ratings?.proprete || 0}/5 </span>

                            <span className='text-sm font-normal text-gray-500'> - % </span>
                            </div>
                        </div>

                         <div className={`bg-white h-fit  flex flex-col  rounded-lg  duration-500 `}>
                            <div className="flex items-center justify-between">
                                <h3 className={`font-medium text-gray-800 text-sm`}>Transparence </h3>
                                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                                <Layers3 className='size-4' />
                                </div>
                            </div>
                            <div className='flex-1 flex flex-col min-h-0 font-bold text-xl'>
                                <span>{
                                    rapportData?.ratings?.transparence || 0
                                    }/5 </span>

                            <span className='text-sm font-normal text-gray-500'> - % </span>
                            </div>
                        </div>

                         <div className={`bg-white h-fit  flex flex-col  rounded-lg  duration-500 `}>
                            <div className="flex items-center justify-between">
                                <h3 className={`font-medium text-gray-800 text-sm`}>Rapidité de Service</h3>
                                <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
                                <Zap className='size-4' />
                                </div>
                            </div>
                            <div className='flex-1 flex flex-col min-h-0 font-bold text-xl'>
                                <span>{
                                    rapportData?.ratings?.reactivite || 0
                                    }/5 </span>

                            <span className='text-sm font-normal text-gray-500'> - % </span>
                            </div>
                        </div>

                        

                    </CardContent>
                </Card>


            </div>
            
        </div>
    }
        
      </DialogContent>
    </Dialog>
  )
}

export default RapportModal