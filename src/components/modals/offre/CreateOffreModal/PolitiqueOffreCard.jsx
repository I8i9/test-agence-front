import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { steeringWheel } from "@lucide/lab";
import {
  Fuel,
  CalendarSearch,
  Gauge,
  CalendarOff,
  IdCard,
  Shield,
  Icon,
  Calendar1,
  Gavel,
  Truck,
} from "lucide-react";

import DetailItem from "../../../customUi/detailitem";
function formatText(input) {
  // Convert to lowercase
  let lower = input.toLowerCase();
  
  // Replace underscores with spaces
  let withSpaces = lower.replace(/_/g, ' ');
  
  // Capitalize the first letter
  let result = withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
  
  return result;
}

const PolitiquesOffreCard = ({ data }) => {

  console.log("data politique offre",data)
  const SteeringWheelIcon = (props) => <Icon iconNode={steeringWheel} {...props} />;

  const   renderBadge = ({ value, textNoValue, condition, trueText, falseText, rawValue }) => {
  // If we have a rawValue (the actual data value), check that instead of the JSX value
  const checkValue = rawValue !== undefined ? rawValue : value;
  
  if (checkValue !== undefined && checkValue !== null && checkValue !== "") {
    return <span className="text-base whitespace-nowrap leading-none">{value}</span>;
  }

  if ((checkValue === undefined || checkValue === null || checkValue === "") && textNoValue) {
    return (
      <Badge variant="secondary" className="text-base px-1.5 py-1 leading-none whitespace-nowrap">
        {textNoValue}
      </Badge>
    );
  }

  if (typeof condition === "boolean") {
    return (
      <Badge
        variant={condition ? "default" : "secondary"}
        className="text-base px-1.5 py-1 leading-none whitespace-nowrap"
      >
        {condition ? trueText : falseText}
      </Badge>
    );
  }

  return null;
};

  return (
    <Card className="shadow-none h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Shield className="w-5 h-5 " />
          Politiques et conditions
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-rows-2 grid-cols-4 gap-x-8 gap-y-8 py-2">
          <DetailItem icon={Fuel} label="Carburant">
            {renderBadge({
              value:
                formatText(data.carburant_pol === "MEME_NIVEAU" ? "Même niveau" : data.carburant_pol) ,
              textNoValue: "Illimité",
            })}
          </DetailItem>
           

          <DetailItem icon={Truck} label="Livraison">
            {renderBadge({
              value: data.livraison_pol === "AGENCE" ? "Agence Seulement" : data.livraison_pol === "HOTEL_AEROPORT" ? "À l’hôtel / Aéroport" : "Livraison partout"  ,
              textNoValue:'Non disponible'
            })}
          </DetailItem>


          <DetailItem icon={Gauge} label="Kilométrage">
            {renderBadge({
              value:
                data.kilometrage_pol_offre > 0
                  ? `${data.kilometrage_pol_offre.toLocaleString("fr-FR")} km/jour`
                  : "",
              textNoValue: "Illimité",
            })}
          </DetailItem>

           <DetailItem icon={Gavel} label="Pénalité sur kilométrage">
            {renderBadge({
              value:
                
                data?.type_penalite === "FIXED" ? `${data?.montant_penalite} DT` :
                data?.type_penalite === "PER_KM" ? `${data.montant_penalite} DT/km ` :
                (data?.type_penalite === "FREE" && data?.kilometrage_pol_offre ) ? "Aucune" : null,
                textNoValue: "Sans pénalité",
            })}
          </DetailItem>

          <DetailItem icon={IdCard} label="Ancienneté du permis">
            {renderBadge({
              value: data.anciennite_permis_pol ? `${data.anciennite_permis_pol} ans` : "",
              textNoValue: "Sans exigence",
            })}
          </DetailItem>
          <DetailItem icon={Calendar1} label="Âge minimum">
            {renderBadge({
              value: data.age ? `${data.age} ans` : "",
              textNoValue:'Sans exigence'
            })}
          </DetailItem>
          <DetailItem icon={CalendarOff} label="Frais d’annulation">
            {renderBadge({
              value: data.annulation_pol_offre ? `${data.annulation_pol_offre} DT` : "",
              textNoValue: "Gratuite",
            })}
          </DetailItem>

          <DetailItem icon={CalendarSearch} label="Frais de modification">
            {renderBadge({
              value: data.modification_pol_offre ? `${data.modification_pol_offre} DT` : "",
              textNoValue: "Gratuite",
            })}
          </DetailItem>
      </CardContent>
    </Card>
  );
};

export default PolitiquesOffreCard;
