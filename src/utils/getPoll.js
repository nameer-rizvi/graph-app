export function getPoll() {
  const day = new Date().getDay();

  const hour = new Date().getHours();

  if (day === 0 || day === 6) return 3600000;

  if (hour > 4 && hour < 20) return 300000;

  return 900000;
}
