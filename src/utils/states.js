export const TunisianStates = [
  "Ariana", "Béja", "Ben Arous", "Bizerte", "El Kef", "Gabès", "Gafsa", 
  "Jendouba", "Kairouan", "Kasserine", "Kébili", "Mahdia", "Manouba", 
  "Médenine", "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", 
  "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan"
];

export const placesWithGroups = {
  "Tunis": [
    "Centre-ville de Tunis (Bab Bhar, Bab Souika, Lafayette)",
    "El Menzah (1 à 9)",
    "El Omrane (Supérieur & Inférieur)",
    "Cité El Khadra",
    "Mutuelleville",
    "Montplaisir",
    "La Marsa (Marsa Ville, Marsa Plage, Marsa Safsaf, Marsa Ennassim)",
    "Gammarth (Résidentiel & Touristique)",
    "Carthage (Byrsa, Amilcar, Salambo)",
    "Le Kram (Kram Ouest, Kram Est)",
    "Jardins de Carthage",
    "Sidi Bou Said",
    "Ain Zaghouan (Nord & Sud)",
    "Lac 1 & Lac 2 (Berges du Lac)",
    "La Goulette (Casino, Halq el Oued)",
    "Mellassine",
    "Séjoumi",
    "Cité Ibn Khaldoun",
    "Cité Ettahrir",
    "Cité Ezzouhour",
    "Aéroport International de Tunis-Carthage"
  ],
  "Ariana": [
    "La Soukra (Chotrana 1, 2 & 3)",
    "Ennasr (1 & 2)",
    "Borj Louzir",
    "Riadh Andalous",
    "Cité Ghazela",
    "Cité Ennasim",
    "Ettadhamen",
    "Mnihla",
    "Jardins d'El Menzah",
    "Cité des Juges",
    "Aéroport International de Tunis-Carthage"
  ],
  "Ben Arous": [
    "Mégrine (Mégrine Supérieur & Inférieur)",
    "Radès (Forêt, Méliane, Salammbô)",
    "Ezzahra",
    "Hammam-Lif",
    "Hammam-Chatt",
    "Fouchana",
    "Boumhel El Bassatine",
    "Mornag"
  ],
  "La Manouba": [
    "Manouba Ville",
    "Oued Ellil",
    "Denden",
    "Douar Hicher",
    "Jedaida",
    "Tebourba"
  ],
  "Nabeul": [
    "Hammamet Nord",
    "Hammamet Sud",
    "Nabeul Ville",
    "Korba",
    "Kelibia",
    "Dar Chaabane El Fehri",
    "Béni Khiar",
    "Takelsa",
    "El Haouaria",
    "Aéroport International Enfidha-Hammamet"
  ],
  "Sousse": [
    "Sousse Ville",
    "Khezama (Ouest & Est)",
    "Sahloul",
    "Jawhara",
    "Erriadh",
    "Hammam Sousse",
    "Port El Kantaoui",
    "Akouda",
    "Aéroport International de Monastir Habib Bourguiba"
  ],
  "Monastir": [
    "Skanes",
    "Monastir Ville",
    "Ksar Hellal",
    "Sahline",
    "Jemmel",
    "Sayada",
    "Aéroport International de Monastir Habib Bourguiba"
  ],
  "Sfax": [
    "Sfax Ville",
    "Sfax El Jadida",
    "Thyna",
    "Gremda",
    "Sakiet Eddaier",
    "Sakiet Ezzit",
    "Aéroport International de Sfax-Thyna"
  ],
  "Gabès": [
    "Gabès Ville",
    "El Hamma",
    "Mareth"
  ],
  "Bizerte": [
    "Bizerte Ville",
    "Menzel Bourguiba",
    "Ras Jebel",
    "Mateur",
    "Zarzouna"
  ],
  "Kasserine": [
    "Kasserine Ville",
    "Feriana",
    "Thala",
    "Sbiba"
  ],
  "Siliana": [
    "Siliana Ville",
    "Bargou",
    "Gaâfour",
    "Maknassy"
  ],
  "El Kef": [
    "Le Kef Ville",
    "Aïn Draham",
    "Tajerouine",
    "Nebeur"
  ],
  "Tozeur": [
    "Tozeur Ville",
    "Nefta",
    "Tamerza",
    "Douz"
  ],
  "Jendouba": [
    "Jendouba Ville",
    "Tabarka",
    "Bousalem",
    "Oued Melliz"
  ],
  "Zaghouan": [
    "Zaghouan Ville",
    "Nadhour",
    "El Fahs",
    "Saouaf"
  ],
  "Kairouan": [
    "Kairouan Ville",
    "El Ala",
    "Haffouz",
    "Sidi Amor"
  ],
  "Sidi Bouzid": [
    "Sidi Bouzid Ville",
    "Menzel Bouzaiane",
    "Ouled Haffouz",
    "Jilma"
  ],
  "Tataouine": [
    "Tataouine Ville",
    "Ghomrassen",
    "Remada",
    "Bir Lahmar"
  ],
  "Médenine": [
    "Médenine Ville",
    "Ben Gardane",
    "Midoun",
    "Zarzis"
  ],
  "Mahdia": [
    "Mahdia Ville",
    "Hiboun",
    "Rejiche",
    "Ksour Essef"
  ]
};

export const getAllPlaces = () => {
  let allPlaces = [];
  for (const group in placesWithGroups) {
    allPlaces = allPlaces.concat(placesWithGroups[group]);
  }
  return allPlaces;
}