import { Dialog, DialogTitle, DialogContent,DialogHeader  } from "@/components/ui/dialog";
import {Button} from "@/components/ui/button"
import ReactDOM from "react-dom";
import { ChevronLeft, ChevronRight, Maximize, X } from "lucide-react";
import { Info } from 'lucide-react'
import { useFetchDetailGarage } from '../../../../api/queries/garage/useFetchDetailGarage';
import { Loader2 } from 'lucide-react';
import { VehicleSummaryCard } from "../../garage/ModalViewCar/DetailsTab";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

function ViewGarageModal({open , setOpen , vehicleId }) {
  const {data : vehicleDetails ,isLoading, isError} = useFetchDetailGarage(vehicleId , { enabled: open === true });

  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [expandedImage, setExpandedImage] = useState(null);

  const handleCloseExpanded = () => {
    setExpandedImage(null);
  }

  const photos = {
    0 : { label: 'Vue Avant', url: vehicleDetails?.front_image_garage , subtitle : "Face avant du véhicule" },
    1 : { label: 'Vue Arrière', url: vehicleDetails?.rear_image_garage , subtitle : "Face arrière du véhicule" },
    2 : { label: 'Vue Gauche', url: vehicleDetails?.left_image_garage , subtitle : "Face gauche du véhicule" },
    3 : { label: 'Vue Droite', url: vehicleDetails?.right_image_garage , subtitle : "Face droite du véhicule" },
    4 : { label: 'Vue Intérieure', url: vehicleDetails?.interior_image_garage , subtitle : "Face intérieure du véhicule" },
  }

  const handleGoNext = () => {
    setSelectedPhoto((prev) => (prev + 1) % Object.keys(photos).length);
    setExpandedImage(photos[(selectedPhoto + 1) % Object.keys(photos).length]);
  }

   const handleGoPrev = () => {
    setSelectedPhoto((prev) => (prev - 1 + Object.keys(photos).length) % Object.keys(photos).length);
    setExpandedImage(photos[(selectedPhoto - 1 + Object.keys(photos).length) % Object.keys(photos).length]);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
        
      <DialogContent aria-describedby={undefined} className="flex max-w-[996px] h-[572px] scale-85 desktop:scale-90 desktop-lg:scale-110 flex-col">
        <DialogHeader>
          <DialogTitle   className=" w-full leading-tight"> 
            { vehicleDetails ? `Détails du véhicule - ${vehicleDetails.nom_voiture} ` : "Détails du véhicule" }
          </DialogTitle>
          <Separator />
        </DialogHeader> 
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin " />
          </div>
        ) : isError ||! vehicleDetails ? (
          <div className="flex flex-col gap-3 items-center text-center justify-center  h-full">
            <span className="bg-red-50 p-3 rounded-full"><Info className="text-rod-accent w-7 h-7" /></span>
            <p className="text-rod-accent">Une erreur s'est produite lors du chargement des détails du véhicule.
              <br />
              Veuillez réessayer plus tard.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 h-full overflow-hidden ">
            <div className="flex flex-col gap-4 flex-1">
                

               
                <div className="h-full group relative w-full">
                    <img src={photos[selectedPhoto].url} alt={photos[selectedPhoto].label} className="object-cover w-full max-h-[370px] h-full  rounded-md" />
                     

                   <div onClick={(e) => {e.stopPropagation(); setExpandedImage(photos[selectedPhoto])}} className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 cursor-pointer transition-opacity duration-300" />
                </div>
                
                <div className="grid grid-cols-5 gap-x-2 p-0.5 ">
                    {Object.keys(photos).map((key) => (
                       <img key={key} src={photos[key].url} alt={photos[key].label} className={`object-cover w-full h-full aspect-square rounded-md cursor-pointer ${selectedPhoto === Number(key) ? 'ring-2 ring-rod-primary' : ''}`} onClick={() => setSelectedPhoto(Number(key))} /> 
                    ))}
                </div>
            </div>
            <VehicleSummaryCard vehicleData={vehicleDetails} isForDetails={true} />
          </div>
        )}

        {expandedImage &&
            ReactDOM.createPortal(
            <div
                className="fixed inset-0 z-[100] bg-rod-primary/80 backdrop-blur-xs flex items-center justify-center p-4"
                onClick={handleCloseExpanded}
                style={{ pointerEvents: 'auto' }} // make sure it's clickable
            >

                 <Button variant="outline" size="sm" className="absolute z-50 top-1/2 -translate-y-1/2 right-16 cursor-pointer  transition-opacity duration-300 [&>svg]:!h-8 p-6  [&>svg]:!w-8 backdrop-blur-xs hover:backdrop-blur-md   text-white border-0 hover:bg-transparent hover:text-white bg-transparent" onClick={(e) => {e.stopPropagation(); handleGoNext()}}>
                        <ChevronRight  />
                    </Button>

                    <Button variant="outline" size="sm" className="absolute z-50 top-1/2 -translate-y-1/2 left-16 cursor-pointer  transition-opacity duration-300 [&>svg]:!h-8 p-6  [&>svg]:!w-8 backdrop-blur-xs hover:backdrop-blur-md  text-white border-0 hover:bg-transparent hover:text-white bg-transparent" onClick={(e) => {e.stopPropagation(); handleGoPrev()}}>
                        <ChevronLeft  />
                    </Button>


                {/* Invisible blocker to prevent background interactions */}
                <div className="absolute inset-0 z-0" />

                {/* Content wrapper that stops propagation */}
                <div
                className="relative z-10 max-w-full max-h-full flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
                >
                {/* Close Button */}
                <button
                    onClick={(e) => {
                    e.stopPropagation();
                    handleCloseExpanded();
                    }}
                    className="fixed top-4 right-4 cursor-pointer transition-all duration-300 ease-in-out  flex items-center justify-center"
                >
                    <X className="w-6 h-6 text-gray-300 hover:text-gray-400" />
                </button>

                {/* Image */}
                <img
                    src={expandedImage.url}
                    alt={expandedImage.label}
                    className="max-w-full max-h-[80dvh] object-contain rounded-lg shadow-2xl"
                />

               

                {/* Caption */}
                <div className="mt-6 text-center text-white">
                    <h2 className="text-2xl font-semibold">{expandedImage.label}</h2>
                    <p className="text-lg opacity-80">{expandedImage.subtitle}</p>
                </div>
                </div>
            </div>,
            document.body
    )}
        
      </DialogContent>
    </Dialog>
  )
}

export default ViewGarageModal