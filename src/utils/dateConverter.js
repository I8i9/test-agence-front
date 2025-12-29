import { DateTime } from "luxon";

const TIMEZONE = "Africa/Tunis";

// This helper now forces the Tunis zone so dates never "revert" to UTC or local browser time
const toLuxonDate = (date) => {
  if (!date) return DateTime.now().setZone(TIMEZONE).setLocale("fr");
  
  // fromISO reads the +01:00, and setZone(TIMEZONE) locks it there
  return DateTime.fromISO(date).setZone(TIMEZONE).setLocale("fr");
};

export const nowTun = () => DateTime.now().setZone(TIMEZONE).setLocale("fr");

/**
 * Capitalizes the first letter of each word (Day and Month)
 */
const capitalize = (str) => str.replace(/\b\w/g, (char) => char.toUpperCase());

export function FormatDateEEEEddMMyyyy(date) {
  const dt = toLuxonDate(date);
  const formatted = dt.toFormat("EEEE, dd MMMM, yyyy");
  return capitalize(formatted);
}

export function FormatDateddMMyyyy(date) {
  return capitalize(toLuxonDate(date).toFormat("dd MMMM yyyy"));
}

export function formatDateDDMMYYYYHHMM(date) {
  return toLuxonDate(date).toFormat("dd-MM-yyyy HH'h'mm");
}

export function formatDateDDMMYYYY(date) {
  return toLuxonDate(date).toFormat("dd-MM-yyyy");
}

export function formatDateDDmmmmYYYY(date) {
  return toLuxonDate(date).toFormat("dd LLL yyyy");
}

export function formatDateDDMMYYYYAHHMM(dateString) {
  return toLuxonDate(dateString).toFormat("dd-MM-yyyy 'à' HH'h'mm");
}

export function formatDateFr(date) {
  const dt = toLuxonDate(date);
  return capitalize(dt.toFormat("EEEE d MMMM yyyy")) + dt.toFormat(" 'à' HH'h'mm");
}

export function formatDateFrWithouttime(date) {
  return capitalize(toLuxonDate(date).toFormat("EEEE d MMMM yyyy"));
}

export function formatTimeHHmm(dateString) {
  return toLuxonDate(dateString).toFormat("HH'h'mm");
}

export function formatDateDDLLLLYYYY(dateString) {
  return toLuxonDate(dateString).toFormat("dd LLLL yyyy");
}

export function formatNotificationTime(dateString) {
  const date = toLuxonDate(dateString);
  const now = nowTun();
  
  const diff = now.diff(date, ["days", "hours", "minutes", "seconds"]).toObject();

  if (diff.seconds < 60 && diff.seconds >= 0) {
    return "maintenant";
  } else if (diff.minutes < 60 && diff.minutes >= 0) {
    return `il y a ${Math.floor(diff.minutes)} min`;
  } else if (diff.hours < 24 && now.hasSame(date, 'day')) {
    return `il y a ${Math.floor(diff.hours)}h`;
  } else if (now.minus({ days: 1 }).hasSame(date, 'day')) {
    return "Hier";
  } else {
    return `Le ${date.toFormat("EEE dd MMM yyyy")}`;
  }
}

export function formatDepuis(dateInput) {
  const date = toLuxonDate(dateInput);
  const now = nowTun();

  const diffInMinutes = Math.floor(now.diff(date, "minutes").minutes);
  const diffInHours = Math.floor(now.diff(date, "hours").hours);
  const diffInDays = Math.floor(now.diff(date, "days").days);

  if (diffInMinutes < 1) return ["À l’instant"];
  if (diffInMinutes < 60) return [`il y a ${diffInMinutes} min`];
  if (diffInHours < 24 && now.hasSame(date, "day")) return [`il y a ${diffInHours} h`];

  if (now.minus({ days: 1 }).hasSame(date, "day")) {
    return ["Hier", date.toFormat("HH:mm")];
  }

  if (diffInDays < 7) {
    return [`il y a ${diffInDays} jours`];
  }

  return [date.toFormat("dd-MM-yyyy"), date.toFormat("HH:mm")];
}

export function formatDiffreneceInYYYYMMM(dateString) {
  const date = toLuxonDate(dateString);
  const now = nowTun();

  // Use Luxon's built-in interval/diff for accuracy
  const diff = now.diff(date, ['years', 'months']).toObject();
  const years = Math.floor(diff.years);
  const months = Math.floor(diff.months);

  if (years <= 0 && months < 1) {
    return "Acheté ce mois";
  } else if (years === 0) {
    return `${months} mois`;
  } else if (months === 0) {
    return `${years} an${years > 1 ? "s" : ""}`;
  } else {
    return `${years} an${years > 1 ? "s" : ""} ${months} mois`;
  }
}