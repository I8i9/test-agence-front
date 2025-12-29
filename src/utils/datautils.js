import { DateTime } from "luxon";


// 22-11-2005
export function FormatDateEEEEddMMyyyy(tunisISO) {
  const dt = DateTime.fromISO(tunisISO); 
  return dt.toFormat("dd-MM-yyyy");
}


// mardi 23 septembre 2025
export function formatDateFr(isoDate) {
  const dt = DateTime.fromISO(isoDate).setLocale("fr"); 
  return dt.toFormat("EEEE d MMMM yyyy");    
}

// Format date as YYYY-MM-DD
export function formatDateOnly(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

// Format date as YYYY-MM-DDTHH:MM
export function formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}


// CONVER TO TUNISIA DATE JS SAFE

export function luxonToJSDate(luxonDate) {
  const date = DateTime.fromISO(luxonDate);
  // Extract the components ignoring the offset
  return new Date(
    date.year,
    date.month - 1, // JS months are 0-indexed
    date.day,
    date.hour,
    date.minute,
    date.second,
    date.millisecond
  );
}