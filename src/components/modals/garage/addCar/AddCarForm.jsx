import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription , DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {Button} from "@/components/ui/button"
import { useState } from 'react'
import { CarIcon, Check, Gauge, Loader2, PlusSquare, RotateCcw, X } from 'lucide-react';
import ChooseCar from "./chooseCar";
import React , { useEffect } from 'react';
import CarForm from "./carForm";
import CarImages from "./carImages";
import CarConfirm from "./carConfirm";
import { useAddGarage } from "../../../../api/queries/garage/useAddGarage";
import { useUploadGarageImages } from "../../../../api/queries/images/useUploadGarageImages";
import { carColors, finishEffects } from "../../../../utils/colors";
import { FireworksBackground } from '@/components/animate-ui/components/backgrounds/fireworks';
import { formatDateTime } from "../../../../utils/datautils";
import CarSettings from "./carSettings";


function AddCarGarage() {
  const [activeTab, setActiveTab] = useState(0) // Start with details
  const [open , setOpen] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(null);

  const [Car , setCar] = useState({})

  useEffect(() => {
    if (open === false) {
      setTimeout(() => {
      setActiveTab(0);
      setCar({});
      setSuccessModal(false);
      setErrorModal(null);
      }, 200);
    }
;
  }, [open]);

  const tabs = [
    { id: 0, label: 'Sélectionnez votre véhicule' , description : "Choisissez le véhicule que vous souhaitez gérer dans votre garage" },
    { id: 1, label: 'Indiquez les informations du véhicule' , description : "Fournissez les détails nécessaires concernant votre véhicule." },
    { id: 2, label: 'Ajoutez les photos du véhicule' , description : "Téléchargez des images de votre véhicule sous différents angles." },
    { id: 3, label: 'Ajoutez les photos du véhicule' , description : "Téléchargez des images de votre véhicule sous différents angles." }, 
    { id: 4, label: 'Confirmez votre véhicule' , description : "Vérifiez les informations et confirmez." }
  ]



  const {mutate , isPending  } = useAddGarage();
  const {mutate : imageMutate , isPending : isImagePending} = useUploadGarageImages();


  const handleAddGarageCar = () => {
    mutate(
      {
        matricule : Car.matricule_garage, 
        achat : formatDateTime(Car.date_achat_garage),
        assurance : formatDateTime(Car.date_assurance_garage),
        visite_technique : formatDateTime(Car.date_visite_garage),
        kilometrage : Car.kilometrage_garage,
        couleur : Car.couleur_garage,
        couleur_finition : Car.couleur_finition_garage ,
        id_voiture : Car.id_voiture ,
        type_achat: Car.type_achat ,
        valeur_achat: Car.valeur_achat,
        annees_ammortissement: Car.annees_ammortissement,
        valeur_amortissement: Car.valeur_amortissement,
        prix_achat: Car.prix_achat,
       
      },
      {
        onSuccess : (data) => {
          imageMutate({
            id: data,
            payload : {...Car.images}
          });
          setSuccessModal(true);
          }
        ,
        onError : (error) => {
          if(error.response) {
            if(error.response.status === 409) {
              setErrorModal("Le numéro de matricule saisi existe déjà sur la plateforme. Veuillez vérifier qu’il est correct.");
            }else{
              setErrorModal("Une erreur s’est produite lors de l'ajout du véhicule. Veuillez réessayer.");
            }
          }else{
             setErrorModal("Une erreur s’est produite lors de l'ajout du véhicule. Veuillez réessayer.");
          }
        }
      }
    );
  }


  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <ChooseCar setCar={setCar} Car={Car} next={() => setActiveTab(activeTab + 1)}  />
      case 1:
        return <CarForm Car={Car} setCar={setCar} next={() => setActiveTab(activeTab + 1)} prev={() => setActiveTab(activeTab - 1)} />

      case 2:
        return <CarImages Car={Car} setCar={setCar} next={() => setActiveTab(activeTab + 1)} prev={() => setActiveTab(activeTab - 1)} />

      case 3:
        return <CarSettings Car={Car} setCar={setCar} next={() => setActiveTab(activeTab + 1)}  prev={() => setActiveTab(activeTab - 1)} />

      case 4:
        return <CarConfirm isPending={isPending} Car={Car} prev={() => setActiveTab(activeTab - 1)} next={() => handleAddGarageCar()} />

      default:
        return null
    }
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}  modal>
      <DialogTrigger asChild>
        <Button className='flex items-center leading-none gap-2 h-full'><PlusSquare/> Ajouter Voiture</Button>
      </DialogTrigger>

      { successModal ? (
        <SucessContent 
        Car={Car} 
        setOpen={setOpen} 
        setActiveTab={setActiveTab}
        setCar={setCar}
        setSuccessModal={setSuccessModal}
        
        />
      ) : errorModal ? (
        <ErrorContent
          setErrorModal={setErrorModal} 
          setCar={setCar}
          setActiveTab={setActiveTab}
          setOpen={setOpen}
          errorModal={errorModal}
        />
      ) : (
        <ModalContent
          tabs={tabs}
          activeTab={activeTab}
          renderTabContent={renderTabContent}
          isPending={isPending}
          isImagePending={isImagePending}
        />
      )}
      
    </Dialog>
  )
}

export default AddCarGarage


const ModalContent = ({tabs, activeTab, renderTabContent ,isPending , isImagePending}) => {
  return (
    <DialogContent className="flex max-w-[996px] h-[694px] scale-85 desktop:scale-90 desktop-lg:scale-110 flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="w-full leading-tight"> 
            {tabs[activeTab].label}
          </DialogTitle>
          <DialogDescription className=' leading-tight text-base -mt-2'>
            {tabs[activeTab].description}
          </DialogDescription>
          <Separator />
          
          {/*steps counter */}
          <div className="w-full flex items-center  h-10 mt-1 gap-2 ">
            {tabs.map((tab,index) => (
              <React.Fragment key={`fragment-${index}`}>
              <span  className={`rounded-full relative z-10 shrink-0 leading-none  flex items-center transition-all  duration-300 ease-in-out justify-center font-semibold ${activeTab >= tab.id ? 'text-white bg-rod-accent' :  ' bg-gray-200 text-gray-500' } ${activeTab === tab.id ? ' w-8 h-8  ring-4 ring-red-100 ' : 'w-8 h-8'}`} >
                {activeTab === tab.id ?
                 <span  className=" text-white text-xl flex items-center justify-center leading-none rounded-full " >
                  {tab.id + 1}
                  </span>
                : tab.id < activeTab ?
                <Check  strokeWidth={4} className="w-4 h-4 text-white" />
                :
                index + 1
                }
              </span>

                  {index < tabs.length - 1 && (
                    <div  className={`w-full relative h-1 transition-colors  duration-300 rounded-full bg-gray-200`}>
                          <div  className={`w-full absolute rounded-full  h-1 bg-rod-accent`}
                          style={{
                              transform: activeTab > tab.id ? 'scaleX(1)' : 'scaleX(0)',
                              transformOrigin: 'left',
                              transition: 'transform 0.3s ease-out, background-color 0.3s ease',
                          }}
                          />
                      </div>
                  )}
              
              </React.Fragment>
            ))}
          </div>
        </DialogHeader>

        {/* Tab Content */}
        { (activeTab <= 4 && !isPending && !isImagePending) ? (
          <div className="overflow-hidden h-full ">
            {renderTabContent()}
          </div>
        ) : 
        (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin" />
          </div>
        )
        
        }

      </DialogContent>
  );
}


const SucessContent = ({Car , setOpen , setActiveTab , setCar , setSuccessModal}) => {
  return (
    <>
    <FireworksBackground color={[
  "#FF3B3F", // Bright Red
  "#FFF44F", // Lemon Yellow
  "#FF6EC7", // Neon Pink
  "#3EC1D3", // Electric Blue
  "#3DFE4A", // Emerald Green
  "#FFB830", // Orange Gold
  "#A259FF"  // Deep Purple
]} fireworkSize={8}
      fireworkSpeed={10}
      particleSize={4}
      particleSpeed={6} population={1} className="absolute z-20 h-screen w-screen inset-0 flex items-center justify-center rounded-xl" />
    <DialogContent className="flex items-center w-136 h-120 scale-85 desktop:scale-90 desktop-lg:scale-110 gap-1 flex-col">
          <DialogHeader className="flex-shrink-0">
              <DialogTitle className="w-full sr-only leading-tight"> 
                Nouveau Véhicule Ajouté
              </DialogTitle>
              <DialogDescription className=' leading-tight text-base sr-only -mt-2'>
                Votre véhicule a été ajouté avec succès à votre garage.
              </DialogDescription>
          </DialogHeader>
          <h2 className="text-2xl font-semibold leading-tight">Nouveau Véhicule Ajouté</h2>
          <p className="text-gray-500 text-base">Votre véhicule a été ajouté avec succès à votre garage.</p>
          <div className="relative  py-4 flex flex-col items-center mt-4">
             <div className="absolute top-3 left-8 bg-rod-primary text-white text-sm rounded-sm font-medium px-1.5 py-0.5">
                {Car?.matricule_garage}
              </div>

              <div className="absolute top-3 right-8 bg-emerald-700 text-white text-sm rounded-sm font-medium px-1.5 py-0.5">
                Disponible
              </div>
            <div className="max-h-36">
              <img loading="eager" src={Car?.image_voiture} alt={Car.nom_voiture} className="w-auto h-full object-cover" />
            </div>
            <div className="mt-4 flex flex-col gap-1 items-center">
              <h4 className="text-xl font-semibold leading-none">{Car?.nom_voiture}</h4>
              <p className="text-gray-500 text-lg leading-none">{Car?.version_voiture}</p>
            </div>
            <div className="flex mt-3 gap-6">
              <div className="flex text-base items-center gap-2">
                <Gauge className="h-4 w-4 mb-0.5 desktop-lg:h-5 desktop-lg:w-5" />
                <span >{Car?.kilometrage_garage} Km</span>
              </div>

              <div className="flex text-base items-center gap-2">
                 <span className="text-sm  desktop-lg:text-base flex gap-2 items-center  ">
                    <span className={`h-5 w-5 mb-0.5 rounded-xs ${(Car?.couleur_garage==="Blanc" || Car?.couleur_garage==="Crème" || Car?.couleur_garage==="Beige" ) && "border-gray-400 border"}`} style={{ backgroundColor: carColors[Car?.couleur_garage] , ...finishEffects[Car?.couleur_finition_garage]}} >
                    </span>
                    
                    <span >
                        {Car?.couleur_garage} {Car?.couleur_finition_garage}
                    </span>
                  </span>
              </div>

            </div>
          </div>
          <DialogFooter className=" w-full grid grid-cols-1 items-center gap-2 mt-2">
            <Button className="[&>svg]:!w-5 [&>svg]:!h-5 " onClick={() => { setSuccessModal(false); setCar({}); setActiveTab(0);}} >
              <PlusSquare />
              Ajouter un autre véhicule
              </Button>
            <Button className="[&>svg]:!w-5 [&>svg]:!h-5 " variant="outline" onClick={() => setOpen(false)}>
              <CarIcon  />
              Voir mon garage
            </Button>
            
          </DialogFooter>
      </DialogContent>
    </>
  );
}

const ErrorContent = ({ setErrorModal, setCar, setActiveTab, setOpen, errorModal }) => {
  return (
    <DialogContent className="flex items-center w-136 h-fit scale-85 desktop:scale-90 desktop-lg:scale-110 gap-1 flex-col">
      <DialogHeader className="flex-shrink-0">
              <DialogTitle className="w-full sr-only leading-tight"> 
                Ajout Échoué
              </DialogTitle>
              <DialogDescription className=' leading-tight text-base sr-only -mt-2'>
               {errorModal || "Votre véhicule n'a pas pu être ajouté à votre garage."}
              </DialogDescription>
          </DialogHeader>
           <div className="rounded-full bg-red-100 p-2 mb-4">
              <X className="h-8 w-8 text-red-600" />
           </div>
          <h2 className="text-2xl font-semibold leading-tight">Ajout Échoué</h2>
          <p className="text-gray-500 text-base text-center">{errorModal}</p>
          <DialogFooter className=" w-full grid grid-cols-1 items-center gap-2 mt-6">
            <Button className="[&>svg]:!w-5 [&>svg]:!h-5 " onClick={() => { setErrorModal(null); setCar({}); setActiveTab(0);}} >
              <RotateCcw />
              Réessayer l'ajout du véhicule
              </Button>
            <Button className="[&>svg]:!w-5 [&>svg]:!h-5 " variant="outline" onClick={() => setOpen(false)}>
              <CarIcon  />
              Voir mon garage
            </Button>
            
          </DialogFooter>
      </DialogContent>
  );
}