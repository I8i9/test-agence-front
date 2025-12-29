export const raisonsAnnulationOptionsAgency = [
  { value: "CLIENT_IMPREVU_PERSONNEL", label: "Imprévu personnel (santé, urgence…)" },
  { value: "CLIENT_ANNULATION_DEPLACEMENT", label: "Déplacement ou voyage annulé" },
  { value: "CLIENT_ATTENTE_TROP_LONGUE", label: "Délai trop long avant confirmation" },
  { value: "CLIENT_NON_SATISFAIT_OFFRE", label: "Conditions ou véhicule non satisfaisants" },

  // Agency-side reasons
  { value: "AGENCE_VEHICULE_INDISPONIBLE", label: "Véhicule non disponible" },  // Optional addition
  { value: "AGENCE_DOCUMENTS_NON_VALIDES", label: "Documents invalides" },
  { value: "AGENCE_CONDITION_NON_REMPLIE", label: "Conditions non remplies (âge, garantie…)" },
  { value: "AGENCE_HISTORIQUE_NEGATIF", label: "Historique de location défavorable" },
  { value: "AGENCE_NON_RESPECT_REGLES", label: "Non-respect des conditions générales" },
  { value: "CLIENT_ABSENCE_OU_RETARD", label: "Absence ou retard du client" },
  { value: "CLIENT_NON_COMMUNICATION", label: "Pas de réponse du client" }, 
  { value: "AUTRE", label: "Autre" }

];

export const reasons = [
    "CLIENT_IMPREVU_PERSONNEL", 
    "CLIENT_ANNULATION_DEPLACEMENT", 
    "CLIENT_ATTENTE_TROP_LONGUE", 
    "CLIENT_NON_SATISFAIT_OFFRE",
    "AGENCE_VEHICULE_INDISPONIBLE",
    "AGENCE_DOCUMENTS_NON_VALIDES",
    "AGENCE_CONDITION_NON_REMPLIE",
    "AGENCE_HISTORIQUE_NEGATIF",
    "AGENCE_NON_RESPECT_REGLES",
    "CLIENT_ABSENCE_OU_RETARD",
    "CLIENT_NON_COMMUNICATION",
    "AUTRE"
]

export const raisonsShow = {
  "CLIENT_IMPREVU_PERSONNEL" : "Imprévu personnel",
  "CLIENT_ANNULATION_DEPLACEMENT" : "Déplacement ou voyage annulé",
  "CLIENT_ATTENTE_TROP_LONGUE" : "Délai trop long avant confirmation",
  "CLIENT_NON_SATISFAIT_OFFRE" : "Conditions ou véhicule non satisfaisants",
  "AGENCE_VEHICULE_INDISPONIBLE": "Véhicule non disponible",
  "AGENCE_DOCUMENTS_NON_VALIDES": "Documents incomplets ou non conformes",
  "AGENCE_CONDITION_NON_REMPLIE": "Certaines conditions n'ont pas été remplies",
  "AGENCE_HISTORIQUE_NEGATIF": "Historique défavorable",
  "AGENCE_NON_RESPECT_REGLES": "Non-respect des règles",
  "CLIENT_ABSENCE_OU_RETARD": "Absence ou retard",
  "CLIENT_NON_COMMUNICATION": "Pas de réponse du client",
  "AUTRE": "Raison non spécifiée",
  "VOITURE_INDISPONIBLE": "Surbooking (Demande antérieure déjà validée)",
  "OFFRE_INDISPONIBLE": "L'offre a été supprimée",
  "PAS_DE_REPONSE_AGENCE": "Pas de réponse de l'agence",
}

export const raisonSource = {
  "CLIENT_IMPREVU_PERSONNEL" : "Annulation",
  "CLIENT_ANNULATION_DEPLACEMENT" : "Annulation",
  "CLIENT_ATTENTE_TROP_LONGUE" : "Annulation",
  "CLIENT_NON_SATISFAIT_OFFRE" : "Annulation",
  "AGENCE_VEHICULE_INDISPONIBLE": "Refus",
  "AGENCE_DOCUMENTS_NON_VALIDES": "Refus",
  "AGENCE_CONDITION_NON_REMPLIE": "Refus",
  "AGENCE_HISTORIQUE_NEGATIF": "Refus",
  "AGENCE_NON_RESPECT_REGLES": "Refus",
  "CLIENT_ABSENCE_OU_RETARD": "Refus",
  "CLIENT_NON_COMMUNICATION": "Refus",
  "AUTRE": "Refus",
  "VOITURE_INDISPONIBLE": "Autonome",
  "OFFRE_INDISPONIBLE": "Autonome",
  "PAS_DE_REPONSE_AGENCE": "Autonome",
}