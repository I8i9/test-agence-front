export function getTunisianNow() {
  return moment().tz("Africa/Tunis").format("YYYY-MM-DD HH:mm:ss");
}