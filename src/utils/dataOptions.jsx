import {
  WifiIcon,
  NavigationIcon,
  UserPlusIcon,
  ShieldCheckIcon,
  ShieldIcon,
  BabyIcon,
  ArmchairIcon,
  UserIcon,
  FuelIcon,
  TruckIcon,
  Icon,
} from "lucide-react"

import { babyPacifier , steeringWheel } from "@lucide/lab"

// eslint-disable-next-line react-refresh/only-export-components
const BabyPacifierIcon = (props) => <Icon iconNode={babyPacifier} {...props} />


// eslint-disable-next-line react-refresh/only-export-components
const SteeringWheelIcon = (props) => <Icon iconNode={steeringWheel} {...props} />;


export const availableOptions = [
{
    id: "conducteur_additionnel",
    icon: UserPlusIcon,
    title: "Conducteur Additionnel",
    description: "Autorisation pour un conducteur supplémentaire",
    availableModes: ["FREE", "FIXED", "PER_DAY"],
  },
  {
    id: "chauffeur",
    icon: SteeringWheelIcon,
    title: "Chauffeur",
    description: "Service de chauffeur professionnel",
    availableModes: ["FREE", "FIXED", "PER_DAY"],
  },
  {
    id: "wifi",
    icon: WifiIcon,
    title: "WiFi",
    description: "Connexion internet sans fil dans le véhicule",
    availableModes: ["FREE", "FIXED", "PER_DAY"],
  },
  {
    id: "gps",
    icon: NavigationIcon,
    title: "GPS",
    description: "Système de navigation GPS intégré",
    availableModes: ["FREE", "FIXED", "PER_DAY"],
  },
  {
    id: "assurance_PR",
    icon: ShieldCheckIcon,
    title: "Assurance Protection +",
    description: "Protection supplémentaire avec franchise réduite",
    availableModes: ["FREE", "FIXED", "PER_DAY"],
  },
  {
    id: "assurance_TR",
    icon: ShieldIcon,
    title: "Assurance Tout Risque",
    description: "Couverture complète sans franchise",
    availableModes: ["FREE", "FIXED", "PER_DAY"],
  },
  {
    id: "siege_bebe",
    icon: BabyPacifierIcon,
    title: "Siège Bébé",
    description: "Siège auto pour bébés (0-13 kg)",
    availableModes: ["FREE", "FIXED", "PER_DAY"],
  },
  {
    id: "siege_enfant",
    icon: BabyIcon,
    title: "Siège Enfant",
    description: "Siège auto pour enfants (9-18 kg)",
    availableModes: ["FREE", "FIXED", "PER_DAY"],
  },
  {
    id: "rehausseur",
    icon: ArmchairIcon,
    title: "Réhausseur",
    description: "Siège rehausseur pour enfants (15-36 kg)",
    availableModes: ["FREE", "FIXED", "PER_DAY"],
  },
  {
    id: "plein_carburant",
    icon: FuelIcon,
    title: "Plein Carburant",
    description: "Réservoir plein à la prise en charge",
    availableModes: ["FREE", "FIXED"], // Only FREE or fixed
  },
  {
    id: "livraison",
    icon: TruckIcon,
    title: "Livraison",
    description: "Livraison du véhicule à votre adresse",
    availableModes: ["FREE", "FIXED", "NEGOTIABLE"], // Only FREE or negotiable
  },
]