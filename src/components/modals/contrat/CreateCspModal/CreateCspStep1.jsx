import React, { useEffect , useState  } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Gauge, Settings, Car, SearchX, ChevronRight, Loader2, Calendar, MapPin, CalendarCog } from "lucide-react"
import ToolTipCustom from "../../../customUi/tooltip";
import { carColors } from "../../../../utils/colors";
import { finishEffects } from "../../../../utils/colors";
import { useFetchGarageOffreDispo } from '../../../../api/queries/contrat/useFetchOffreDispoGarageDispo';
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '../../../customUi/animatedCheckbox';
import ViewGarageModal from './ViewGarageModal';
import ViewOffreModal from './ViewOffreModal';
import { formatDateTime } from '../../../../utils/datautils';

import { Jelly } from 'ldrs/react'
import 'ldrs/react/Jelly.css'

const CreateCspStep1 = ({ fetchedOnce , prev , load ,setLoading , setContratSpData, ContratSpData, next }) => {
  

  const {data  , isFetching  } = useFetchGarageOffreDispo({lieu_retour: ContratSpData.lieu_retour , 
    lieu_depart: ContratSpData.lieu_depart ,
     date_debut: formatDateTime(ContratSpData.date_debut) ,
      date_fin: formatDateTime(ContratSpData.date_fin)});

  const [selected , setSelected] = useState(ContratSpData.selected_offre || null);

  const [openCar , setOpenCar] = useState({open: false , vehicleId : null});

  const [openOffre , setOpenOffre] = useState({open: false , offre : null});

   const [filterState, setFilterState] = useState({
    brand: 'all',
    model: 'all',
    avecPromo: false,
    priceRange: [0, 0], // min-max
    avecChauffeur: false,
  });

  // do animation for the first time loading only 
  useEffect(() => {
    if (isFetching && !fetchedOnce.current) {
      setLoading(true);
    }
    else if (!isFetching && !fetchedOnce.current) {
      fetchedOnce.current = true;
      setLoading(false);
    }

    },[isFetching  , fetchedOnce]);

  const handleNext = () => {
    setContratSpData({...ContratSpData , selected_offre: selected});
    next();
  };


const [brands, setBrands] = useState([]);
const [uniqueModels, setUniqueModels] = useState([]);
const [priceRange, setPriceRange] = useState({min: 0, max: 0});

// whenever `data` changes
useEffect(() => {
  if (!data || data.length === 0) return;

  // Total prices
  const totalPrices = data
    .map(item => item.prix_total_voiture)
    .filter(p => typeof p === 'number' && !isNaN(p));

  const minTotal = Math.min(...totalPrices);
  const maxTotal = Math.max(...totalPrices);

  setPriceRange({min: minTotal, max: maxTotal});
  // Always reset price range when data changes
  setFilterState(prev => ({
    ...prev,
    priceRange: [minTotal, maxTotal],
  }));

  // Unique brands
  const brandList = [...new Set(data.map(item => item.garage.brand_voiture))].sort();
  setBrands(brandList);

}, [data]);

// Update models whenever brand filter changes
useEffect(() => {
  if (!data || data.length === 0) return;

  const allModels = data.map(item => ({
    brand: item.garage.brand_voiture,
    model: item.garage.model_voiture,
  }));

  const filteredModels = filterState.brand !== 'all'
    ? allModels.filter(m => m.brand === filterState.brand)
    : allModels;

  const modelsUnique = [...new Set(filteredModels.map(m => m.model))].sort();
  setUniqueModels(modelsUnique);
}, [data, filterState.brand]);

// Handle brand change and reset model
const handleBrandChange = (brand) => {
  setFilterState(prev => ({...prev, brand, model: 'all'}));
};

// Filter the data based on all filter criteria
const filteredData = data ? data.filter(vehicle => {
  // Brand filter
  const matchesBrand = filterState.brand === 'all' || vehicle.garage.brand_voiture === filterState.brand;
  
  // Model filter
  const matchesModel = filterState.model === 'all' || vehicle.garage.model_voiture === filterState.model;
  
  // Promo filter
  const matchesPromo = !filterState.avecPromo || (vehicle.discount && vehicle.discount > 0);
  
  // Price range filter
  const matchesPrice = vehicle.prix_total_voiture >= filterState.priceRange[0] && 
    vehicle.prix_total_voiture <= filterState.priceRange[1];
  
  // Chauffeur filter
  const matchesChauffeur = !filterState.avecChauffeur || vehicle.avec_chauffeur === true;
  
  return matchesBrand && matchesModel && matchesPromo && matchesPrice && matchesChauffeur;
}) : [];




  if (load && fetchedOnce.current === false) {
    return (
       <div  className='w-full  h-full flex-1 flex flex-col  justify-center items-center'>
        
        <div className=' font-semibold text-center'>Nous cherchons les meilleurs  véhicules pour vous…</div>
        <span  className='mt-2' >

            {
              <Jelly
                size="40"
                speed="0.9"
                color="#D90429" 
              /> 
            }
          </span>

      </div>
    );
  }

  return (
    <div className='w-full h-full flex flex-col gap-4'>
      {/* Header */}

      {
        !isFetching && data?.length > 0 &&
        <div className='flex gap-4 justify-between p-0.5 w-full items-center'>
          <Select
            onValueChange={handleBrandChange}
            value={filterState.brand}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder="Marque" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Toutes les marques</SelectItem>
              {brands.map(brand => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => setFilterState({...filterState , model: value})}
            value={filterState.model}
            disabled={!filterState.brand || filterState.brand === 'all'}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder="Modèle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tous les modèles</SelectItem>
              {uniqueModels.map(model => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {
            priceRange.max > priceRange.min &&
          <div className='space-y-2 w-[1000px] mx-2'>
            <Label>
                  Range: {filterState.priceRange[0]} DT - {filterState.priceRange[1]} DT
                </Label>
                <Slider
                  value={filterState.priceRange}
                  onValueChange={setValue => setFilterState({...filterState , priceRange: setValue})}
                  max={priceRange.max}
                  min={priceRange.min}
                  step={10}
                  className="w-full"
                />
          </div>
          } 

          <div className='flex items-center gap-2 whitespace-nowrap'>
            <Checkbox id="avecPromo"
              className="cursor-pointer"
              checked={filterState.avecPromo}
              onCheckedChange={(checked) => setFilterState({...filterState , avecPromo: checked})}
            />
            <Label htmlFor="avecPromo" className="cursor-pointer text-nowrap">
              Avec Promo
            </Label>
          </div>

          <div className='flex items-center gap-2'>
            <Checkbox id="avecChauffeur"
              className="cursor-pointer"
              checked={filterState.avecChauffeur}
              onCheckedChange={(checked) => setFilterState({...filterState , avecChauffeur: checked})}
            />
            <Label htmlFor="avecChauffeur" className="cursor-pointer text-nowrap">
              Avec Chauffeur
            </Label>
            
          </div>
          
        

        </div>
      }

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
        {isFetching ? 
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
          : !isFetching && data?.length===0 ?
          <div className='flex h-full flex-col justify-center items-center gap-1'>
            <span className='p-2 bg-rod-foreground rounded-full' >
              <SearchX className='w-6 h-6 text-rod-primary' />
            </span>
            <span className='text-gray-600 text-base'>Aucun véhicule trouvé</span>
          </div>
          : !isFetching && filteredData.length === 0 ?
          <div className='flex h-full flex-col justify-center items-center gap-1'>
            <span className='p-2 bg-rod-foreground rounded-full' >
              <SearchX className='w-6 h-6 text-rod-primary' />
            </span>
            <span className='text-gray-600 text-base'>Aucun véhicule trouvé avec ces filtres</span>
          </div>
          : !isFetching && filteredData.length > 0 && (
            <div className="grid grid-cols-3 gap-4 p-0.5">
              {filteredData.map(vehicle => (
                <VehicleCard key={vehicle.id_offre} vehicle={vehicle} selected={selected} setSelected={setSelected} setOpenCar={setOpenCar} setOpenOffre={setOpenOffre} />
              ))}
            </div>
          )}
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-4 border-t">
        <Button 
          variant="outline" 
          onClick={prev}
        >
          <ChevronRight className='h-4 w-4 rotate-180' />
          Retour
        </Button>


        <Button 
          onClick={handleNext}
          disabled={!selected}
        >
          Suivant
          <ChevronRight className="h-4 w-4  " />
        </Button>
      </div>
      {
        openCar.open &&
        <ViewGarageModal open={openCar.open} setOpen={() => setOpenCar({open : false , vehicleId: null})} vehicleId={openCar.vehicleId} />
      }

      {
        openOffre.open &&
        <ViewOffreModal open={openOffre.open} setOpen={() => setOpenOffre({open : false , offreId: null})} data={openOffre.offre} />
      }
    </div>
    
  )
}

export default CreateCspStep1 

const VehicleCard = ({ vehicle, selected, setSelected , setOpenCar , setOpenOffre }) => {
  const handleCardClick = () => {
    // Use offer ID for offers, garage ID for garages
    setSelected(selected?.id_offre === vehicle.id_offre ? null : vehicle);
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`relative overflow-hidden group w-full h-full max-h-[192px] gap-3 grid grid-rows-[1fr_1fr] p-4 bg-white rounded-lg border transition-all cursor-pointer ${
        selected?.id_offre === vehicle.id_offre ? 'ring-2 ring-rod-primary' : 'hover:border-gray-300'
      }`}
    >
      {/* matricule */}
      <div className="absolute top-2 left-2 bg-rod-foreground text-xs rounded-sm font-semibold px-1.5 py-1 leading-none ">
        {vehicle.garage.matricule_garage}
      </div>

        <div className="absolute top-2 right-2 bg-rod-primary text-white text-xs rounded-sm font-semibold px-1.5 py-1 flex items-center gap-1 leading-none">
           {vehicle.prix_total_voiture} DT
        </div>

        { vehicle.discount &&
        <div className='absolute top-8 right-2 bg-destructive text-white text-xs rounded-sm font-semibold px-1.5 py-1 flex items-center gap-1 leading-none'>
          -{vehicle.discount}%
        </div>
        }

      { /* slide in buttons */}
      <div onClick={(e) => e.stopPropagation()} className="absolute left-0 top-9  transform -translate-x-full  group-hover:-translate-x-0 transition-transform duration-300 bg-white  rounded-r-lg py-1 px-2 flex flex-col gap-2">
        <Button  onClick={() => setOpenOffre({open: true , offre : vehicle})} size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
          <Settings className="h-4 w-4" />
        </Button>
        <Button onClick={() => setOpenCar({open: true , vehicleId : vehicle.garage.id_garage})} size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
          <Car className="h-4 w-4" />
        </Button>
      </div>

      
      
      {/* car image */}
      <div className="w-full h-21  flex items-center justify-center">
        <img src={vehicle.garage.image_voiture} loading='eager' alt={vehicle.garage.nom_voiture} className="w-auto h-full object-cover" />
      </div>

      <div className="w-full flex flex-col space-y-3 items-center h-fit">
        {/* car details */}
        <div className="flex flex-col gap-1 items-center">
          <h3 className="text-base font-medium text-rod-primary leading-none truncate">{vehicle.garage.nom_voiture}</h3>
          <ToolTipCustom 
            trigger={
              <p className="text-sm text-gray-500 leading-none truncate">
                {vehicle.garage.version_voiture}
              </p>
            }
            message={vehicle.garage.version_voiture}
          />
        </div>

        {/* car kilometrage & color */}
        <div className="flex gap-4 items-center">
          <ToolTipCustom 
            trigger={
              <span className="text-sm flex gap-1 items-center">
                <Gauge className="h-4 w-4 mb-0.5" />
                <span className="leading-none max-w-[144px] truncate">{vehicle.garage.kilometrage_garage} km</span>
              </span>
            }
            message={vehicle.garage.kilometrage_garage + " km"}
          />

          <ToolTipCustom 
            trigger={
              <span className="text-sm flex gap-1.5 items-center">
                <span 
                  className={`h-4 w-4 rounded-xs ${
                    (vehicle.garage.couleur_garage === "Blanc" || 
                     vehicle.garage.couleur_garage === "Crème" || 
                     vehicle.garage.couleur_garage === "Beige") && "border-gray-300 border"
                  }`} 
                  style={{ 
                    backgroundColor: carColors[vehicle.garage.couleur_garage], 
                    ...finishEffects[vehicle.garage.couleur_finition_garage]
                  }} 
                />
                <span className="leading-none max-w-[144px] truncate">
                  {vehicle.garage.couleur_garage} {vehicle.garage.couleur_finition_garage}
                </span>
              </span>
            }
            message={`${vehicle.garage.couleur_garage} ${vehicle.garage.couleur_finition_garage}`}
          />
        </div>
      </div>
    </div>
  );
};