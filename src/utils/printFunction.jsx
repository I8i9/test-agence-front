import { jsPDF } from 'jspdf';

const FONT_FAMILY = "courier";



/*const textToPRINtd = {
  location: "Mayssam Rent A Car",
  name: "Rhaiem Mohamed",
  birthDate: "06 Mars 1998",
  nationality: "Tunisienne",
  passport: "X12345678",
  cin: "12345678",
  cin_deliver: "Carthage - 01 Janvier 2018",
  permis: "98765432",
  permis_deliver: "Carthage - 01 Janvier 2018",
  Telephone: "+216 20123456",
  adresse: "Tunis, Carthagedazdazdaz very long text that must span on two lines",
  name_cond: "Hamdi Rayen",
  birthDate_cond: "10 Avril 1995",
  passport_cond: "Y87654321",
  cin_cond: "87654321",
  cin_deliver_cond: "Carthage - 10 Avril 2015",
  permis_cond: "23456789",
  permis_deliver_cond: "Carthage - 10 Avril 2015",
  Telephone_cond: "+216 50123456",
  adresse_cond: "Ariana, La Soukra",
  carburant_full: true,
  Kilometrage_depart: "1234542 Km",
  Kilometrage_retour: "1234542 Km",
  voiture: "Renault Clio",
  matricule: "123 TU 4756",
  date_debut: "01/01/2024",
  heure_debut: "10h00",
  lieu_debut: "Tunis",
  date_retour: "05/01/2024",
  heure_retour: "10h00",
  lieu_retour: "Tunis",
  date_depot: "01/01/2024",
  montant_depot: "200 DT",
  nature_depot: "Espèces",
  prix_jours: "50 DT",
  prix_totale: "250 DT",
  contrat: "N°1234",
};*/

/*const textConfigtest = {
  location: {
    position: { xStart: 320, xEnd: 1094, yStart: 524 },
    alignment: "center",
    size: 64,
    weight: "semibold",
   
  },
  name: {
    position: { xStart: 412, xEnd: 1112, yStart: 614 },
    alignment: "center",
    size: 64,
    weight: "semibold"
  },
  birthDate: {
    position: { xStart: 438, xEnd: 1176, yStart: 712 },
    alignment: "center",
    size: 64,
    weight: "semibold"
  },
  nationality: {
    position: { xStart: 438, xEnd: 1176, yStart: 790 },
    alignment: "center",
    size: 64,
    weight: "semibold"
  },
  passport: {
    position: { xStart: 430, xEnd: 1120, yStart: 878 },
    alignment: "center",
    size: 64,
    weight: "semibold"
  },
  cin: {
    position: { xStart: 436, xEnd: 1102, yStart: 948 },
    alignment: "center",
    size: 64,
    weight: "semibold"
  },
  cin_deliver: {
    position: { xStart: 300, xEnd: 1106, yStart: 1002 },
    alignment: "center",
    size: 64,
    weight: "semibold"
  },
  permis: {
    position: { xStart: 512, xEnd: 1074, yStart: 1078 },
    alignment: "center",
    size: 64,
    weight: "semibold"
  },
  permis_deliver: {
    position: { xStart: 300, xEnd: 1106, yStart: 1132 },
    alignment: "center",
    size: 64,
    weight: "semibold"
  },
  Telephone: {
    position: { xStart: 200, xEnd: 614, yStart: 1340 },
    alignment: "center",
    size: 52,
    weight: "semibold"
  },
  adresse: {
    position: { xStart: 256, xEnd: 1200, yFirst: 1200, ySecond: 1264 },
    alignment: "center",
    size: 52,
    weight: "semibold",
    isTwoLines: true
  },
  name_cond: {
    position: { xStart: 412, xEnd: 1112, yStart: 1444 },
    alignment: "center",
    size: 64,
    weight: "semibold"
  },
  birthDate_cond: {
    position: { xStart: 438, xEnd: 1176, yStart: 1538 },
    alignment: "center",
    size: 64,
    weight: "semibold"
  },
  passport_cond: {
    position: { xStart: 430, xEnd: 1120, yStart: 1618 },
    alignment: "center",
    size: 64,
    weight: "semibold"
  },
  cin_cond: {
    position: { xStart: 436, xEnd: 1102, yStart: 1688 },
    alignment: "center",
    size: 64,
    weight: "semibold"
  },
  cin_deliver_cond: {
    position: { xStart: 300, xEnd: 1106, yStart: 1748 },
    alignment: "center",
    size: 64,
    weight: "semibold"
  },
  permis_cond: {
    position: { xStart: 512, xEnd: 1074, yStart: 1832 },
    alignment: "center",
    size: 64,
    weight: "semibold"
  },
  permis_deliver_cond: {
    position: { xStart: 300, xEnd: 1106, yStart: 1892 },
    alignment: "center",
    size: 64,
    weight: "semibold"
  },
  Telephone_cond: {
    position: { xStart: 200, xEnd: 614, yStart: 2092 },
    alignment: "center",
    size: 52,
    weight: "semibold"
  },
  adresse_cond: {
    position: { xStart: 256, xEnd: 1200, yFirst: 1984 },
    alignment: "center",
    size: 64,
    weight: "semibold",
    isTwoLines: true
  },
  noAdditionalCond: {
    position: { xStart: 232, xEnd: 1204, yStart: 1434, yEnd: 2082 },
    alignment: "center",
    size: 500,
    weight: "semibold",
    isDraw: true,
    drawColor: [255, 0, 0],
    lineWidth: 3
  },
  carburant_empty: {
    position: { xStart: 1644, xEnd: 1991, yStart: 1680, yEnd: 1708 },
    isDraw: true,
    drawColor: [0, 0, 0],
    lineWidth: 3
  },
  carburant_quart: {
    position: { xStart: 1739, xEnd: 1773, yStart: 1680, yEnd: 1712 },
    isDraw: true,
    drawColor: [0, 0, 0],
    lineWidth: 3
  },
  carburant_half: {
    position: { xStart: 1829, xEnd: 1873, yStart: 1680, yEnd: 1716 },
    isDraw: true,
    drawColor: [0, 0, 0],
    lineWidth: 3
  },
  carburant_third: {
    position: { xStart: 1921, xEnd: 1965, yStart: 1680, yEnd: 1716 },
    isDraw: true,
    drawColor: [0, 0, 0],
    lineWidth: 3
  },
  carburant_full: {
    position: { xStart: 2015, xEnd: 2059, yStart: 1680, yEnd: 1716 },
    isDraw: true,
    drawColor: [0, 0, 0],
    lineWidth: 3
  },
  Kilometrage_depart: {
    position: { xStart: 1920, xEnd: 2374, yStart: 1840 },
    alignment: "center",
    size: 64,
    weight: "semibold"
  },
  Kilometrage_retour: {
    position: { xStart: 1920, xEnd: 2374, yStart: 1916 },
    alignment: "center",
    size: 64,
    color: [255, 0, 0],
    weight: "semibold"
  },
  voiture: {
    position: { xStart: 1456, xEnd: 2318, yStart: 568 },
    alignment: "center",
    size: 80,
    weight: "semibold",
    maxCharacters: 20
  },
  matricule: {
    position: { xStart: 1846, xEnd: 2318, yStart: 678 },
    alignment: "center",
    size: 80,
    weight: "semibold"
  },
  date_debut: {
    position: { xStart: 1428, xEnd: 1826, yStart: 842 },
    alignment: "center",
    size: 80,
    weight: "semibold"
  },
  heure_debut: {
    position: { xStart: 1886, xEnd: 2098, yStart: 842 },
    alignment: "center",
    size: 80,
    weight: "semibold"
  },
  lieu_debut: {
    position: { xStart: 2156, xEnd: 2368, yStart: 842 },
    alignment: "center",
    size: 80,
    weight: "semibold"
  },
  date_retour: {
    position: { xStart: 1428, xEnd: 1826, yStart: 990 },
    alignment: "center",
    size: 80,
    weight: "semibold"
  },
  heure_retour: {
    position: { xStart: 1886, xEnd: 2098, yStart: 990 },
    alignment: "center",
    size: 80,
    weight: "semibold"
  },
  lieu_retour: {
    position: { xStart: 2156, xEnd: 2368, yStart: 990 },
    alignment: "center",
    size: 80,
    weight: "semibold"
  },
  date_depot: {
    position: { xStart: 1456, xEnd: 1728, yStart: 2126 },
    alignment: "center",
    size: 64,
    weight: "semibold"
  },
  montant_depot: {
    position: { xStart: 1772, xEnd: 2024, yStart: 2126 },
    alignment: "center",
    size: 64,
    weight: "semibold"
  },
  nature_depot: {
    position: { xStart: 2072, xEnd: 2333, yStart: 2120 },
    alignment: "center",
    size: 64,
    weight: "semibold"
  },
  prix_jours: {
    position: { xStart: 1744, xEnd: 2108, yStart: 2212 },
    alignment: "center",
    size: 64,
    weight: "semibold"
  },
  prix_totale: {
    position: { xStart: 1744, xEnd: 2108, yStart: 2356 },
    alignment: "center",
    size: 64,
    weight: "semibold"
  },
  contrat: {
    position: { xStart: 1134, xEnd: 1474, yStart: 410 },
    alignment: "left",
    size: 80,
    color: [255, 0, 0],
    weight: "semibold"
  }
};*/

/**
 * Truncate text to max characters by words
 */
function truncateByWords(text, maxCharacters) {
  if (!maxCharacters || text.length <= maxCharacters) {
    return text;
  }

  const words = text.split(" ");
  let result = "";

  for (let i = 0; i < words.length; i++) {
    const testString = result + (result ? " " : "") + words[i];
    if (testString.length <= maxCharacters) {
      result = testString;
    } else {
      break;
    }
  }

  return result;
}

/**
 * Draw an X mark (two diagonal lines)
 */
function drawXMark(pdf, xStart, xEnd, yStart, yEnd, color, lineWidth) {
  pdf.setLineWidth(lineWidth);
  pdf.setDrawColor(...color);
  pdf.line(xStart, yStart, xEnd, yEnd);
  pdf.line(xStart, yEnd, xEnd, yStart);
}

/**
 * Render two-line text
 */
function renderTwoLineText(pdf, value, config) {
  const pos = config.position;
  if (!pos || typeof pos.xStart === 'undefined' || typeof pos.xEnd === 'undefined') {
    console.warn(`Invalid position config for two-line text`);
    return;
  }

  // Truncate if maxCharacters is set
  const text = truncateByWords(value, config.maxCharacters);

  const xStart = pos.xStart;
  const xEnd = pos.xEnd;
  const yBaseline = pos.yFirst;
  const availableWidth = xEnd - xStart;
  const fontSize = config.size || 52;
  const fontWeight =  "bold";

  pdf.setFont(FONT_FAMILY, fontWeight);
  pdf.setFontSize(fontSize);
  pdf.setTextColor(...(config.color || [0, 0, 0]));

  const fullWidth = pdf.getTextWidth(text);
  const lineHeight = fontSize * 1.2;
  const hasTwoLines = "ySecond" in pos;

  if (fullWidth <= availableWidth || !hasTwoLines) {
    const x = config.alignment === "center"
      ? xStart + (availableWidth - fullWidth) / 2
      : xStart;
    pdf.text(text, x, yBaseline);
  } else {
    const words = text.split(" ");
    let line1 = "";
    let line2 = "";

    for (let i = 0; i < words.length; i++) {
      const testLine = line1 + (line1 ? " " : "") + words[i];
      const width = pdf.getTextWidth(testLine);
      if (width <= availableWidth) {
        line1 = testLine;
      } else {
        line2 = words.slice(i).join(" ");
        break;
      }
    }

    if (line1) {
      const line1Width = pdf.getTextWidth(line1);
      const x1 = config.alignment === "center"
        ? xStart + (availableWidth - line1Width) / 2
        : xStart;
      pdf.text(line1, x1, yBaseline);
    }

    if (line2) {
      const y2 = hasTwoLines && pos.ySecond ? pos.ySecond : yBaseline + lineHeight;
      const line2Width = pdf.getTextWidth(line2);
      const x2 = config.alignment === "center"
        ? xStart + (availableWidth - line2Width) / 2
        : xStart;
      pdf.text(line2, x2, y2);
    }
  }
}

/**
 * Render standard single-line text
 */
function renderText(pdf, value, config) {
  const { xStart, xEnd, yStart } = config.position;
  const availableWidth = xEnd - xStart;
  const fontSize = config.size;
  const fontWeight =  "bold";

  // Truncate if maxCharacters is set
  const text = truncateByWords(value, config.maxCharacters);

  pdf.setFont(FONT_FAMILY, fontWeight);
  pdf.setFontSize(fontSize);
  pdf.setTextColor(...(config.color || [0, 0, 0]));

  const textWidth = pdf.getTextWidth(text);
  const x = config.alignment === "center"
    ? xStart + (availableWidth - textWidth) / 2
    : xStart;

  pdf.text(text, x, yStart);
}

/**
 * Auto-print function that opens printer interface directly without showing PDF
 */
export function printText(textConfig,textToPRINT) {
  // remove nulls and undefined from textToPRINT
  Object.keys(textToPRINT).forEach(key => {
    if (textToPRINT[key] === null || textToPRINT[key] === undefined) {
      delete textToPRINT[key];
    }
  });

  if (!textConfig || !textToPRINT) {
    return;
  }

  console.log('printText textConfig ', textConfig);
  console.log('printText textToPRINT ', textToPRINT);


  const pdf = new jsPDF({
    orientation: textConfig?.orientation || 'portrait',
    unit: 'pt',
    format: [textConfig?.width || 595.28, textConfig?.height || 3508],
  });
  

  Object.entries(textToPRINT).forEach(([key, value]) => {
    const config = textConfig[key];

    if (!config) {
      return;
    }

    // Handle draw operations (X marks)
    if (config.isDraw) {
      if(!value) return; // Only draw if value is truthy
      const { xStart, xEnd, yStart, yEnd } = config.position;
      drawXMark(pdf, xStart, xEnd, yStart, yEnd, config.drawColor, config.lineWidth);
      return;
    }

    // Handle two-line text
    if (config.isTwoLines) {
      renderTwoLineText(pdf, value.toString(), config);
      return;
    }

    if(!value) return; // Skip rendering if value is falsy

    console.log(`Rendering text for key: ${key}, value: ${value} with config :`, config);
    // Handle standard text
    renderText(pdf, value.toString(), config);
  });

  pdf.autoPrint();

  const pdfBlob = pdf.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';

  document.body.appendChild(iframe);

  iframe.onload = () => {
    setTimeout(() => {
      try {
        iframe.contentWindow.print();
      } catch {
        window.open(pdfUrl, '_blank', 'width=1,height=1');
      }
      setTimeout(() => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(pdfUrl);
      }, 20000);
    }, 500);
  };

  iframe.src = pdfUrl;
}