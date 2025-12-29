import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ToolTipCustom from '../../../customUi/tooltip';
import { Car, CarFront, Gauge, Info, Joystick, Palette, Tag } from 'lucide-react';
import { carColors, finishEffects } from '../../../../utils/colors';
import   DetailItem from '../../../customUi/detailitem';

const VoitureCard = ({garage}) => {
  const status = {
    "bien" : { text : "Prête à rouler" , class : "text-green-600" },
    "avenir" : { text : "Échéance proche" , class : "text-amber-600" },
    "probleme" : { text : "Ne peut pas rouler" , class : "text-red-600" }
  }
    return (
        <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-medium text-lg">
          <CarFront className="w-5 h-5 mb-0.5" />
          Véhicule
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-x-8 gap-y-7">
          <DetailItem label="Version" icon={Tag}>
            <ToolTipCustom
            trigger={
            <p className="max-w-fit truncate">{garage.version_voiture || 'N/A'}</p>
            }
            message={
                garage.version_voiture || 'N/A'
            }
          />
          </DetailItem> 


          <DetailItem label="Status" icon={Info}>
            {
              garage.problemes === "bien" ?
            
                <p className={`max-w-fit truncate ${status[garage.problemes]?.class}`}>
                  {status[garage.problemes]?.text || 'N/A'}
                </p>

                :

                <ToolTipCustom
                  trigger={
                      <p className={`max-w-fit truncate flex items-start cursor-pointer gap-1 ${status[garage.problemes]?.class}`}>
                        {status[garage.problemes]?.text || 'N/A'}
                        <Info className="size-3" />
                      </p>
                  }
                  message = {
                       <div className="space-y-1 pb-2">
                            <h4 className="font-semibold  text-sm">
                                Problème(s) à régler :</h4>
                            <ul className="space-y-1 text-sm text-gray-700">
                                {garage?.probleme_controle !==false && (
                                    <li className="flex items-center gap-2">
                                        {
                                            garage?.probleme_controle < 0 ?
                                            <>
                                            <div className="w-1.5 h-1.5 mt-1 bg-rod-accent rounded-full flex-shrink-0" />
                                            Visite technique expirée
                                            </>
                                            :

                                            garage?.probleme_controle === 0 ?
                                            <>
                                                <div className="w-1.5 h-1.5 mt-1 bg-amber-500 rounded-full flex-shrink-0" />
                                                Visite technique expire aujourd'hui
                                            </>
                                            :

                                            <>
                                                <div className="w-1.5 h-1.5 mt-1 bg-amber-500 rounded-full flex-shrink-0" />
                                                Visite technique expire dans {garage?.probleme_controle} jour{garage?.probleme_controle > 1 ? 's' : ''}
                                            </>                                            

                                        }
                                        
                                    </li>
                                )}
                                {garage?.probleme_assurance !== false && (
                                    <li className="flex items-center gap-2">
                                        {
                                            garage?.probleme_assurance < 0 ?
                                            <>
                                            <div className="w-1.5 h-1.5 mt-1 bg-rod-accent rounded-full flex-shrink-0" />
                                            Assurance expirée
                                            </>
                                            :

                                            garage?.probleme_assurance === 0 ?
                                            <>
                                                <div className="w-1.5 h-1.5 mt-1 bg-amber-500 rounded-full flex-shrink-0" />
                                                Assurance expire aujourd'hui
                                            </>
                                            :

                                            <>
                                                <div className="w-1.5 h-1.5 mt-1 bg-amber-500 rounded-full flex-shrink-0" />
                                                Assurance expire dans {garage?.probleme_assurance} jour{garage?.probleme_assurance > 1 ? 's' : ''}
                                            </>

                                        }
                                    </li>
                                )}
                                {garage?.probleme_vignette !== false && (
                                    <li className="flex items-center gap-2">
                                        {
                                            garage?.probleme_vignette < 0 ?
                                            <>
                                            <div className="w-1.5 h-1.5 mt-1 bg-rod-accent rounded-full flex-shrink-0" />
                                            Vignette expirée
                                            </>
                                            :

                                            garage?.probleme_vignette === 0 ?
                                            <>
                                                <div className="w-1.5 h-1.5 mt-1 bg-amber-500 rounded-full flex-shrink-0" />
                                                Vignette expire aujourd'hui
                                            </>
                                            :

                                            <>
                                                <div className="w-1.5 h-1.5 mt-1 bg-amber-500 rounded-full flex-shrink-0" />
                                                Vignette expire dans {garage?.probleme_vignette} jour{garage?.probleme_vignette > 1 ? 's' : ''}
                                            </>

                                        }
                                    </li>
                                )}
                            </ul>
                        </div>
                      }
                />

            }

            </DetailItem>
            
            <DetailItem label="Transmission" icon={Joystick}>
            <ToolTipCustom
              trigger={
                  <p className=" max-w-fit  truncate">{garage.transmission_voiture || 'N/A'}</p>
                }
              message={garage.matricule_garage || 'N/A'}
            />
          </DetailItem>

            {/* lieu retour */}
          <DetailItem label="Kilometrage" icon={Gauge}>
            <ToolTipCustom
              trigger={
                <p className="  max-w-fit  truncate">{garage.kilometrage_garage + ' Km' || 'N/A'}</p>
              }
              message={garage.kilometrage_garage || 'N/A'}
            />
          </DetailItem>   

          {/* date depart */}
          <DetailItem label="Type du véhicule" icon={Car}>
            <ToolTipCustom
              trigger={
                <p className=" max-w-fit  truncate">{garage.type_voiture || 'N/A'}</p>
              }
              message={garage.type_voiture || 'N/A'}
            />
          </DetailItem>

            {/* date retour */}
          <DetailItem label="Couleur" icon={Palette}>
             <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-xs ${(garage.couleur_garage==="Blanc" || garage.couleur_garage==="Crème" || garage.couleur_garage==="Beige" ) && "border-gray-300 border"}`} style={{ backgroundColor: carColors[garage.couleur_garage] , ...finishEffects[garage.couleur_finition_garage]}} ></div>
              <ToolTipCustom
                trigger={
                  <p className="leading-none truncate max-w-fit">{garage.couleur_garage} {garage.couleur_finition_garage}</p>
                }
                message={`${garage.couleur_garage} ${garage.couleur_finition_garage}`}
              />
            </div>
          </DetailItem>
      </CardContent>
    </Card>
    )
}
export default VoitureCard