import {Car,CarFront, Info, Gauge, Palette, CircleCheck, Calendar1, Luggage, Users, Fuel, Settings, Trash2, Edit, Joystick, CalendarDaysIcon, TriangleAlert, CheckCheck } from 'lucide-react'; 
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import UpdateTab from './UpdateTab'
import ToolTipCustom from '../../../customUi/tooltip';
import { formatDateDDMMYYYY, FormatDateEEEEddMMyyyy, formatDiffreneceInYYYYMMM } from '../../../../utils/dateConverter';
import { carColors, finishEffects } from '../../../../utils/colors';
import { capitalizeWords } from '../../../../utils/textConverter';
import { DeleteCar } from './deleteCar';
import { isSameDay } from 'date-fns';
import { ConfirmVignette } from '../carProblems/confirmVignette';
import { ConfirmAssurance } from '../carProblems/confirmAssurance';
import { ConfirmControle } from '../carProblems/confirmControle';
import { formatDiffreneceInYYYYMMMJS } from '../../../../utils/dateConverterJS';
import { AssignCost } from '../carProblems/cost';

// Vehicle Information Card Component
const VehicleInformationCard = ({ vehicleData }) => {
  console.log("vehicleData in DetailsTab:", vehicleData); 

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-medium text-lg">
          <Info className="w-5 h-5" />
          Informations du véhicule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 -mt-2 ">
        {/* Vehicle Details Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
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
                <span className=" text-gray-500 leading-none">Mise en Circulation</span> 
                <ToolTipCustom
                  trigger={<p className="font-medium leading-none">{formatDateDDMMYYYY(vehicleData.date_achat_garage)}</p>}
                  message={FormatDateEEEEddMMyyyy(vehicleData.date_achat_garage)}
                />  
              </div>
            </div>
          </div>

          {/* Kilométrage */}
          <div >
            <div className="flex items-start gap-1.5">
              <Gauge className="w-4 h-4 text-gray-500" />
              <div className="flex flex-col items-start gap-1.5">
                <span className=" text-gray-500 leading-none">Kilométrage</span> 
                <ToolTipCustom
                  trigger={<p className="font-medium leading-none">{vehicleData.kilometrage_garage} Km</p>}
                  message={`${vehicleData.kilometrage_garage} Km`}
                />
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
                <ToolTipCustom
                  trigger={<p className="font-medium leading-none"> { isSameDay(vehicleData.date_visite_garage,vehicleData.date_achat_garage)? "_" : formatDateDDMMYYYY(vehicleData.date_visite_garage)}</p>}
                  message={isSameDay(vehicleData.date_visite_garage,vehicleData.date_achat_garage)? <div className='text-center'>La Voiture est neuve donc la visite technique <br />  n'est pas encore effectuée.</div> : FormatDateEEEEddMMyyyy(vehicleData.date_visite_garage)}
                />
              </div>
            </div>
          </div>

          {/* Assurance */}
          <div >
            <div className="flex items-start gap-1.5">
              <Calendar1 className="w-4 h-4 text-gray-500" />
              <div className="flex flex-col items-start gap-1.5">
                <span className=" text-gray-500 leading-none">Assurance</span> 
                <ToolTipCustom
                  trigger={<p className="font-medium leading-none">{formatDateDDMMYYYY(vehicleData.date_assurance_garage)}</p>}
                  message={FormatDateEEEEddMMyyyy(vehicleData.date_assurance_garage)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Vignette Section */}
       
      </CardContent>
    </Card>
  );
};

// Status Alert Component
const StatusAlert = ({vehicleData}) => {

    const [openCost, setOpenCost] = useState({open : false , id : null , type : "" , title : ""});

    // Build a list of problems
    const  styleVignette = vehicleData.probleme_vignette !== false ? vehicleData.probleme_vignette < 0 ? "bg-destructive/10 text-destructive border-1 border-red-200 relative  p-4 justify-start" : "bg-amber-600/10 text-amber-600 border-1 border-amber-200 relative  p-4  justify-start" : "border-green-200 relative  p-4 bg-green-600/10 text-green-600 justify-start";
    const  styleAssurance = vehicleData.probleme_assurance !== false ? vehicleData.probleme_assurance < 0 ? "bg-destructive/10 text-destructive border-1 border-red-200 relative  p-4 justify-start" : "bg-amber-600/10 text-amber-600 border-1 border-amber-200 relative  p-4  justify-start" : "border-green-200 relative p-4 bg-green-600/10 text-green-600 justify-start";
    const  styleControle = vehicleData.probleme_controle !== false ? vehicleData.probleme_controle < 0 ? "bg-destructive/10 text-destructive border-1 border-red-200 relative  p-4 justify-start" : "bg-amber-600/10 text-amber-600 border-1 border-amber-200 relative  p-4  justify-start" : "border-green-200 relative  p-4 bg-green-600/10 text-green-600 justify-start";

    return (
      <div className='space-y-3'>
      <Alert className={styleControle}>
        {
          vehicleData.probleme_controle !== false ? vehicleData.probleme_controle < 0 ? <TriangleAlert className="w-5 h-5 mt-0.75 shrink-0 text-red-700" /> : <TriangleAlert className="w-5 h-5 mt-0.75 shrink-0 text-amber-700" /> : <CircleCheck className="w-5 h-5 mt-0.75 shrink-0 text-green-700" />
        }
      <AlertTitle className={` min-h-7 max-h-7 flex justify-between items-center text-base ${vehicleData.probleme_controle !== false ? vehicleData.probleme_controle <= 0 ? "text-red-700" : "text-amber-700" : "text-green-700"}`}>
        <>{
                  vehicleData.probleme_controle !== false ?
                  vehicleData.probleme_controle < 0 ?
                  "La visite technique a expiré depuis "+Math.abs(vehicleData.probleme_controle)+" jour"+(Math.abs(vehicleData.probleme_controle)>1?"s":"")+"."  :
                  "La visite technique expire "+(vehicleData.probleme_controle === 0 ? "aujourd'hui." : "dans "+vehicleData.probleme_controle+" jour"+(vehicleData.probleme_controle>1?"s":"")+"." )
                  :
                  "Visite technique à jour, prochaine le "+formatDateDDMMYYYY(vehicleData.nextControleDate)+"."
        
        }</>
        {
                vehicleData.probleme_controle !== false &&
                  <ConfirmControle setCost={setOpenCost} id={vehicleData.id_garage} next={vehicleData.nextControleDate}/>
              }
        </AlertTitle>
      </Alert>
      <Alert className={styleAssurance}>
        {
          vehicleData.probleme_assurance!== false ? vehicleData.probleme_assurance < 0 ? <TriangleAlert className="w-5 h-5 mt-0.75 shrink-0 text-red-700" /> : <TriangleAlert className="w-5 h-5 mt-0.75 shrink-0 text-amber-700" /> : <CircleCheck className="w-5 h-5 mt-0.75 shrink-0 text-green-700" />
        }
      <AlertTitle className={` min-h-7 max-h-7 flex justify-between items-center text-base ${vehicleData.probleme_assurance !== false ? vehicleData.probleme_assurance <= 0 ? "text-red-700" : "text-amber-700" : "text-green-700"}`}>
        <>{
                  vehicleData.probleme_assurance !== false ?
                  vehicleData.probleme_assurance         < 0 ?
                  "L'assurance a expiré depuis "+Math.abs(vehicleData.probleme_assurance)+" jour"+(Math.abs(vehicleData.probleme_assurance)>1?"s":"")+"."  :
                  "L'assurance expire " + (vehicleData.probleme_assurance === 0 ? "aujourd'hui." : "dans " + vehicleData.probleme_assurance + " jour" + (vehicleData.probleme_assurance > 1 ? "s" : "") + ".")
                  :
                  <>Assurance à jour, échéance prévue le {' '}
                  {formatDateDDMMYYYY(vehicleData.nextAssuranceDate)}.</>
        
        }</>
        {
                vehicleData.probleme_assurance !== false &&
                 <ConfirmAssurance setCost={setOpenCost} id={vehicleData.id_garage} next={vehicleData.nextAssuranceDate}/>
              }
        </AlertTitle>
      </Alert>
      <Alert className={styleVignette}>
        {
          vehicleData.probleme_vignette !== false ? vehicleData.probleme_vignette < 0 ? <TriangleAlert className="w-5 h-5 mt-0.75 shrink-0 text-red-700" /> : <TriangleAlert className="w-5 h-5 mt-0.75 shrink-0 text-amber-700" /> : <CircleCheck className="w-5 h-5 mt-0.75 shrink-0 text-green-700" />
        }
      <AlertTitle className={`  min-h-7 max-h-7 flex justify-between items-center text-base ${vehicleData.probleme_vignette !== false ? vehicleData.probleme_vignette <= 0 ? "text-red-700" : "text-amber-700" : "text-green-700"}`}>
        <>{
                  vehicleData.probleme_vignette !== false ?
                  vehicleData.probleme_vignette < 0 ?
                  "La vignette est expirée pour cette année." :
                  "La vignette expire " + (vehicleData.probleme_vignette === 0 ? "aujourd'hui." : "dans " + vehicleData.probleme_vignette + " jour" + (vehicleData.probleme_vignette > 1 ? "s" : "") + ".")
                  :
                  <>Vignette payée, paiement prévu le {' '}
                  {formatDateDDMMYYYY(vehicleData.nextVignetteDate)}.</>
        
        }</>
        {
                vehicleData.probleme_vignette !== false &&
                  <ConfirmVignette setCost={setOpenCost} id={vehicleData.id_garage} date={formatDateDDMMYYYY(vehicleData.nextVignetteDate)}/>
              }
        </AlertTitle>
      </Alert>

      {
        openCost.open &&
        <AssignCost open={openCost.open} setOpen={() => setOpenCost({ open: false, id: null, type: "" , title : "" })} id={openCost.id} type={openCost.type} title={openCost.title} />
      }

      </div>
    );
};

// Equipment Accordion Component
 const EquipmentAccordion = ({ details }) => {
  return (
    <div className='flex-shrink-0'>
      <Accordion type="multiple" className="px-2">
        {Object.entries(details).map(([key, value]) => {
          if (value) {
            return (
          <AccordionItem key={key} value={key}>
            <AccordionTrigger className="font-semibold text-base py-3 cursor-pointer">
              {key}
            </AccordionTrigger>
            <AccordionContent>
              {
              Object.entries(value).map(([subKey, subValue], idx, arr) => (
                <div
                  key={subKey}
                  className={`flex justify-between gap-4 items-start text-wrap mb-2 ${idx === arr.length - 1 ? '' : 'border-b pb-2'}`}
                >
                  <span className="max-w-[60%] text-base text-left text-wrap">{capitalizeWords(subKey)}</span>
                  <span className="font-medium text-base flex-grow text-right">{capitalizeWords(subValue) === "" ? "Oui" : capitalizeWords(subValue)}</span>
                </div>
              ))
              }
            </AccordionContent>
          </AccordionItem>
        )}})}
      </Accordion>
    </div>
  );
};

// Vehicle Summary Card Component
export const VehicleSummaryCard = ({vehicleData , isForDetails = false}) => {
  return (
    <div className={`flex flex-col border relative rounded-md px-4 py-6 ${isForDetails ? 'max-h-[474.4px]' : 'max-h-[459px]'} overflow-y-auto no-scrollbar`} >
      {/* Vehicle Image and Basic Info */} 
      <div className="text-center"> 
        <div className="w-full h-24 overflow-hidden flex items-center justify-center gap-6">
          { vehicleData?.matricule_garage &&
          <div className='bg-rod-foreground rounded-sm  px-1.5 py-0.5 flex items-center text-sm absolute top-4 left-4  font-semibold  justify-center '>
            {vehicleData.matricule_garage}
          </div>
          }

          { vehicleData?.date_achat_garage &&
          <div className='bg-rod-foreground rounded-sm  px-1.5 py-0.5 flex items-center text-sm absolute top-4 right-4  font-semibold  justify-center '>
            {isForDetails ? formatDiffreneceInYYYYMMM(vehicleData.date_achat_garage) : formatDiffreneceInYYYYMMMJS(vehicleData.date_achat_garage) }
          </div>
          }

          <img 
            src={vehicleData.image_voiture} 
            loading='eager'
            alt={vehicleData.nom_voiture}
            className="w-auto max-h-32 h-full object-cover rounded-lg"
          />
        </div>
        <div className="mt-2 flex flex-col items-center">
          <h2 className="text-lg desktop-lg:text-xl font-semibold">{vehicleData.nom_voiture}</h2>
          <p className="text-gray-500 text-base ">{vehicleData.version_voiture}</p>
        </div>
      </div>

      {/* Vehicle Specs */}
      <div className="grid grid-cols-3 self-center gap-y-3 gap-x-6 px-6 my-4">
        <div className="flex items-center gap-3">
          <Joystick className="w-5 h-5 shrink-0" />
          <ToolTipCustom
            trigger={
          <span className='truncate leading-none mt-0.5'>{vehicleData.transmission_voiture === "Automatique" ? "Auto"  : vehicleData.transmission_voiture}</span>
            }
            message={vehicleData.transmission_voiture}
          />
        </div>
        <div className="flex items-center gap-3">
          <Fuel className="w-5 h-5 shrink-0" />
          <ToolTipCustom
            trigger={
          <span className='truncate leading-none mt-0.5'>{vehicleData.energie_voiture}</span>
            }
            message={vehicleData.energie_voiture}
          />
        </div>
        <div className="flex items-center gap-3">
          <Gauge className="w-5 h-5 shrink-0 " />
          <ToolTipCustom
            trigger={
              <span className='truncate leading-none mt-0.5'>{vehicleData.kilometrage_garage || 0 } Km </span>
            }
            message={vehicleData.kilometrage_garage + " Km"}
          />
        </div>
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 " />
          <ToolTipCustom
            trigger={
              <span className='leading-none mt-0.5'>{vehicleData.nombre_places_voiture + " places"}</span>
            }
            message={vehicleData.nombre_places_voiture + " places"}
          />
        </div>
        <div className="flex items-center gap-3">
          <Luggage className="w-5 h-5 " />
          <ToolTipCustom
            trigger={
              <span className='leading-none mt-0.5'>{vehicleData.coffre_voiture}</span>
            }
            message={vehicleData.coffre_voiture}
          />
          
        </div>
        <div className="flex items-center gap-3">
          {(!vehicleData?.couleur_garage && !vehicleData?.couleur_finition_garage) ? (
            <>
            <div className={`size-5 shrink-0 rounded bg-rod-foreground text-rod-primary text-center`}> ? </div>
            <span className=' leading-none mt-0.5'>Aucune</span>
            </>
          ) : (
          <>
          <div className={`size-5 shrink-0 rounded ${(vehicleData.couleur_garage==="Blanc" || vehicleData.couleur_garage==="Crème" || vehicleData.couleur_garage==="Beige" ) && "border-gray-300 border"}`} style={{ backgroundColor: carColors[vehicleData.couleur_garage] , ...finishEffects[vehicleData.couleur_finition_garage]}}></div>
          <ToolTipCustom
            trigger={
              <span className="truncate mt-0.5 ">
                <span>{vehicleData.couleur_garage + " " + vehicleData.couleur_finition_garage}</span>
              </span>
            }
            message={vehicleData.couleur_garage + " " + vehicleData.couleur_finition_garage}
          />
          </> 
          )}
        </div>
      </div>

      <EquipmentAccordion  details={vehicleData.details} />
    </div>
  );
};

// Main DetailsTab Component
const DetailsTab = ({setOpen, vehicleData }) => {
  const [isEditMode, setIsEditMode] = useState(false); 


  if (isEditMode) {
    return (
      <UpdateTab
        onClose={() => setIsEditMode(false)}
        vehicleData={vehicleData} 
      />
    );
  }

  return (
    <div className="h-full flex flex-col ">
      {/* Main Content - Scrollable */}
      <div className="flex-1 ">
        <div className="grid grid-cols-2 gap-6 ">
          <div className="flex flex-col gap-4">
            <VehicleInformationCard 
              vehicleData={vehicleData}
            />
            <StatusAlert vehicleData={vehicleData} />
          </div>

          {/* Right Column - Vehicle Summary Card */} 
          <VehicleSummaryCard isForDetails={true} vehicleData={vehicleData} />
        </div>
      </div>

      {/* Action Buttons - Sticky at bottom */}
      <div className="flex-shrink-0 bg-white mt-6">
        <div className="flex justify-end gap-4">
          {/* delet car button */}
          <DeleteCar setOpenModal={setOpen} id={vehicleData.id_garage} matricule={vehicleData.matricule_garage} name={vehicleData.nom_voiture} />
          <Button onClick={() => setIsEditMode(true)} >
            <Edit />
            Mettre à jour
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DetailsTab;