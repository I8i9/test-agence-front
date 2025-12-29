  // Mock data - replace with actual data from your API/props
 export const contracts = [
    {
      id: 1,
      clientName: 'Rayen Hamdi',
      email: 'jean.dupont@email.com',
      phone: '95 300 323',
      status: 'EN_COURS',
      amount: 80.50,
      period: {
        start: '2025-07-20T10:30:00',
        end: '2025-07-30T10:30:00',
      },
      location: {
        pickup: 'La Soukra, Ariana',
        dropoff: 'Aéroport Tunis Carthage, Tunis'
      },
      sequenceContrat: 'CR-123456',

    },
    {
      id: 2,
      clientName: 'Rayen Hamdi',
      email: 'jean.dupont@email.com',
      phone: '95 300 323',
      status: 'TERMINE',
      amount: 80.50,
      period: {
        start: '2025-07-20T10:30:00',
        end: '2025-07-30T10:30:00',
      },
      location: {
        pickup: 'La Soukra, Ariana',
        dropoff: 'Aéroport Tunis Carthage, Tunis'
      },
      sequenceContrat: 'CR-123456',
    },
    {
      id: 3,
      clientName: 'Rayen Hamdi',
      email: 'jean.dupont@email.com',
      phone: '95 300 323',
      status: 'TERMINE',
      amount: 80.50,
      period: {
        start: '2025-07-20T10:30:00',
        end: '2025-07-30T10:30:00',
      },
      location: {
        pickup: 'La Soukra, Ariana',
        dropoff: 'Aéroport Tunis Carthage, Tunis'
      },
      sequenceContrat: 'CR-123456',
    },
    {
      id: 4,
      clientName: 'Rayen Hamdi',
      email: 'jean.dupont@email.com',
      phone: '95 300 323',
      status: 'TERMINE',
      amount: 80.50,
      period: {
        start: '2025-07-20T10:30:00',
        end: '2025-07-30T10:30:00',
      },
      location: {
        pickup: 'La Soukra, Ariana',
        dropoff: 'Aéroport Tunis Carthage, Tunis'
      },
      sequenceContrat: 'CR-123456',
    },
    {
      id: 5,
      clientName: 'Rayen Hamdi',
      email: 'jean.dupont@email.com',
      phone: '95 300 323',
      status: 'TERMINE',
      amount: 80.50,
      period: {
        start: '2025-07-20T10:30:00',
        end: '2025-07-30T10:30:00',
      },
      location: {
        pickup: 'La Soukra, Ariana',
        dropoff: 'Aéroport Tunis Carthage, Tunis'
      },
      sequenceContrat: 'CR-123456',
    },
  ];

    // Mock data - replace with actual data from your API/props
export const expenses = [
      { 
        id: 1,
        title: 'Paiement de carburant', 
        date: '16-12-2024', 
        time: '103:450 km', 
        reference: 'FF#478528775', 
        amount: '80.50 DT',
        icon: 'Fuel'
      },
      { 
        id: 2,
        title: "Paiement de l'assurance annuelle", 
        date: '16-12-2024', 
        time: '103:450 km', 
        reference: 'Numéro Reçu', 
        amount: '80.50 DT',
        icon: 'ShieldCheck'
      },
      { 
        id: 3,
        title: 'Paiement de la vignette', 
        date: '16-12-2024', 
        time: '103:450 km', 
        reference: 'Numéro Reçu', 
        amount: '80.50 DT',
        icon: 'FileBadge2'
      },
      { 
        id: 4,
        title: 'Réparation mécanique', 
        date: '16-12-2024', 
        time: '103:450 km', 
        reference: 'Numéro Reçu', 
        amount: '80.50 DT',
        icon: 'Wrench'
      },
      { 
        id: 5,
        title: 'Entretien périodique', 
        date: '16-12-2024', 
        time: '103:450 km', 
        reference: 'Numéro Reçu', 
        amount: '80.50 DT',
        icon: 'Hammer'
      },
      { 
        id: 6,
        title: 'Entretien périodique', 
        date: '16-12-2024', 
        time: '103:450 km', 
        reference: 'Numéro Reçu', 
        amount: '80.50 DT',
        icon: 'Hammer'
      },
    ];
  // Default data - can be replaced with vehicleData props
 export const vehicleInfo = {
    registration: "123TUN4567",
    mileage: "123456789 Km",
    type: "Premium",
    color: "Argenté Metallisé",
    technicalVisit: "23-12-2025",
    insurance: "23-12-2025"
  };

 export const vehicleDetails = {
    plateNumber: "123 TU 4567",
    model: "Skoda Fabia ",
    variant: "1.0 L MPI Monte Carlo",
    transmission: "Manuelle",
    fuel: "Essence",
    odometer: "12345678",
    seats: "5 Places",
    engineSize: "350m³",
    color: "Argenté Metallisé",
    imageUrl: "https://test-rod.b-cdn.net/Catalogue/skoda-fabia-1.0-l-mpi-monte-carlo-2.webp"
  };

export const equipmentData = {
    interior: [
      "Climatisation automatique",
      "Sièges en cuir",
      "Système de navigation GPS",
      "Écran tactile 10 pouces",
      "Volant chauffant"
    ],
    security: [
      "ABS (système de freinage antiblocage)",
      "Airbags frontaux et latéraux",
      "Contrôle de stabilité électronique",
      "Caméra de recul",
      "Système d'alarme"
    ],
    exterior: [
      "Jantes en alliage 18 pouces",
      "Phares LED",
      "Toit ouvrant panoramique",
      "Rétroviseurs électriques chauffants",
      "Barres de toit"
    ]
  };