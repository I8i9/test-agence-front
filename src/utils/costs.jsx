import { Bubbles, Disc2, Cpu, TrafficCone, Forklift, Siren, Icon, TrendingDown, Box, Gem, Lamp } from 'lucide-react';
import { tire } from "@lucide/lab"; 
import {
  Fuel,
  Wrench,
  ShieldCheck,
  FileBadge2,
  Banknote,
  Car,
} from "lucide-react";
import {
  Hammer,
  FileText,
  Briefcase,
  Megaphone,
  MapPin,
  Phone,
  CreditCard,
  Laptop,
  Landmark,
  CircleDollarSign,
  Users,
  FileX,
  CircleEllipsis,
  Warehouse,
  Activity,
} from "lucide-react";

// Create wrapper components for icons from @lucide/lab
const TireIcon = (props) => <Icon iconNode={tire} {...props} />;

export const Cost = [
  {
    value: "CARBURANT_LUBRIFIANT",
    label: "Carburant & Lubrifiant",
    icon: Fuel,
    tva: 0.19,
    deductable: true,
    style:"text-emerald-600 bg-emerald-50"
  },
  {
    value: "PIECES_DETACHEES",
    label: "Pièces Détachées",
    icon: Box,
    tva: 0.19,
    deductable: true,
    style:"text-indigo-600 bg-indigo-50"
  },
  {
    value: "ENTRETIEN_ET_REPARATIONS",
    label: "Entretien & Réparations",
    icon: Wrench,
    tva: 0.19,
    deductable: true,
    style:"text-yellow-600 bg-yellow-50"
  },
  {
    value: "PRIMES_D_ASSURANCE",
    label: "Primes d'Assurance",
    icon: ShieldCheck,
    tva: 0,
    deductable: false,
  },
  {
    value: "CREDIT_BAIL",
    label: "Paiement Leasing",
    icon: Banknote,
    tva: 0.19,
    hasSpecialTva : "19%-7% (depend du véhicule)",
    deductable: true,
    style:"text-blue-600 bg-blue-50"
  },
  {
    value: "VIGNETTES_ET_TAXES_SUR_LES_VEHICULES",
    label: "Vignettes et Taxes sur les véhicules",
    icon: FileBadge2,
    tva: 0,
    deductable: false,
    style:"text-red-600 bg-red-50"
  },
];

export const Rappel = [
  { value: "CARBURANT", label: "Carburant", icon: Fuel },
  { value: "ENTRETIEN", label: "Entretien périodique", icon: Hammer  },
  { value: "PNEUS", label: "Remplacement pneus", icon: TireIcon }, 
  { value: "FREINS", label: "Freins & plaquettes", icon: Disc2  },
  { value: "REPARATION_MECANIQUE", label: "Réparation mécanique", icon: Wrench  },
  { value: "REPARATION_ELECTRONIQUE", label: "Réparation électronique", icon: Cpu },
  { value: "LAVAGE", label: "Lavage & nettoyage", icon: Bubbles  },
  { value: "AMENDE", label: "Amendes", icon: FileText},
  { value: "DEPANNAGE", label: "Dépannage / remorquage", icon: Forklift  },
  { value: "REPARATION_ACCIDENT", label: "Réparation accident", icon: TrafficCone    },
  { value: "VOL_VANDALISME", label: "Vol / vandalisme", icon: Siren  },
  { value: "PAIMENT_LEASING", label: "Paiement leasing", icon: Banknote },
  { value: "AUTRE", label: "Autre dépense", icon: CircleEllipsis  }
];

export const costMisc = [
  {
    value: "ENTRETIEN_LOCAUX",
    label: "Entretien des Locaux",
    icon: Hammer,
    tva: 0.19,
    deductable: true,
    style:"text-teal-600 bg-teal-50"
  },
  {
    value: "FOURNITURES_DE_BUREAU",
    label: "Fournitures de bureau",
    icon: Lamp,
    tva: 0.19,
    deductable: true,
    style:"text-orange-600 bg-orange-50"
  },
  {
    value: "LOYERS_DES_LOCATIONS",
    label: "Loyers des locaux",
    icon: Warehouse,
    tva: 0.19,
    deductable: true,
    style : "text-blue-600 bg-blue-50"
  },
  {
    value: "HONORAIRES_ET_COMMISSIONS",
    label: "Honoraires et Commissions",
    icon: Briefcase,
    tva: 0.19,
    deductable: true,
    style:"text-fuchsia-600 bg-fuchsia-50"
  },
  {
    value: "PUBLICITE_MARKETING_COMMUNICATION",
    label: "Publicité, marketing et communication",
    icon: Megaphone,
    tva: 0.19,
    deductable: true,
    style:"text-sky-600 bg-sky-50"
  },
  {
    value: "FRAIS_DE_DEPLACEMENT_ET_MISSIONS",
    label: "Frais de déplacement et missions",
    icon: MapPin,
    tva: 0.19,
    deductable: false,
    style:"text-violet-600 bg-violet-50"
  },
  {
    value: "FRAIS_POSTAUX_ET_TELECOMS",
    label: "Frais postaux et télécoms",
    icon: Phone,
    tva: 0.19,
    deductable: true,
    style:"text-pink-600 bg-pink-50"
  },
  {
    value: "FRAIS_BANCAIRES_ET_ASSIMILES",
    label: "Services bancaires et assimilés",
    icon: CreditCard,
    tva: 0.19,
    deductable: true,
     style:"text-rose-600 bg-rose-50"
  },
  {
    value: "PAIEMENT_LOGICIELS",
    label: "Paiement Logiciels",
    icon: Laptop,
    tva: 0.19,
    deductable: true,
    style:"text-cyan-600 bg-cyan-50"
  },
  {
    value: "DROITS_D_ENREGISTREMENT",
    label: "Droits d'enregistrement",
    icon: Landmark,
    tva: 0,
    deductable: false,
    style:"text-amber-600 bg-amber-50"
  },
  {
    value: "SALAIRES_NETS",
    label: "Salaires nets",
    icon: CircleDollarSign,
    tva: 0,
    deductable: false,
    style:"text-emerald-600 bg-emerald-50"
  },
  {
    value: "CHARGES_SOCIALES_PATRONALES_CNSS",
    label: "Charges sociales patronales (CNSS)",
    icon: Users,
    tva: 0,
    deductable: false,
    style:"text-purple-600 bg-purple-50"
  },
  {
    value: "VERSEMENTS_AU_PROFIT_D_OEUVRES_SOCIALES",
    label: "Contributions sociales et syndicales",
    icon: Gem,
    tva: 0,
    deductable: false,
    style:"text-indigo-600 bg-indigo-50"
  },
  {
    value: "PERTE_SUR_CREANCES_IRRECOVERABLES",
    label: "Pertes irrécouvrables",
    icon: FileX,
    tva: 0,
    deductable: false,
    style:"text-red-600 bg-red-50"
  },
  {
    value: "AMENDES_ET_PENALITES",
    label: "Pénalités et amendes",
    icon: FileText,
    tva: 0,
    deductable: false,
    style:"text-yellow-600 bg-yellow-50"
  },
  {
    value: "AUTRE_CHARGES_D_EXPLOITATION",
    label: "Autres charges diverses",
    icon: CircleEllipsis,
    tva: 0,
    deductable: false,
    style:"text-slate-600 bg-slate-50"
  },
];

export const allCosts = [
  ...Cost,
  ...costMisc
];

export const archiveCosts = [
  ...allCosts,
  {
    value: "TOTAL_AMMORTISSEMENT",
    label: "Ammortissement Flotte",
    icon: TrendingDown,
    tva: 0,
    deductable: false,
  }
]

export const CostArray = [
  "CARBURANT_LUBRIFIANT",
  "PIECES_DETACHEES",
  "FOURNITURES_DE_BUREAU",
  "LOYERS_DES_LOCATIONS",
  "ENTRETIEN_ET_REPARATIONS",
  "PRIMES_D_ASSURANCE",
  "CREDIT_BAIL",
  "VIGNETTES_ET_TAXES_SUR_LES_VEHICULES",
  "ENTRETIEN_LOCAUX",
  "HONORAIRES_ET_COMMISSIONS",
  "PUBLICITE_MARKETING_COMMUNICATION",
  "FRAIS_DE_DEPLACEMENT_ET_MISSIONS",
  "FRAIS_POSTAUX_ET_TELECOMS",
  "FRAIS_BANCAIRES_ET_ASSIMILES",
  "PAIEMENT_LOGICIELS",
  "DROITS_D_ENREGISTREMENT",
  "SALAIRES_NETS",
  "CHARGES_SOCIALES_PATRONALES_CNSS",
  "VERSEMENTS_AU_PROFIT_D_OEUVRES_SOCIALES",
  "PERTE_SUR_CREANCES_IRRECOVERABLES",
  "AMENDES_ET_PENALITES",
  "AUTRE_CHARGES_D_EXPLOITATION"
];

export const RappelArray = [
  "CARBURANT",
  "ENTRETIEN",
  "PNEUS",
  "FREINS",
  "REPARATION_MECANIQUE",
  "REPARATION_ELECTRONIQUE",
  "LAVAGE",
  "AMENDE",
  "DEPANNAGE",
  "REPARATION_ACCIDENT",
  "VOL_VANDALISME",
  "PAIMENT_LEASING",
  "AUTRE"
];

export const CostMiscArray = [
  "LOYER",
  "SALAIRES",
  "CNSS_ASSURANCE",
  "FOURNITURES",
  "LOGICIELS",
  "TAXES",
  "FRAIS_BANCAIRES",
  "AUTRE_MISC"
];
