import { format  } from 'date-fns';
import { fr } from 'date-fns/locale';


export function FormatDateEEEEddMMyyyyJS(date){
  const formatted = format(new Date(date), "EEEE, dd MMMM, yyyy", { locale: fr });
  
  // Find the position of the month (after the comma and space and day number)
  const commaIndex = formatted.indexOf(',');
  const monthStartIndex = formatted.indexOf(' ', commaIndex + 2) + 1; // Find space after day number
  
  return formatted[0].toUpperCase() + 
         formatted.slice(1, monthStartIndex) + 
         formatted[monthStartIndex].toUpperCase() + 
         formatted.slice(monthStartIndex + 1);
}

export function FormatDateddMMyyyyJS(date){
    return format(new Date(date),"dd MMMM yyyy",{ locale: fr })
}

  export function formatDateDDMMYYYYHHMMJS(dateString) {
    const date = new Date(dateString);
    return format(date, "dd-MM-yyyy HH'h'mm");
  }

  export function formatDateDDMMYYYYJS(dateString) {
    const date = new Date(dateString);
    return format(date, "dd-MM-yyyy");
  }


  export function formatTimeHHmmJS(dateString) {
    const date = new Date(dateString);
    return format(date, "HH'h'mm");
  }



export function formatDateDDMMYYYYAHHMMJS(dateString) {
    const date = new Date(dateString);
    return format(date, "dd-MM-yyyy à HH'h'mm");
  }

export function formatDateFrJS(date) {
  return format(new Date(date), "EEEE d MMMM yyyy 'à' HH'h'mm", { locale: fr });
}
export function formatDateFrWithouttimeJS(date) {
  return format(new Date(date), "EEEE d MMMM yyyy", { locale: fr });
}


  export function formatDiffreneceInYYYYMMMJS(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    let years = now.getFullYear() - date.getFullYear();
    let months = now.getMonth() - date.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years < 0) return "Acheté ce mois";

    if (years === 0 && months < 1) {
      return "Acheté ce mois";
    } else if (years === 0) {
      return `${months} mois`;
    } else if (years > 0 && months === 0) {
      return `${years} an${years > 1 ? "s" : ""}`;
    } else if (years > 0 && months > 0) {
      return `${years} an${years > 1 ? "s" : ""} ${months} mois`;
    }
    else {
      return "Acheté ce mois";
    }
  }

  export function formatTimeHHmm(dateString) {
    const date = new Date(dateString);
    return format(date, "HH'h'mm");
  }