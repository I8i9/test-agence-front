export const fournisseurTypes = {
  LEASING: 'Leasing',
  ASSURANCE: 'Assurance',
  GARAGE: 'Garage / Maintenance / Réparations',
  PIECES_AUTO: 'Pièces Auto & Accessoires',
  LAVAGE: 'Lavage & Nettoyage auto',
  REMORQUAGE: 'Remorquage / Dépannage',
  CONTROLE_TECHNIQUE: 'Contrôle technique',
  GPS_TRACKING: 'Systèmes GPS / Tracking',
  CAR_IMPORT: 'Import Auto / Achat véhicules',
  FUEL: 'Carburant',
  BANQUE: 'Banque',
  SOFTWARE: 'Logiciels / ERP / CRM',
  MARKETING: 'Marketing & Publicité',
  FOURNITURES_BUREAU: 'Fournitures & Matériel de bureau',
  SECURITE: 'Sécurité & Surveillance',
  OTHER: 'Entreprise Divers'
}


// Type styling function
export const getTypeStyle = (type) => {
  switch (type) {
    case 'LEASING':
      return 'bg-blue-100 text-blue-700';

    case 'ASSURANCE':
      return 'bg-green-100 text-green-700';

    case 'GARAGE':
      return 'bg-orange-100 text-orange-700';

    case 'PIECES_AUTO':
      return 'bg-amber-100 text-amber-700';

    case 'LAVAGE':
      return 'bg-cyan-100 text-cyan-700';

    case 'REMORQUAGE':
      return 'bg-red-100 text-red-700';

    case 'CONTROLE_TECHNIQUE':
      return 'bg-lime-100 text-lime-700';

    case 'GPS_TRACKING':
      return 'bg-teal-100 text-teal-700';

    case 'CAR_IMPORT':
      return 'bg-purple-100 text-purple-700';

    case 'FUEL':
      return 'bg-yellow-100 text-yellow-700';

    case 'BANQUE':
      return 'bg-indigo-100 text-indigo-700';

    case 'SOFTWARE':
      return 'bg-sky-100 text-sky-700';

    case 'MARKETING':
      return 'bg-rose-100 text-rose-700';

    case 'FOURNITURES_BUREAU':
      return 'bg-stone-100 text-stone-700';

    case 'SECURITE':
      return 'bg-slate-100 text-slate-700';

    case 'OTHER':
      return 'bg-gray-100 text-gray-700';

    default:
      return 'bg-gray-100 text-gray-700';
  }
};
