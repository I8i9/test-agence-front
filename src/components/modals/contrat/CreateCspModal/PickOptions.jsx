import React from 'react'
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ShieldCheck, Truck } from "lucide-react";
import { Checkbox } from '../../../customUi/animatedCheckbox';
import { Badge } from "@/components/ui/badge";
import { Wifi, MapPin, Baby, User, Fuel, Clock5, Icon ,ShieldCheckIcon, ShieldIcon,UserPlusIcon } from "lucide-react";
import { steeringWheel, pillow } from "@lucide/lab";  


const PickOptions = ({ prev , next , setContratSpData ,ContratSpData  }) => {
    const offre = ContratSpData.selected_offre;
    const livraisonMode = offre?.livraison;
    console.log("selected offre",offre);
    const [selectedOptions, setSelectedOptions] = React.useState(ContratSpData.selectedOptions || []);


    const SteeringWheelIcon = (props) => <Icon iconNode={steeringWheel} {...props} />;
    const Pillow = (props) => <Icon iconNode={pillow} {...props} />;

    const optionConfig = {
    prix_options_assurance_TR : {label : 'Assurance tous risque' , description :'Protection complète' , icon : ShieldCheckIcon}    ,
    prix_options_assurance_PR : {label : 'Assurance Protection +' , description :'Protection complète' , icon : ShieldIcon} ,
    prix_options_conducteur_add : {label : 'Conducteur Additionnel' , description :'Conducteur supplémentaire' , icon : UserPlusIcon} ,
    prix_options_wifi: { label: "Wifi", description: "Connexion internet embarquée.", icon: Wifi },
    prix_options_gps: { label: "GPS", description: "Navigation avec géolocalisation.", icon: MapPin },
    prix_options_rehausseur: { label: "Réhausseur", description: "Siège réhausseur pour enfant.", icon: Pillow },
    prix_options_siege_bebe: { label: "Siège bébé", description: "Siège adapté aux nourrissons.", icon: Baby },
    prix_options_siege_enfant: { label: "Siège enfant", description: "Siège de sécurité pour enfants.", icon: User },
    prix_options_plein: { label: "Plein carburant", description: "Voiture livrée avec réservoir plein.", icon: Fuel },
    prix_options_livraison: { label: "Livraison", description: "Livraison de voiture à l'adresse souhaitée.", icon: Truck },
    prix_total_chauffeur: { label: "Chauffeur", description: "Conducteur privé inclus.", icon: SteeringWheelIcon },
  };

  // Extract only the option keys that exist in optionConfig from optionsData
  const availableOptions = offre 
    ? Object.keys(optionConfig).filter(key => key in offre)
    : [];

  // Filter to get only non-null options
  const optionsList = availableOptions
    .map(key => [key, offre[key]])
    .filter(([, value]) => value != null);

    const handleNext = () => {
        // Update ContratSpData with selected options
        setContratSpData(prev => ({
            ...prev,
            selectedOptions: selectedOptions,
        }));
        next();
    }

    if (optionsList.length === 0 && ContratSpData.skippedOptions) {
        setContratSpData(prev => ({
          ...prev,
          skippedOptions: false, // Indicate that options step was skipped
            }));
            prev();
        return null; // or a loading spinner, or a message indicating no options available
    }

    if(optionsList.length === 0) {
        setContratSpData(prev => ({
            ...prev,
            selectedOptions: [],
            skippedOptions: true, // Indicate that options step was skipped
        }));
        next();

        return null; // or a loading spinner, or a message indicating no options available
    }


  return (
    <div className='flex flex-col h-full'>
        {/* Content Area */}
        <div className=" p-1">
            <div className='flex items-center justify-between'>
                <h3 className="flex items-center gap-1 font-semibold text-lg">
                Options Suplémentaires
                </h3>
                
                <h4 className='flex items-center justify-between font-medium'>
                <span>Total Des Options :</span>&nbsp;
                <span className='font-bold'>
                    {optionsList
                    .filter(([key]) => selectedOptions.includes(key))
                    .reduce((acc, [, value]) => acc + (value || 0), 0)}{' '}
                    TND
                </span>
                </h4>
            </div>
        </div>
        <div className='flex-1 mt-4 grid-cols-1 gap-y-4 overflow-y-scroll pr-1 '>

            {optionsList.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 h-fit p-0.5">
            {optionsList.map(([key, value]) => {
              const config = optionConfig[key];
              const iSelected =selectedOptions.includes(key)
              if (!config) return null;
              const IconComponent = config.icon;

              return (
                <div
                onClick={() => {
                    if (selectedOptions.includes(key)) {
                        setSelectedOptions(selectedOptions.filter(option => option !== key));
                    } else {
                        setSelectedOptions([...selectedOptions, key]);
                    }
                }}
                  key={key}
                  className={`flex  justify-between items-start py-3.5 px-2.5 cursor-pointer ${ iSelected ? 'border-1 ring-1  border-rod-primary' : ''} rounded-md border bg-background hover:bg-muted/40 transition-colors duration-300  h-full`}
                >
                  <div className="flex  items-center gap-2.5">
                    <div className="bg-muted p-3 rounded-full">
                      {IconComponent && (
                        <IconComponent className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    
                    <div className="flex items-start   gap-2.5">
                      <div>
                        <div className="flex flex-col gap-1">
                          <p className="font-medium text-base text-foreground">
                            {config.label}
                          </p>
                          <p className="text-base text-muted-foreground leading-none">
                            {config.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 relative ">
                    {
                    config.label=== "Livraison" ? 
                    value && value > 0 && livraisonMode === "FIXED" ? (
                      <span className=" leading-none font-semibold text-lg ">
                        + {value} DT
                      </span>
                    ) : livraisonMode === "FREE" ? (
                      <Badge
                        variant="secondary"
                        className="text-sm absolute  -top-1  font-medium px-1 py-1 leading-none rounded-sm bg-green-100 text-green-600"
                      >
                        Gratuite
                      </Badge>
                    ) : livraisonMode === "NEGOTIABLE" ? (
                      <Badge
                        variant="secondary"
                        className="text-sm absolute  -top-1 right-6 font-medium px-1 py-1 leading-none rounded-sm bg-blue-100 text-blue-600"
                      >
                        À négocier
                      </Badge>
                    ) : null
                    
                    // if not delivery option do the usal checking

                    :
                    value && value > 0 ? (
                      <span className=" leading-none font-semibold text-lg ">
                        + {value} DT
                      </span>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="text-sm absolute  -top-1 right-6  font-medium px-1 py-1 leading-none rounded-sm bg-green-100 text-green-600"
                      >
                        Gratuite
                      </Badge>
                    )}
                    <Checkbox checked={iSelected} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Aucune option supplémentaire disponible
          </p>
        )}

        </div>
         {/* Navigation Footer */}
        <div className="flex justify-between pt-4 mt-4 border-t">
            <Button 
            type="button"
            variant="outline"
            onClick={prev}
            >
            <ChevronLeft className="h-4 w-4" />
            Retour
            </Button>
            
            <Button 
            onClick={() => handleNext()}
            >
            Suivant
            <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    </div>
  )
}

export default PickOptions