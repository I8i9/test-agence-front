import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Gauge, Check, SearchX , Search, ChevronRight, Car , Loader2 } from "lucide-react"
import ToolTipCustom from "../../../customUi/tooltip";
import { carColors } from "../../../../utils/colors";
import { finishEffects } from "../../../../utils/colors";
import { useState, useEffect } from "react";
import { useFetchGarageDispo } from "../../../../api/queries/garage/useFetchGarageDispo";
import { toast } from "sonner";


const CreateStep1 = ({ setData, data, next ,mode = null, useMutation = useFetchGarageDispo }) => {
  const [selectedCarId, setSelectedCarId] = useState("");
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedModel, setSelectedModel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: garageData, error , isFetching  } = useMutation();

  useEffect(() => {
    if (selectedCarId && selectedCarId !== data.id_garage) {
      setData(prev => ({ ...prev, id_garage: selectedCarId }));
    }
  }, [selectedCarId, setData, data.id_garage]); 

  if (error) {
    toast.error("Une erreur est survenue. Veuillez réessayer.");
  }

  const cars = garageData || [];

  // Extract unique brands from cars data with proper capitalization
  const brands = [...new Set(cars.map(car => car.brand_voiture))].sort();

  // Get models for selected brand with proper capitalization
  const modelsForSelectedBrand = selectedBrand && selectedBrand !== 'all'
    ? [...new Set(cars
        .filter(car =>car.brand_voiture === selectedBrand)
        .map(car => car.model_voiture)
      )].sort()
    : [];

  const allModels = [...new Set(cars.map(car => car.model_voiture))].sort();

  // Filter cars based on selected filters and search term
  const filteredCars = cars.filter(car => {
    const matchesBrand = selectedBrand === 'all' || !selectedBrand || car.brand_voiture === selectedBrand;
    const matchesModel = selectedModel === 'all' || !selectedModel || car.model_voiture === selectedModel;
    const matchesSearch = !searchTerm || 
      car.nom_voiture.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.brand_voiture.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model_voiture.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.version_voiture.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.matricule_garage.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesBrand && matchesModel && matchesSearch;
  });

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
    setSelectedModel('all'); // Reset model when brand changes
  };

  const handleModelChange = (model) => {
    setSelectedModel(model);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleNext = () => {
    if (!selectedCarId) {
      toast.error("Veuillez sélectionner un véhicule avant de continuer.");
      return;
    }
    next();
  };
  const handleNextNull = () => {
    setData(prev => ({ ...prev, id_garage: null }));
    next();
  };

  return (
    <div className='w-full h-full flex flex-col gap-4'>
      {/* Header */}
      <div className='w-full flex gap-2 p-1'>
          <Select value={selectedBrand} onValueChange={handleBrandChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Choisir une marque" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
                <SelectItem value="all">Toutes les marques</SelectItem>
                {brands.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
            </SelectContent>
          </Select>
      
          <Select 
            value={selectedModel} 
            onValueChange={handleModelChange}
            disabled={!selectedBrand}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Choisir un modèle" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
                <SelectItem value="all">Tous les modèles</SelectItem>
                { selectedBrand === 'all' ? (
                  allModels.map(model => (
                    <SelectItem key={model} value={model}>{model}</SelectItem>
                  ))
                )
                :
                (
                modelsForSelectedBrand.map(model => (
                  <SelectItem key={model} value={model}>{model}</SelectItem>
                ))
                )
              }
            </SelectContent>
          </Select>

        <div className="w-[320px] ml-auto relative flex items-center  ">
          <span className="absolute left-2 text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <Input 
            placeholder="Rechercher..." 
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-8"
          /> 
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
        {isFetching &&  
              <div className='self-center place-self-center flex flex-col items-center justify-center h-full'>
                <Loader2 className="animate-spin" />
              </div>
        }
        {filteredCars.length === 0 && !isFetching ? (
          <div className="flex-1 w-full flex flex-col items-center justify-center gap-2">
            
            {(selectedBrand === 'all' && searchTerm === '') ? (
              <div className='flex flex-col items-center gap-1'>
                 <span className='p-2 bg-rod-foreground rounded-full' >
                  <Car className='w-8 h-8 ' />
                </span>
                <span className='text-gray-600 text-lg'>Aucune véhicule est disponible</span>
              </div>
            ) : (
              <div className='flex flex-col items-center gap-1'>
                <span className='p-2 bg-rod-foreground rounded-full' >
                  <SearchX className='w-8 h-8 text-rod-primary' />
                </span>
                <span className='text-gray-600 text-lg'>Aucun véhicule trouvé</span>
              </div>
            )}
        </div>
        ) : (
          <div className="w-full flex-1 overflow-y-auto  ">
            <div className="grid grid-cols-3 gap-4 p-1">
              {filteredCars.map(car => (
                <div key={car.id_garage}>
                  <VehicleCard 
                    car={car} 
                    isSelected={selectedCarId === car.id_garage}
                    onSelect={setSelectedCarId}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-end gap-4">
        {mode && (
          <Button variant="ghost" onClick={handleNextNull}>
            Dépense liée à l’agence 

          </Button>
        )}
        <Button 
          onClick={handleNext}
          disabled={!selectedCarId || isFetching}
        >
          Suivant
          <ChevronRight className="h-4 w-4  " />
        </Button>
      </div>
    </div>
  )
}

export default CreateStep1 

const VehicleCard = ({ car, isSelected, onSelect }) => {
    const handleCardClick = () => {
        onSelect(isSelected ? null : car.id_garage);
    };

    return(
        <div 
            onClick={handleCardClick}
            className={`relative w-full h-[192px] gap-3  grid grid-rows-[1fr_1fr] p-4 bg-white rounded-lg border  transition-all cursor-pointer ${
                isSelected ? 'ring-2 ring-rod-primary' : 'hover:border-gray-300'
            }`}
        >
            {/* matricule */}
            <div className="absolute top-2 left-2 bg-rod-primary text-white text-xs rounded-sm font-medium px-1.5 py-0.5">
                {car.matricule_garage}
            </div>

            {/* selection indicator */}
            {isSelected && (
                <div className='absolute top-2 right-2 bg-rod-primary text-white rounded-full p-1'>
                  <Check className='w-4 h-4' />
                </div>
            )}
            
            {/* car image */}
            <div className="w-full max-h-21  h-full flex items-center justify-center">
                <img src={car.image_voiture} loading='eager' alt={car.nom_voiture} className="w-auto h-full object-cover" />
            </div>

            <div className="w-full flex flex-col space-y-3 items-center h-fit">
                {/* car details */}
                <div className="flex flex-col gap-1 items-center">
                    <h3 className="text-base font-medium text-rod-primary leading-none truncate">{car.nom_voiture}</h3>
                    <ToolTipCustom 
                        trigger={
                            <p className="text-sm text-gray-500 leading-none truncate">
                                {car.version_voiture}
                            </p>
                        }
                        message={car.version_voiture}
                    />
                </div>

                {/* car kilometrage & color */}
                <div className="flex gap-4 items-center">
                    <ToolTipCustom 
                        trigger={
                            <span className="text-sm flex gap-1 items-center">
                                <Gauge className="h-4 w-4 mb-0.5" />
                                <span className="leading-none max-w-[144px] truncate">{car.kilometrage_garage} km</span>
                            </span>
                        }
                        message={car.kilometrage_garage + " km"}
                    />

                    <ToolTipCustom 
                        trigger={
                            <span className="text-sm flex gap-1.5 items-center">
                                <span className={`h-4 w-4 rounded-xs ${(car.couleur_garage === "Blanc" || car.couleur_garage === "Crème" || car.couleur_garage === "Beige") && "border-gray-300 border"}`} style={{ backgroundColor: carColors[car.couleur_garage], ...finishEffects[car.couleur_finition_garage]}} >
                                </span>

                                <span className="leading-none max-w-[144px] truncate">
                                    {car.couleur_garage} {car.couleur_finition_garage}
                                </span>
                            </span>
                        }
                        message={`${car.couleur_garage} ${car.couleur_finition_garage}`}
                    />
                </div>
            </div>
        </div>
    );
};

