export const carColors = {
  "Blanc": "#FFFFFF",
  "Noir": "#000000",
  "Argenté": "#C0C0C0",
  "Gris": "#808080",
  "Bleu": "#0066FF",
  "Bleu Marine": "#000080",
  "Bleu Foncé": "#4682B4",
  "Bleu Clair": "#87CEEB",
  "Rouge Foncé": "#8B0000",
  "Rouge": "#FF0000",
  "Rose": "#FF69B4",
  "Beige": "#F5F5DC",
  "Crème": "#FFFDD0",
  "Vert": "#006400",
  "Vert Clair": "#90EE90",
  "Jaune": "#FFD700",
  "Or": "#FFD700",
  "Orange": "#FF8C00",
  "Marron": "#8B4513",
  "Bordeaux": "#800000"
};



export const colorsOptions = [
    { name: 'Blanc',  color: '#FFFFFF' },
    { name: 'Noir', color: '#000000' },
    { name: 'Argenté', color: '#C0C0C0', selected: true },
    { name: 'Gris',  color: '#808080' },
    { name: 'Bleu',  color: '#0066FF' },
    { name: 'Bleu Marine',  color: '#000080' },
    { name: 'Bleu Foncé',  color: '#4682B4' },
    { name: 'Bleu Clair',  color: '#87CEEB' },
    { name: 'Rouge Foncé',  color: '#8B0000' },
    { name: 'Rouge',  color: '#FF0000' },
    { name: 'Rose', color: '#FF69B4' },
    { name: 'Beige',  color: '#F5F5DC' },
    { name: 'Crème',  color: '#FFFDD0' },
    { name: 'Vert',  color: '#006400' },
    { name: 'Vert Clair',  color: '#90EE90' },
    { name: 'Jaune',  color: '#FFD700' },
    { name: 'Or',  color: '#FFD700' },
    { name: 'Orange',  color: '#FF8C00' },
    { name: 'Marron',  color: '#8B4513' },
    { name: 'Bordeaux',  color: '#800000' },

  ];

export const finishOptions = [
    { value: 'Mat' },
    { value: 'Brillant'},
    { value: 'Métallisé' },
  ];

export const finishEffects = {
  Mat: {
    filter: "brightness(0.85) saturate(0.8)", // dulls the color
  },
 Brillant: {
   position: "relative",
    backgroundImage: `
      linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.5) 0%,
        rgba(255, 255, 255, 0.3) 40%,
        rgba(255, 255, 255, 0.05) 70%,
        transparent 100%
      )
    `,
    backgroundBlendMode: "hard-light",
    boxShadow: "inset 0 0 1px rgba(255,255,255,0.5), 0 0 2px rgba(255,255,255,0.3)",
    },
  Métallisé: {
    backgroundImage: `
      repeating-linear-gradient(
        45deg,
        rgba(255,255,255,0.2) 0px,
        rgba(255,255,255,0.2) 2px,
        rgba(0,0,0,0.05) 2px,
        rgba(0,0,0,0.05) 4px
      )
    `,
    backgroundBlendMode: "overlay",
  },
};
