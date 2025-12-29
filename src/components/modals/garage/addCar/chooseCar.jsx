import { useEffect, useState } from 'react'
import { Joystick, Fuel, Gauge, Users, Luggage, Search, Check, ChevronRight, SearchX, CarFront, CarIcon, Image } from 'lucide-react';
import ToolTipCustom from '../../../customUi/tooltip.jsx';
import {VehicleSummaryCard} from '../ModalViewCar/DetailsTab.jsx';
import { Button } from '@/components/ui/button';
import {  Loader2 } from 'lucide-react';
import { useFetchBrands , useFetchModels, useFetchVersions } from '../../../../api/queries/car/carsFetch.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ChooseCar = ({setCar , Car , next}) => {

    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');


    const { data : brands , isLoading : isBrandsLoading , isError : isBrandsError ,} = useFetchBrands();
    const {data : models , isLoading : isModelsLoading , isError : isModelsError,  } = useFetchModels(brand , {enabled: brand !== '' });
    const { data : carsData , isLoading : isCarsLoading , isError : isCarsError } = useFetchVersions  (brand , model, {enabled: model !== '' && brand !== '' });

    useEffect(() => {
        if (brand) {
            setModel(''); // Reset model when brand changes
        }
    }, [brand]);

    const handleSetCar = (carItem) => {
      console.log('carItem', carItem);
        if(Car.id_voiture !== carItem.id_voiture) {
          setCar({
            ...carItem
          });
        }
    }

  return (
     <div className="h-full flex flex-col justify-between ">
      {/* Main Content - Scrollable */}
      <div className="flex-1 ">
        <div className="grid grid-cols-2 gap-6 h-full ">

            {/* Choose Vehicule */}
          <div className="flex flex-col gap-6  ">
            {/* Select fields and search button*/}
            <div className='flex items-center gap-4 pl-0.5 pt-0.5'>
                <Select value={brand} onValueChange={setBrand}>
                    <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue placeholder="Choisir une marque" />
                    </SelectTrigger>
                    <SelectContent className='max-h-72 overflow-y-auto'>
                        
                        { isBrandsLoading ? (
                            <SelectItem disabled className="w-full">
                              <Loader2 className="animate-spin" />
                              Chargement...
                            </SelectItem>
                        ) : isBrandsError ? (
                            <SelectItem disabled className="w-full ">
                              Erreur de chargement
                            </SelectItem>
                        ) :
                        brands?.map((brand) => (
                            <SelectItem key={`brands-${brand}`} value={brand}>
                                {brand}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={model} onValueChange={setModel}>
                    <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue placeholder="Choisir un modèle" />
                    </SelectTrigger>
                    <SelectContent className='max-h-72 overflow-y-auto'>
                        {
                          !models && brand === '' && !isModelsLoading ? (
                            <SelectItem disabled className="w-full">
                              Veuillez sélectionner une marque
                            </SelectItem>
                        ) : isModelsLoading ? (
                            <SelectItem disabled className="w-full">
                              <Loader2 className="animate-spin" />
                              Chargement...
                            </SelectItem>
                        ) : isModelsError ? (
                            <SelectItem disabled className="w-full ">
                              Erreur de chargement
                            </SelectItem>
                        ) :
                          models?.length === 0 ? (
                            <SelectItem disabled className="w-full">
                              Aucun modèle trouvé pour cette marque
                            </SelectItem>
                          ) :
                        models?.map((model) => (
                            <SelectItem key={`models-${model}`} value={model}>
                                {model}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

            </div>

             <div className='flex flex-col gap-3 h-full'>
                  <div className='flex justify-between items-center '>
                    <span className='text-sm font-medium '>
                      {!model ? 'Sélectionnez une marque et un modèle' : 'Resultat du recherche'}
                    </span>
                    <span className='text-sm  font-medium'>  { carsData && `(${carsData?.length || 0})`}</span>
                  </div>

                  {
                    // Display loading when fetching cars
                    isCarsLoading ? (
                    <div className='flex items-center justify-center h-full'>
                      <Loader2 className="animate-spin " />
                    </div> ) 
                    // Display error message if there is an error
                    : isCarsError ? (
                    <div className='flex items-center justify-center h-full'>
                      <span className='text-red-500'>Erreur lors du chargement des véhicules</span>
                    </div> )
                    :
                    // Display cars data if available
                    (carsData && !isCarsLoading) ?  (
                      <div className='grid grid-cols-2 gap-3 no-scrollbar h-[368px] p-0.5  overflow-scroll '>

                        {carsData.map((car) => (
                          <div onClick={() => handleSetCar(car)} className= {`flex flex-col relative gap-4  items-center border max-h-[178px] rounded-md p-4  cursor-pointer ${Car.id_voiture === car.id_voiture ? 'ring-2 ring-rod-primary' : 'hover:border-gray-300'} `} key={car.id_voiture}>
                            {/* check if chosen*/}
                            {
                              Car.id_voiture === car.id_voiture && (
                                <div className='absolute top-2 right-2 bg-rod-primary text-white rounded-full p-1'>
                                  <Check className='w-4 h-4' />
                                </div>
                              )
                            }
                            <div className='flex items-center justify-between max-h-22 '>
                                <img  loading="eager" src={car.image_voiture} alt={car.nom_voiture} className='object-cover  h-full w-auto' />
                            </div>
                            <div className='flex flex-col items-center gap-1 w-full'>
                              <ToolTipCustom
                                trigger={
                                  <span className='text-base text-center w-full font-medium leading-none truncate '>{car.version_voiture}</span>
                                }
                                message={car.version_voiture}
                              />
                              <p className='text-gray-500 text-sm leading-none text-center'> Géneration {car.generation_voiture}</p>
                            </div>  
                          </div>
                        ))}

                      </div>)
                    : (
                      // If no cars data, show a message
                    <div className='flex flex-col items-center justify-center h-full'>
                      <span className='p-2 bg-rod-foreground rounded-full' >
                        <SearchX className='w-6 h-6 text-rod-primary' />
                      </span>
                      <span className='text-gray-500 text-sm mt-2'>Aucun véhicule trouvé</span>
                    </div>)
                  }
            </div>
          </div>

           { /* If a car is selected, show its details */}
            { Car.id_voiture ? (
                <VehicleSummaryCard vehicleData={Car} />
            )
             :(
               <div className="flex flex-col border relative rounded-md px-4 py-6 max-h-[459px] overflow-y-auto no-scrollbar" >
                {/* Vehicle Image and Basic Info */} 
                <div className="text-center"> 
                  <div className="w-full h-24 overflow-hidden flex items-center justify-center gap-6">

                    <div  className="size-20 text-4xl text-gray-500 flex items-center justify-center font-medium rounded-full bg-rod-foreground " >
                      <Image className="w-8 h-8 text-gray-300" />
                    </div>
                  </div>
                  <div className="mt-2 flex flex-col items-center">
                    <h2 className="text-lg desktop-lg:text-xl font-semibold">Aucun véhicule sélectionné</h2>
                    <p className="text-gray-500 text-base ">Sélectionnez un véhicule pour voir ses détails</p>
                  </div>
                </div>

                {/* Vehicle Specs */}
                <div className="grid grid-cols-3 self-center gap-y-3 gap-x-6 px-12 w-fit my-4">
                  <div className="flex items-center   w-fit gap-3">
                    <Joystick className="w-5 h-5 shrink-0" />
                    <span className='truncate leading-none mt-0.5'>_</span>

                  </div>
                  <div className="flex items-center   w-fit gap-3">
                    <Fuel className="w-5 h-5 shrink-0" />
                    <span className='truncate leading-none mt-0.5'>_</span>
                  </div>
                  <div className="flex items-center  w-fit gap-3">
                    <Gauge className="w-5 h-5 shrink-0 " />
                    <span className='truncate leading-none mt-0.5'>_</span>

                  </div>
                  <div className="flex items-center w-fit gap-3">
                    <Users className="w-5 h-5 " />
                    <span className='leading-none mt-0.5'>_</span>
                  </div>
                  <div className="flex items-center  w-fit gap-3">
                    <Luggage className="w-5 h-5 " />
                    <span className='leading-none mt-0.5'>_</span>
                  </div>
                  <div className="flex items-center  w-fit gap-3">
                      <div className={`size-5 shrink-0 rounded bg-rod-foreground text-rod-primary text-center`}> ? </div>
                      <span className=' leading-none mt-0.5'>_</span>
                  </div>
                </div>

                <div className='flex-shrink-0'>
                      <Accordion type="multiple" className="px-2">

                          <AccordionItem key={"caracteristiques"} >
                            <AccordionTrigger className="font-semibold text-base py-3 cursor-pointer">
                              Caracteristiques
                            </AccordionTrigger>
                          </AccordionItem>
                          <AccordionItem key={"motorisation"} >
                            <AccordionTrigger className="font-semibold text-base py-3 cursor-pointer">
                              Motorisation
                            </AccordionTrigger>
                          </AccordionItem>
                          <AccordionItem key={"transmission"} >
                            <AccordionTrigger className="font-semibold text-base py-3 cursor-pointer">
                              Transmission
                            </AccordionTrigger>
                          </AccordionItem>
                          <AccordionItem key={"dimensions"} >
                            <AccordionTrigger className="font-semibold text-base py-3 cursor-pointer">
                              Dimensions
                            </AccordionTrigger>
                          </AccordionItem>
                          <AccordionItem key={"performances"} >
                            <AccordionTrigger className="font-semibold text-base py-3 cursor-pointer">
                              Performances
                            </AccordionTrigger>
                          </AccordionItem>
                          <AccordionItem key={"consommation"} >
                            <AccordionTrigger className="font-semibold text-base py-3 cursor-pointer">
                              Consomation
                            </AccordionTrigger>
                          </AccordionItem>
                          <AccordionItem key={"audio_et_communication"} >
                            <AccordionTrigger className="font-semibold text-base py-3 cursor-pointer">
                              Audio et communication
                            </AccordionTrigger>
                          </AccordionItem>

                      </Accordion>
                </div>
              </div>
            )  
            }
        </div>
      </div>

      {/* Action Buttons - Sticky at bottom */}
      <div className="flex-shrink-0 bg-white mt-6">
        <div className="flex justify-end gap-4">
          <Button variant="default" disabled={!Car.id_voiture} onClick={next}>
            Suivant
            <ChevronRight/>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ChooseCar

