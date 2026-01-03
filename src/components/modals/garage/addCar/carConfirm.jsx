import { ArrowDown, BadgeDollarSign, Banknote, Calculator, CalendarCheck, Camera, Check, ChevronLeft, ChevronRight, Info, Tag } from "lucide-react";
import { formatDateDDMMYYYYJS } from "../../../../utils/dateConverterJS";
import { finishEffects , carColors } from "../../../../utils/colors";
import { Button } from "../../../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../../ui/card";
import  ToolTipCustom  from "../../../customUi/tooltip";
import { VehicleSummaryCard } from "../ModalViewCar/DetailsTab";
import { Alert, AlertTitle, AlertDescription } from "../../../ui/alert";
import { CalendarDaysIcon, CarFront, Gauge, Palette, Calendar1 } from "lucide-react";
import { useState } from "react";


const CarConfirm = ({ Car , next , prev , isPending}) => {

  return (
    <div className="h-full flex flex-col ">
      {/* Main Content - Scrollable */}
      <div className="flex-1 ">
        <div className="grid grid-cols-2 gap-6 ">
          <div className="flex flex-col justify-between space-y-4 h-full">
            <InformationCard vehicleData={Car} />

          <Alert className="border-blue-200 h-full py-6  bg-blue-50 text-blue-600">
                <Info className="w-5 h-5 mt-0.5 shrink-0" /> 
                <AlertTitle className="font-medium text-base text-blue-700">Vérification requise</AlertTitle>
                <AlertDescription className="text-blue-700 text-sm">
                   Avant de Confirmer veuillez vérifier que toutes les informations sont correctes.
                </AlertDescription> 
            </Alert>
           
            
          </div>

           {/* Right Column - Vehicle Summary Card */} 
          <VehicleSummaryCard vehicleData={Car} />
         
        </div>
      </div>

      {/* Action Buttons - Sticky at bottom */}
      <div className="flex-shrink-0 bg-white mt-6">
        <div className="flex justify-between gap-4">
          <Button onClick={prev} variant="outline">
            <ChevronLeft />
            Précedent
          </Button>
          <Button disabled={isPending} onClick={next} >
            <Check />
            Confirmer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CarConfirm ;


const InformationCard = ({ vehicleData }) => {
    const [pass, setPass] = useState(false);


    const imagesLabels = [{
        field : "front" , label : "Avant",
    },
    {
        field : "rear" , label : "Arrière",
    },
    {
        field : "left" , label : "Gauche",
    },
    {
        field : "right" , label : "Droit",
    },
    {
        field : "interior" , label : "Intérieur"
    }]

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-medium text-lg">
          <Info className="w-5 h-5" />
          Informations du véhicule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative -mt-2 pb-4 min-h-[222px]">
        <Button onClick={() => setPass(!pass)} variant="outline" size="sm" className="absolute -top-13 right-4">
          <ChevronRight className="w-4 h-4 " />
        </Button>
        {/* Vehicle Details Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">

        {
            !pass ?
            <>
              {/* Matricule */}
          <div >
            <div className="flex items-start gap-1.5">
              <CarFront className="w-4 h-4 text-gray-500" />
              <div className="flex flex-col items-start gap-1.5">
                <span className=" text-gray-500 leading-none">Matricule</span> 
                <p className="font-medium leading-none">{vehicleData.matricule_garage}</p>
              </div>
            </div>
          </div>

          {/* Date d'achat véhicule */}
          <div >
            <div className="flex items-start gap-1.5">
              <CalendarDaysIcon className="w-4 h-4 text-gray-500" />
              <div className="flex flex-col items-start gap-1.5">
                <span className=" text-gray-500 leading-none">Date d'achat</span> 
                <p className="font-medium leading-none">{formatDateDDMMYYYYJS(vehicleData.date_achat_garage)}</p>
              </div>
            </div>
          </div>

          {/* Kilométrage */}
          <div >
            <div className="flex items-start gap-1.5">
              <Gauge className="w-4 h-4 text-gray-500" />
              <div className="flex flex-col items-start gap-1.5">
                <span className=" text-gray-500 leading-none">Kilométrage</span> 
                <p className="font-medium leading-none">{vehicleData.kilometrage_garage} Km</p>
              </div>
            </div>
          </div>

          

          {/* Couleur */}
          <div >
            <div className="flex items-start gap-1.5">
              <Palette className="w-4 h-4 text-gray-500" />
              <div className="flex flex-col items-start gap-1.5">
                <span className=" text-gray-500 leading-none">Couleur</span> 
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-xs ${(vehicleData.couleur_garage==="Blanc" || vehicleData.couleur_garage==="Crème" || vehicleData.couleur_garage==="Beige" ) && "border-gray-300 border"}`} style={{ backgroundColor: carColors[vehicleData.couleur_garage] , ...finishEffects[vehicleData.couleur_finition_garage]}} ></div>
                  <ToolTipCustom
                    trigger={
                      <p className="font-medium leading-none truncate max-w-[144px] ">{vehicleData.couleur_garage} {vehicleData.couleur_finition_garage}</p>
                    }
                    message={`${vehicleData.couleur_garage} ${vehicleData.couleur_finition_garage}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Visite Technique */}
          <div >
            <div className="flex items-start gap-1.5">
              <Calendar1 className="w-4 h-4 text-gray-500" />
              <div className="flex flex-col items-start gap-1.5">
                <span className=" text-gray-500 leading-none">Visite Technique</span> 
                <p className="font-medium leading-none">{formatDateDDMMYYYYJS(vehicleData.date_visite_garage)}</p>
              </div>
            </div>
          </div>

          {/* Assurance */}
          <div >
            <div className="flex items-start gap-1.5">
              <Calendar1 className="w-4 h-4 text-gray-500" />
              <div className="flex flex-col items-start gap-1.5">
                <span className=" text-gray-500 leading-none">Assurance</span> 
                <p className="font-medium leading-none">{formatDateDDMMYYYYJS(vehicleData.date_assurance_garage)}</p>
              </div>
            </div>
          </div>

          {/* Photos Section */}
            <div >
            <div className="flex items-start gap-1.5">
                <Camera className="w-4 h-4 text-gray-500" />
                <div className="flex flex-col items-start gap-1.5">
                    <span className=" text-gray-500 leading-none">Photos Fournies</span> 
                    <span className="flex gap-2 items-center">
                    {imagesLabels.map((image, index) => (
                        vehicleData.images[image.field] ? (
                            <span key={index} className="font-medium px-3 py-1 text-sm rounded-lg bg-rod-primary text-white leading-none">
                                {image.label}
                            </span>
                        ): (
                            <span key={index} className="font-medium px-3 py-1 text-sm rounded-lg bg-rod-foreground leading-none">
                                {image.label}
                            </span>
                        )
                    ))}
                    </span>
                </div>
                </div>
            </div>
            </>

            :

            <>
            <div >
            <div className="flex items-start gap-1.5">
              <CalendarCheck className="w-4 h-4 text-gray-500" />
              <div className="flex flex-col items-start gap-1.5">
                <span className=" text-gray-500 leading-none">Durée D'usage</span> 
                <p className="font-medium leading-none">{vehicleData.annees_ammortissement} an{vehicleData.annees_ammortissement > 1 ? "s" : ""}</p>
              </div>
            </div>
          </div>

          {/* Date d'achat véhicule */}
          <div >
            <div className="flex items-start gap-1.5">
              <ArrowDown className="w-4 h-4 text-gray-500" />
              <div className="flex flex-col items-start gap-1.5">
                <span className=" text-gray-500 leading-none text-nowrap ">Ammortissement/an</span> 
                <p className="font-medium leading-none">{(vehicleData.valeur_amortissement)} DT</p>
              </div>
            </div>
          </div>

          {/* Kilométrage */}
          <div >
            <div className="flex items-start gap-1.5">
              <Calculator className="w-4 h-4 text-gray-500" />
              <div className="flex flex-col items-start gap-1.5">
                <span className=" text-gray-500 leading-none">Valeur Comptable</span> 
                <p className="font-medium leading-none">{vehicleData.valeur_achat} DT</p>
              </div>
            </div>
          </div>

          

          {/* Couleur */}
          <div >
            <div className="flex items-start gap-1.5">
              <Tag className="w-4 h-4 text-gray-500" />
              <div className="flex flex-col items-start gap-1.5">
                <span className=" text-gray-500 leading-none">Prix D'achat</span> 
                <p className="font-medium leading-none">{vehicleData.prix_achat} DT</p>
              </div>
            </div>
          </div>

          <div className="col-span-full">
            <div className="flex items-start gap-1.5">
              <Banknote className="w-4 h-4 text-gray-500" />
              <div className="flex flex-col items-start gap-1.5">
                <span className=" text-gray-500 leading-none">Paiement</span> 
                <p className="font-medium leading-none">{vehicleData.type_achat === "COMPTANT"
                  ? "Payé en comptant"
                  : vehicleData.type_achat === "LEASING"
                  ? "Payé / En cours en leasing"
                  : vehicleData.type_achat === "CREDIT_BANCAIRE"
                  ? "Crédit Payé par crédit bancaire"
                  : "Inconnu"
                  }</p>
              </div>
            </div>
          </div>
            </>

          }
        
        </div>

        
      </CardContent>
    </Card>
  );
};